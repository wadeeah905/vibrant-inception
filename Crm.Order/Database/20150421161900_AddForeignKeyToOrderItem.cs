namespace Crm.Order.Database
{
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20150421161900)]
	public class AddForeignKeyToOrderItem : Migration
	{
		public override void Up()
		{
			if ((int)Database.ExecuteScalar("SELECT COUNT(*) FROM sys.objects WHERE NAME = 'FK_OrderItem_Order'") == 0)
			{
				var stringBuilder = new StringBuilder();

				stringBuilder.AppendLine("ALTER TABLE [CRM].[OrderItem]  WITH NOCHECK ADD  CONSTRAINT [FK_OrderItem_Order] FOREIGN KEY([OrderKey])");
				stringBuilder.AppendLine("REFERENCES [CRM].[Order] ([OrderId])");

				stringBuilder.AppendLine("ALTER TABLE [CRM].[OrderItem] CHECK CONSTRAINT [FK_OrderItem_Order]");

				Database.ExecuteNonQuery(stringBuilder.ToString());
			}
		}
	}
}