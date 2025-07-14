SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

BEGIN
SET NOCOUNT ON;
EXEC SP_WriteLog 'Installation Import started', @print = 0
BEGIN TRY
	DECLARE @log AS VARCHAR(MAX);
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
		CREATE TABLE #ImportedContact (Change NVARCHAR(100), IsActive BIT NULL, ContactId UNIQUEIDENTIFIER, LegacyId NVARCHAR(100), LegacyVersion BIGINT)
		IF OBJECT_ID('tempdb..#Contact') IS NOT NULL DROP TABLE #Contact
 
		SELECT
			installation.*
			,installation.[Description] AS [Name]
			,installation.InstallationNo AS LegacyId
			,1 AS IsExported
			,CAST(NULL AS UNIQUEIDENTIFIER) AS ParentKey
			,NULL AS ContactLanguage
			,2 AS Visibility
			,NULL AS ResponsibleUser
			,NULL AS NavisionContactNo
			,CAST(NULL AS UNIQUEIDENTIFIER) AS LmobileKey
			--,(case when installation.[ErfStandort]=1  then addressI.AddressId else  addressC.AddressId end) AS LocationAddressKey
			,addressC.AddressId AS LocationAddressKey
			,companyContact.ContactId As LocationContactId
			,station.[StationId] AS StationKey
			--,installation.[ShipToCode] 
			,BINARY_CHECKSUM(
				installation.[InstallationNo]
				,installation.[LegacyInstallationId]
				,installation.[Description]
				,installation.[InstallationType]
				,installation.[KickOffDate]
				,installation.[WarrantyUntil]
				,installation.[NavisionCustomerNo]
				,installation.[CustomInstallationType]
				,installation.[StationLegacyId]
				,installation.[Status]
				,installation.[ShipToCode] 
				,installation.[ExactPlace]
				,installation.ExternalReference
				,companyContact.ContactId
				,installation.[MotorTyp]
	           , installation.[MotorNummer]
	           , installation.[GeneratorTyp]
	           , installation.[GeneratorNummer]
	           , installation.[PumpeTyp]
	           , installation.[PumpeNummer]
	           ,installation.[KagemaLocation]
			) AS [LegacyVersion]
		INTO #Contact 
		FROM [V].[External_Installation] installation
		JOIN CRM.Contact companyContact ON companyContact.LegacyId = installation.NavisionCustomerNo AND companyContact.IsActive = 1 and ContactType='Company'
		JOIN CRM.Address addressC ON  
		--(companyContact.ContactId = addressC.CompanyKey and IsCompanyStandardAddress=1 and addressC.IsActive = 1 and  coalesce(installation.[ErfStandort],0)=0 ) 
		--OR ( 
		installation.InstallationNo = addressC.InstallationNo  and addressC.IsActive = 1 
		--and coalesce(installation.[ErfStandort],0)=1 )
		LEFT OUTER JOIN [CRM].[Station] station ON installation.[StationLegacyId] = station.[LegacyId]
		
		CREATE NONCLUSTERED INDEX IX_#Contact_InstallationNo ON #Contact ([InstallationNo] ASC)
			
		DECLARE @transferInstallation NVARCHAR(100);
		SELECT @transferInstallation = 'Transfered ' + CONVERT(NVARCHAR(10), COUNT(*)) + ' rows to #Contact' FROM #Contact
		EXEC SP_AppendNewLine @log OUTPUT, @transferInstallation, @timeDiff OUTPUT;
	END


	BEGIN TRANSACTION
	BEGIN TRY

	--EXEC SP_Merge_Contact 'Installation'
BEGIN
	SET NOCOUNT ON;
		MERGE CRM.Contact AS [target]
		USING #Contact AS [source]
		ON [target].ContactType = 'Installation' AND [target].[LegacyId] = [source].[LegacyId]
		WHEN NOT MATCHED 
			AND ([source].[LmobileKey] IS NULL -- this is filled during export
				--REMOVE WHEN EXPORT IS TURNED ON
				--OR NOT EXISTS (	SELECT 1 
				--				FROM [CRM].[Contact] 
				--				WHERE ContactId = [source].[LmobileKey] AND ContactType = @contactType
				--	) -- still insert, if we do not know this id (migration service/sales)
				--REMOVE WHEN EXPORT IS TURNED ON
			) 
		THEN INSERT (
				CreateDate, CreateUser
				,ModifyDate, ModifyUser
				,IsExported
				,IsActive
				,LegacyId
				,LegacyVersion
				,[Name]
				,ParentKey
				,ContactType
				,ContactLanguage
				,Visibility
				,ResponsibleUser
			) VALUES (
				GETUTCDATE(), 'Import'
				,GETUTCDATE(), 'Import'
				,[source].IsExported
				,1
				,[source].LegacyId
				,[source].LegacyVersion
				,[source].[Name]
				,[source].ParentKey
				,'Installation'
				,[source].ContactLanguage
				,[source].Visibility
				,[source].ResponsibleUser
			)
		WHEN MATCHED 
		AND [target].LegacyVersion IS NULL OR [target].LegacyVersion <> [source].LegacyVersion 
		THEN UPDATE 
			SET [target].ModifyDate = GETUTCDATE()
				,[target].ModifyUser = 'Import'
				,[target].LegacyVersion = [source].LegacyVersion
				,[target].IsActive = 1
				,[target].IsExported = [source].IsExported
				,[target].LegacyId = [source].LegacyId
				,[target].[Name] = [source].[Name]
				,[target].ParentKey = [source].ParentKey
				,[target].ContactLanguage = [source].ContactLanguage
				,[target].Visibility = [source].Visibility
				,[target].ResponsibleUser = [source].ResponsibleUser
		WHEN NOT MATCHED BY SOURCE 
			AND [target].[LegacyId] IS NOT NULL
			AND [target].IsActive = 1
			AND [target].ContactType = 'Installation'
		THEN UPDATE
			SET [target].ModifyDate = GETUTCDATE()
				,[target].ModifyUser = 'Import'
				,[target].LegacyVersion = NULL
				,[target].IsActive = 0
		OUTPUT $action, inserted.IsActive, inserted.ContactId, [source].LegacyId, [source].LegacyVersion INTO #ImportedContact;
