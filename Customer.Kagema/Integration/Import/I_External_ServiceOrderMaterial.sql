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
	CREATE TABLE #I_ServiceOrdersMaterials_Output ([Change] NVARCHAR(50), IsActive BIT NULL, OrderId uniqueidentifier, itemno NVARCHAR(50), posno NVARCHAR(10), estimatedquantity [decimal](18, 2), OrderMaterialId uniqueidentifier)

	--IF OBJECT_ID( 'tempdb..#I_ServiceOrdersMaterials_Output_Serial') IS NOT NULL DROP TABLE #I_ServiceOrdersMaterials_Output_Serial
	--CREATE TABLE #I_ServiceOrdersMaterials_Output_Serial ([Change] NVARCHAR(50), IsActive BIT NULL, OrderMaterialId uniqueidentifier, SerialNo nvarchar(50))

	IF OBJECT_ID( 'tempdb..#I_External_ServiceOrderMaterial') IS NOT NULL DROP TABLE #I_External_ServiceOrderMaterial

	SELECT 
		*
	INTO #I_External_ServiceOrderMaterial
	FROM V.External_ServiceOrderMaterial

	CREATE NONCLUSTERED INDEX IX_#External_ServiceOrderMaterial_OrderNo ON #I_External_ServiceOrderMaterial ([OrderNo])
	CREATE NONCLUSTERED INDEX IX_#External_ServiceOrderMaterial_Sot ON #I_External_ServiceOrderMaterial ([ServiceOrderTime])

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
				,ext.[LegacyVersion]
				,ext.[CommissionedQuantity]
				,soh.[ContactKey] AS [OrderId]
				,a.[ArticleId] AS [ArticleId]
				,a.[IsSerial] AS [IsSerial]
				,ext.[Calculate]
				,ext.[OnReport]
			INTO #I_ServiceOrdersMaterials_Input
			FROM #I_External_ServiceOrderMaterial AS ext
			LEFT OUTER JOIN SMS.ServiceOrderHead soh ON soh.[Status] <> 'Closed' AND soh.OrderNo = ext.OrderNo 
			JOIN SMS.ServiceOrderTimes sot WITH (READUNCOMMITTED) 
				ON soh.ContactKey = sot.OrderId 
				AND ext.ServiceOrderTime = sot.PosNo
			LEFT OUTER JOIN [CRM].[Article] a ON a.[ItemNo] = ext.[ItemNo]

			DECLARE @transfer NVARCHAR(100);
			SELECT @transfer = 'Transfered ' + CONVERT(NVARCHAR(10), COUNT(*)) + ' rows to #I_ServiceOrdersMaterials_Input' FROM #I_ServiceOrdersMaterials_Input
			EXEC SP_AppendNewLine @log OUTPUT, @transfer, @timeDiff OUTPUT;
		END

		BEGIN TRANSACTION
		BEGIN TRY
			MERGE [SMS].[ServiceOrderMaterial] AS [target]
			USING #I_ServiceOrdersMaterials_Input AS [source]
				ON [target].[OrderId] = [source].[OrderId]
				AND [target].[PosNo] = [source].[PosNo]
				AND [target].[ItemNo] = [source].[ItemNo]
			WHEN NOT matched THEN 
				INSERT ([orderid], 
						[posno], 
						[itemno], 
						[description], 
						[quantityunit], 
						[estimatedquantity], 
						[isserial], 
						[Status],
						[BuiltIn],
						[CreatedLocal],
						[FromWarehouse],
						[FromLocationNo],
						[CommissioningStatusKey],
						[HourlyRate],
						[serviceordertimeid], 
						[articleid],
						[createdate], 
						[modifydate], 
						[createuser], 
						[modifyuser],
						[legacyversion]
						,[Calculate]
						,[IsCalculate]
						,[OnReport]
						,[isactive]
						,[iPosNo]
						) 
				VALUES (source.[orderid], 
						source.[posno], 
						source.[itemno], 
						source.[description], 
						source.[unitofmeasure], 
						source.[estimatedquantity], 
						coalesce(source.[IsSerial],0),
						0,
						0,
						0,
						'',
						'',
						0,
						0,
						source.[serviceordertimeid], 
						source.[articleid],
						getutcdate(),
						getutcdate(),
						'Import', 
						'Import', 
						source.[legacyversion]
						,[source].[Calculate]
						,[source].[Calculate]
						,[source].[OnReport]
						,1
						,CAST(source.[posno] as int)
						) 
			WHEN MATCHED
				AND [target].[LegacyVersion] <> [source].[LegacyVersion]
				THEN UPDATE
					SET [description] = source.[description], 
						[quantityunit] = source.[unitofmeasure],
						[estimatedquantity] = source.[estimatedquantity], 
						[isserial] = coalesce(source.[IsSerial],0),
						[serviceordertimeid] = source.[serviceordertimeid], 
						[articleid] = source.[articleid],
						[modifydate] = getutcdate(),  
						[modifyuser] = 'Import',
						[legacyversion] = source.[legacyversion],
						[isactive] = 1
						,[Calculate] = [source].[Calculate]
						,[IsCalculate] = [source].[Calculate]
						,[OnReport] = [source].[OnReport]
			WHEN NOT MATCHED BY SOURCE
				AND [target].[EstimatedQuantity] <> 0 AND [target].[IsActive] = 1 AND [target].[DispatchId] is null 
				THEN UPDATE SET
					[target].[IsActive] = 0
					,[target].[ModifyDate] = GETUTCDATE()
					,[target].[ModifyUser] = 'Import'
			OUTPUT $ACTION, inserted.IsActive, inserted.[OrderId], inserted.[itemno], inserted.[posno], inserted.[estimatedquantity], inserted.Id
			INTO #I_ServiceOrdersMaterials_Output;

			EXEC SP_AppendResult 'Merged Service Order Material', '#I_ServiceOrdersMaterials_Output', @log OUTPUT, @timeDiff OUTPUT

			-- If serialnumbers are needed add this import. Serial no needs to be added also to the view
			--MERGE [SMS].[ServiceOrderMaterialSerials] AS [target]
			--USING (SELECT [source].*, insertedToMaterial.[OrderMaterialId]
			--	FROM #I_ServiceOrdersMaterials_Input AS [source]
			--	JOIN #I_ServiceOrdersMaterials_Output insertedToMaterial ON 
			--		[source].IsSerial = 1
			--		AND insertedToMaterial.[OrderId] = [source].[OrderId]
			--		AND insertedToMaterial.[PosNo] = [source].[PosNo] COLLATE DATABASE_DEFAULT
			--		AND insertedToMaterial.[ItemNo] = [source].[ItemNo] COLLATE DATABASE_DEFAULT
			--	) [sourceOnlySerialMaterial]
			--ON [sourceOnlySerialMaterial].[OrderMaterialId] = [target].[OrderMaterialId]
			--WHEN NOT matched THEN 
			--	INSERT (
			--			[SerialNo],
			--			[IsInstalled],
			--			[IsActive],
			--			[OrderMaterialId],
			--			[createdate], 
			--			[modifydate], 
			--			[createuser], 
			--			[modifyuser]
			--			) 
			--	VALUES (
			--			[sourceOnlySerialMaterial].[Serial],
			--			0,
			--			1, 
			--			[sourceOnlySerialMaterial].[OrderMaterialId],
			--			getutcdate(),
			--			getutcdate(),
			--			'Import', 
			--			'Import'
			--			) 
			--WHEN MATCHED
			--	THEN UPDATE
			--		SET 
			--			[SerialNo] = [sourceOnlySerialMaterial].[Serial],
			--			[IsInstalled] = 0,
			--			[IsActive] = 1,
			--			[createdate] = getutcdate(), 
			--			[modifydate] = getutcdate(), 
			--			[createuser] = 'Import', 
			--			[modifyuser] = 'Import'
			--WHEN NOT MATCHED BY SOURCE 
			--	AND [target].[IsActive] = 1
			--	THEN UPDATE SET
			--		[target].[IsActive] = 0
			--		,[target].[ModifyDate] = GETUTCDATE()
			--		,[target].[ModifyUser] = 'Import'
			--OUTPUT $ACTION, inserted.IsActive, inserted.[OrderMaterialId], inserted.[SerialNo]
			--INTO #I_ServiceOrdersMaterials_Output_Serial;

			--EXEC SP_AppendResult 'Merged Service ServiceOrderMaterialSerials', '#I_ServiceOrdersMaterials_Output_Serial', @log OUTPUT, @timeDiff OUTPUT

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


