SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

BEGIN
SET NOCOUNT ON;

DECLARE @log AS VARCHAR(MAX);
SET @log = 'Service Order Import started';
EXEC SP_WriteLog @log, @print = 0
BEGIN TRY
	SET @log = '';

	DECLARE @timeDiff AS DATETIME;
	SET @timeDiff = GETDATE();
	
	DECLARE @totalTime AS DATETIME;
	SET @totalTime = GETDATE();

		-------------------------------------------------
		-- Fill temporary merge storage
		-------------------------------------------------	
	BEGIN
		IF OBJECT_ID('tempdb..#ImportedContact') IS NOT NULL DROP TABLE #ImportedContact
		CREATE TABLE #ImportedContact (Change NVARCHAR(100), IsActive BIT NULL, ContactId UNIQUEIDENTIFIER, LegacyId NVARCHAR(100))

		IF OBJECT_ID('tempdb..#ServiceOrderMaterial') IS NOT NULL DROP TABLE #ServiceOrderMaterial
		SELECT OrderNo, CommissioningStatus
		INTO #ServiceOrderMaterial
		FROM V.External_ServiceOrderMaterial
		CREATE NONCLUSTERED INDEX IX_#ServiceOrderMaterial ON #ServiceOrderMaterial (OrderNo) INCLUDE (CommissioningStatus)

		IF OBJECT_ID('tempdb..#ServiceOrderMaterialMinMax') IS NOT NULL DROP TABLE #ServiceOrderMaterialMinMax
		SELECT
			OrderNo
			,MIN(CommissioningStatus) AS MinCommissioningStatus
			,MAX(CommissioningStatus) AS MaxCommissioningStatus
		INTO #ServiceOrderMaterialMinMax
		FROM #ServiceOrderMaterial
		GROUP BY OrderNo
		CREATE NONCLUSTERED INDEX IX_#ServiceOrderMaterialMinMax ON #ServiceOrderMaterialMinMax (OrderNo)

		IF OBJECT_ID('tempdb..#ServiceOrderSetup') IS NOT NULL DROP TABLE #ServiceOrderSetup
		SELECT 
			ext.*
			,companyContact.ContactId AS CustomerContactId
			,CrmUser.Username as TroubleshooterUserName
			--,CASE 
			--	WHEN serviceOrder.[SchedulerApprovals] IS NOT NULL AND ext.[SchedulerApprovals] > serviceOrder.[SchedulerApprovals] 
			--	THEN 1 
			--	ELSE 0 
			--END AS [Rescheduled]
			--,CASE
			--	WHEN serviceOrder.OrderNo IS NOT NULL AND serviceOrder.StationKey <> station.StationId
			--	THEN 1
			--	ELSE 0
			--END AS [RefreshNeeded]
			-- ,CASE
				-- WHEN material.MinCommissioningStatus = 0 AND material.MaxCommissioningStatus = 0
					-- THEN 0 --NoCommissioning
				-- WHEN material.MinCommissioningStatus = material.MaxCommissioningStatus
					-- THEN material.MinCommissioningStatus
				-- WHEN material.MinCommissioningStatus <> material.MaxCommissioningStatus AND material.MinCommissioningStatus > 0
					-- THEN material.MinCommissioningStatus
				-- WHEN material.MinCommissioningStatus <> material.MaxCommissioningStatus AND material.MinCommissioningStatus = 0
					-- THEN (	SELECT MIN(m2.CommissioningStatus) 
							-- FROM #ServiceOrderMaterial m2
							-- WHERE m2.OrderNo = ext.OrderNo AND m2.CommissioningStatus > 0)
				-- ELSE 0
			-- END AS CommissioningStatus
			,0 AS CommissioningStatus
		INTO #ServiceOrderSetup
		FROM [V].[External_ServiceOrder_Migration] AS ext
		JOIN [CRM].[Contact] companyContact WITH (READUNCOMMITTED) ON companyContact.LegacyId = ext.NavisionCustomerNo 
				AND companyContact.IsActive = 1 
				AND companyContact.ContactType = 'Company'
		LEFT JOIN [CRM].[User] CrmUser WITH (READUNCOMMITTED) ON ext.[Troubleshooter] COLLATE DATABASE_DEFAULT = CrmUser.LegacyId  COLLATE DATABASE_DEFAULT
		
		LEFT OUTER JOIN #ServiceOrderMaterialMinMax material ON material.OrderNo = ext.OrderNo

		IF OBJECT_ID('tempdb..#ServiceOrder') IS NOT NULL DROP TABLE #ServiceOrder
		SELECT
			*
			,BINARY_CHECKSUM(
				City
				,Commission
				,CommissioningStatus
				,CountryKey
				,Deadline
				,ErrorMessage
				,Name1
				,Name2
				,Name3
				,NavisionCustomerNo
				,OrderNo
				,OrderStateKey
				,OrderTypeKey
				,Planned
				,Priority
				,PurchaseOrderNo
				,Reported
				,ServiceLocationEmail
				,ServiceLocationFax
				,ServiceLocationMobile
				,ServiceLocationPhone
				,ServiceLocationResponsiblePerson
				,StationNo
				,[Status]
				,Street
				,ZipCode
				,CustomerContactId
				,[Troubleshooter] 
				,[RepairStatusCode]
			) AS LegacyVersion
		INTO #ServiceOrder
		FROM #ServiceOrderSetup
		CREATE NONCLUSTERED INDEX IX_#ServiceOrder_OrderNo ON #ServiceOrder (OrderNo ASC)

		IF OBJECT_ID('tempdb..#ServiceOrderCommentLine') IS NOT NULL DROP TABLE #ServiceOrderCommentLine
		SELECT [OrderNo]
		  ,[Type]
		  ,[Line No_]
		  ,[Comment]
		  ,[Date]
		  ,[Worktime]
		INTO #ServiceOrderCommentLine
		FROM V.[External_ServiceCommentLine]
		CREATE NONCLUSTERED INDEX IX_#ServiceCommentLine ON #ServiceOrderCommentLine ([OrderNo]) INCLUDE ([Type], [Line No_])

		DECLARE @transfer NVARCHAR(100);
		SELECT @transfer = 'Transfered ' + CONVERT(NVARCHAR(10), COUNT(*)) + ' rows to #ServiceOrder' FROM #ServiceOrder
		EXEC SP_AppendNewLine @log OUTPUT, @transfer, @timeDiff OUTPUT;
	END
		--select * from #ServiceOrder
	BEGIN TRANSACTION
	BEGIN TRY
	
		-------------------------------------------------
		-- Merge Crm.Contact
		-------------------------------------------------	
		BEGIN
			MERGE [CRM].[Contact] AS [target]
			USING #ServiceOrder AS [source]
			ON [target].[LegacyId] = [source].OrderNo
			AND [target].[ContactType] = 'ServiceOrder'
			WHEN MATCHED 
				AND ([target].[LegacyVersion] IS NULL OR [target].[LegacyVersion] <> [source].[LegacyVersion])
				AND [source].[OrderStateKey] <> 'Completed'
				THEN UPDATE SET
					[target].[LegacyVersion] = [source].[LegacyVersion]
					,[target].[ModifyDate] = dbo.GetFutureUtcDate()
					,[target].[ModifyUser] = 'Import'
					,[target].[Name] = [source].[OrderNo]
					,[target].[IsActive] = 1
					,[target].[ResponsibleUser]=[source].[TroubleshooterUserName] 
					,[target].[IsExported] = CASE WHEN [source].[OrderStateKey] = 'ReadyForScheduling' AND [source].[Status] <> 7 THEN 0 ELSE [target].[IsExported] END
			WHEN NOT MATCHED
				AND [source].[CustomerContactId] IS NOT NULL
				THEN INSERT
				(
					[ContactType]
					,[LegacyId] 
					,[LegacyVersion] 
					,[IsExported] 
					,[Name]
					,[IsActive]
					,[Visibility]
					,[CreateDate] 
					,[ModifyDate]
					,[CreateUser] 
					,[ModifyUser]
					,[ResponsibleUser]
				) VALUES (
					'ServiceOrder'
					,[source].OrderNo
					,[source].LegacyVersion
					,0
					,[source].OrderNo
					,1
					,2
					,dbo.GetFutureUtcDate() 
					,dbo.GetFutureUtcDate()
					,'Import' 
					,'Import'
					,[TroubleshooterUserName] 
				)
			WHEN NOT MATCHED BY SOURCE 
				AND [target].[IsActive] = 1 
				AND [target].[ContactType] = 'ServiceOrder' 
				AND NOT EXISTS (
					SELECT TOP 1 ContactKey
					FROM [SMS].[ServiceOrderHead]
					WHERE [Status] IN ('Closed', 'Completed')
					AND ContactKey = [target].[ContactId]
				)
				THEN UPDATE SET 
					[IsActive] = 0
					,[ModifyDate] = dbo.GetFutureUtcDate()
					,[ModifyUser] = 'Import'
					,[LegacyVersion] = NULL
			OUTPUT $action, inserted.IsActive, inserted.ContactId, [source].OrderNo AS LegacyId INTO #ImportedContact;
			EXEC SP_AppendNewLine @log OUTPUT, 'Merged Contact', @timeDiff OUTPUT;
		END

		IF OBJECT_ID('tempdb..#ImportedServiceOrder') IS NOT NULL DROP TABLE #ImportedServiceOrder

		SELECT imported.ContactId, [order].*
		INTO #ImportedServiceOrder
		FROM #ImportedContact imported
		JOIN #ServiceOrder [order] ON [order].OrderNo COLLATE DATABASE_DEFAULT = imported.LegacyId

		CREATE NONCLUSTERED INDEX IX_#ImportedServiceOrder ON #ImportedServiceOrder (ContactId)

		BEGIN
			MERGE [SMS].[ServiceOrderHead] AS [target]
			USING #ImportedServiceOrder AS [source]
			ON [target].[ContactKey] = [source].[ContactId]
			WHEN MATCHED 
				AND [source].OrderNo IS NOT NULL
				AND [source].[OrderStateKey] <> 'Completed'
			THEN UPDATE SET
					[Name1] = [source].[Name1]
					,[Name2] = [source].[Name2]
					,[Name3] = [source].[Name3]
					,[City] = [source].[City]
					,[CountryKey] = [source].[CountryKey]
					,[ZipCode] = [source].[ZipCode]
					,[Street] = [source].[Street]
					,[Latitude] = CASE 
						WHEN [source].[Name1] <> [target].[Name1]
							OR [source].[City] <> [target].[City]
							OR [source].[ZipCode] <> [target].[ZipCode]
							OR [source].[Street] <> [target].[Street]
						THEN NULL 
						ELSE [target].[Latitude] 
					END
					,[Longitude] = CASE 
						WHEN [source].[Name1] <> [target].[Name1]
							OR [source].[City] <> [target].[City]
							OR [source].[ZipCode] <> [target].[ZipCode]
							OR [source].[Street] <> [target].[Street]
						THEN NULL
						ELSE [target].[Longitude]
					END
					,[GeocodingRetryCounter] = CASE 
						WHEN [source].[Name1] <> [target].[Name1]
							OR [source].[City] <> [target].[City]
							OR [source].[ZipCode] <> [target].[ZipCode]
							OR [source].[Street] <> [target].[Street]
						THEN 0
						ELSE [target].[GeocodingRetryCounter]
					END
					,[CustomerContactId] = COALESCE([source].[CustomerContactId], [target].[CustomerContactId])
					,[Reported] = [source].[Reported]
					,[Priority] = [source].[Priority]
					,[Planned] = [source].[Planned]
					,[Deadline] = [source].[Deadline]
					,[OrderType] = [source].[OrderTypeKey]
					,[PurchaseOrderNo] = [source].[PurchaseOrderNo]
					,[ServiceLocationPhone] = [source].[ServiceLocationPhone]
					,[ServiceLocationMobile] = [source].[ServiceLocationMobile]
					,[ServiceLocationFax] = [source].[ServiceLocationFax]
					,[ServiceLocationEmail] = [source].[ServiceLocationEmail]
					,[ServiceLocationResponsiblePerson] = [source].[ServiceLocationResponsiblePerson]
					,[CommissioningStatusKey] = COALESCE([source].[CommissioningStatus], 0)
					,[Status] = 'ReadyForScheduling'
					,[RepairStatusCode]=[source].RepairStatusCode
					,[ReportSent] = 0
					,[ReportSendingRetries] = NULL
					,[ReportSendingDetails] = NULL
					,[ReportSaved] = 0
					,[ReportSavingRetries] = NULL
					,[ReportSavingDetails] = NULL
					,[CustomerMessage] = (SELECT convert(xml, '<p>' + Replace([Comment],'<',' ') + '</p>')
						FROM #ServiceOrderCommentLine scl
						WHERE scl.[OrderNo] = [source].OrderNo AND scl.[Type] = 8
						ORDER BY [Line No_]
						FOR XML PATH (''))
					,[TroubleshooterActions] = (SELECT convert(xml, '<p>' + Replace([Comment],'<',' ')+ '</p>')
						FROM #ServiceOrderCommentLine scl
						WHERE scl.[OrderNo] = [source].OrderNo AND scl.[Type] = 9
						ORDER BY [Line No_]
						FOR XML PATH (''))
					,[ErrorMessage] = COALESCE((SELECT convert(xml, '<p>' + Replace([Comment],'<',' ') + '</p>')
						FROM #ServiceOrderCommentLine scl
						WHERE scl.[OrderNo] = [source].OrderNo AND scl.[Type] = 10
						ORDER BY [Line No_]
						FOR XML PATH ('')), '')
			WHEN NOT MATCHED
				AND [source].OrderNo IS NOT NULL
				AND [source].[CustomerContactId] IS NOT NULL
			THEN INSERT
					(
						[OrderNo]
						,[CustomerContactId]
						,[Reported]
						,[Planned]
						,[Deadline]
						,[OrderType]
						,[Status]
						,[Priority]
						,[Name1]
						,[Name2]
						,[Name3]
						,[City]
						,[CountryKey]
						,[ZipCode]
						,[Street]
						,[PurchaseOrderNo]
						,[ServiceLocationPhone]
						,[ServiceLocationMobile]
						,[ServiceLocationFax]
						,[ServiceLocationEmail]
						,[ServiceLocationResponsiblePerson]
						,[ContactKey]
						,[LegacyTransferFlag]
						,[CommissioningStatusKey]
						,[CustomerMessage]
						,[TroubleshooterActions]
						,[ErrorMessage]
						,[RepairStatusCode]
					) VALUES (
						[source].OrderNo
						,[source].[CustomerContactId]
						,[source].[Reported]
						,[source].[Planned]
						,[source].[Deadline]
						,[source].[OrderTypeKey]
						,'ReadyForScheduling'
						,[source].[Priority]
						,[source].[Name1]
						,[source].[Name2]
						,[source].[Name3]
						,[source].[City]
						,[source].[CountryKey]
						,[source].[ZipCode]
						,[source].[Street]
						,[source].[PurchaseOrderNo]
						,[source].[ServiceLocationPhone]
						,[source].[ServiceLocationMobile]
						,[source].[ServiceLocationFax]
						,[source].[ServiceLocationEmail]
						,[source].[ServiceLocationResponsiblePerson]
						,[source].[ContactId]
						,1
						,COALESCE([source].[CommissioningStatus], 0)
						,(SELECT convert(xml, '<p>' + Replace([Comment],'<',' ') + '</p>')
							FROM #ServiceOrderCommentLine scl
							WHERE scl.[OrderNo] = [source].OrderNo AND scl.[Type] = 9
							ORDER BY [Line No_]
							FOR XML PATH (''))
						,(SELECT convert(xml, '<p>' + Replace([Comment],'<',' ') + '</p>')
							FROM #ServiceOrderCommentLine scl
							WHERE scl.[OrderNo] = [source].OrderNo AND scl.[Type] = 9
							ORDER BY [Line No_]
							FOR XML PATH (''))
						,COALESCE((SELECT convert(xml, '<p>' + Replace([Comment],'<',' ') + '</p>')
							FROM #ServiceOrderCommentLine scl
							WHERE scl.[OrderNo] = [source].OrderNo AND scl.[Type] = 10
							ORDER BY [Line No_]
							FOR XML PATH ('')), '')
							,[source].RepairStatusCode
						)
			WHEN NOT MATCHED BY SOURCE 
				AND [target].[Status] <> 'Closed'
				AND EXISTS (SELECT TOP 1 [LegacyId] 
							FROM [CRM].[Contact]
							WHERE [ContactId] = [target].[ContactKey] AND [LegacyId] IS NOT NULL)
				AND NOT EXISTS(SELECT TOP 1 NULL FROM #ServiceOrder WHERE OrderNo = [target].[OrderNo])
				THEN UPDATE	SET
					[Status] = 'Closed';
			
			EXEC SP_AppendResult 'Merged Service Order', '#ImportedContact', @log OUTPUT, @timeDiff OUTPUT
		END

		--BEGIN -- Close order when it doesn't exist in Navision anymore
		--	MERGE [SMS].[ServiceOrderHead] AS [target]
		--	USING #ImportedServiceOrder AS [source]
		--	ON [target].[ContactKey] = [source].[ContactId]
		--	WHEN MATCHED 
		--		AND [source].[OrderNo] IS NULL
		--		AND NOT EXISTS(SELECT TOP 1 NULL FROM #ServiceOrder WHERE OrderNo = [target].[OrderNo] OR [AdHocOrderNo] = [target].[OrderNo])
		--		THEN UPDATE SET
		--			[Status] = 'Closed'
		--			,[Debug] = 'Closed because service order was not found in Navision View (2)';	
			
		--	EXEC SP_AppendNewLine @log OUTPUT, 'Closed Service Orders', @timeDiff OUTPUT;
		--END

		--BEGIN	
		--	IF OBJECT_ID('tempdb..#ServiceOrderRescheduled') IS NOT NULL DROP TABLE #ServiceOrderRescheduled
			
		--	SELECT ContactId, OrderNo
		--	INTO #ServiceOrderRescheduled
		--	FROM #ImportedServiceOrder
		--	WHERE Rescheduled = 1 OR RefreshNeeded = 1
			
		--	CREATE NONCLUSTERED INDEX IX_#ServiceOrderRescheduled_ContactId ON #ServiceOrderRescheduled (ContactId)
		--	CREATE NONCLUSTERED INDEX IX_#ServiceOrderRescheduled_OrderNo ON #ServiceOrderRescheduled (OrderNo)

		--	-- Refresh dispatches, checklists, jobs and material for rescheduled orders
		--	UPDATE dispatch
		--	SET [ModifyDate] = dbo.GetFutureUtcDate(), [ModifyUser] = 'Import'
		--	FROM [SMS].[ServiceOrderDispatch] dispatch
		--	JOIN #ServiceOrderRescheduled [order] ON [order].ContactId = dispatch.OrderId

		--	UPDATE checklist 
		--	SET [ModifyDate] = dbo.GetFutureUtcDate(), [ModifyUser] = 'Import'
		--	FROM [CRM].[DynamicFormReference] checklist
		--	JOIN #ServiceOrderRescheduled [order] ON [order].ContactId = checklist.[ReferenceKey]

		--	UPDATE times
		--	SET [ModifyDate] = dbo.GetFutureUtcDate(), [ModifyUser] = 'Import'
		--	FROM [SMS].[ServiceOrderTimes] times
		--	JOIN #ServiceOrderRescheduled [order] ON times.OrderNo = [order].OrderNo

		--	UPDATE material
		--	SET [ModifyDate] = dbo.GetFutureUtcDate(), [ModifyUser] = 'Import'
		--	FROM [SMS].[ServiceOrderMaterial] material
		--	JOIN #ServiceOrderRescheduled [order] ON material.OrderNo = [order].OrderNo

		--	DECLARE @orderNos NVARCHAR(MAX) = 'Refreshed Rescheduled Dispatches, Checklists, Times, Material: ' + (SELECT OrderNo + ', ' AS 'data()' FROM #ServiceOrderRescheduled FOR XML PATH(''))
		--	EXEC SP_AppendNewLine @log OUTPUT, @orderNos, @timeDiff OUTPUT;
		--END

		--BEGIN
		--	-- Completing dispatches for closed orders
		--	UPDATE dispatch
		--	SET [IsActive] = 0
		--		,[ModifyDate] = GETUTCDATE()
		--		,[ModifyUser] = 'Import'
		--	FROM [SMS].[ServiceOrderDispatch] AS dispatch
		--	JOIN [SMS].[ServiceOrderHead] AS [order] ON dispatch.[OrderId] = [order].[ContactKey]
		--	WHERE [order].[Status] = 'Closed'
		--		AND dispatch.[IsActive] = 1
		--		AND dispatch.[Status] IN ('Released', 'Read', 'InProgress', 'SignedByCustomer')

		--	EXEC SP_AppendNewLine @log OUTPUT, 'Closed dispatches of closed orders', @timeDiff OUTPUT;
		--END

		--BEGIN -- Completing dispatches for orders which are in status "7" (rescinded) in Navision
		--	MERGE [SMS].[ServiceOrderDispatch] AS [target]
		--	USING #ImportedServiceOrder AS [source]
		--	ON [target].[OrderId] = [source].[ContactId] AND [source].[Status] = 7
		--	WHEN MATCHED AND [target].[IsActive] = 1
		--		THEN UPDATE SET
		--			[target].[IsActive] = 0
		--			,[target].[ModifyDate] = GETUTCDATE()
		--			,[target].[Remark] = 'Auftrag wurde in Navision storniert, Dispatch wurde von Import automatisch abgeschlossen.';

		--	MERGE [RPL].[Dispatch] AS [target]
		--	USING #ImportedServiceOrder AS [source]
		--	ON [target].[DispatchOrderKey] = [source].[ContactId] AND [source].[Status] = 7
		--	WHEN MATCHED AND [target].[IsActive] = 1
		--		THEN UPDATE SET
		--			[target].[IsActive] = 0
		--			,[target].[Version] = [target].[Version] + 1
		--			,[target].[ModifyDate] = GETUTCDATE()
		--			,[target].[InternalInformation] = 'Auftrag wurde in Navision storniert, Dispatch wurde von Import automatisch abgeschlossen.';
			
		--	EXEC SP_AppendNewLine @log OUTPUT, 'Closed dispatches of rescinded orders', @timeDiff OUTPUT;
		--END

		--BEGIN
		--	UPDATE [RPL].[Dispatch]
		--	SET [IsActive] = 0
		--	WHERE [Type]  = 'ServiceOrderDispatch'
		--		AND [DispatchClosed] = 1
		--		AND [IsActive] = 1

		--	INSERT INTO [RPL].[Dispatch] 
		--		(
		--			[Type]
		--			,[Start]
		--			,[Stop]
		--			,[Fix]
		--			,[ResourceKey]
		--			,[DispatchOrderKey]
		--			,[DispatchClosed]
		--			,[Version]
		--			,[LegacyId]
		--			,[CreateDate]
		--			,[ModifyDate]
		--			,[CreateUser]
		--			,[ModifyUser]
		--			,[IsActive]
		--		)
		--		SELECT
		--			'TimePosting'
		--			,MIN(tp.[From]) AS [Start]
		--			,DATEADD(Minute, SUM(tp.[DurationInMinutes]), MIN(tp.[From])) AS [Stop]
		--			,0 AS [Fix]
		--			,tp.[UserUsername] AS [ResourceKey]
		--			,(SELECT TOP 1 ContactKey FROM SMS.ServiceOrderHead WHERE [OrderNo] = tp.[OrderNo]) AS [OrderKey]
		--			,1 AS [DispatchClosed]
		--			,1 AS [Version]
		--			,tp.[DispatchId] AS [LegacyId]
		--			,GETUTCDATE() AS [CreateDate]
		--			,GETUTCDATE() AS [ModifyDate]
		--			,tp.[UserUsername] AS [CreateUser]
		--			,tp.[UserUsername] AS [ModifyUser]
		--			,1 AS [IsActive]
		--		FROM SMS.ServiceOrderTimePostings tp 
		--		WHERE tp.IsActive = 1 
		--			AND tp.ItemNo = '0300' 
		--			AND tp.DispatchId IN
		--				(
		--					-- rpl dispatches without rpl timeposting but with sms timepostings
		--					SELECT rpl.LegacyId as DispatchId from [RPL].[Dispatch] rpl
		--					JOIN [SMS].[ServiceOrderDispatch] sod ON sod.[DispatchId] = rpl.[LegacyId]
		--					WHERE [type] = 'ServiceOrderDispatch' AND rpl.DispatchClosed = 1 AND sod.[ModifyDate] < DATEADD(MINUTE, -5, GETUTCDATE())
		--						AND NOT EXISTS (SELECT TOP 1 * FROM RPL.Dispatch rpl2 WHERE rpl2.[Type] = 'TimePosting' AND rpl2.LegacyId = rpl.LegacyId)
		--						AND EXISTS (SELECT TOP 1 * FROM SMS.ServiceOrderTimePostings tp WHERE tp.ItemNo = '0300' AND tp.DispatchId = rpl.legacyid AND tp.IsActive = 1)
		--				)
		--			AND tp.IsActive = 1
		--			AND tp.ItemNo = '0300'
		--		GROUP BY tp.[Date], tp.[DispatchId], tp.[UserUsername], tp.[OrderNo]

		--	EXEC SP_AppendNewLine @log OUTPUT, 'Inserted time postings to RPL.Dispatch (??)', @timeDiff OUTPUT;
		--END

		--BEGIN
		--	-- duplicate rpl timepostings
		--	DELETE d
		--	FROM [RPL].[Dispatch] d
		--	WHERE d.[Type] = 'TimePosting'
		--	AND d.[IsActive] = 1
		--	AND EXISTS (
		--		SELECT TOP 1 NULL
		--		FROM [RPL].[Dispatch] d2
		--		WHERE d2.[Type] = 'TimePosting'
		--			AND d.[Start] = d2.[Start]
		--			AND d.[Stop] = d2.[Stop]
		--			AND d.[ResourceKey] = d2.[ResourceKey]
		--			AND d.[DispatchOrderKey] = d2.[DispatchOrderKey]
		--			AND d.[DispatchClosed] = d2.[DispatchClosed]
		--			AND d.[LegacyId] = d2.[LegacyId]
		--			AND d.[IsActive] = d2.[IsActive]
		--			AND d2.[Id] < d.[Id]
		--	)
		--	EXEC SP_AppendNewLine @log OUTPUT, 'Deleted duplicate time postings from RPL.Dispatch', @timeDiff OUTPUT;
		--END

		--BEGIN -- Extended Logging for disappearing service orders
		--	IF OBJECT_ID('tempdb..#ServiceOrderDisappeared') IS NOT NULL DROP TABLE #ServiceOrderDisappeared
		--	IF OBJECT_ID('tempdb..##ServiceOrderDisappearedData') IS NOT NULL DROP TABLE ##ServiceOrderDisappearedData

		--	SELECT o.OrderNo
		--	INTO #ServiceOrderDisappeared
		--	FROM SMS.ServiceOrderHead o
		--	JOIN #ImportedServiceOrder ON [ContactKey] = [ContactId]
		--	WHERE o.Status = 'Closed' AND Debug = 'Closed because service order was not found in Navision View (1)'

		--	IF EXISTS(SELECT TOP 1 OrderNo FROM #ServiceOrderDisappeared) BEGIN
		--		SELECT [No_], [Customer No_], [Service Item No_], [Description], [Order Date], [Service Priority], [Companyname  (Reparaturort)], [City (Reparaturort)], [Status], [Approval Planning Table], [Approvals Planning Table]
		--		INTO ##ServiceOrderDisappearedData
		--		FROM [S].[External_ServiceHeader] WITH (READUNCOMMITTED)
		--		WHERE [No_] COLLATE DATABASE_DEFAULT IN (SELECT OrderNo FROM #ServiceOrderDisappeared)
		--	END
		--END

		--BEGIN --Update Orders which reappeared in View
		--	IF OBJECT_ID('tempdb..#ServiceOrderReappeared') IS NOT NULL DROP TABLE #ServiceOrderReappeared
		--	IF OBJECT_ID('tempdb..##ServiceOrderReappearedData') IS NOT NULL DROP TABLE ##ServiceOrderReappearedData
			
		--	SELECT ContactId, EX.OrderStateKey, O.OrderNo
		--	INTO #ServiceOrderReappeared
		--	FROM SMS.ServiceOrderHead O
		--	JOIN CRM.Contact C ON O.ContactKey = C.ContactId
		--	JOIN #ServiceOrder EX ON O.OrderNo = EX.OrderNo
		--	WHERE O.Status = 'Closed' AND Debug = 'Closed because service order was not found in Navision View (1)'
		--		AND O.Status <> EX.OrderStateKey
		--		AND C.IsActive = 1

		--	UPDATE o
		--	SET o.Status = OrderStateKey
		--		,Debug = Debug + ' ' + 'Reset status because service order reappeared'
		--	FROM SMS.ServiceOrderHead o
		--	JOIN #ServiceOrderReappeared ON ContactId = ContactKey

		--	UPDATE c
		--	SET c.ModifyDate = GETUTCDATE()
		--		,c.ModifyUser = 'Import'
		--	FROM CRM.Contact c
		--	JOIN #ServiceOrderReappeared o ON c.ContactId = o.ContactId

		--	UPDATE times
		--	SET [ModifyDate] = GETUTCDATE(), [ModifyUser] = 'Import'
		--	FROM [SMS].[ServiceOrderTimes] times
		--	JOIN #ServiceOrderReappeared [order] ON times.OrderNo = [order].OrderNo

		--	EXEC SP_AppendNewLine @log OUTPUT, 'Reset status of reappeared service orders', @timeDiff OUTPUT;

		--	IF EXISTS(SELECT TOP 1 OrderNo FROM #ServiceOrderReappeared) BEGIN
		--		SELECT [No_], [Customer No_], [Service Item No_], [Description], [Order Date], [Service Priority], [Companyname  (Reparaturort)], [City (Reparaturort)], [Status], [Approval Planning Table], [Approvals Planning Table]
		--		INTO ##ServiceOrderReappearedData
		--		FROM [S].[External_ServiceHeader] WITH (READUNCOMMITTED)
		--		WHERE [No_] COLLATE DATABASE_DEFAULT IN (SELECT OrderNo FROM #ServiceOrderReappeared)
		--	END
		--END

	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW
	END CATCH

	IF @@TRANCOUNT > 0
		COMMIT TRANSACTION;

	SET @log = 'Service Order Import finished: ' + @log;
	EXEC SP_WriteLog @log, @print = 0
END TRY
BEGIN CATCH
	DECLARE @name AS NVARCHAR(100)
	SET @name = 'Service Order Import'
	--EXEC SP_CatchError @name;
END CATCH;
END