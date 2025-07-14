namespace Crm.VisitReport.Database
{
    using System.Data;

    using Crm.Library.Data.MigratorDotNet.Framework;
    using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

    [Migration(20130822103600)]
    public class AddTheFieldCarbonCopyToVisitReport : Migration
	{
		public override void Up()
		{
            Database.AddColumnIfNotExisting("[CRM].[VisitReport]", new Column("[CarbonCopy]", DbType.String, 250, ColumnProperty.Null));
		}

		public override void Down()
		{
		}
	}
}