SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

IF EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID('[dbo].[SP_WriteLog]'))
DROP PROCEDURE [dbo].[SP_WriteLog]
GO

CREATE PROCEDURE [dbo].[SP_WriteLog]
	@message AS NVARCHAR(MAX),
	@level AS NVARCHAR(10) = 'INFO',
	@print AS BIT = 1
AS
BEGIN
	SET NOCOUNT ON;
	
	IF (@print = 1) PRINT @message;
	
	INSERT INTO [CRM].[Log]
	(
		[Date]
		,[Thread]
		,[Level]
		,[Logger]
		,[Message]
	) VALUES (
		GETDATE()
		,''
		,@level
		,'Import'
		,ISNULL(@message, '')
	)
END

GO