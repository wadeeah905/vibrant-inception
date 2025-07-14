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
	 		
			TRUNCATE  table [S].[ServiceCommentLine]
			TRUNCATE  table [S].[ServiceCommentLineV2]

			--select top 1 * from [V].[External_ServiceCommentLine]  
			INSERT INTO [S].[ServiceCommentLineV2] ([InstallationNo],[Type],[LineNo],[Text],[LegacyId]
													,[TextDate],[CreateUser])
			SELECT [InstallationNo],[Type],[LineNo],[Text],[LegacyId],[TextDate],[CreateUser] 
			FROM [V].[External_ServiceCommentLine]  sc 
			WHERE  sc.TextDate is not null

			INSERT INTO [S].[ServiceCommentLine] ([InstallationNo],[Type],[LineNo],[Text],[LegacyId]
												,[TextDate],[CreateUser],groupComment)
			SELECT [InstallationNo],[Type],[LineNo],[Text],[LegacyId],[TextDate],[CreateUser] ,(select top 1 scl.[LineNo] from  
					 [S].[ServiceCommentLineV2] scl
			WHERE scl.[LineNo]<= sc.[LineNo] AND sc.[InstallationNo]=scl.[InstallationNo] 
			ORDER BY [LineNo]  DESC ) 
			FROM [V].[External_ServiceCommentLine]  sc 

			UPDATE [S].[ServiceCommentLine]
			SET groupComment=[lineNo]
			WHERE groupComment is null

			UPDATE [S].[ServiceCommentLineV2]
			SET groupComment=[lineNo]

--select * from [S].[ServiceCommentLineV2]

update  [S].[ServiceCommentLineV2]
set Text=COALESCE((SELECT convert(xml,Replace(Replace(Replace(scl.text,'<',' '),'>',' '),'&',' ') +'
')
						FROM  [S].[ServiceCommentLine]  scl
						WHERE scl.[InstallationNo] = sh.[InstallationNo] 
						and scl.groupComment=sh.groupComment
						ORDER BY [LineNo] 
						FOR XML PATH ('')), '') 

FROM [S].[ServiceCommentLineV2] sh
--SELECT sh.groupComment,sh.installationNo
--,COALESCE((SELECT convert(xml,Replace(Replace(Replace(scl.text,'<',' '),'>',' '),'&',' ') +'
--')
--						FROM  [S].[ServiceCommentLine]  scl
--						WHERE scl.[InstallationNo] = sh.[InstallationNo] 
--						and scl.groupComment=sh.groupComment
--						ORDER BY [LineNo] 
--						FOR XML PATH ('')), '') as [CommentText]

--FROM [S].[ServiceCommentLine] sh
			SELECT  
				distinct l.*
				,BINARY_CHECKSUM(
				l.[InstallationNo]
				,l.[Type]
				,l.[LineNo]
				,l.[Text]
				,l.[LegacyId]
				,l.[TextDate]
				,l.[CreateUser]
				) AS [LegacyVersion]
				,s.ContactKey As [InstallationId]
				INTO #ServiceCommentLine 
				from [S].[ServiceCommentLineV2] l
			 join sms.InstallationHead s on l.InstallationNo COLLATE DATABASE_DEFAULT=s.InstallationNo  COLLATE DATABASE_DEFAULT
			 join crm.Contact on ContactKey=ContactId
			 where IsActive=1 
			 --and IsExported=0
			DELETE FROM #ServiceCommentLine where groupComment!=[LineNo]
			CREATE NONCLUSTERED INDEX IX_#ServiceCommentLine_LegacyId ON #ServiceCommentLine ([InstallationId] ASC)include([LineNo])
			
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
			and [target].[LineNo] = [source].[LineNo]
			WHEN MATCHED AND ([target].LegacyVersion is null OR [target].LegacyVersion <> [source].[LegacyVersion])
				THEN UPDATE SET
				--[CreateDate] = (case [source].[TextDate] when null then  '1753-01-30 00:00:00.000' else DATEADD (DD ,1 ,DATEADD (SS , -CAST([source].[LineNo] AS INT) , coalesce([source].[TextDate], '1753-01-30 00:00:00.000'))) end )
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
				[LineNo]
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
				[source].[LineNo]
				--,(case [source].[TextDate] when null then  '1753-01-30 00:00:00.000' else DATEADD (DD ,1 ,DATEADD (SS , -CAST([source].[LineNo] AS INT) , coalesce([source].[TextDate], '1753-01-30 00:00:00.000'))) end )
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