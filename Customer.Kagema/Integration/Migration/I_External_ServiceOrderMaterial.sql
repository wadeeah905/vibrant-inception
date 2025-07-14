SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

BEGIN
SET NOCOUNT ON;

DECLARE @log AS VARCHAR(MAX);
SET @log = 'Service Order Material Import started';
EXEC SP_WriteLog @log, @print = 0

IF OBJECT_ID( 'tempdb..#I_ServiceOrdersMaterials_Output') IS NOT NULL DROP TABLE #I_ServiceOrdersMaterials_Output
CREATE TABLE #I_ServiceOrdersMaterials_Output ([Change] NVARCHAR(50), IsActive BIT NULL, OrderNo NVARCHAR(50))

BEGIN TRY
	SET @log = '';

	DECLARE @timeDiff AS DATETIME;
	SET @timeDiff = GETDATE();
	
	DECLARE @totalTime AS DATETIME;
	SET @totalTime = GETDATE();
	
	BEGIN 
		IF OBJECT_ID( 'tempdb..#I_ServiceOrdersMaterials_Input') IS NOT NULL DROP TABLE #I_ServiceOrdersMaterials_Input
		SELECT 
			ext.[OrderNo]
			,ext.[PosNo]
			,ext.[ItemNo]
			,ext.[Description]
			,ext.[UnitOfMeasure]
			,ext.[EstimatedQuantity]
			,sot.id As [ServiceOrderTimeId]
			,so.[Status] As [NavisionServiceOrderStatus]
			,soh.[Status] AS [SMSServiceOrderStatus]
			,ext.[LegacyVersion]
			,ext.[CommissionedQuantity]
			,soh.[ContactKey] AS [OrderId]
			,a.[ArticleId] AS [ArticleId]
		INTO #I_ServiceOrdersMaterials_Input
		FROM V.External_ServiceOrderMaterial AS ext
		LEFT OUTER JOIN SMS.ServiceOrderHead soh ON soh.OrderNo = ext.OrderNo 
		JOIN SMS.ServiceOrderTimes sot WITH (READUNCOMMITTED) 
			ON soh.ContactKey = sot.OrderId 
			AND ext.ServiceOrderTime = sot.PosNo
		JOIN V.External_ServiceOrder so 
			ON ext.OrderNo = so.OrderNo
		LEFT OUTER JOIN [SMS].[ServiceOrderMaterial] som
			ON som.[OrderId] = soh.[ContactKey]
			AND som.[PosNo] = ext.[PosNo]
			AND som.[ItemNo] = ext.[ItemNo]
		LEFT OUTER JOIN [CRM].[Article] a ON a.[ItemNo] = ext.[ItemNo] 
		WHERE soh.[Status] <> 'Closed' AND so.[Status] NOT IN (2, 5, 7)
			AND (som.OrderId IS NULL OR som.OrderId IS NOT NULL)

		DECLARE @transfer NVARCHAR(100);
		SELECT @transfer = 'Transfered ' + CONVERT(NVARCHAR(10), COUNT(*)) + ' rows to #I_ServiceOrdersMaterials_Input' FROM #I_ServiceOrdersMaterials_Input
		EXEC SP_AppendNewLine @log OUTPUT, @transfer, @timeDiff OUTPUT;
	END

	BEGIN TRANSACTION
	BEGIN TRY
		BEGIN -- do not delete planned manterial, but remove legacy version and estimated quantity, so it becomes unplanned material
			UPDATE [target]
			SET
				[EstimatedQuantity] = 0,
				[LegacyVersion] = NULL,
				[ModifyDate] = dbo.GetFutureUtcDate(),
				[ModifyUser] = 'Import',
				[PosNo] = (	SELECT MAX([MaxPosSOM].PosNo) 
							FROM [SMS].[ServiceOrderMaterial] [MaxPosSOM] WITH (READUNCOMMITTED) 
							JOIN [SMS].[ServiceOrderHead] soh ON soh.ContactKey = [target].[OrderId]
							WHERE soh.[OrderNo] = [MaxPosSOM].[OrderId]) + ABS(CHECKSUM(NEWID()) % 10000)
			FROM [SMS].[ServiceOrderMaterial] AS [target]
			JOIN [SMS].[ServiceOrderHead] soh ON soh.ContactKey = [target].[OrderId]
			LEFT OUTER JOIN V.External_ServiceOrderMaterial [extMaterial] 
				ON soh.[OrderNo] = [extMaterial].[OrderNo]
				AND [target].[PosNo] = [extMaterial].[PosNo]
				AND [target].[ItemNo] = [extMaterial].[ItemNo]
			LEFT OUTER JOIN V.External_ServiceOrder AS [extServiceOrder] 
				ON soh.OrderNo = [extServiceOrder].OrderNo
			WHERE [extMaterial].[OrderNo] IS NULL -- material is removed in NAV
				AND [extServiceOrder].OrderNo IS NOT NULL -- order is active
				AND [extServiceOrder].Status NOT IN (2, 5, 7) -- order in correct state (not done or canceled)
				--AND [target].[IsExported] = 0 ignore this flag, sometimes orders are changed even after export and are rescheduled
				AND [target].[IsActive] = 1
				AND [target].[LegacyVersion] IS NOT NULL

			DECLARE @unplanned NVARCHAR(1000);
			SELECT @unplanned = 'updated ' + CONVERT(NVARCHAR, @@ROWCOUNT) + ' records not found in Navision to estimated quantity = 0 (now unplanned)'
			EXEC SP_AppendNewLine @log OUTPUT, @unplanned, @timeDiff OUTPUT;
		END

		BEGIN -- find all (unplanned) material that got a PosNo from us that now collides with a entry from navision (same PosNo, different ItemNo) => give them a new PosNo
			UPDATE [target]
			SET
				[ModifyDate] = dbo.GetFutureUtcDate(),
				[ModifyUser] = 'Import',
				[PosNo] = (SELECT MAX([MaxPosSOM].PosNo) 
							FROM [SMS].[ServiceOrderMaterial] [MaxPosSOM] WITH (READUNCOMMITTED)
							JOIN [SMS].[ServiceOrderHead] soh ON soh.ContactKey = [target].[OrderId]
							WHERE soh.[ContactKey] = [MaxPosSOM].[OrderId]) + ABS(CHECKSUM(NEWID()) % 1000)
			FROM [SMS].[ServiceOrderMaterial] AS [target]
			JOIN [SMS].[ServiceOrderHead] soh ON soh.ContactKey = [target].[OrderId]
			LEFT JOIN V.External_ServiceOrderMaterial [extMaterial] 
				ON soh.[OrderNo] = [extMaterial].[OrderNo]
				AND [target].[PosNo] = [extMaterial].[PosNo]
			LEFT JOIN V.External_ServiceOrder AS [extServiceOrder] 
				ON soh.OrderNo = [extServiceOrder].OrderNo
			WHERE [extMaterial].[ItemNo] <> [target].ItemNo
				AND [extServiceOrder].Status NOT IN (2, 5, 7) -- order in correct state (not done or canceled)
				AND [target].[IsExported] = 0
				AND [target].[IsActive] = 1
				AND [target].[LegacyVersion] IS NULL

			DECLARE @collisions NVARCHAR(1000);
			SELECT @collisions = 'updated ' + CONVERT(NVARCHAR, @@ROWCOUNT) + ' records that had a collision on their PosNo'
			EXEC SP_AppendNewLine @log OUTPUT, @collisions, @timeDiff OUTPUT;
		END

		-- This code is actually here because at times it seems that orders are disappearing from NAV without being
		-- deleted and they reappear after a while. In this case we will have updated the original positions with New PosNos to prevent
		-- any incoming changes from the technicians to get lost. However we save the original Positions and if after a while the 
		-- item shows up again we will update it using it's original PositionNo so the lower merge will update the Material line 
		-- as if the position would have been around
		MERGE [SMS].[ServiceOrderMaterial] AS [target]
		USING #I_ServiceOrdersMaterials_Input AS [source]
			ON [target].[OrderId] = [source].[OrderId]
			AND [target].[ItemNo] = [source].[ItemNo]
		WHEN MATCHED
			THEN UPDATE
				SET [PosNo] = [source].[PosNo];	

		MERGE [SMS].[ServiceOrderMaterial] AS [target]
		USING #I_ServiceOrdersMaterials_Input AS [source]
			ON [target].[OrderId] = [source].[OrderId]
			AND [target].[PosNo] = [source].[PosNo]
			AND [target].[ItemNo] = [source].[ItemNo]
		WHEN NOT MATCHED 
			THEN
				INSERT ([OrderId], [PosNo], [ItemNo], [Description], [QuantityUnit], [EstimatedQuantity], [ActualQuantity], [FromWarehouse], [FromLocationNo], [Status], [BuiltIn], [IsSerial], [CreatedLocal], [CreateDate], [ModifyDate], [Id], [ServiceOrderTimeId], [CreateUser], [ModifyUser], [LegacyVersion], [ArticleId])
				VALUES (source.[OrderId], source.[PosNo], source.[ItemNo], source.[Description], source.[UnitOfMeasure], source.[EstimatedQuantity], 0.0, '', '', '', '', 0, 0, dbo.GetFutureUtcDate(), dbo.GetFutureUtcDate(), newid(), source.[ServiceOrderTimeId], 'Import', 'Import', source.[LegacyVersion], source.[ArticleId])
		WHEN MATCHED
			AND [source].[SMSServiceOrderStatus] <> 'Completed'
			AND [target].[LegacyVersion] <> [source].[LegacyVersion]
			THEN UPDATE
				SET [EstimatedQuantity] = source.[EstimatedQuantity],
				[ServiceOrderTimeId] = source.[ServiceOrderTimeId],
				[ModifyDate] = dbo.GetFutureUtcDate(),
				[ModifyUser] = 'Import',
				[IsActive] = 1,
				[ItemNo] = CASE WHEN [target].[ActualQuantity] <> 0 THEN [target].[ItemNo] ELSE source.[ItemNo] END,
				[Description] = CASE WHEN [target].[ActualQuantity] <> 0 THEN [target].[Description] ELSE source.[Description] END,
				[QuantityUnit] = CASE WHEN [target].[ActualQuantity] <> 0 THEN [target].[QuantityUnit] ELSE source.[UnitOfMeasure] END,
				[LegacyVersion] = source.[LegacyVersion]
		OUTPUT $ACTION, inserted.IsActive, inserted.[OrderId]
		INTO #I_ServiceOrdersMaterials_Output;

		EXEC SP_AppendResult 'Merged Service Order Material', '#I_ServiceOrdersMaterials_Output', @log OUTPUT, @timeDiff OUTPUT

	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW
	END CATCH

	IF @@TRANCOUNT > 0
		COMMIT TRANSACTION;

	SET @log = 'Service Order Material Import finished: ' + @log;
	EXEC SP_WriteLog @log, @print = 0
END TRY
BEGIN CATCH
	DECLARE @name AS NVARCHAR(100)
	SET @name = 'Service Order Material Import'
	EXEC SP_CatchError @name;
END CATCH
END

GO


