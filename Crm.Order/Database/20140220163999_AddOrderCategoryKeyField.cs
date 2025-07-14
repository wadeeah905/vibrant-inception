namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20140220163999)]
	public class AddOrderCategoryKeyField : Migration
	{
		public override void Up()
		{
			const string colName = "OrderCategoryKey";
			const string tableName = "[CRM].[Order]";
			if (Database.ColumnExists(tableName, colName))
			{
				return;
			}
			Database.AddColumn(tableName, new Column(colName, DbType.String, 20, ColumnProperty.Null));
		}
		public override void Down()
		{

		}
	}
}
