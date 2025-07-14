namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20140422122426)]
	public class ChangeOrderItemToHighLowIds : Migration
	{
		private const int Low = 32;
		public override void Up()
		{
			Database.ExecuteNonQuery("ALTER TABLE [CRM].[OrderItem] DROP CONSTRAINT PK_OrderItem");
			Database.RenameColumn("[CRM].[OrderItem]", "OrderItemId", "Id_Identity");
			Database.ExecuteNonQuery("ALTER TABLE [CRM].[OrderItem] ADD OrderItemId bigint NULL");
			Database.ExecuteNonQuery("UPDATE [CRM].[OrderItem] SET OrderItemId = Id_Identity");
			Database.ExecuteNonQuery("ALTER TABLE [CRM].[OrderItem] ALTER COLUMN OrderItemId bigint NOT NULL");
			Database.ExecuteNonQuery("ALTER TABLE [CRM].[OrderItem] DROP COLUMN Id_Identity");
			Database.ExecuteNonQuery("ALTER TABLE [CRM].[OrderItem] ADD CONSTRAINT PK_OrderItem PRIMARY KEY(OrderItemId)");

			var hibernateUniqueKeyTableExists = (int)Database.ExecuteScalar("SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'hibernate_unique_key'") > 0;
			var hibernateUniqueKeyTableName = hibernateUniqueKeyTableExists ? "hibernate_unique_key" : "hibernate_unique_key_old";
			Database.ExecuteNonQuery(string.Format("BEGIN IF ((SELECT COUNT(*) FROM dbo.{0} WHERE tablename = '[CRM].[OrderItem]') = 0) " +
			                         "INSERT INTO {0} (next_hi, tablename) values ((select (COALESCE(max(OrderItemId), 0) / " + Low + ") " +
			                         "+ 1 from [CRM].[OrderItem] where OrderItemId is not null), '[CRM].[OrderItem]') END", hibernateUniqueKeyTableName));
		}
		public override void Down()
		{
		}
	}
}