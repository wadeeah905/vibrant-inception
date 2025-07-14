SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[SP_Import_SendErrorMessage]
	@TableName AS NVARCHAR(100),
	@ErrorMessage AS NVARCHAR(4000)	
AS
	DECLARE @mailProfile AS NVARCHAR(100);
	DECLARE @mailRecipients AS NVARCHAR(100);
	DECLARE @EMailBody AS NVARCHAR(MAX)
	DECLARE @Subject AS NVARCHAR(400)
	BEGIN
		SET NOCOUNT ON;
		SET @mailProfile = 'Okuma';
		SET @mailRecipients = 'crm-service@l-mobile.com;hend.kharez@l-mobile.com';
		SET @EMailBody = 
		'<h3><span style="color:#ff0000">Fehler beim L-mobile Datenimport, Prüfung der Daten</span></h3>' +
		'<p><strong>Tabelle</strong>: </p>' +
		'<p>' + @TableName + '</p>' +
		'<p></p>' +		
		'<p><strong>Fehlermeldung</strong>: </p>' +
		'<p>' + @ErrorMessage + '</p>';
		
		SET @Subject = 'OKUMA TEST ' + DB_NAME() + ': Fehler beim Import'
			
		EXEC msdb.dbo.sp_send_dbmail
		@profile_name = @mailProfile,
		@recipients = @mailRecipients,
		@body = @EMailBody,
		@body_format = 'HTML',
		@subject = @Subject;
	END
	
GO
