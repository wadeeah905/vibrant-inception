SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
		DECLARE @count bigint;
		DECLARE @tableName nvarchar(200);
		SET @tableName = '[CRM].[Company]';
				
		-------------------------------------------------
		-- Fill temporary merge storage
		-------------------------------------------------
		BEGIN
			IF OBJECT_ID('tempdb..#ContactImport') IS NOT NULL DROP TABLE #ContactImport
			CREATE TABLE #ContactImport (Change NVARCHAR(100), 
												ContactId UNIQUEIDENTIFIER, 
												LegacyId NVARCHAR(100), 
												LegacyVersion BIGINT)
												
			IF OBJECT_ID('tempdb..#Company') IS NOT NULL DROP TABLE #Company
												
			SELECT *
			INTO #Company
			FROM [V].[External_Company]
			
			CREATE NONCLUSTERED INDEX IX_#Company_CompanyNo ON #Company ([CompanyNo] ASC)

			SELECT @count = COUNT(*) FROM #Company
			PRINT CONVERT(nvarchar, @count) + ' Records transferred to input table'
		END
	


		BEGIN TRANSACTION
		BEGIN TRY
			-------------------------------------------------
			-- Merge Crm.Contact
			-------------------------------------------------	
			BEGIN	
				MERGE [CRM].[Contact] AS [target]
				USING #Company AS [source]
				ON [target].[LegacyId] = [source].[CompanyNo] COLLATE DATABASE_DEFAULT
				AND [target].[ContactType] = 'Company'
				WHEN MATCHED 
					AND ([target].[LegacyVersion] IS NULL OR [target].[LegacyVersion] <> [source].[LegacyVersion])
					THEN UPDATE SET
						[target].[Name] = [source].[Name]
						,[target].[ContactLanguage] = [source].[ContactLanguage]
						,[target].[ModifyDate] = GETUTCDATE()
						,[target].[ModifyUser] = 'BCImportUpdate'
						,[target].[LegacyVersion] = [source].[LegacyVersion]
						,[target].[IsActive] = 1
				WHEN NOT MATCHED
					THEN INSERT
						(
							[ContactType]
							,[Name]
							,[BackgroundInfo]
							,[ContactLanguage]
							,[LegacyId]
							,[IsActive]
							,[CreateDate]
							,[ModifyDate]
							,[CreateUser]
							,[ModifyUser]
							,[LegacyVersion]
						) VALUES (
							'Company'
							,[source].[Name]
							,NULL
							,[source].[ContactLanguage]
							,[source].[CompanyNo]
							,1
							,GETUTCDATE()
							,GETUTCDATE()
							,'BCImportInsert'
							,'BCImportInsert'
							,[source].[LegacyVersion]
						)
				WHEN NOT MATCHED BY SOURCE 
					AND [target].[IsActive] = 1 
					AND [target].[ContactType] = 'Company' 
					AND [target].[LegacyId] IS NOT NULL
					THEN UPDATE SET 
						[target].[IsActive] = 0
						,[target].[ModifyDate] = GETUTCDATE()
						,[target].[ModifyUser] = 'BCImportUpdate'
						,[target].[LegacyVersion] = NULL

				OUTPUT $action
						,inserted.ContactId
						,[source].[CompanyNo]
						,[source].[LegacyVersion]
				INTO #ContactImport;
			
				CREATE NONCLUSTERED INDEX IX_#ContactImport_LegacyId ON #ContactImport ([LegacyId] ASC)
			END
		
			-------------------------------------------------
			-- Merge Entity table
			-------------------------------------------------	
			BEGIN
				MERGE [CRM].[Company] AS [target]
				USING (SELECT ci.[ContactId], c.*
						FROM #Company c
						JOIN #ContactImport ci ON ci.LegacyId = c.CompanyNo COLLATE DATABASE_DEFAULT) AS [source]		
				ON [target].[ContactKey] = [source].[ContactId]
				WHEN MATCHED
					THEN UPDATE SET
						[target].[ShortText] = [source].[ShortText]
						,[target].[SearchText] = [source].[SearchText]
						,[target].[CompanyTypeKey] = [source].[CompanyTypeKey]
						,[target].[IsOwnCompany] = [source].[IsOwnCompany]
						,[target].[GroupFlag1Key] = [source].[GroupFlag1Key]
						,[target].[GroupFlag2Key] = [source].[GroupFlag2Key]
						,[target].[GroupFlag3Key] = [source].[GroupFlag3Key]
						,[target].[GroupFlag4Key] = [source].[GroupFlag4Key]
						,[target].[GroupFlag5Key] = [source].[GroupFlag5Key]
				WHEN NOT MATCHED
					THEN INSERT
						(
							[ContactKey]
							,[ShortText]
							,[SearchText]
							,[CompanyTypeKey]
							,[IsOwnCompany]
							,[GroupFlag1Key]
							,[GroupFlag2Key]
							,[GroupFlag3Key]
							,[GroupFlag4Key]
							,[GroupFlag5Key]
						) VALUES (
							[source].[ContactId]
							,[source].[ShortText]
							,[source].[SearchText]
							,[source].[CompanyTypeKey]
							,[source].[IsOwnCompany]
							,[source].[GroupFlag1Key]
							,[source].[GroupFlag2Key]
							,[source].[GroupFlag3Key]	
							,[source].[GroupFlag4Key]
							,[source].[GroupFlag5Key]
						);
			END

		END TRY
		BEGIN CATCH
			IF @@TRANCOUNT > 0
				ROLLBACK TRANSACTION;
			THROW
		END CATCH

		IF @@TRANCOUNT > 0
			COMMIT TRANSACTION;
			
		PRINT 'Import ' + @tableName + ': TOTAL ' +  CAST(@@Rowcount AS VARCHAR(20)) + ' Rows'

		SELECT @count = COUNT(*) FROM #ContactImport WHERE Change = 'INSERT'
		EXEC SP_Import_WriteLog 'INSERT', @tableName, @count;

		SELECT @count = COUNT(*) FROM #ContactImport WHERE Change = 'UPDATE'
		EXEC SP_Import_WriteLog 'UPDATE', @tableName, @count;
	
		SELECT @count = COUNT(*) FROM #ContactImport WHERE Change = 'DELETE'
		EXEC SP_Import_WriteLog 'DELETE', @tableName, @count;
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
