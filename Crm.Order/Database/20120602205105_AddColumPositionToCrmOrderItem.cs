namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20120602205105)]
	public class _AddColumPositionToCrmOrderItem : Migration
	{
		public override void Up()
		{
			if (!Database.ColumnExists("[CRM].[OrderItem]", "Position")) 
				Database.ExecuteNonQuery("ALTER TABLE [CRM].[OrderItem] ADD [Position] int NOT NULL");
		}
		public override void Down()
		{
		}
	}
}