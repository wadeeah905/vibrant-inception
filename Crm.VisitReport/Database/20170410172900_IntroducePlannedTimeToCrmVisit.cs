namespace Crm.VisitReport.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20170410172900)]
	public class IntroducePlannedTimeToCrmVisit : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("[Crm].[Visit]", new Column("PlannedTime", DbType.DateTime, ColumnProperty.Null));
			Database.ExecuteNonQuery(@"
				UPDATE CRM.Visit
				SET PlannedTime = CAST(DATEFROMPARTS(YEAR(Date), MONTH(Date), DAY(Date)) AS DATETIME) + CAST(Time AS DATETIME)
				WHERE DATE IS NOT NULL
				AND Time IS NOT NULL
			");
		}
	}
}