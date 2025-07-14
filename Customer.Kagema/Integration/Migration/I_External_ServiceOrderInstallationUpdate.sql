SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

BEGIN
SET NOCOUNT ON;

DECLARE @log AS VARCHAR(MAX);
SET @log = 'Service order update installation Import started';
EXEC SP_WriteLog @log, @print = 0
BEGIN TRY
	SET @log = '';

	DECLARE @timeDiff AS DATETIME;
	SET @timeDiff = GETDATE();
	
	DECLARE @totalTime AS DATETIME;
	SET @totalTime = GETDATE();

	IF OBJECT_ID('tempdb..#I_ServiceOrderInstallation_Input') IS NOT NULL DROP TABLE #I_ServiceOrderInstallation_Input

	IF OBJECT_ID('tempdb.. #I_ServiceOrderInstallation_Output') IS NOT NULL DROP TABLE #I_ServiceOrderInstallation_Output
	CREATE TABLE  #I_ServiceOrderInstallation_Output ([Change] NVARCHAR(50), IsActive BIT NULL)

	SELECT ext.*
		   ,soh.[Status] AS ServiceOrderStatus
		   ,soh.[ContactKey] AS OrderId
		   ,ih.[ContactKey] AS [InstallationId]
	INTO   #I_ServiceOrderInstallation_Input
	FROM V.External_ServiceOrderTime AS ext
	JOIN SMS.ServiceOrderHead soh ON ext.OrderNo COLLATE DATABASE_DEFAULT = soh.OrderNo COLLATE DATABASE_DEFAULT
	JOIN SMS.InstallationHead ih ON ih.[InstallationNo] COLLATE DATABASE_DEFAULT = ext.[InstallationNo] COLLATE DATABASE_DEFAULT

	DECLARE @transfer NVARCHAR(100);
	SELECT @transfer = 'Transfered ' + CONVERT(NVARCHAR(10), COUNT(*)) + ' rows to #I_ServiceOrderInstallation_Input' FROM #I_ServiceOrderInstallation_Input
	EXEC SP_AppendNewLine @log OUTPUT, @transfer, @timeDiff OUTPUT;
	--select * from   V.External_ServiceOrderTime 
	
	BEGIN TRANSACTION
	BEGIN TRY
	
	MERGE [SMS].[serviceorderhead] AS [target]
	USING #I_ServiceOrderInstallation_Input AS [source]
		ON [target].[contactkey] = [source].[OrderId]
	WHEN MATCHED 
		AND [source].[ServiceOrderStatus] <> 'Completed'
		THEN
			UPDATE 
			SET 
			[InstallationId] = source.[InstallationId]

	OUTPUT $action, 1 INTO  #I_ServiceOrderInstallation_Output;
	EXEC SP_AppendResult 'Merged Service Order', '#I_ServiceOrderInstallation_Output', @log OUTPUT, @timeDiff OUTPUT

	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW
	END CATCH


	IF @@TRANCOUNT > 0
		COMMIT TRANSACTION;

	SET @log = 'Service Order update installation Import finished: ' + @log;
	EXEC SP_WriteLog @log, @print = 0
END TRY
BEGIN CATCH
	DECLARE @name AS NVARCHAR(100)
	SET @name = 'Service Order update installation Import'
	--EXEC SP_CatchError @name;
END CATCH;
END