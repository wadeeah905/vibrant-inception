IF EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID('[dbo].[SP_SendMessage]'))
	DROP PROCEDURE [dbo].SP_SendMessage
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Joest, Oliver>
-- Create date: <08.05.2013>
-- Description:	<Send out messsages using DB-Mail and including the originating Company>
-- =============================================
CREATE PROCEDURE [dbo].SP_SendMessage
	@subject AS NVARCHAR(250),
	@message AS NVARCHAR(max),
	@query AS NVARCHAR(max) = NULL
AS
BEGIN
	DECLARE @mailProfile AS NVARCHAR(100);
	DECLARE @mailRecipients AS NVARCHAR(100);
	DECLARE @company AS NVARCHAR(100);
	SET @mailProfile = 'Backup';
	SET @mailRecipients = 'crm-service@l-mobile.com;hend.kharez@l-mobile.com';
	SET @company = 'Okuma Test: ';

	SET NOCOUNT ON;

	RAISERROR(@subject, 10, 0) WITH NOWAIT
	SET @subject = @company + @subject;
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
			@execute_query_database=N'LmobileTest',
			@query=@query,
			@attach_query_result_as_file=1,
			@query_attachment_filename='Records.csv',
			@query_result_no_padding=1,
			@query_result_separator='	'
END

GO


