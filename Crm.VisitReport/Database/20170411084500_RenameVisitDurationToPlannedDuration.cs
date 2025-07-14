namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20170411084500)]
	public class RenameVisitDurationToPlannedDuration : Migration
	{
		public override void Up()
		{
			Database.RenameColumn("[Crm].[Visit]", "VisitDuration", "PlannedDuration");
		}
	}
}