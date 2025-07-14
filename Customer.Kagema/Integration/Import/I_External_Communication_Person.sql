SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

BEGIN
SET NOCOUNT ON;

DECLARE @log AS VARCHAR(MAX);
SET @log = 'Communication Import started';
EXEC SP_WriteLog @log, @print = 0
BEGIN TRY
	SET @log = '';

	DECLARE @timeDiff AS DATETIME;
	SET @timeDiff = GETDATE();
	
	DECLARE @totalTime AS DATETIME;
	SET @totalTime = GETDATE();

	BEGIN
		IF OBJECT_ID('tempdb..#ImportedCommunication') IS NOT NULL DROP TABLE #ImportedCommunication
		IF OBJECT_ID('tempdb..#Communication') IS NOT NULL DROP TABLE #Communication
		IF OBJECT_ID('tempdb..#ShortContact') IS NOT NULL DROP TABLE #ShortContact
		CREATE TABLE #ImportedCommunication (Change NVARCHAR(100), IsActive BIT NULL)

		select  LegacyId,ContactId,ParentKey
		Into #ShortContact
		from crm.Contact where IsActive = 1 AND ContactType= 'Person'

		SELECT communication.*
			  ,contact.ContactId
			  ,[address].AddressId
			  ,BINARY_CHECKSUM(GroupKey, TypeKey, communication.CountryKey, AreaCode, [Data]) AS LegacyVersion
		INTO #Communication 
		FROM [V].[External_Communication] communication
		JOIN #ShortContact contact ON communication.[NavisionContactNo]  COLLATE DATABASE_DEFAULT = contact.LegacyId
		JOIN CRM.[Address] [address] ON contact.ParentKey = [address].CompanyKey AND [address].IsActive = 1 and AddressTypeKey=1

		CREATE NONCLUSTERED INDEX IX_#Communication_AddressLegacyId ON #Communication (AddressLegacyId)
		CREATE NONCLUSTERED INDEX IX_#Communication_ContactLegacyId ON #Communication (NavisionContactNo)
		CREATE NONCLUSTERED INDEX IX_#Communication_CommunicationLegacyId ON #Communication (CommunicationLegacyId)

		DECLARE @transferCommunication NVARCHAR(100);
		SELECT @transferCommunication = 'Transfered ' + CONVERT(NVARCHAR(10), COUNT(*)) + ' rows to #Communication' FROM #Communication
		EXEC SP_AppendNewLine @log OUTPUT, @transferCommunication, @timeDiff OUTPUT;
	END
	
	BEGIN TRANSACTION
	BEGIN TRY

	--select LegacyId,COUNT(*) from  #ShortContact group by LegacyId having COUNT(*)>1
	MERGE CRM.Communication AS [target]
	USING #Communication AS [source]
	ON [target].LegacyId = [source].CommunicationLegacyId AND [target].TypeKey = [source].TypeKey
	WHEN NOT MATCHED THEN 
	INSERT (
			CreateDate, CreateUser
			,ModifyDate, ModifyUser
			,IsActive
			,LegacyId
			,LegacyVersion
			,AddressKey
			,ContactKey
			,GroupKey
			,TypeKey
			,CountryKey
			,AreaCode
			,[Data]
			,IsExported
		) VALUES (
			GETUTCDATE(), 'BCImportInsert'
			,GETUTCDATE(), 'BCImportInsert'
			,1
			,CommunicationLegacyId
			,LegacyVersion
			,AddressId
			,ContactId
			,GroupKey
			,TypeKey
			,CountryKey
			,AreaCode
			,[Data]
			,1
		)
	WHEN MATCHED 
		AND [target].LegacyVersion IS NULL OR [target].LegacyVersion <> [source].LegacyVersion	
	THEN UPDATE
		SET [target].ModifyDate = GETUTCDATE()
			,[target].ModifyUser = 'BCImportUpdate'
			,[target].IsActive = 1
			,[target].LegacyVersion = [source].LegacyVersion
			,[target].AddressKey = [source].AddressId
			,[target].ContactKey = [source].ContactId
			,[target].GroupKey = [source].GroupKey
			,[target].TypeKey = [source].TypeKey
			,[target].CountryKey = [source].CountryKey
			,[target].AreaCode = [source].AreaCode
			,[target].[Data] = [source].[Data]
			,[target].IsExported = 1
	WHEN NOT MATCHED BY SOURCE
		AND [target].IsActive = 1
		AND [target].LegacyId IS NOT NULL
		AND EXISTS (SELECT 1 FROM CRM.Contact WHERE ContactId = [target].ContactKey)
	THEN UPDATE
		SET [target].ModifyDate = GETUTCDATE()
			,[target].ModifyUser = 'BCImportUpdate'
			,[target].IsActive = 0
			,[target].LegacyVersion = NULL
	OUTPUT $action, inserted.IsActive INTO #ImportedCommunication;
	EXEC SP_AppendResult 'Merged Communication', '#ImportedCommunication', @log OUTPUT, @timeDiff OUTPUT
	
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW
	END CATCH

	IF @@TRANCOUNT > 0
		COMMIT TRANSACTION;

	SET @log = 'Communication Import finished: ' + @log;
	EXEC SP_WriteLog @log, @print = 0
END TRY
BEGIN CATCH
	DECLARE @name AS NVARCHAR(100)
	SET @name = 'Communication Import'
	EXEC SP_CatchError @name;
END CATCH;
END

