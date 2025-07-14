namespace Crm.Order.Database.Migrate
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130513094751)]
	public class AlterOrderItemQuantityValueColumnToDecimal : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery("ALTER TABLE [CRM].[OrderItem] ALTER COLUMN [QuantityValue] [decimal](21, 2) NOT NULL");
		}
		public override void Down()
		{
		}
	}
}