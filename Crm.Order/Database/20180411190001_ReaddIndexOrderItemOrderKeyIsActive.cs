namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20180411190001)]
	public class ReaddIndexOrderItemOrderKeyIsActive : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery("CREATE NONCLUSTERED INDEX [IX_OrderItem_OrderKey_IsActive] ON [CRM].[OrderItem] ([OrderKey] ASC, [IsActive] ASC)");
		}
	}
}