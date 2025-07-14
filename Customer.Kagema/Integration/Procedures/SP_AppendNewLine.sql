SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO
IF EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID('[dbo].[SP_AppendNewLine]'))
DROP PROCEDURE [dbo].[SP_AppendNewLine]
GO
CREATE PROCEDURE [dbo].[SP_AppendNewLine]
	@message AS VARCHAR(MAX) OUTPUT,
	@appendix AS VARCHAR(MAX),
	@lastTime AS DATETIME = NULL OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
	
	IF (@lastTime IS NOT NULL)
	BEGIN
		DECLARE @ms INT;
		SET @ms = DATEDIFF(millisecond, @lastTime, GETDATE());
		SET @appendix = '+' + FORMAT(@ms, '000000') + 'ms ' + @appendix;
		SET @lastTime = GETDATE();
	END

	PRINT @appendix;

	IF (@message IS NULL) SET @message = ''
	ELSE SET @message = @message + char(13) + char(10)
	
	SET @message = @message + @appendix;
END

GO