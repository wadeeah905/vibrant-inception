namespace Crm.VisitReport.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20170329093700)]
	public class CarryOverOldVisitAimStructureToLookupStructure : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery(@"
				INSERT INTO [LU].[VisitAim]
					([Name]
					,[Language]
					,[Value]
					,[IsActive])
				SELECT
					Text
					,'de'
					,VisitPossibleAimId
					,1
				FROM CRM.VisitPossibleAim
				UNION ALL
				SELECT
					Text
					,'en'
					,VisitPossibleAimId
					,1
				FROM CRM.VisitPossibleAim
			");
		}
	}
}