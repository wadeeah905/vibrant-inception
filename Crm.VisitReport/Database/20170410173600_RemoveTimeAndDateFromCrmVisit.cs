namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20170410173600)]
	public class RemoveTimeAndDateFromCrmVisit : Migration
	{
		public override void Up()
		{
			Database.RemoveColumn("[Crm].[Visit]", "Time");
			Database.RemoveColumn("[Crm].[Visit]", "Date");
		}
	}
}