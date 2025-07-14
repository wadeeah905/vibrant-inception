namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20140220163499)]
	public class AddOrderCategoryLookup : Migration
	{
		public override void Up()
		{
			const string tableName = "[LU].[OrderCategory]";
			if (Database.TableExists(tableName))
			{
				return;
			}
			Database.AddTable(tableName,
				new Column("OrderCategoryId", DbType.Int16, ColumnProperty.Identity),
				new Column("Name", DbType.String, 20, ColumnProperty.NotNull),
				new Column("Language", DbType.StringFixedLength, 2, ColumnProperty.NotNull),
				new Column("Favorite", DbType.Boolean, ColumnProperty.NotNull, false),
				new Column("SortOrder", DbType.Int16, ColumnProperty.Null),
				new Column("Value", DbType.String, 30, ColumnProperty.NotNull),
				new Column("AllowedArticleTypeValues", DbType.String, 120, ColumnProperty.Null),
				new Column("Color", DbType.String, 20, ColumnProperty.Null),
				new Column("TenantKey", DbType.Int16, ColumnProperty.Null));
		}
		public override void Down()
		{

		}
	}
}
