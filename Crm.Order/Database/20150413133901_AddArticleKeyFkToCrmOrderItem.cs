namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20150413133901)]
	public class AddArticleKeyFkToCrmOrderItem : Migration
	{
		public override void Up()
		{
			if ((int)Database.ExecuteScalar("SELECT COUNT(*) FROM sys.foreign_keys WHERE name = 'FK_OrderItem_Article'") == 0)
			{
				Database.ExecuteNonQuery("UPDATE oi SET oi.[ArticleKey] = NULL FROM [CRM].[OrderItem] oi LEFT OUTER JOIN [CRM].[Article] a on oi.[ArticleKey] = a.[ArticleId] WHERE a.[ArticleId] IS NULL");
				Database.AddForeignKey("FK_OrderItem_Article", "[CRM].[OrderItem]", "ArticleKey", "[CRM].[Article]", "ArticleId", ForeignKeyConstraint.SetNull);
			}
		}
	}
}