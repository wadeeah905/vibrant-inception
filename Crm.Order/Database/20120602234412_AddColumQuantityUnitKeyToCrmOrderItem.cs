namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20120602234412)]
	public class AddColumQuantityUnitKeyToCrmOrderItem : Migration
	{
		public override void Up()
		{
			if (!Database.ColumnExists("[CRM].[OrderItem]", "QuantityUnitKey")) 
				Database.ExecuteNonQuery("ALTER TABLE [CRM].[OrderItem] ADD [QuantityUnitKey] nvarchar(10) NOT NULL");
		}
		public override void Down()
		{
		}
	}
}