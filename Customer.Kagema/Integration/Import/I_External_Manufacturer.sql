SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

BEGIN
	SET NOCOUNT ON;
		
	BEGIN TRY
		DECLARE @count bigint;
		DECLARE @tableName nvarchar(200);
		SET @tableName = '[LU].[Manufacturer]';
			
		-------------------------------------------------
 		-- Fill temporary merge storage
 		-------------------------------------------------	
 		BEGIN
 			IF OBJECT_ID('tempdb..#ManufacturerImport') IS NOT NULL DROP TABLE #ManufacturerImport
 			CREATE TABLE #ManufacturerImport (Change NVARCHAR(100));									
			
			SELECT @count = COUNT(*) FROM [V].[External_Manufacturer]
			PRINT CONVERT(NVARCHAR, @count) + ' Records transferred to input table'
		END
	
		-------------------------------------------------
		-- Merge Entity table
		-------------------------------------------------
		BEGIN
			MERGE [LU].[Manufacturer] AS [target]
			USING [V].[External_Manufacturer] AS [source]
			ON [target].[Value] = [source].[Value] AND [target].[Language] = [source].[Language]
			WHEN NOT MATCHED THEN
			INSERT 
				(
					[Name]
					,[Language]
					,[Value]
					,[Favorite]
					,[SortOrder]
					,[CreateDate]
					,[ModifyDate]
					,[CreateUser]
					,[ModifyUser]
				) VALUES (
					[source].[Name]
					,[source].[Language]
					,[source].[Value]
					,0
					,0
					,GETUTCDATE()
					,GETUTCDATE()
					,'BCImportInsert'
					,'BCImportInsert'
				)
			WHEN NOT MATCHED BY SOURCE
				AND [target].[IsActive] = 1
				THEN UPDATE SET
					[target].[ModifyDate] = GETUTCDATE()
					,[target].[ModifyUser] = 'BCImportUpdate'
					,[target].[IsActive] = 0
				
			OUTPUT $action INTO #ManufacturerImport;
			
			PRINT 'Import ' + @tableName + ': TOTAL ' +  CAST(@@ROWCOUNT AS VARCHAR(20)) + ' Rows'

			SELECT @count = COUNT(*) FROM #ManufacturerImport WHERE Change = 'INSERT'
    		EXEC SP_Import_WriteLog 'INSERT', @tableName, @count;

			SELECT @count = COUNT(*) FROM #ManufacturerImport WHERE Change = 'UPDATE'
 			EXEC SP_Import_WriteLog 'UPDATE', @tableName, @count;
   		END				    
	END TRY
	BEGIN CATCH
		DECLARE @name AS NVARCHAR(100)
		SET @name = 'Manufacturer Import'
		EXEC SP_CatchError @name;
	END CATCH;
END