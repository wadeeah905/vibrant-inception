SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

BEGIN
	SET NOCOUNT ON;
		
	BEGIN TRY
		DECLARE @count BIGINT;
		DECLARE @tableName NVARCHAR(200);
		SET @tableName = '[SMS].[InstallationPos]';
			
		-------------------------------------------------
 		-- Fill temporary merge storage
 		-------------------------------------------------	
 		BEGIN
 			IF OBJECT_ID('tempdb..#InstallationPosImport') IS NOT NULL DROP TABLE #InstallationPosImport
 			CREATE TABLE #InstallationPosImport (Change NVARCHAR(100), 
 											InstallationPosId UNIQUEIDENTIFIER,SerialNo varchar(50))

 			IF OBJECT_ID('tempdb..#InstallationPos') IS NOT NULL DROP TABLE #InstallationPos
	 		    			
			SELECT 
				l.*,i.ContactKey as InstallationId
			INTO #InstallationPos
			 FROM [V].[External_ServiceItemComponent] l
			join sms.InstallationHead i on  l.InstallationNo COLLATE DATABASE_DEFAULT =i.InstallationNo COLLATE DATABASE_DEFAULT
			
			
			CREATE NONCLUSTERED INDEX IX_##InstallationPos_LegacyId ON #InstallationPos ([LegacyId] ASC)
			
			SELECT @count = COUNT(*) FROM #InstallationPos
			PRINT CONVERT(NVARCHAR, @count) + ' Records transferred to input table'
		END
	
		-------------------------------------------------
		-- Merge Entity table
		-------------------------------------------------
		BEGIN
			MERGE [SMS].[InstallationPos] AS [target]
			USING #InstallationPos AS [source]
			ON [target].[LegacyId] = [source].[LegacyId] COLLATE DATABASE_DEFAULT
			WHEN MATCHED AND [target].LegacyVersion <> [source].[LegacyVersion]
				THEN UPDATE SET
					[target].[Description] = [source].[Description]
					,[target].[IsActive] = 1
					,[target].LegacyVersion=[source].LegacyVersion
			WHEN NOT MATCHED THEN
			INSERT 
           ([InstallationId]
           ,[PosNo]
           ,[ItemNo]
           ,[Description]
           ,[QuantityUnit]
           ,[Quantity]
           ,[isInstalled]
           ,[InstallDate]
           ,[CreateDate]
           ,[ModifyDate]
           ,[IsGroupItem]
           ,[GroupLevel]
           ,[CreateUser]
           ,[ModifyUser]
		   ,LegacyId
		   ,LegacyVersion)
     VALUES
           ([source].InstallationId
           ,[source]. [LineNo]
           ,[source].InstallationPosNo
           ,[source].[Description]
           ,'STK'
           ,1
           ,1
           ,[DateInstalled]
           ,GETUTCDATE()
           ,GETUTCDATE()
           ,0
           ,0
           ,'Import'
           ,'Import'
		   ,LegacyId
		   ,LegacyVersion)
			WHEN NOT MATCHED BY SOURCE
				AND [target].[LegacyId] IS NOT NULL
				AND [target].[IsActive] = 1
				THEN UPDATE SET
					[target].[IsActive] = 0
					,[target].[ModifyDate] = GETUTCDATE()
					,[target].[ModifyUser] = 'Import'
				
			OUTPUT $action
	   			,inserted.Id,[Source].SerialNo
   			INTO #InstallationPosImport;
			

			-------------------------------------------------
		-- Merge Entity table Serial
		-------------------------------------------------
		BEGIN
			MERGE [SMS].[InstallationPosSerials] AS [target]
			USING #InstallationPosImport AS [source]
			ON [target].[InstallationPosId] = [source].[InstallationPosId]
			AND  [target].[SerialNo] COLLATE DATABASE_DEFAULT = [source].[SerialNo] COLLATE DATABASE_DEFAULT
			
			WHEN NOT MATCHED AND  coalesce([source].[SerialNo],'')<>'' THEN
			INSERT 
           ([SerialNo]
           ,[IsInstalled]
           ,[CreateDate]
           ,[CreateUser]
           ,[ModifyDate]
           ,[ModifyUser]
           ,[InstallationPosId])
     VALUES
           ([source].[SerialNo]
           ,1
		   ,GETDATE()
           ,'Import'
		   ,GETDATE()
           ,'Import'
		   ,[InstallationPosId])
			WHEN NOT MATCHED BY SOURCE
				AND [target].isInstalled = 1
				THEN UPDATE SET
					[target].isInstalled = 0
					,[target].[ModifyDate] = GETUTCDATE()
					,[target].[ModifyUser] = 'Import';
				
			END
			
			PRINT 'Import ' + @tableName + ': TOTAL ' +  CAST(@@Rowcount AS VARCHAR(20)) + ' Rows'

			SELECT @count = COUNT(*) FROM #InstallationPosImport WHERE Change = 'INSERT'
    		EXEC SP_Import_WriteLog 'INSERT', @tableName, @count;

			SELECT @count = COUNT(*) FROM #InstallationPosImport WHERE Change = 'UPDATE'
 			EXEC SP_Import_WriteLog 'UPDATE', @tableName, @count;
	
			SELECT @count = COUNT(*) FROM #InstallationPosImport WHERE Change = 'DELETE'
 			--EXEC SP_Import_WriteLog 'DELETE', @tableName, @count;
   		END				    
	END TRY
	BEGIN CATCH
		EXEC SP_CatchError '#InstallationPos Import';
	END CATCH;
End		

GO