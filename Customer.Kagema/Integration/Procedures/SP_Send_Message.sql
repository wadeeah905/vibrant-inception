SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_Send_Message]
	@subject AS NVARCHAR(250),
	@message AS NVARCHAR(max),
	@query AS NVARCHAR(max) = NULL
AS
BEGIN
	DECLARE @mailProfile AS NVARCHAR(100);
	DECLARE @mailRecipients AS NVARCHAR(100);
	DECLARE @company AS NVARCHAR(100);
	SET @mailProfile = 'LMobile';
	SET @mailRecipients = 'hend.kharez@l-mobile.com';
	SET @company = 'OKUMA';

	SET NOCOUNT ON;

	RAISERROR(@subject, 10, 0) WITH NOWAIT
	SET @subject = @company + ' ' + DB_NAME() + ' ' + @subject;
	IF @query IS NULL
		EXEC msdb.dbo.sp_send_dbmail 
			@profile_name=@mailProfile, 
			@recipients=@mailRecipients, 
			@subject=@subject, 
			@body=@message
	ELSE
		EXEC msdb.dbo.sp_send_dbmail 
			@profile_name=@mailProfile, 
			@recipients=@mailRecipients, 
			@subject=@subject, 
			@body=@message,
			@execute_query_database=DB_Name,
			@query=@query,
			@attach_query_result_as_file=1,
			@query_attachment_filename='Records.csv',
			@query_result_no_padding=1,
			@query_result_separator='	'
END

GO
