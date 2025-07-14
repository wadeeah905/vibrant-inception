namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20150413133900)]
	public class AlterCrmOrderItemArticleKey : Migration
	{
		public override void Up()
		{
			var hasArticleIdChangedToGuid = (int)Database.ExecuteScalar("SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'Crm' AND TABLE_NAME = 'Article' AND COLUMN_NAME = 'ArticleId' and DATA_TYPE = 'uniqueidentifier'") == 1;
			if (!hasArticleIdChangedToGuid)
			{
				Database.ChangeColumn("[CRM].[OrderItem]", new Column("ArticleKey", DbType.Int32, ColumnProperty.Null));
			}
			else
			{
				Database.ExecuteNonQuery(@"IF NOT EXISTS (SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='CRM' AND TABLE_NAME='OrderItem' AND COLUMN_NAME='ArticleKey' AND DATA_TYPE = 'uniqueidentifier')
				BEGIN
					EXEC sp_rename '[CRM].[OrderItem].[ArticleKey]', 'ArticleKeyOld', 'COLUMN'
					ALTER TABLE [CRM].[OrderItem] ALTER COLUMN [ArticleKeyOld] int NULL
					ALTER TABLE [CRM].[OrderItem] ADD [ArticleKey] uniqueidentifier NULL
					EXEC('UPDATE a SET a.[ArticleKey] = b.[ContactId] FROM [CRM].[OrderItem] a Join [CRM].[Contact] b ON a.[ArticleKeyOld] = b.[ContactIdOld]')
				END");
			}
		}
	}
}