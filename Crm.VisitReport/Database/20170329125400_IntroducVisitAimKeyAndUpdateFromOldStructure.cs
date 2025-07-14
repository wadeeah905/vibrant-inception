namespace Crm.VisitReport.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20170329125400)]
	public class IntroducVisitAimKeyAndUpdateFromOldStructure : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("[CRM].[Visit]", new Column("VisitAimKey", DbType.String, 20, ColumnProperty.Null));
			Database.ExecuteNonQuery(@"
				UPDATE v
				SET v.VisitAimKey = lva.Value
				FROM CRM.Visit v
				JOIN CRM.VisitPossibleAim va
					ON va.Text = v.Aim
				JOIN LU.VisitAim lva
					ON lva.Value = va.VisitPossibleAimId
					AND lva.Language = 'de'
				WHERE v.VisitAimKey IS NULL
				AND v.Aim IS NOT NULL
			");
		}
	}
}