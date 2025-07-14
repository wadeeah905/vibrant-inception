SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

BEGIN
SET NOCOUNT ON;

DECLARE @log AS VARCHAR(MAX);
SET @log = 'Service Order Time Import started';
EXEC SP_WriteLog @log, @print = 0
BEGIN TRY
	SET @log = '';

	DECLARE @timeDiff AS DATETIME;
	SET @timeDiff = GETDATE();
	
	DECLARE @totalTime AS DATETIME;
	SET @totalTime = GETDATE();

	IF OBJECT_ID('tempdb..#I_ServiceOrderTimes_Input') IS NOT NULL DROP TABLE #I_ServiceOrderTimes_Input
	IF OBJECT_ID('tempdb..#I_ServiceOrderTimes_Output') IS NOT NULL DROP TABLE #I_ServiceOrderTimes_Output
	CREATE TABLE #I_ServiceOrderTimes_Output ([Change] NVARCHAR(50), IsActive BIT NULL)

	SELECT ext.*
		   ,soh.[Status] AS ServiceOrderStatus
		   ,soh.[ContactKey] AS OrderId
		   ,ih.[ContactKey] AS [InstallationId]
	INTO   #I_ServiceOrderTimes_Input
	FROM V.External_ServiceOrderTime AS ext
	JOIN SMS.ServiceOrderHead soh ON ext.OrderNo COLLATE DATABASE_DEFAULT = soh.OrderNo COLLATE DATABASE_DEFAULT
	JOIN SMS.InstallationHead ih ON ih.[InstallationNo] COLLATE DATABASE_DEFAULT = ext.[InstallationNo] COLLATE DATABASE_DEFAULT

	DECLARE @transfer NVARCHAR(100);
	SELECT @transfer = 'Transfered ' + CONVERT(NVARCHAR(10), COUNT(*)) + ' rows to #I_ServiceOrderTimes_Input' FROM #I_ServiceOrderTimes_Input
	EXEC SP_AppendNewLine @log OUTPUT, @transfer, @timeDiff OUTPUT;
	BEGIN TRANSACTION
	BEGIN TRY

	MERGE [SMS].[ServiceOrderTimes] AS [target]
	USING #I_ServiceOrderTimes_Input AS [source]
		ON [target].[OrderId] = [source].[OrderId]
		AND [target].[PosNo] = [source].[PosNo]
	WHEN NOT MATCHED
		THEN
			INSERT ([Id], [OrderId], [PosNo], [ItemNo], [Description], [Comment], [CreatedLocal], [Status], [CreateDate], [CreateUser], [ModifyDate], [ModifyUser], [IsExported], [IsActive], [InstallationId])
			VALUES (NEWID(), source.[OrderId], source.[PosNo], source.[ItemNo], source.[Description], source.[Comment], 0, 'Created', GetUtcDate(), 'BCImportInsert', GetUtcDate(), 'BCImportInsert', 0, 1, source.[InstallationId])
	WHEN MATCHED 
		AND [source].[ServiceOrderStatus] <> 'Completed'
		THEN
			UPDATE
			SET [ItemNo] = source.[ItemNo]
			,[Description] = source.[Description]
			,[Comment] = source.[Comment]
			,[ModifyDate] = GetUtcDate()
			,[ModifyUser] = 'BCImportUpdate'
			,[InstallationId] = source.[InstallationId]

	OUTPUT $action, inserted.IsActive INTO #I_ServiceOrderTimes_Output;
	EXEC SP_AppendResult 'Merged Service Order Time', '#I_ServiceOrderTimes_Output', @log OUTPUT, @timeDiff OUTPUT

	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW
	END CATCH



	IF @@TRANCOUNT > 0
		COMMIT TRANSACTION;

	SET @log = 'Service Order Time Import finished: ' + @log;
	EXEC SP_WriteLog @log, @print = 0
END TRY
BEGIN CATCH
	DECLARE @name AS NVARCHAR(100)
	SET @name = 'Service Order Time Import'
	--EXEC SP_CatchError @name;
END CATCH;
END