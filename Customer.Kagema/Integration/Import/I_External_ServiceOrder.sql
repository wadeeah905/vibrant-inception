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
			,0 AS CommissioningStatus
		INTO #ServiceOrderSetup
		FROM [V].[External_ServiceOrder] AS ext
		JOIN [CRM].[Contact] companyContact WITH (READUNCOMMITTED) ON companyContact.LegacyId = ext.NavisionCustomerNo 
				AND companyContact.IsActive = 1 
				AND companyContact.ContactType = 'Company'
		
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
				,[ErrorMessage]
				,[SalespersonName]
				,[Remark]
				,[TravelFlateRate]
				,[OfferFlateRate]
				,[Tag13B]
			) AS LegacyVersion
		INTO #ServiceOrder
		FROM #ServiceOrderSetup
		CREATE NONCLUSTERED INDEX IX_#ServiceOrder_OrderNo ON #ServiceOrder (OrderNo ASC)

		DECLARE @transfer NVARCHAR(100);
		SELECT @transfer = 'Transfered ' + CONVERT(NVARCHAR(10), COUNT(*)) + ' rows to #ServiceOrder' FROM #ServiceOrder
		EXEC SP_AppendNewLine @log OUTPUT, @transfer, @timeDiff OUTPUT;
	END
		
	BEGIN TRANSACTION
	BEGIN TRY
	
		-------------------------------------------------
		-- Merge Crm.Contact
		-------------------------------------------------	
		BEGIN
			MERGE [CRM].[Contact] AS [target]
			USING #ServiceOrder AS [source]
			ON [target].[Name] = [source].OrderNo
			AND [target].[ContactType] = 'ServiceOrder'
			WHEN MATCHED 
				AND ([target].[LegacyVersion] IS NULL OR [target].[LegacyVersion] <> [source].[LegacyVersion])
				AND [source].[OrderStateKey] <> 'Completed'
				THEN UPDATE SET
					[target].[LegacyVersion] = [source].[LegacyVersion]
					,[target].[ModifyDate] = getutcdate()
					,[target].[ModifyUser] = 'Import'
					,[target].[Name] = [source].[OrderNo]
					,[target].[IsActive] = 1
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

				) VALUES (
					'ServiceOrder'
					,[source].OrderNo
					,[source].LegacyVersion
					,0
					,[source].OrderNo
					,1
					,2
					,getutcdate() 
					,getutcdate()
					,'Import' 
					,'Import'

				)
			--WHEN NOT MATCHED BY SOURCE 
			--	AND [target].[LegacyId] IS NOT NULL
			--	AND [target].IsActive = 1
			--	AND [target].ContactType = 'ServiceOrder'
			--THEN UPDATE
			--	SET [target].ModifyDate = GETUTCDATE()
			--		,[target].ModifyUser = 'Import'
			--		,[target].LegacyVersion = NULL
			--		,[target].IsActive = 0
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
				AND Coalesce([target].[ExportServiceOrder],0) =0
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
					,[ReportSent] = 0
					,[ReportSaved] = 0
					,[ErrorMessage] = [source].[ErrorMessage]
					,[SalespersonName] = [source].[SalespersonName]
					--,[ShipToCode] = [source].[ShipToCode]
					,[LMStatus] = [source].[LMStatus]
					,[ExportServiceOrder]=1
					,[Remark]= [source].[Remark]
					,[TravelFlateRate]= [source].[TravelFlateRate]
				    ,[OfferFlateRate]=  [source].[OfferFlateRate]
					,[Tag13B]=[source].[Tag13B]
					--,[AttachChecklist]=1

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
						,[ErrorMessage]
						,[SalespersonName]
						--,[ShipToCode]
						,[LMStatus]
						,[ExportServiceOrder]
						,[Remark]
						,[TravelFlateRate]
				        ,[OfferFlateRate]
						,[AttachChecklist]
						,[Tag13B]
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
						,0
						,COALESCE([source].[CommissioningStatus], 0)
						,[ErrorMessage]
						,[source].[SalespersonName]
						--,[source].[ShipToCode]
						,[source].[LMStatus]
						,1
						,[source].[Remark]
						,[source].[TravelFlateRate]
						,[source].[OfferFlateRate]
						,1
						,[source].[Tag13B]
						);
			EXEC SP_AppendResult 'Merged Service Order', '#ImportedContact', @log OUTPUT, @timeDiff OUTPUT
		END
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW
	END CATCH

	------Inactivate contacts when status is open
	UPDATE CRM.Contact 
	SET IsActive=0,
		ModifyDate=GETUTCDATE(),
		ModifyUser='InactivateImportBC',
		LegacyVersion = NULL
	FROM S.External_ServiceHeader sh WITH (READUNCOMMITTED)
	JOIN CRM.contact c on sh.[No_] COLLATE DATABASE_DEFAULT = c.LegacyId and ContactType='ServiceOrder'
	WHERE [lmstatus]=0 and c.IsActive=1

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