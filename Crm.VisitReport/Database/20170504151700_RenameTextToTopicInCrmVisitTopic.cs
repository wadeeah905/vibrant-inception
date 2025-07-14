namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20170504151700)]
	public class RenameTextToTopicInCrmVisitTopic : Migration
	{
		public override void Up()
		{
			if (Database.ColumnExists("[CRM].[VisitTopic]", "Text") && !Database.ColumnExists("[CRM].[VisitTopic]", "Topic"))
			{
				Database.RenameColumn("[CRM].[VisitTopic]", "Text", "Topic");
			}
		}
	}
}