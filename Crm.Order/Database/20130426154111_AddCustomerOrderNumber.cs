namespace Crm.Order.Database.Migrate
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130426154111)]
	public class AddCustomerOrderNumber : Migration
	{
		public override void Up()
		{
			if (!Database.ColumnExists("[CRM].[Order]", "CustomerOrderNumber"))
				Database.ExecuteNonQuery("ALTER TABLE [CRM].[Order] ADD [CustomerOrderNumber] [nvarchar](256)");
		}
		public override void Down()
		{
		}
	}
}