SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
		DECLARE @count BIGINT;
		DECLARE @tableName NVARCHAR(200);
		SET @tableName = '[SMS].[ServiceOrderTimePostings]';

		-------------------------------------------------
		-- Fill temporary merge storage
		-------------------------------------------------	
		BEGIN
			IF OBJECT_ID('tempdb..#ServiceOrderTimePostings') IS NOT NULL DROP TABLE #ServiceOrderTimePostings
			IF OBJECT_ID('tempdb..#ServiceOrderTimePostingsImport') IS NOT NULL DROP TABLE #ServiceOrderTimePostingsImport
			CREATE TABLE #ServiceOrderTimePostingsImport (Change NVARCHAR(100)
												,id UNIQUEIDENTIFIER)

			SELECT 
				sotp.*	
				,u.[UserId] AS [UserId]
				,u.[Username] AS [UserUsername]
				,soh.[Contactkey] AS [OrderId]
				,sot.[id] AS [OrderTimesId]
			INTO #ServiceOrderTimePostings
			FROM [V].[External_ServiceOrderTimePostings] sotp
			JOIN [CRM].[User] u ON u.[LegacyId] = sotp.[UserLegacyId] COLLATE DATABASE_DEFAULT
			JOIN [SMS].[ServiceOrderHead] soh ON soh.[OrderNo] = sotp.[OrderNo] COLLATE DATABASE_DEFAULT
			JOIN [SMS].[InstallationHead] ih ON sotp.[InstallationNo] = ih.[InstallationNo] COLLATE DATABASE_DEFAULT
			JOIN [SMS].[ServiceOrderTimes] sot ON sot.[OrderId] = soh.[ContactKey] AND sot.[InstallationId] = ih.[ContactKey]
			
			SELECT @count = COUNT(*) FROM #ServiceOrderTimePostings
			PRINT CONVERT(NVARCHAR, @count) + ' Records transferred to input table'
		END
		
		BEGIN TRANSACTION
		BEGIN TRY
			-------------------------------------------------
			-- Merge Sms.ServiceOrderTimePostings
			-------------------------------------------------	
			BEGIN
				MERGE [SMS].[ServiceOrderTimePostings] AS [target]
				USING #ServiceOrderTimePostings AS [source]
				ON [target].[UserId] = [source].[UserId]
					AND [target].[OrderTimesId] = [source].[OrderTimesId]
 					AND [target].[OrderId] = [source].[OrderId]
				WHEN MATCHED AND [target].[DurationInMinutes] <> [source].[DurationInMinutes]
				THEN UPDATE SET 
					[IsActive] = 1
					,[ModifyDate] = GETUTCDATE()
					,[ModifyUser] = 'BCImportUpdate'
					,[DurationInMinutes] = [source].[DurationInMinutes]
				WHEN NOT MATCHED
				THEN INSERT 
					(
						[UserId]
						,[CreateDate]
						,[ModifyDate]
						,[OrderTimesId]
						,[CreateUser]
						,[ModifyUser]
						,[UserUsername]
						,[Date]
						,[DurationInMinutes]
						,[IsActive]
						,[IsExported]
						,[OrderId]
					) VALUES (
						source.[UserId]
						,GETUTCDATE()
						,GETUTCDATE()
						,source.[OrderTimesId]
						,'BCImportInsert'
						,'BCImportInsert'
						,source.[UserUsername]
						,source.[Date]
						,source.[DurationInMinutes]
						,1
						,1
						,source.[OrderId]
					)

				OUTPUT $action
						,inserted.id
				INTO #ServiceOrderTimePostingsImport;
			END

			PRINT 'Import SMS.ServiceOrderTimePostings: TOTAL ' + cast(@@Rowcount as varchar(20)) + ' Rows';
				
			SELECT @count = COUNT(*) FROM #ServiceOrderTimePostingsImport WHERE Change = 'INSERT'
			EXEC SP_Import_WriteLog 'INSERT', 'CRM.Contact', @count;
						
			SELECT @count = COUNT(*) FROM #ServiceOrderTimePostingsImport WHERE Change = 'UPDATE'
			EXEC SP_Import_WriteLog 'UPDATE', 'CRM.Contact', @count;
					
		END TRY
		BEGIN CATCH
			IF @@TRANCOUNT > 0
				ROLLBACK TRANSACTION;
			THROW
		END CATCH

		IF @@TRANCOUNT > 0
			COMMIT TRANSACTION;
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