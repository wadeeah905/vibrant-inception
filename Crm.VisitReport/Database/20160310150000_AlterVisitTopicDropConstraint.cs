namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20160310150000)]
	public class AlterVisitTopicDropConstraint : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery(
				@"IF EXISTS (SELECT * from sys.objects where name = 'FK_VisitTopic_Visit')
					ALTER TABLE [CRM].[VisitTopic] DROP CONSTRAINT [FK_VisitTopic_Visit]"
				);
		}
	}
}
