SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

BEGIN
	SET NOCOUNT ON;
		
	BEGIN TRY
		DECLARE @count BIGINT;
		DECLARE @tableName NVARCHAR(200);
		SET @tableName = '[CRM].[Station]';
			
		-------------------------------------------------
 		-- Fill temporary merge storage
 		-------------------------------------------------	
 		BEGIN
 			IF OBJECT_ID('tempdb..#StationImport') IS NOT NULL DROP TABLE #StationImport
 			CREATE TABLE #StationImport (Change NVARCHAR(100), 
 											StationId UNIQUEIDENTIFIER)

 			IF OBJECT_ID('tempdb..#Station') IS NOT NULL DROP TABLE #Station
	 		    			
			SELECT 
				l.*
			INTO #Station
			FROM [V].[External_Station] l
			
			CREATE NONCLUSTERED INDEX IX_#Station_LegacyId ON #Station ([LegacyId] ASC)
			
			SELECT @count = COUNT(*) FROM #Station
			PRINT CONVERT(NVARCHAR, @count) + ' Records transferred to input table'
		END
	
		-------------------------------------------------
		-- Merge Entity table
		-------------------------------------------------
		BEGIN
			MERGE [CRM].[Station] AS [target]
			USING #Station AS [source]
			ON [target].[LegacyId] = [source].[LegacyId] COLLATE DATABASE_DEFAULT
			WHEN MATCHED AND [target].[Name] <> [source].[Name]
				THEN UPDATE SET
					[target].[Name] = [source].[Name]
					,[target].[IsActive] = 1
			WHEN NOT MATCHED THEN
			INSERT 
				(
					[Name]
					,[IsActive]
					,[LegacyId]
					,[CreateDate]
					,[ModifyDate]
					,[CreateUser]
					,[ModifyUser]
				) VALUES (
					[source].[Name]
					,[source].[IsActive]
					,[source].[LegacyId]
					,GETUTCDATE()
					,GETUTCDATE()
					,'Import'
					,'Import'
				)
			WHEN NOT MATCHED BY SOURCE
				AND [target].[LegacyId] IS NOT NULL
				AND [target].[IsActive] = 1
				THEN UPDATE SET
					[target].[IsActive] = 0
					,[target].[ModifyDate] = GETUTCDATE()
					,[target].[ModifyUser] = 'Import'
				
			OUTPUT $action
	   			,inserted.StationId
   			INTO #StationImport;
			
			PRINT 'Import ' + @tableName + ': TOTAL ' +  CAST(@@Rowcount AS VARCHAR(20)) + ' Rows'

			SELECT @count = COUNT(*) FROM #StationImport WHERE Change = 'INSERT'
    		EXEC SP_Import_WriteLog 'INSERT', @tableName, @count;

			SELECT @count = COUNT(*) FROM #StationImport WHERE Change = 'UPDATE'
 			EXEC SP_Import_WriteLog 'UPDATE', @tableName, @count;
	
			SELECT @count = COUNT(*) FROM #StationImport WHERE Change = 'DELETE'
 			EXEC SP_Import_WriteLog 'DELETE', @tableName, @count;
   		END				    
	END TRY
	BEGIN CATCH
		EXEC SP_CatchError 'Station Import';
	END CATCH;
End		

GO