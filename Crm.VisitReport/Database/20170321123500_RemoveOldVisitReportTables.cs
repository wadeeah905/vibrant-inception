namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20170321123500)]
	public class RemoveOldVisitReportTables : Migration
	{
		public override void Up()
		{
			Database.RemoveTableIfExisting("[CRM].[OLD_Visit]");
			Database.RemoveTableIfExisting("[CRM].[OLD_VisitReport]");
		}
	}
}