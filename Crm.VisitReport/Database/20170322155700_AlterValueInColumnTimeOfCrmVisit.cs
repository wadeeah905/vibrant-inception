namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20170322155700)]
	public class AlterValueInColumnTimeOfCrmVisit : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery(@"
				UPDATE CRM.Visit
				SET Time = NULL
				WHERE Time = '00:00:00'
			");
		}
	}
}