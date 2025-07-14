namespace Crm.Order.Database
{
    using System.Data;

    using Crm.Library.Data.MigratorDotNet.Framework;
    using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

    [Migration(20160205115200)]
	public class AddLegacyIdToCrmOrder : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("[CRM].[Order]", new Column("LegacyId", DbType.String, 50, ColumnProperty.Null));
		}
	}
}