namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20170331151500)]
	public class InsertValuesLuNoteType : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery(@"
INSERT INTO [LU].[NoteType]
           ([Name]
           ,[Language]
           ,[Value]
		   ,[Color]
		   ,[Icon]
           ,[Favorite]
           ,[SortOrder]
           ,[TenantKey]
           ,[CreateDate]
           ,[ModifyDate]
           ,[CreateUser]
           ,[ModifyUser]
           ,[IsActive])
     VALUES
 ('Abgeschlossener Besuchsbericht',	'de', 'VisitReportClosedNote',	'#9164a6', '\f196', 0, 0, NULL, GETUTCDATE(), GETUTCDATE(), 'Migration_20170331151500', 'Migration_20170331151500', 1)
,('Completed Visit Report',			'en', 'VisitReportClosedNote',	'#9164a6', '\f196', 0, 0, NULL, GETUTCDATE(), GETUTCDATE(), 'Migration_20170331151500', 'Migration_20170331151500', 1)
,('Besuchsbericht Themen',			'de', 'VisitReportTopicNote',	'#4caf50', '\f196', 0, 0, NULL, GETUTCDATE(), GETUTCDATE(), 'Migration_20170331151500', 'Migration_20170331151500', 1)
,('Visit Report Topics',			'en', 'VisitReportTopicNote',	'#4caf50', '\f196', 0, 0, NULL, GETUTCDATE(), GETUTCDATE(), 'Migration_20170331151500', 'Migration_20170331151500', 1)
			");
		}
	}
}