SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO
IF EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID('[dbo].[SP_Merge_Contact]'))
DROP PROCEDURE [dbo].[SP_Merge_Contact]
GO

CREATE PROCEDURE [dbo].[SP_Merge_Contact] 
	@contactType AS VARCHAR(100)
WITH RECOMPILE
AS
BEGIN
	IF 1 = 0
	BEGIN
		-- just fakes to fool intellisense
		CREATE TABLE #ImportedContact (Change NVARCHAR(100), IsActive BIT NULL)
		CREATE TABLE #Contact (LegacyId NVARCHAR(50), LmobileKey UNIQUEIDENTIFIER)
	END
	
	SET NOCOUNT ON;
		MERGE CRM.Contact AS [target]
		USING #Contact AS [source]
		ON [target].ContactType = @contactType AND [target].[LegacyId] = [source].[LegacyId]
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
				,@contactType
				,[source].ContactLanguage
				,[source].Visibility
				,[source].ResponsibleUser
			)
		WHEN MATCHED AND [target].LegacyVersion IS NULL OR [target].LegacyVersion <> [source].LegacyVersion 
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
			AND [target].ContactType = @contactType
		THEN UPDATE
			SET [target].ModifyDate = GETUTCDATE()
				,[target].ModifyUser = 'Import'
				,[target].LegacyVersion = NULL
				,[target].IsActive = 0
		OUTPUT $action, inserted.IsActive, inserted.ContactId, [source].LegacyId, [source].LegacyVersion INTO #ImportedContact;
END
