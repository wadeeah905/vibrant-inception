SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
		DECLARE @count bigint;
		DECLARE @tableName nvarchar(200);
		SET @tableName = '[SMS].[InstallationType]';
				
		-------------------------------------------------
		-- Merge Entity table
		-------------------------------------------------				
		BEGIN
			IF OBJECT_ID('tempdb..#ImportSummary') IS NOT NULL DROP TABLE #ImportSummary
			CREATE TABLE #ImportSummary (
											Change NVARCHAR(100)
											,InstallationTypeId INT
											,Value NVARCHAR(100)
										)
			
			MERGE [SMS].[InstallationType] AS [target]
			USING [V].[External_InstallationType] AS [source]
			ON [target].[Value] = [source].[Value]
			AND [target].[Language] = [source].[Language]
			WHEN MATCHED AND BINARY_CHECKSUM([target].[Language], [target].[Name], [target].[Value]) <> [source].LegacyVersion
				THEN UPDATE SET
					[target].[Name] = [source].[Name]
					,[target].[GroupKey] = [source].[GroupKey]
			WHEN NOT MATCHED
				THEN INSERT 
					(
						[Name]
						,[Value]
						,[Language]
						,[GroupKey]
						,[Favorite]
						,[Sortorder]
						,[ModifyDate]
						,[ModifyUser]
					) VALUES (
						[source].[Name]
						,[source].[Value]
						,[source].[Language]
						,[source].[GroupKey]
						,0
						,0
						,GETUTCDATE()
						,'BCImportInsert'
					)				
			WHEN NOT MATCHED BY SOURCE
				THEN DELETE

			OUTPUT $action
				,inserted.InstallationTypeId
				,[source].[Value]
			INTO #ImportSummary;
			
			PRINT 'Import ' + @tableName + ': TOTAL ' +  CAST(@@Rowcount AS VARCHAR(20)) + ' Rows'

			SELECT @count = COUNT(*) FROM #ImportSummary WHERE Change = 'INSERT'
    		EXEC SP_Import_WriteLog 'INSERT', @tableName, @count;

			SELECT @count = COUNT(*) FROM #ImportSummary WHERE Change = 'UPDATE'
 			EXEC SP_Import_WriteLog 'UPDATE', @tableName, @count;
	
			SELECT @count = COUNT(*) FROM #ImportSummary WHERE Change = 'DELETE'
 			EXEC SP_Import_WriteLog 'DELETE', @tableName, @count;
		END
	END TRY
	BEGIN CATCH
		EXEC SP_CatchError 'InstallationType Import';
	END CATCH;
END

