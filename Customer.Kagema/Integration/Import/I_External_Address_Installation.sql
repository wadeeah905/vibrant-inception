SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

BEGIN
	SET NOCOUNT ON;
	SET ANSI_NULLS ON;
	SET QUOTED_IDENTIFIER ON;
		
	BEGIN TRY
		DECLARE @count bigint;
		DECLARE @tableName nvarchar(200);
		SET @tableName = '[CRM].[Address]';

		-------------------------------------------------
		-- Fill temporary merge storage
		-------------------------------------------------
		BEGIN
			IF OBJECT_ID('tempdb..#ImportedAddresses') IS NOT NULL DROP TABLE #ImportedAddresses
			CREATE TABLE #ImportedAddresses (Change NVARCHAR(100), 
												AddressId UNIQUEIDENTIFIER, 
												LegacyId NVARCHAR(100), 
												LegacyVersion BIGINT)
			IF OBJECT_ID('tempdb..#AddressesFromView') IS NOT NULL DROP TABLE #AddressesFromView												
			IF OBJECT_ID('tempdb..#Address') IS NOT NULL DROP TABLE #Address
			
			SELECT 
				a.*
			INTO #AddressesFromView
			FROM [V].[External_Address_Installation] a

			CREATE NONCLUSTERED INDEX IX_#AddressesFromView_LegacyId ON #AddressesFromView ([LegacyId] ASC)

			SELECT 
				a.*
				,a.[CountryCode] AS [CountryKey]
				,CASE WHEN 
					a.[CountryCode] <> ad.[CountryKey]
					OR a.[City] <> ad.[City]
					OR a.[ZipCode] <> ad.[ZipCode]
					OR a.[Street] <> ad.[Street]
				THEN 1 ELSE 0 END AS [LocationChanged]
				,c.ContactId AS [CompanyKey]
				,ci.ContactKey AS [InstallationKey]
			INTO #Address
			FROM #AddressesFromView a
			LEFT JOIN [CRM].[Contact] c ON c.LegacyId = a.[CompanyNo] AND c.ContactType = 'Company'
			LEFT JOIN [SMS].[InstallationHead] ci ON ci.InstallationNo = a.[InstallationNo] 
			LEFT OUTER JOIN [CRM].[Address] ad ON ad.LegacyId = a.LegacyId AND a.AddressTypeKey = '3'
			
			CREATE NONCLUSTERED INDEX IX_#Address_LegacyId ON #Address ([LegacyId] ASC)
			 
			
			SELECT @count = COUNT(*) FROM #Address
			PRINT CONVERT(nvarchar, @count) + ' Records transferred to input table'
		END
		-------------------------------------------------
		-- Merge Entity table
		-------------------------------------------------
		BEGIN
			MERGE [CRM].[Address] AS [target]
			USING #Address AS [source]
			ON [target].[LegacyId] = [source].[LegacyId]
			WHEN MATCHED
				AND ([target].[LegacyVersion] IS NULL OR [target].[LegacyVersion] <> [source].[LegacyVersion])
				THEN UPDATE SET 
					[target].[LegacyId] = [source].[LegacyId]
					,[target].[Name1] = [source].[Name1]
					,[target].[Name2] = [source].[Name2]
					,[target].[Name3] = [source].[Name3]
					,[target].[City] = [source].[City]
					,[target].[CountryKey] = [source].[CountryKey]
					,[target].[ZipCode] = [source].[ZipCode]
					,[target].[Street] = [source].[Street]
					,[target].[RegionKey] = [source].[RegionKey]
					,[target].[AddressTypeKey] = [source].[AddressTypeKey]
					,[target].[ZipCodePOBox] = [source].[ZipCodePOBox]
					,[target].[POBox] = [source].[POBox]
					,[target].[CompanyKey] = [source].[CompanyKey]
					,[target].[IsCompanyStandardAddress] = [source].[IsCompanyStandardAddress]
					,[target].[IsActive] = 1
					,[target].[Latitude] = CASE WHEN [source].[LocationChanged] = 1 THEN NULL ELSE [target].[Latitude] END
    				,[target].[Longitude] = CASE WHEN [source].[LocationChanged] = 1 THEN NULL ELSE [target].[Longitude] END
    				,[target].[GeocodingRetryCounter] = CASE WHEN [source].[LocationChanged] = 1 THEN 0 ELSE [target].[GeocodingRetryCounter] END
    				,[target].[ModifyDate] = GETUTCDATE()
    				,[target].[ModifyUser] = 'Import'
					,[target].[LegacyVersion] = [source].[LegacyVersion]
					,ContactName=[source].ContactName
					,ContactTelefon=[source].ContactTelefon
					,ErfStandort=[source].ErfStandort
					,[InstallationKey]=[source].[InstallationKey]
					,[InstallationNo]=[source].[InstallationNo]
			WHEN NOT MATCHED
				THEN INSERT
					(					
						[LegacyId]
						,[Name1]
						,[Name2]
						,[Name3]
						,[City]
						,[CountryKey]
						,[ZipCode]
						,[Street]
						,[RegionKey]
						,[AddressTypeKey]
						,[ZipCodePOBox]
						,[POBox]
						,[CompanyKey]
						,[IsCompanyStandardAddress]
						,[IsExported]
						,[CreateDate]
						,[CreateUser]
						,[ModifyDate]
						,[ModifyUser]
						,[LegacyVersion]
						,ContactName
						,ContactTelefon
						,ErfStandort
						,[InstallationKey]
						,[InstallationNo]
					) VALUES (
						[source].[LegacyId]
						,[source].[Name1]
						,[source].[Name2]
						,[source].[Name3]
						,[source].[City]
						,[source].[CountryKey]
						,[source].[ZipCode]
						,[source].[Street]
						,[source].[RegionKey]
						,[source].[AddressTypeKey]
						,[source].[ZipCodePOBox]
						,[source].[POBox]
						,[source].[CompanyKey]
						,[source].[IsCompanyStandardAddress]
						,1
						,GETUTCDATE()
						,'Import'
						,GETUTCDATE()
						,'Import'
						,[source].[LegacyVersion]
						,[source].ContactName
						,[source].ContactTelefon
						,[source].ErfStandort
						,[source].[InstallationKey]
						,[source].[InstallationNo]
					)
			WHEN NOT MATCHED BY SOURCE 
				AND [target].[IsActive] = 1
				AND [target].[AddressTypeKey] = '3'
				THEN UPDATE SET
					[target].[IsActive] = 0
					,[target].[IsCompanyStandardAddress] = 0
					,[target].[ModifyDate] = GETUTCDATE()
    				,[target].[ModifyUser] = 'Import'
					,[target].[LegacyVersion] = NULL
			OUTPUT $action
				,inserted.AddressId
				,[source].LegacyId
				,[source].LegacyVersion 
			INTO #ImportedAddresses;
			
			PRINT 'Import ' + @tableName + ': TOTAL ' +  CAST(@@Rowcount AS VARCHAR(20)) + ' Rows'

			SELECT @count = COUNT(*) FROM #ImportedAddresses WHERE Change = 'INSERT'
    		EXEC SP_Import_WriteLog 'INSERT', @tableName, @count;

			SELECT @count = COUNT(*) FROM #ImportedAddresses WHERE Change = 'UPDATE'
 			EXEC SP_Import_WriteLog 'UPDATE', @tableName, @count;
	
			SELECT @count = COUNT(*) FROM #ImportedAddresses WHERE Change = 'DELETE'
 			EXEC SP_Import_WriteLog 'DELETE', @tableName, @count;
		END
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMessage NVARCHAR(4000);
		DECLARE @ErrorSeverity INT;
		DECLARE @ErrorState INT;
	
		SELECT
			@ErrorMessage = ERROR_MESSAGE(),
			@ErrorSeverity = ERROR_SEVERITY(),
			@ErrorState = ERROR_STATE();

		EXEC SP_Import_WriteErrorLog @tableName, @ErrorMessage, @ErrorSeverity, @ErrorState;
	END CATCH;
END
GO