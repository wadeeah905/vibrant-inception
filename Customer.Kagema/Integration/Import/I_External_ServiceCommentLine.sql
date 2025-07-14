SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

BEGIN
	SET NOCOUNT ON;
		
	BEGIN TRY
		DECLARE @count BIGINT;
		DECLARE @tableName NVARCHAR(200);
		SET @tableName = '[CRM].[Note]';
			
		-------------------------------------------------
 		-- Fill temporary merge storage
 		-------------------------------------------------	
 		BEGIN
 			IF OBJECT_ID('tempdb..#ServiceCommentLineImport') IS NOT NULL DROP TABLE #ServiceCommentLineImport
 			CREATE TABLE #ServiceCommentLineImport (Change NVARCHAR(100), 
 											ServiceCommentLineId uniqueidentifier)

 			IF OBJECT_ID('tempdb..#ServiceCommentLine') IS NOT NULL DROP TABLE #ServiceCommentLine
	 		    			
			SELECT  
				distinct l.*
				,BINARY_CHECKSUM(
				l.[InstallationNo]
				,l.[Type]
				,l.[NoteLineNo]
				,l.[Text]
				,l.[LegacyId]
				,l.[TextDate]
				,l.[CreateUser]
				) AS [LegacyVersion]
				,s.ContactKey As [InstallationId]
				INTO #ServiceCommentLine 
				from [V].[External_ServiceCommentLine] l
			 join sms.InstallationHead s on l.InstallationNo COLLATE DATABASE_DEFAULT=s.InstallationNo  COLLATE DATABASE_DEFAULT
			 join crm.Contact on ContactKey=ContactId
			 where IsActive=1 
			 --and IsExported=0
			
			CREATE NONCLUSTERED INDEX IX_#ServiceCommentLine_LegacyId ON #ServiceCommentLine ([InstallationId] ASC)include([NoteLineNo])
			
			SELECT @count = COUNT(*) FROM #ServiceCommentLine
			PRINT CONVERT(NVARCHAR, @count) + ' Records transferred to input table'
		END
		-------------------------------------------------
		-- Merge Entity table
		-------------------------------------------------
		BEGIN
			MERGE [CRM].[Note] AS [target]
			USING #ServiceCommentLine AS [source]
			ON [target].[ElementKey] = [source].[InstallationId]
			and [target].[iNoteLineNo] = CAST([source].[NoteLineNo] as int)
			WHEN MATCHED AND ([target].LegacyVersion is null OR [target].LegacyVersion <> [source].[LegacyVersion])
				THEN UPDATE SET
				--[CreateDate] = (case [source].[TextDate] when null then  '1753-01-30 00:00:00.000' else DATEADD (DD ,1 ,DATEADD (SS , -CAST([source].[NoteLineNo] AS INT) , coalesce([source].[TextDate], '1753-01-30 00:00:00.000'))) end )
				[CreateDate] = (case [source].[TextDate] when null then  '1753-01-30 00:00:00.000' else coalesce([source].[TextDate], '1753-01-30 00:00:00.000') end )
				,[CreateUser] = [source].[CreateUser]
				,[ModifyDate] = getUTCDATE()
				,[ModifyUser] = 'updateImport'
				,[IsActive] = 1
				,[LegacyVersion] = [source].[LegacyVersion]
				,[Text] = [source].[Text]
				,[ElementKey] = [source].[InstallationId]
			WHEN NOT MATCHED THEN
			INSERT 
				(
				[iNoteLineNo]
				,[CreateDate]
				,[ModifyDate]
				,[CreateUser]
				,[ModifyUser]
				,[IsActive]
				,[LegacyId]
				,[LegacyVersion]
				,[Text]
				,[NoteType]
				,[IsExported]
				,[IsSystemGenerated]
				,ElementKey
						
				) VALUES (
				CAST([source].[NoteLineNo] as int)
				--,(case [source].[TextDate] when null then  '1753-01-30 00:00:00.000' else DATEADD (DD ,1 ,DATEADD (SS , -CAST([source].[NoteLineNo] AS INT) , coalesce([source].[TextDate], '1753-01-30 00:00:00.000'))) end )
				,(case [source].[TextDate] when null then  '1753-01-30 00:00:00.000' else coalesce([source].[TextDate], '1753-01-30 00:00:00.000') end )
				,getUTCDATE()
				,[source].[CreateUser]
				,'import'
				,1			
				,[source].[LegacyId]
				,[source].[LegacyVersion]
				,[source].[Text]
				,'UserNote'
				,1
				,0
				,[InstallationId]
				)
			WHEN NOT MATCHED BY SOURCE
				AND [target].[LegacyId] IS NOT NULL
				AND [target].[IsActive] = 1
				THEN UPDATE SET
					[target].[IsActive] = 0
					,[target].[ModifyDate] = GETUTCDATE()
					,[target].[ModifyUser] = 'DeleteImport'
				
			OUTPUT $action
	   			,inserted.NoteId
   			INTO #ServiceCommentLineImport;
			
			PRINT 'Import ' + @tableName + ': TOTAL ' +  CAST(@@Rowcount AS VARCHAR(20)) + ' Rows'

			SELECT @count = COUNT(*) FROM #ServiceCommentLineImport WHERE Change = 'INSERT'
    		EXEC SP_Import_WriteLog 'INSERT', @tableName, @count;

			SELECT @count = COUNT(*) FROM #ServiceCommentLineImport WHERE Change = 'UPDATE'
 			EXEC SP_Import_WriteLog 'UPDATE', @tableName, @count;
	
			SELECT @count = COUNT(*) FROM #ServiceCommentLineImport WHERE Change = 'DELETE'
 			EXEC SP_Import_WriteLog 'DELETE', @tableName, @count;
   		END				    
	END TRY
	BEGIN CATCH
		EXEC SP_CatchError 'ServiceCommentLine Import';
	END CATCH;
End		

GO