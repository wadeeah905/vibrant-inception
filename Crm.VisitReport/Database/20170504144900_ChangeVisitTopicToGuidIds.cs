namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20170504144900)]
	public class ChangeVisitTopicToGuidIds : Migration
	{
		public override void Up()
		{
			if ((int)Database.ExecuteScalar("SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'CRM' AND TABLE_NAME = 'VisitTopic' AND COLUMN_NAME = 'VisitTopicId' AND DATA_TYPE = 'UNIQUEIDENTIFIER'") == 0)
			{
				Database.ExecuteNonQuery("ALTER TABLE [CRM].[VisitTopic] DROP CONSTRAINT [PK_VisitTopic]");
				Database.ExecuteNonQuery("ALTER TABLE [CRM].[VisitTopic] ADD [VisitTopicIdOld] INT NULL");
				Database.ExecuteNonQuery("UPDATE [CRM].[VisitTopic] SET [VisitTopicIdOld] = [VisitTopicId]");
				Database.ExecuteNonQuery("ALTER TABLE [CRM].[VisitTopic] DROP COLUMN [VisitTopicId]");
				Database.ExecuteNonQuery("ALTER TABLE [CRM].[VisitTopic] ADD [VisitTopicId] UNIQUEIDENTIFIER NOT NULL DEFAULT(NEWSEQUENTIALID())");
				Database.ExecuteNonQuery("ALTER TABLE [CRM].[VisitTopic] ADD CONSTRAINT [PK_VisitTopic] PRIMARY KEY([VisitTopicId])");
			}
		}
	}
}