namespace Crm.Order.Database.Migrate
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130408153515)]
	public class AddPriceAndDiscount : Migration
	{
		public override void Up()
		{
			if (!Database.ColumnExists("[CRM].[OrderItem]", "Price"))
				Database.ExecuteNonQuery("ALTER TABLE [CRM].[OrderItem] ADD [Price] DECIMAL(19,4) NOT NULL DEFAULT(0)");

			if (!Database.ColumnExists("[CRM].[OrderItem]", "Discount"))
				Database.ExecuteNonQuery("ALTER TABLE [CRM].[OrderItem] ADD [Discount] DECIMAL(19,4) NOT NULL DEFAULT(0)");

			if (!Database.ColumnExists("[CRM].[OrderItem]", "DiscountType"))
				Database.ExecuteNonQuery("ALTER TABLE [CRM].[OrderItem] ADD [DiscountType] INT NOT NULL DEFAULT(1)");

			if (!Database.ColumnExists("[CRM].[Order]", "Price"))
				Database.ExecuteNonQuery("ALTER TABLE [CRM].[Order] ADD [Price] DECIMAL(19,4) NOT NULL DEFAULT(0)");

			if (!Database.ColumnExists("[CRM].[Order]", "Discount"))
				Database.ExecuteNonQuery("ALTER TABLE [CRM].[Order] ADD [Discount] DECIMAL(19,4) NOT NULL DEFAULT(0)");

			if (!Database.ColumnExists("[CRM].[Order]", "DiscountType"))
				Database.ExecuteNonQuery("ALTER TABLE [CRM].[Order] ADD [DiscountType] INT NOT NULL DEFAULT(1)");
		}
		public override void Down()
		{
		}
	}
}