SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
		DECLARE @count bigint;
		DECLARE @tableName nvarchar(200);
		DECLARE @maxValue INT;
		SET @tableName = 'LU.FaultArea';
			
		IF OBJECT_ID('tempdb..#FaultArea') IS NOT NULL DROP TABLE #FaultArea

		SELECT *				
		INTO #FaultArea
		FROM [V].[External_FaultArea]

		-------------------------------------------------
		-- Merge Entity table
		-------------------------------------------------				
		BEGIN
			IF OBJECT_ID('tempdb..#ImportSummary') IS NOT NULL DROP TABLE #ImportSummary
			CREATE TABLE #ImportSummary (Change NVARCHAR(100))
			
			MERGE [LU].[FaultArea] AS [target]
			USING #FaultArea AS [source]
			ON [target].[Name] = [source].[Name] COLLATE DATABASE_DEFAULT
			AND [target].[Language] = [source].[Language]
			WHEN NOT MATCHED THEN
				INSERT 
				(
					[Name]
					,[Language]
					,[Value]
					,[Favorite]
					,[SortOrder]
					,CreateDate
					,ModifyDate
					,CreateUser
					,ModifyUser
					,IsActive
					
				)				
				VALUES 
				(
					source.[Name]
					,source.[Language]
					,source.[Value]
					,0
					,0
					,getutcdate()
					,getutcdate()
					,'Import'
					,'Import'
					,1
				)				
			WHEN NOT MATCHED BY SOURCE 
				THEN 
					UPDATE SET
					[target].[IsActive] = 0
					,[target].[ModifyDate] = GETUTCDATE()
					,[target].[ModifyUser] = 'Import'
					
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

GO