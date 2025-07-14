namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20140422122425)]
	public class ChangeOrderToHighLowIds : Migration
	{
		private const int Low = 32;
		public override void Up()
		{
			Database.ExecuteNonQuery("ALTER TABLE [CRM].[Order] DROP CONSTRAINT PK_Order");
			Database.RenameColumn("[CRM].[Order]", "OrderId", "Id_Identity");
			Database.ExecuteNonQuery("ALTER TABLE [CRM].[Order] ADD OrderId bigint NULL");
			Database.ExecuteNonQuery("UPDATE [CRM].[Order] SET OrderId = Id_Identity");
			Database.ExecuteNonQuery("ALTER TABLE [CRM].[Order] ALTER COLUMN OrderId bigint NOT NULL");
			Database.ExecuteNonQuery("ALTER TABLE [CRM].[Order] DROP COLUMN Id_Identity");
			Database.ExecuteNonQuery("ALTER TABLE [CRM].[Order] ADD CONSTRAINT PK_Order PRIMARY KEY(OrderId)");

			var hibernateUniqueKeyTableExists = (int)Database.ExecuteScalar("SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'hibernate_unique_key'") > 0;
			var hibernateUniqueKeyTableName = hibernateUniqueKeyTableExists ? "hibernate_unique_key" : "hibernate_unique_key_old";
			Database.ExecuteNonQuery(string.Format("BEGIN IF ((SELECT COUNT(*) FROM dbo.{0} WHERE tablename = '[CRM].[Order]') = 0) " +
															 "INSERT INTO {0} (next_hi, tablename) values ((select (COALESCE(max(OrderId), 0) / " + Low + ") " +
			                         "+ 1 from [CRM].[Order] where OrderId is not null), '[CRM].[Order]') END", hibernateUniqueKeyTableName));
		}
		public override void Down()
		{
		}
	}
}