namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20120403153943)]
	public class MakeColumnVisitReportKeyInCrmVisitReportAnswerNullable : Migration
	{
		public override void Up()
		{
			if (Database.TableExists("[CRM].[VisitReportAnswer]"))
				Database.ExecuteNonQuery("ALTER TABLE [CRM].[VisitReportAnswer] ALTER COLUMN VisitReportKey int null");
		}
		public override void Down()
		{
		}
	}
}