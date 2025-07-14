SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

BEGIN
	SET NOCOUNT ON;
	SET QUOTED_IDENTIFIER ON;
		
	BEGIN TRY	

		DECLARE @count bigint;
		DECLARE @tableName nvarchar(200);
		DECLARE @emptyGuid nvarchar(36);
		SET @tableName = 'Crm.User';
		SET @emptyGuid = '00000000-0000-0000-0000-000000000000';
			
		-------------------------------------------------
 		-- Fill temporary merge storage
 		-------------------------------------------------	
 		BEGIN
 			IF OBJECT_ID('tempdb..#UserImport') IS NOT NULL DROP TABLE #UserImport
 			CREATE TABLE #UserImport (Change NVARCHAR(100), 
 											Username NVARCHAR(100))  
			IF OBJECT_ID('tempdb..#UserRemote') IS NOT NULL DROP TABLE #UserRemote
			IF OBJECT_ID('tempdb..#RoleAssignmentImport') IS NOT NULL DROP TABLE #RoleAssignmentImport
										
			SELECT 
				u.*
				,BINARY_CHECKSUM(						
					u.[FirstName]
					,u.[LastName]
					,u.[Username]
					,u.[Email]
					,u.PersonnelId
					) AS [LegacyVersion]
			INTO #UserRemote
			FROM [V].[External_User] u

			SELECT @count = COUNT(*) FROM #UserRemote
			PRINT CONVERT(nvarchar, @count) + ' Records transferred to input table'
		END

		-------------------------------------------------
		-- Merge Entity table
		-------------------------------------------------
		BEGIN TRANSACTION
		BEGIN TRY
		
		BEGIN
			MERGE [CRM].[User] AS [target]
			USING #UserRemote AS [source]
			ON [target].[LegacyId] COLLATE DATABASE_DEFAULT = [source].[LegacyId] COLLATE DATABASE_DEFAULT
			WHEN NOT MATCHED
			THEN INSERT 
				(
					[Username]
					,[Email]
					,[Password]
					,[DefaultLanguage]
					,[IsActive]
					,[CreateDate]
					,[ModifyDate]
					,[Firstname]
					,[Lastname]
					,[CreateUser]
					,[ModifyUser]
					,[LegacyId]
					,[PersonnelId]
				) VALUES (
					[source].[Username]
					,[source].[Email]
					,'firstlogin'
					,'de'
					,1
					,GETUTCDATE()
					,GETUTCDATE()
					,[source].[Firstname]
					,[source].[Lastname]
					,'Import'
					,'Import'
					,[source].[LegacyId]
					,[source].[PersonnelId]
				)
			WHEN NOT MATCHED BY SOURCE 
				AND [target].[LegacyId] IS NOT NULL
				AND [target].[Discharged] = 0
			THEN UPDATE SET
				[target].[Discharged] = 1
				,[target].[ModifyDate] = GETUTCDATE()
				,[target].[ModifyUser] = 'Import'
				,[target].[DischargeDate] = GETUTCDATE()
			WHEN MATCHED
			THEN UPDATE SET
				[Firstname] = [source].[Firstname]
				,[Lastname] = [source].[Lastname]
				,[LegacyId] = [source].[LegacyId]
				,PersonnelId =[source].[PersonnelId]
				,[IsActive] = 1
				,[Discharged] = 0
				,[ModifyDate] = GETUTCDATE()
				,[ModifyUser] = 'Import'
				,[Email] = [source].[Email]
			OUTPUT $action
   				,[source].Username
   			INTO #UserImport;
		END
		
		BEGIN
			MERGE [dbo].[User] AS [target]
			USING [crm].[User] AS [source]
			ON [target].[UId] = [source].[UserID]			
			WHEN NOT MATCHED
			THEN INSERT 
				(
					[UId]
					,[Username]
					,[Version]
					,[CreatedBy]
					,[CreatedAt]
					,[ModifiedBy]
					,[ModifiedAt]
					,[IsDeleted]
					,[DomainId]
					,[EntityTypeId]
					,[LockoutEnabled]
					,[AccessFailedCount]
					,[EmailConfirmed]
				) VALUES (
					[source].[UserID]
					,[source].[Username]
					,1
					,'Import'
					,GETUTCDATE()
					,'Import'
					,GETUTCDATE()
					,0
					,@emptyGuid
					,'2B3F933C-B2C7-E811-82E6-901B0E84E2BE'
					,0
					,0
					,1
				);
		END
		
		-------------------------------------------------
		-- Add required permissions to users
		-------------------------------------------------
		SELECT 
			c.*
			,ps.PermissionSchemaId
			,r.[PermissionSchemaRoleId]
			,ps.PermissionSchemaSettlementId
		INTO #RoleAssignmentImport
		FROM #UserImport c
		CROSS APPLY (SELECT TOP 1 [UId] AS [PermissionSchemaRoleId], [PermissionSchemaId] FROM [dbo].[PermissionSchemaRole] WHERE [Name] = 'FieldService' AND [CompilationName] IS NULL AND [IsDeleted] = 0) AS r
		CROSS APPLY (SELECT ps.[UId] AS [PermissionSchemaId], pss.[UId] AS [PermissionSchemaSettlementId]
		  FROM [dbo].[PermissionSchema] ps
		  LEFT JOIN [dbo].[PermissionSchemaSettlement] pss ON ps.[UId] = pss.[PermissionSchemaId]
		  WHERE ps.[UId] = r.[PermissionSchemaId] AND ps.[IsDeleted] = 0 AND SourcePermissionSchemaId IS NULL and  name='DefaultPermissionSchema') AS ps

   		BEGIN
			MERGE [dbo].[PermissionSchemaRoleAssignment] AS [target]
			USING (SELECT rai.PermissionSchemaRoleId, rai.[PermissionSchemaId], rai.[PermissionSchemaSettlementId], u.[UserId]
				FROM #RoleAssignmentImport rai
				 JOIN [Crm].[User] u ON rai.Username = u.Username) AS [source]
			ON [target].[UserId] = [source].[UserId] AND [target].[PermissionSchemaRoleId] = [source].[PermissionSchemaRoleId]
			WHEN NOT MATCHED
			THEN INSERT
				(
					[PermissionSchemaId]
					,[PermissionSchemaSettlementId]
					,[PermissionSchemaRoleId]
					,[UserId]
					,[AuthDomainId]
				) VALUES (
					[source].[PermissionSchemaId]
					,[source].[PermissionSchemaSettlementId]
					,[source].[PermissionSchemaRoleId]
					,[source].[UserID]
					,@emptyGuid
				);
		END
		
		BEGIN
		MERGE [dbo].[GrantedRole] AS [target]
		USING (SELECT rai.PermissionSchemaRoleId, u.[UserId], 
					  CONVERT(NVARCHAR(36), rai.[PermissionSchemaRoleId]) + '::' + CONVERT(NVARCHAR(36), u.[UserID]) + '::' + @emptyGuid + '::' + @emptyGuid + '::::' + @emptyGuid AS [UId]
		FROM #RoleAssignmentImport rai
		JOIN [Crm].[User] u ON rai.Username = u.Username) AS [source]
		ON [target].[UserId] = [source].[UserId] AND [source].[UId] = [target].[UId]	
		WHEN NOT MATCHED
		THEN INSERT
			(
				[UId]
				,[RoleId]
				,[UserId]
				,[AuthDomainId]
				,[TargetDomainId]
			) VALUES (
				[source].[UId]
				,[source].[PermissionSchemaRoleId]
				,[source].[UserID]
				,@emptyGuid
				,@emptyGuid
			);
		END
		
		BEGIN
		MERGE [dbo].[GrantedPermission] AS [target]
		USING (SELECT rai.[PermissionSchemaRoleId], u.[UserId], psp.[PermissionId],
					  CONVERT(NVARCHAR(36), psp.[PermissionId]) + '::' + CONVERT(NVARCHAR(36), u.[UserID]) + '::' + @emptyGuid + '::' + @emptyGuid + '::::' + @emptyGuid AS [UId]
				FROM #RoleAssignmentImport rai
				JOIN [Crm].[User] u ON rai.Username = u.Username
				JOIN [dbo].[PermissionSchemaRolePermission] psp ON psp.[PermissionSchemaRoleId] = rai.[PermissionSchemaRoleId]) AS [source]
		ON [target].[UserId] = [source].[UserId] AND [target].[UId] = [source].[UId]
		WHEN NOT MATCHED
		THEN INSERT
			(
				[UId]
				,[PermissionId]
				,[UserId]
				,[AuthDomainId]
				,[TargetDomainId]
				,[Circle]
				,[ReferenceCount]
			) VALUES (
				[source].[UId]
				,[source].[PermissionId]
				,[source].[UserID]
				,@emptyGuid
				,@emptyGuid
				,@emptyGuid
				,1
			);
		END
		
		-------------------------------------------------
		-- Update users general tokens
		-------------------------------------------------
		BEGIN
			UPDATE CRM.[User] SET GeneralToken = RIGHT('000000000000000' + CAST(BINARY_CHECKSUM(Username) AS NVARCHAR), 15) WHERE GeneralToken IS NULL
		END

		BEGIN
			DECLARE @password VARCHAR(MAX)
			SET @password = '123123'
 
			UPDATE U
			SET Password = P.Password
			FROM [CRM].[User] U JOIN 
			(
				SELECT UserID
				,Username
				,Email
				,CAST('' AS XML).value('xs:base64Binary(sql:column("Hash"))', 'VARCHAR(MAX)') AS Password
			FROM (
				SELECT *
				,CONVERT(VARBINARY(MAX), HASHBYTES('SHA2_256', @password + CONVERT(VARCHAR(MAX), LOWER(RTRIM(LTRIM(Email)))))) AS Hash
				FROM [CRM].[User]
				) T
			) P ON U.UserID = P.UserID
			WHERE U.Password='firstlogin'

		END


		END TRY		
		BEGIN CATCH
			IF @@TRANCOUNT > 0
				ROLLBACK TRANSACTION;
				DECLARE @ErrorMessage NVARCHAR(4000);
				DECLARE @ErrorSeverity INT;
				DECLARE @ErrorState INT;

				SELECT 
					@ErrorMessage = ERROR_MESSAGE(),
					@ErrorSeverity = ERROR_SEVERITY(),
					@ErrorState = ERROR_STATE();
			RAISERROR(@ErrorMessage,@ErrorSeverity,@ErrorState)
		END CATCH

		IF @@TRANCOUNT > 0
			COMMIT TRANSACTION;

		SELECT @count = COUNT(*) FROM #UserImport
		EXEC SP_Import_WriteLog 'TOTAL', @tableName, @count;
		
		SELECT @count = COUNT(*) FROM #UserImport WHERE Change = 'INSERT'			
		EXEC SP_Import_WriteLog 'INSERT', @tableName, @count;
															
		SELECT @count = COUNT(*) FROM #UserImport WHERE Change = 'UPDATE'			
		EXEC SP_Import_WriteLog 'UPDATE', @tableName, @count;   			
		END TRY
		BEGIN CATCH
			--DECLARE @ErrorMessage NVARCHAR(4000);
			--DECLARE @ErrorSeverity INT;
			--DECLARE @ErrorState INT;
				
			SELECT
				@ErrorMessage = Substring(ERROR_MESSAGE(), 0, 4000),
				@ErrorSeverity = ERROR_SEVERITY(),
				@ErrorState = ERROR_STATE();
					
			EXEC SP_Import_WriteErrorLog @tableName, @ErrorMessage, @ErrorSeverity, @ErrorState;
		END CATCH
END
