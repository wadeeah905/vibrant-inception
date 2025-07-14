SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
		DECLARE @count bigint;
		DECLARE @tableName nvarchar(200);
		SET @tableName = 'LU.Country';
				
		-------------------------------------------------
		-- Merge Entity table
		-------------------------------------------------				
		BEGIN
			IF OBJECT_ID('tempdb..#ImportSummary') IS NOT NULL DROP TABLE #ImportSummary
			CREATE TABLE #ImportSummary (Change NVARCHAR(100))
			
			MERGE [LU].Country AS [target] 
			USING [V].[External_Country] AS [source]
			ON [target].[Value] = [source].[Value]
			WHEN NOT MATCHED THEN
				INSERT 
				(
					[Name]
					,[Value]
					,[Language]
					,[Favorite]
					,[Sortorder]
					,[ModifyDate]
					,[ModifyUser]
				)				
				VALUES 
				(
					[source].[Name]
					,[source].[Value]
					,[source].[Language]
					,0
					,0
					,GETUTCDATE()
					,'BCImportInsert'
				)				
			WHEN NOT MATCHED BY SOURCE THEN 
				DELETE
			OUTPUT $action
			INTO #ImportSummary;
			
			PRINT 'Import ' + @tableName + ': TOTAL ' +  cast(@@Rowcount as varchar(20)) + ' Rows';
			
			SELECT @count = COUNT(*) FROM #ImportSummary WHERE Change = 'INSERT'
			EXEC SP_Import_WriteLog 'INSERT', @tableName, @count;
					
			SELECT @count = COUNT(*) FROM #ImportSummary WHERE Change = 'DELETE'
			EXEC SP_Import_WriteLog 'UPDATE', @tableName, @count;
		END
	END TRY
	BEGIN CATCH
		DECLARE @ErrorMessage NVARCHAR(4000);
		DECLARE @ErrorSeverity INT;
		DECLARE @ErrorState INT;
		
		SELECT
			@ErrorMessage = Substring(ERROR_MESSAGE(), 0, 1000),
			@ErrorSeverity = ERROR_SEVERITY(),
			@ErrorState = ERROR_STATE();

			EXEC SP_Import_WriteErrorLog  @tableName, @ErrorMessage, @ErrorSeverity, @ErrorState;
	END CATCH
END