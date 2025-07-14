namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20140225101010)]
	public class AddAllowedArticleGroupsToOrderCategory : Migration
	{
		public override void Up()
		{
			const string tableName = "[LU].[OrderCategory]";
			const string colName = "AllowedArticleGroupValues";

			Database.AddColumn(tableName, new Column(colName, DbType.String, 120, ColumnProperty.Null));
		}
		public override void Down()
		{

		}
	}
}
