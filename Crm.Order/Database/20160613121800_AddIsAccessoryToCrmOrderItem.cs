namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20160613121800)]
	public class AddIsAccessoryToCrmOrderItem : Migration
	{
		public override void Up()
		{
			if (!Database.ColumnExists("[CRM].[OrderItem]", "IsAccessory"))
			{
				Database.ExecuteNonQuery("ALTER TABLE [CRM].[OrderItem] ADD IsAccessory BIT NOT NULL DEFAULT(0)");
				Database.ExecuteNonQuery("UPDATE oi SET oi.[IsAccessory] = 1, [ModifyDate] = GETUTCDATE() FROM[CRM].[OrderItem] oi JOIN [CRM].[OrderItem] poi ON oi.[ParentOrderItemKey] = poi.[OrderItemId] WHERE oi.[ParentOrderItemKey] IS NOT NULL AND EXISTS(SELECT TOP 1 NULL FROM[CRM].[ArticleRelationship] ar WHERE ar.[ParentArticleKey] = poi.[ArticleKey] AND ar.[ChildArticleKey] = oi.[ArticleKey] AND ar.[RelationshipType] = 'Accessory' AND ar.[IsActive] = 1)");
			}
		}
	}
}