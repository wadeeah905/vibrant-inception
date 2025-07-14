namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20170410174500)]
	public class RenameAimToCustomAimOfCrmVisit : Migration
	{
		public override void Up()
		{
			Database.RenameColumn("[Crm].[Visit]", "Aim", "CustomAim");
		}
	}
}