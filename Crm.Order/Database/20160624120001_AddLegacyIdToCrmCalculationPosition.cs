namespace Crm.Order.Database
{
    using System.Data;

    using Crm.Library.Data.MigratorDotNet.Framework;
    using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

    [Migration(20160624120001)]
	public class AddLegacyIdToCrmCalculationPosition : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("[CRM].[CalculationPosition]", new Column("LegacyId", DbType.String, 50, ColumnProperty.Null));
		}
	}
}