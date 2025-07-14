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
			IF OBJECT_ID('tempdb..#AddressImport') IS NOT NULL DROP TABLE #AddressImport
			CREATE TABLE #AddressImport (Change NVARCHAR(100), 
												AddressId UNIQUEIDENTIFIER, 
												LegacyId NVARCHAR(100), 
												LegacyVersion BIGINT)
			IF OBJECT_ID('tempdb..#RemoteAddress') IS NOT NULL DROP TABLE #RemoteAddress												
			IF OBJECT_ID('tempdb..#Address') IS NOT NULL DROP TABLE #Address
			
			SELECT 
				a.*
			INTO #RemoteAddress
			FROM [V].[External_Address_Company] a

			CREATE NONCLUSTERED INDEX IX_#RemoteAddress_CompanyNo ON #RemoteAddress ([CompanyNo] ASC)
			CREATE NONCLUSTERED INDEX IX_#RemoteAddress_AddressNo ON #RemoteAddress ([AddressNo] ASC)

			SELECT 
				a.*
				,a.[CountryCode] AS [CountryKey]
				,CASE WHEN 
					a.[CountryCode] <> ad.[CountryKey] COLLATE DATABASE_DEFAULT
					OR a.[City] <> ad.[City] COLLATE DATABASE_DEFAULT
					OR a.[ZipCode] <> ad.[ZipCode] COLLATE DATABASE_DEFAULT
					OR a.[Street] <> ad.[Street] COLLATE DATABASE_DEFAULT
				THEN 1 ELSE 0 END AS [LocationChanged]
				,c.ContactId AS [CompanyKey]
			INTO #Address
			FROM #RemoteAddress a
			JOIN [CRM].[Contact] c ON c.LegacyId = a.CompanyNo COLLATE DATABASE_DEFAULT AND c.ContactType = 'Company'
			LEFT OUTER JOIN [CRM].[Address] ad ON ad.LegacyId = a.AddressNo COLLATE DATABASE_DEFAULT
			
			CREATE NONCLUSTERED INDEX IX_#Address_AddressNo ON #Address ([AddressNo] ASC, [IsCompanyStandardAddress])
			CREATE NONCLUSTERED INDEX IX_#Address_IsCompanyStandardAddress ON #Address ([IsCompanyStandardAddress]) INCLUDE ([CompanyNo])

			SELECT @count = COUNT(*) FROM #Address
			PRINT CONVERT(nvarchar, @count) + ' Records transferred to input table'
		END
		
		-------------------------------------------------
		-- Validations
		-------------------------------------------------
		BEGIN
			IF EXISTS (SELECT CompanyNo FROM #Address WHERE IsCompanyStandardAddress = 1 GROUP BY CompanyNo HAVING COUNT(*) > 1)
			BEGIN
				EXEC dbo.SP_Send_Message
					N'Duplicate Standard-Address found in External Address view'
					,N'Während des Imports wurden mehrere Standardadressen für eine Firma gefunden, dies kann von der L-mobile Schnittstelle nicht verarbeitet werden.'
					,N'SELECT CompanyNo FROM #Address WHERE IsCompanyStandardAddress = 1 GROUP BY CompanyNo HAVING COUNT(*) > 1'
				RETURN
			END
		END

		-------------------------------------------------
		-- Merge Entity table
		-------------------------------------------------
		BEGIN
			MERGE [CRM].[Address] AS [target]
			USING #Address AS [source]
			ON [target].[LegacyId] = [source].[AddressNo] COLLATE DATABASE_DEFAULT
			WHEN MATCHED 
				AND ([target].[LegacyVersion] IS NULL OR [target].[LegacyVersion] <> [source].[LegacyVersion])
				THEN UPDATE SET 
					[target].[LegacyId] = [source].[AddressNo]
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
    				,[target].[ModifyUser] = 'BCImportUpdate'
					,[target].[LegacyVersion] = [source].[LegacyVersion]
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
					) VALUES (
						[source].[AddressNo]
						,[source].[Name1]
						,[source].[Name2]
						,[source].[Name3]
						,[source].[City]
						,[source].[CountryKey]
						,[source].[ZipCode]
						,[source].[Street]
						,[source].[AddressTypeKey]
						,[source].[ZipCodePOBox]
						,[source].[POBox]
						,[source].[CompanyKey]
						,[source].[IsCompanyStandardAddress]
						,1
						,GETUTCDATE()
						,'BCImportInsert'
						,GETUTCDATE()
						,'BCImportInsert'
						,[source].[LegacyVersion]
					)
			WHEN NOT MATCHED BY SOURCE 
				AND EXISTS (SELECT ContactId 
								FROM CRM.Contact 
								WHERE ContactType = 'Company' 
								AND ContactId = [target].[CompanyKey]
								AND LegacyId IS NOT NULL)
				AND [target].[LegacyId] IS NOT NULL
				AND [target].[IsActive] = 1
				THEN UPDATE SET
					[target].[IsActive] = 0
					,[target].[IsCompanyStandardAddress] = 0
					,[target].[ModifyDate] = GETUTCDATE()
    				,[target].[ModifyUser] = 'BCImportUpdate'
					,[target].[LegacyVersion] = NULL

			OUTPUT $action
				,inserted.AddressId
				,[source].AddressNo
				,[source].LegacyVersion 
			INTO #AddressImport;
			
			PRINT 'Import ' + @tableName + ': TOTAL ' +  CAST(@@Rowcount AS VARCHAR(20)) + ' Rows'

			SELECT @count = COUNT(*) FROM #AddressImport WHERE Change = 'INSERT'
    		EXEC SP_Import_WriteLog 'INSERT', @tableName, @count;

			SELECT @count = COUNT(*) FROM #AddressImport WHERE Change = 'UPDATE'
 			EXEC SP_Import_WriteLog 'UPDATE', @tableName, @count;
	
			SELECT @count = COUNT(*) FROM #AddressImport WHERE Change = 'DELETE'
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
			Print @ErrorMessage
			Print @ErrorSeverity
			Print @ErrorState
		--EXEC SP_Import_WriteErrorLog @tableName, @ErrorMessage, @ErrorSeverity, @ErrorState;
	END CATCH;
END
GO