END
	EXEC SP_AppendNewLine @log OUTPUT, 'Merged Contact', @timeDiff OUTPUT;

		-------------------------------------------------
		-- Merge Entity table
		-------------------------------------------------

	BEGIN
		MERGE [SMS].[InstallationHead] AS [target]
		USING (	SELECT imported.ContactId, installation.*
				FROM #ImportedContact imported
				JOIN #Contact installation ON installation.[InstallationNo] COLLATE DATABASE_DEFAULT = imported.[LegacyId]) AS [source]
		ON [target].[ContactKey] = [source].[ContactId]
		WHEN MATCHED THEN UPDATE SET  
			[target].[InstallationNo] = [source].[InstallationNo]
			,[target].[LegacyInstallationId] = [source].[LegacyInstallationId]
			,[target].[LocationContactId] = [source].[LocationContactId]
			,[target].[LocationAddressKey]=[source].[LocationAddressKey]
			,[target].[Description] = [source].[Description]
			,[target].[InstallationType] = [source].[InstallationType]
			,[target].[KickOffDate] = [source].[KickOffDate]
			,[target].[WarrantyFrom] = [source].[WarrantyFrom]
			,[target].[WarrantyUntil] = [source].[WarrantyUntil]
			,[target].[ExactPlace] = [source].[ExactPlace]
			,[target].ExternalReference = [source].ExternalReference
			,[target].[Room] = [source].[Room]
			,[target].[Status]=[source].[Status]
			,[target].[ShipToCode]=[source].[ShipToCode]
			, [target].[MotorTyp] =[source].[MotorTyp]
	, [target].[MotorNummer]=  [source].[MotorNummer]
	, [target].[GeneratorTyp]=[source].[GeneratorTyp]
	, [target].[GeneratorNummer]= [source].[GeneratorNummer]
	, [target].[PumpeTyp]=[source].[PumpeTyp]
	, [target].[PumpeNummer]=[source].[PumpeNummer]
	,[target].[KagemaStandort]=[source].[KagemaLocation]
		WHEN NOT MATCHED THEN INSERT 
			(
				[ContactKey]
				,[InstallationNo]
				,[LegacyInstallationId]
				,[Description]
				,[InstallationType]
				,[KickOffDate]
				,[WarrantyFrom]
				,[WarrantyUntil]
				,[LocationContactId]
				,[LocationAddressKey]
				,[Priority]
				,[SortOrder]
				,[Favorite]
				,[Status]
				,ExternalReference 
				,[ExactPlace]
				,[Room]
				,[ShipToCode]
				,[MotorTyp]
	, [MotorNummer]
	, [GeneratorTyp]
	, [GeneratorNummer]
	, [PumpeTyp]
	, [PumpeNummer]
	,[KagemaStandort]
			) VALUES (
				[source].[ContactId]
				,[source].[InstallationNo]
				,[source].[LegacyInstallationId]
				,[source].[Description]
				,[source].[InstallationType]
				,[source].[KickOffDate]
				,[source].[WarrantyFrom] 
				,[source].[WarrantyUntil]
				,[source].[LocationContactId]
				,[source].[LocationAddressKey]
				,0
				,0 
				,0 
				,[source].[Status]
				,[source].ExternalReference
				,[source].[ExactPlace]
				,[source].[Room]
				,[source].[ShipToCode]
					,[source].[MotorTyp]
	, [source].[MotorNummer]
	, [source].[GeneratorTyp]
	, [source].[GeneratorNummer]
	,[source].[PumpeTyp]
	, [source].[PumpeNummer]
	,[source].[KagemaLocation]
			);
			EXEC SP_AppendResult 'Merged Installation', '#ImportedContact', @log OUTPUT, @timeDiff OUTPUT
		END

	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW
	END CATCH

	IF @@TRANCOUNT > 0
		 COMMIT TRANSACTION;

	SET @log = 'Installation Import finished: ' + @log;
	EXEC SP_WriteLog @log, @print = 0
END TRY
BEGIN CATCH
	--EXEC SP_CatchError 'Installation Import';
END CATCH;
END

GO