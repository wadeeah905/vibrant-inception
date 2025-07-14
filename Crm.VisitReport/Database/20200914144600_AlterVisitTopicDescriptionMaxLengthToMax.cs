namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20200914144600)]
	public class AlterVisitTopicDescriptionMaxLengthToMax : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery("ALTER TABLE [CRM].[VisitTopic] ALTER COLUMN Description nvarchar(max)");
			Database.ExecuteNonQuery("ALTER TABLE [CRM].[VisitTopic] ALTER COLUMN Topic nvarchar(max)");
		}
	}
}
