SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
		DECLARE @count BIGINT;
		DECLARE @tableName NVARCHAR(200);
		SET @tableName = '[CRM].[Person]';
		
		-------------------------------------------------
		-- Fill temporary merge storage
		-------------------------------------------------	
		BEGIN
			IF OBJECT_ID('tempdb..#ContactImport') IS NOT NULL DROP TABLE #ContactImport
			CREATE TABLE #ContactImport (Change NVARCHAR(100), 
												ContactId UNIQUEIDENTIFIER, 
												LegacyId NVARCHAR(100), 
												LegacyVersion BIGINT)

			IF OBJECT_ID('tempdb..#RemotePerson') IS NOT NULL DROP TABLE #RemotePerson
			IF OBJECT_ID('tempdb..#Person') IS NOT NULL DROP TABLE #Person
			
			SELECT
				v.*
			INTO #RemotePerson		
			FROM [V].[External_Person] AS v

			CREATE NONCLUSTERED INDEX IX_#RemotePerson_CompanyNo ON #RemotePerson ([CompanyNo] ASC)
			CREATE NONCLUSTERED INDEX IX_#RemotePerson_PersonNo ON #RemotePerson ([PersonNo] ASC)
			CREATE NONCLUSTERED INDEX IX_#RemotePerson_ResponsibleUser ON #RemotePerson ([ResponsibleUser] ASC)
				
			SELECT
				v.*
				,a.CompanyKey As [ParentKey]
				,a.AddressId AS [AddressKey]
				,v.[SalutationCode] AS [SalutationKey]
				,ISNULL(v.[Lastname], '') + ', ' + ISNULL(v.[Firstname], '') AS [Name]
			INTO #Person		
			FROM #RemotePerson AS v
			JOIN CRM.[Contact] c ON c.[LegacyId] = v.[CompanyNo] and c.[ContactType] = 'Company'
			JOIN CRM.[Address] a ON a.[CompanyKey] = c.[ContactId] AND a.[IsCompanyStandardAddress] = 1
			WHERE a.[IsActive] = 1
			
			CREATE NONCLUSTERED INDEX IX_#ContactImport_LegacyId ON #ContactImport ([LegacyId] ASC)
			CREATE NONCLUSTERED INDEX IX_#Person_PersonNo ON #Person ([PersonNo] ASC)
			
			SELECT @count = COUNT(*) FROM #Person
			PRINT CONVERT(nvarchar, @count) + ' Records transferred to input table'
		END
						
		BEGIN TRANSACTION
		BEGIN TRY	
			-------------------------------------------------
			-- Merge Crm.Contact
			-------------------------------------------------	
			BEGIN
				MERGE [CRM].[Contact] AS [target]
				USING #Person AS [source]
				ON [target].[LegacyId] = [source].[PersonNo]
				AND [target].[ContactType] = 'Person'
				WHEN MATCHED 
					AND ([target].[LegacyVersion] IS NULL OR [target].[LegacyVersion] <> [source].[LegacyVersion])
					THEN UPDATE SET 
						[target].[Name] = [source].[Name]
						,[target].[ParentKey] = [source].[ParentKey]
						,[target].[ContactLanguage] = [source].[Language]
						,[target].[Visibility] = [source].[Visibility]
						,[target].[IsActive] = 1
						,[target].[IsExported] = 1
						,[target].[ModifyDate] = GETUTCDATE()
						,[target].[ModifyUser] = 'BCImportUpdate'
						,[target].[LegacyVersion] = [source].[LegacyVersion]
				WHEN NOT MATCHED
					THEN INSERT 
					(
						[ContactType]
						,[LegacyId]
						,[LegacyVersion]
						,[ParentKey]
						,[Name]
						,[ContactLanguage]
						,[Visibility]
						,[IsExported]
						,[IsActive]
						,[CreateDate]
						,[ModifyDate]
						,[CreateUser]
						,[ModifyUser]
					) VALUES (
						'Person'
						,[source].[PersonNo]
						,[source].[LegacyVersion]
						,[source].[ParentKey]
						,[source].[Name]			
						,[source].[Language]
						,[source].[Visibility]
						,1
						,1
						,GETUTCDATE()
						,GETUTCDATE()
						,'BCImportInsert'
						,'BCImportInsert'
					)
				WHEN NOT MATCHED BY SOURCE 
					AND [target].[IsActive] = 1 
					AND [target].[ContactType] = 'Person' 
					AND [target].[LegacyId] IS NOT NULL
					THEN UPDATE SET 
						[IsActive] = 0
						,[ModifyDate] = GETUTCDATE()
						,[ModifyUser] = 'BCImportUpdate'
						,[LegacyVersion] = NULL

				OUTPUT $action
						,inserted.ContactId
						,[source].PersonNo
						,[source].LegacyVersion
				INTO #ContactImport;
			END
		
			-------------------------------------------------
			-- Merge Entity table
			-------------------------------------------------	
			BEGIN
				MERGE [CRM].[Person] AS [target]
				USING (SELECT ci.ContactId, p.* 
							FROM #Person p
							JOIN #ContactImport ci ON p.PersonNo COLLATE DATABASE_DEFAULT = ci.LegacyId) AS [source]
				ON [target].[ContactKey] = [source].[ContactId]
				WHEN MATCHED
					THEN UPDATE SET
						[target].[FirstName] = [source].[Firstname]
						,[target].[Surname] = [source].[Lastname]
						,[target].[SalutationKey] = [source].[SalutationKey]
						,[target].[Department] = [source].[OrganizationalLevelCode]
						,[target].[BusinessTitle] = [source].[BusinessTitle]
						,[target].[AddressKey] = [source].[AddressKey]
						
				WHEN NOT MATCHED
					AND [source].[AddressKey] IS NOT NULL
					THEN INSERT 
					(
						[ContactKey]
						,[FirstName]
						,[Surname]
						,[SalutationKey]
						,[Department]
						,[BusinessTitle]
						,[AddressKey]
					) VALUES  (
						[source].[ContactId]
						,[source].[Firstname]
						,[source].[Lastname]
						,[source].[SalutationKey]
						,[source].[OrganizationalLevelCode]
						,[source].[BusinessTitle]
						,[source].[AddressKey]
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
		
		PRINT 'Import ' + @tableName + ': TOTAL ' +  cast(@@Rowcount as varchar(20)) + ' Rows';
				
		SELECT @count = COUNT(*) FROM #ContactImport WHERE Change = 'INSERT'
		EXEC SP_Import_WriteLog 'INSERT', @tableName, @count;
				
		SELECT @count = COUNT(*) FROM #ContactImport WHERE Change = 'UPDATE'
		EXEC SP_Import_WriteLog 'UPDATE', @tableName, @count;
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMessage NVARCHAR(4000);
		DECLARE @ErrorSeverity INT;
		DECLARE @ErrorState INT;
		
		SELECT
			@ErrorMessage = Substring(ERROR_MESSAGE(), 0, 1000),
			@ErrorSeverity = ERROR_SEVERITY(),
			@ErrorState = ERROR_STATE();

		EXEC SP_Import_WriteErrorLog @tableName, @ErrorMessage, @ErrorSeverity, @ErrorState;
	END CATCH;
END
