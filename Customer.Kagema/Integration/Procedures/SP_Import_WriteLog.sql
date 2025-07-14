SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

IF EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID('[dbo].[SP_Import_WriteLog]'))
	DROP PROCEDURE [dbo].[SP_Import_WriteLog]
GO

CREATE PROCEDURE [dbo].[SP_Import_WriteLog]
	@CRUDType AS NVARCHAR(100),
	@TableName AS NVARCHAR(100),
	@Count AS BIGINT	
AS
BEGIN
	SET NOCOUNT ON;

	--Write Message in Log
	IF @Count > 0
	BEGIN
		PRINT 'Import ' + @TableName + ': ' + @CRUDType + ' ' + CONVERT(NVARCHAR, @Count) + ' Rows';
				
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
			,'INFO'
			,'Import'
			,@TableName + ' - ' + @CRUDType + ' Rows: ' + ' ' + CONVERT(NVARCHAR, @count)	
		)
	END;
END

GO
