namespace Crm.Order.Database
{
    using System.Data;

    using Crm.Library.Data.MigratorDotNet.Framework;
    using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

    [Migration(20160205115201)]
	public class AddLegacyIdToCrmOrderItem : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("[CRM].[OrderItem]", new Column("LegacyId", DbType.String, 50, ColumnProperty.Null));
		}
	}
}