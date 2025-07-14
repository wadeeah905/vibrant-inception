SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID('[dbo].[SP_CatchError]'))
DROP PROCEDURE [dbo].[SP_CatchError]
GO
CREATE PROCEDURE [dbo].[SP_CatchError]
	@prefix AS NVARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;	

	IF ERROR_NUMBER() IS NULL 
		RETURN;
		
	DECLARE @ErrorMessage NVARCHAR(4000),
		@ErrorNumber INT,
		@ErrorSeverity INT,
		@ErrorState INT,
		@ErrorLine INT,
		@ErrorProcedure NVARCHAR(200),
		@logMessage NVARCHAR(MAX),
		@logLevel NVARCHAR(10);

	SELECT @ErrorNumber = ERROR_NUMBER()
		,@ErrorSeverity = ERROR_SEVERITY()
		,@ErrorState = ERROR_STATE()
		,@ErrorLine = ERROR_LINE()
		,@ErrorProcedure = ISNULL(ERROR_PROCEDURE(), '-')
		,@ErrorMessage = ERROR_MESSAGE()
		,@logLevel =	CASE WHEN ERROR_NUMBER() = '1205' --deadlock, step will be retried
							THEN 'WARN'
							ELSE 'ERROR'
						END;

	IF @prefix IS NULL
		SET @prefix = '';

	SET @logMessage = @prefix 
		+ ' Error ' + CONVERT(NVARCHAR, @ErrorNumber)
		+ ', Level ' + CONVERT(NVARCHAR, @ErrorSeverity) 
		+ ', State ' + CONVERT(NVARCHAR, @ErrorState) 
		+ ', Procedure ' + @ErrorProcedure
		+ ', Line ' + CONVERT(NVARCHAR, @ErrorLine) 
		+ ', Message ' + @ErrorMessage;

	
	EXEC SP_WriteLog @logMessage, @logLevel;

	IF (@logLevel = 'ERROR')
		EXEC SP_SendMessage 'Error Import', @logMessage
	
	SELECT @ErrorMessage = 'Original Message: ' + @prefix + N' Error %d, Level %d, State %d, Procedure %s, Line %d, Message: ' + ERROR_MESSAGE();
	RAISERROR (@ErrorMessage, @ErrorSeverity, 1, @ErrorNumber, @ErrorSeverity, @ErrorState, @ErrorProcedure, @ErrorLine) WITH NOWAIT;
END

GO 