namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20120602234742)]
	public class RenameColumQuantityInCrmOrderItem : Migration
	{
		public override void Up()
		{
			if (Database.ColumnExists("[CRM].[OrderItem]", "Quantity"))
				Database.ExecuteNonQuery("sp_rename '[Crm].[OrderItem].[Quantity]', '[QuantityValue]', 'COLUMN'");
		}
		public override void Down()
		{
		}
	}
}