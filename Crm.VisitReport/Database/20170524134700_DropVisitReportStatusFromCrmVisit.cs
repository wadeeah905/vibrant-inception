namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20170524134700)]
	public class DropVisitReportStatusFromCrmVisit : Migration
	{
		public override void Up()
		{
			Database.RemoveColumnIfExisting("CRM.Visit", "VisitReportStatus");
		}
	}
}