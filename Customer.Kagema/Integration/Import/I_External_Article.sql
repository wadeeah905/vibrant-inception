SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
		DECLARE @count BIGINT;
		DECLARE @tableName NVARCHAR(200);
		SET @tableName = '[CRM].[Article]';

		-------------------------------------------------
		-- Fill temporary merge storage
		-------------------------------------------------	
		BEGIN
			IF OBJECT_ID('tempdb..#ContactImport') IS NOT NULL DROP TABLE #ContactImport
			IF OBJECT_ID('tempdb..#Article') IS NOT NULL DROP TABLE #Article
			IF OBJECT_ID('tempdb..#ArticleRelationship') IS NOT NULL DROP TABLE #ArticleRelationship
			IF OBJECT_ID('tempdb..#ArticleRelationshipImport') IS NOT NULL DROP TABLE #ArticleRelationshipImport
			CREATE TABLE #ContactImport (Change NVARCHAR(100)
												,ContactId UNIQUEIDENTIFIER
												,LegacyId NVARCHAR(100)
												,LegacyVersion BIGINT)

			CREATE TABLE #ArticleRelationshipImport (Change NVARCHAR(100))

			SELECT *
			INTO #Article
			FROM [V].[External_Article]
		
			CREATE NONCLUSTERED INDEX IX_#Article_ItemNo ON #Article ([ItemNo])
			
			SELECT @count = COUNT(*) FROM #Article
			PRINT CONVERT(NVARCHAR, @count) + ' Records transferred to input table'
		END

		BEGIN TRANSACTION
		BEGIN TRY
			-------------------------------------------------
			-- Merge Crm.Contact based on data coming from External view
			-------------------------------------------------	
			BEGIN
				MERGE [CRM].[Contact] AS [target]
				USING #Article AS [source]
				ON [target].[LegacyId] = [source].[ItemNo] COLLATE DATABASE_DEFAULT
					AND [target].[ContactType] = 'Article'
				WHEN MATCHED AND ([target].[LegacyVersion] IS NULL OR [target].[LegacyVersion] <> [source].[LegacyVersion])
				THEN UPDATE SET 
					[Name] = [source].[ItemNo]
					,[IsActive] = 1
					,[ModifyDate] = GETUTCDATE()
					,[ModifyUser] = 'BCImportUpdate'
					,[LegacyVersion] = [source].[LegacyVersion]
				WHEN NOT MATCHED
				THEN INSERT 
					(
						[ContactType]
						,[Name]
						,[BackgroundInfo]
						,[LegacyId]
						,[IsActive]
						,[CreateDate]
						,[ModifyDate]
						,[CreateUser]
						,[ModifyUser]
						,[LegacyVersion]
					) VALUES (
						'Article'
						,[source].[ItemNo]
						,NULL
						,[source].[ItemNo]
						,1
						,GETUTCDATE()
						,GETUTCDATE()
						,'BCImportInsert'
						,'BCImportInsert'
						,[source].LegacyVersion
					)
				WHEN NOT MATCHED BY SOURCE 
					AND [target].[IsActive] = 1 
					AND [target].[ContactType] = 'Article' 
					AND [target].[LegacyId] IS NOT NULL
				THEN UPDATE SET 
					[IsActive] = 0
					,[ModifyDate] = GETUTCDATE()
					,[ModifyUser] = 'BCImportUpdate'
					,[LegacyVersion] = NULL

				OUTPUT $action
						,inserted.ContactId
						,source.[ItemNo]
						,source.[LegacyVersion]
				INTO #ContactImport;
				
				CREATE NONCLUSTERED INDEX IX_#ContactImport_LegacyId ON #ContactImport ([LegacyId] ASC)
			END

			PRINT 'Import CRM.Contact: TOTAL ' + cast(@@Rowcount as varchar(20)) + ' Rows';
				
			SELECT @count = COUNT(*) FROM #ContactImport WHERE Change = 'INSERT'
			EXEC SP_Import_WriteLog 'INSERT', 'CRM.Contact', @count;
						
			SELECT @count = COUNT(*) FROM #ContactImport WHERE Change = 'UPDATE'
			EXEC SP_Import_WriteLog 'UPDATE', 'CRM.Contact', @count;
					
			-------------------------------------------------
			-- Merge Crm.Article
			-------------------------------------------------				
			
			BEGIN
				MERGE [CRM].[Article] AS [target]
				USING (SELECT c.ContactId, a.*
						FROM #Article a
						JOIN #ContactImport c ON c.LegacyId = a.ItemNo COLLATE Latin1_General_100_BIN) AS [source]
				ON [target].[ItemNo] = [source].[ItemNo] COLLATE Latin1_General_100_BIN
				WHEN MATCHED
				THEN UPDATE SET 
					[target].[ItemNo] = [source].[ItemNo]
					,[target].[ArticleType]	= [source].[ArticleType]
					,[target].[Description] = [source].[FullDescription]
					,[target].[SalesPrice] = null
					,[target].[QuantityUnit] = [source].[UnitOfMeasure]
					,[target].[lumpsum] = [source].[lumpsum]
					,[target].[QuantityStep]=0.01
					,[target].[ShelfNo]=[source].[ShelfNo]
					,[target].[VendorNo]=[source].[VendorNo]
				WHEN NOT MATCHED
				THEN INSERT 
				(
					[ArticleId]
					,[ItemNo]
					,[Description]
					,[ArticleType]
					,[IsSerial]
					,[IsSparePart]
					,[IsBatch]
					,[DangerousGoodsFlag]
					,[SalesPrice]
					,[QuantityUnit]
					,[lumpsum],
					[QuantityStep]
				) VALUES (
					[source].[ContactId]
					,[source].[ItemNo]
					,[source].[FullDescription]
					,[source].[ArticleType]
					,0
					,0
					,0
					,0
					,null
					,[source].[UnitOfMeasure]
					,[source].[lumpsum]
					,0.01
				);
			END

			PRINT 'Import CRM.Article: TOTAL ' + cast(@@Rowcount as varchar(20)) + ' Rows';
				
			SELECT @count = COUNT(*) FROM #ContactImport WHERE Change = 'INSERT'
			EXEC SP_Import_WriteLog 'INSERT', 'CRM.Article', @count;
						
			SELECT @count = COUNT(*) FROM #ContactImport WHERE Change = 'UPDATE'
			EXEC SP_Import_WriteLog 'UPDATE', 'CRM.Article', @count;
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

