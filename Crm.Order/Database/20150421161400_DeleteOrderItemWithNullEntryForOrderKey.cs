namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20150421161400)]
	public class DeleteOrderItemWithNullEntryForOrderKey : Migration
	{
		public override void Up()
		{
			if ((int)Database.ExecuteScalar("SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'Crm' AND TABLE_NAME = 'OrderItem' AND COLUMN_NAME = 'OrderKey' and DATA_TYPE = 'int'") == 1)
			{
				Database.ExecuteNonQuery("DELETE FROM CRM.OrderItem WHERE OrderKey IS NULL");
				Database.ExecuteNonQuery("DROP INDEX IX_OrderItem_OrderKey_IsActive ON Crm.OrderItem;");
				Database.ChangeColumn("[Crm].[OrderItem]", new Column("OrderKey", DbType.Int64, ColumnProperty.NotNull));
			}
		}
	}
}