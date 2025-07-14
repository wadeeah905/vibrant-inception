namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20160802133902)]
	public class AddOrderEntryTypeToCrmOrder : Migration
	{
		public override void Up()
		{
			if (!Database.ColumnExists("[CRM].[Order]", "OrderEntryType"))
			{
				Database.AddColumn("[CRM].[Order]", new Column("OrderEntryType", DbType.String, 20, ColumnProperty.Null));
				Database.ExecuteNonQuery("UPDATE [CRM].[Order] SET [OrderEntryType] = 'SingleDelivery' WHERE [DeliveryDate] IS NOT NULL");
				Database.ExecuteNonQuery("UPDATE [CRM].[Order] SET [OrderEntryType] = 'MultiDelivery' WHERE [DeliveryDate] IS NULL");
				Database.ChangeColumn("[CRM].[Order]", new Column("OrderEntryType", DbType.String, 20, ColumnProperty.NotNull));
			}
		}
	}
}