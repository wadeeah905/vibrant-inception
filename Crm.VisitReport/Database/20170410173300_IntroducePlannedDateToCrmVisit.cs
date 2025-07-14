namespace Crm.VisitReport.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20170410173300)]
	public class IntroducePlannedDateToCrmVisit : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("[Crm].[Visit]", new Column("PlannedDate", DbType.DateTime, ColumnProperty.Null));
			Database.ExecuteNonQuery(@"
				UPDATE CRM.Visit
				SET PlannedDate = CAST(Date AS DATETIME) + CAST(Time AS DATETIME)
				WHERE Time IS NOT NULL
			");
		}
	}
}