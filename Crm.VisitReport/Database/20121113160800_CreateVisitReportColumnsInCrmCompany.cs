namespace Crm.VisitReport.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20121113160800)]
	public class CreateVisitReportColumnsInCrmCompany : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("CRM.Company", new Column("VisitFrequencyValue", DbType.Int32, ColumnProperty.Null));
			Database.AddColumnIfNotExisting("CRM.Company", new Column("VisitFrequencyTimeUnitKey", DbType.String, 20, ColumnProperty.Null));
		}
		public override void Down()
		{
			Database.RemoveColumnIfExisting("CRM.Company", "VisitFrequencyValue");
			Database.RemoveColumnIfExisting("CRM.Company", "VisitFrequencyTimeUnitKey");
		}
	}
}