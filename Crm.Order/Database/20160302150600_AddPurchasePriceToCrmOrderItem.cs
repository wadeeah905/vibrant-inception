namespace Crm.Order.Database
{
    using System.Data;

    using Crm.Library.Data.MigratorDotNet.Framework;
    using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

    [Migration(20160302150600)]
	public class AddPurchasePriceToCrmOrderItem : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("[CRM].[OrderItem]", new Column("PurchasePrice", DbType.Decimal, ColumnProperty.Null));
		}
	}
}