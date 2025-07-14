namespace Crm.Order.Database
{
	using System.Text;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20150421154400)]
	public class AddIndexToCrmOrderItem : Migration
	{
		public override void Up()
		{
			if ((int)Database.ExecuteScalar("SELECT COUNT(*) FROM sys.indexes WHERE NAME = 'IX_OrderItem_OrderKey_IsActive'") == 0)
			{
				var stringBuilder = new StringBuilder();

				stringBuilder.AppendLine("CREATE NONCLUSTERED INDEX [IX_OrderItem_OrderKey_IsActive] ON [CRM].[OrderItem]");
				stringBuilder.AppendLine("(");
				stringBuilder.AppendLine("	[OrderKey] ASC,");
				stringBuilder.AppendLine("	[IsActive] ASC");
				stringBuilder.AppendLine(")");
				stringBuilder.AppendLine("INCLUDE (OrderItemId, Position, ArticleKey, ArticleNo, ArticleDescription, CustomDescription,");
				stringBuilder.AppendLine("QuantityValue, DeliveryDate, QuantityUnitKey, IsCarDump, IsSample, IsRemoval, IsSerial,");
				stringBuilder.AppendLine("Price, Discount, DiscountType, CreateDate, ModifyDate, CreateUser, ModifyUser, TenantKey)");
				stringBuilder.AppendLine("WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]");

				Database.ExecuteNonQuery(stringBuilder.ToString());
			}
		}
	}
}