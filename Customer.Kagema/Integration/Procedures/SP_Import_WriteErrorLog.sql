SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_Import_WriteErrorLog]
	@TableName NVARCHAR(100),
	@ErrorMessage NVARCHAR(4000),
	@ErrorSeverity INT,
	@ErrorState INT
AS
BEGIN
	SET NOCOUNT ON;	
		
	DECLARE @logmessage AS NVARCHAR(4000);
	SET @logmessage = SUBSTRING('ERROR ' + @TableName + ' EXCEPTION: ' + @ErrorMessage, 0, 4000);
	PRINT @logmessage

	INSERT INTO [CRM].[Log]
	(
		[Date]
		,[Thread]
		,[Level]
		,[Logger]
		,[Message]
		,[Exception]
	) VALUES (
		GETDATE()
		,''
		,'ERROR'
		,'Import'
		,'ERROR ' + @TableName
		,@logmessage		
	)
		
	EXEC [SP_Import_SendErrorMessage] @TableName, @ErrorMessage;
	
	--RAISERROR (@logmessage, @ErrorSeverity, @ErrorState) WITH NOWAIT		
END

GO
