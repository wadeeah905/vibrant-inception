namespace Crm.VisitReport.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20170403142700)]
	public class IntroduceVisitAimKeyInCrmVisitReportAndUpdateFromOldStructure : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("[CRM].[VisitReport]", new Column("VisitAimKey", DbType.String, 20, ColumnProperty.Null));
			Database.ExecuteNonQuery(@"
				UPDATE v
				SET v.VisitAimKey = lva.Value
				FROM CRM.VisitReport v
				JOIN CRM.VisitPossibleAim va
					ON va.Text = v.VisitAim
				JOIN LU.VisitAim lva
					ON lva.Value = va.VisitPossibleAimId
					AND lva.Language = 'de'
				WHERE v.VisitAimKey IS NULL
				AND v.VisitAim IS NOT NULL
			");
		}
	}
}