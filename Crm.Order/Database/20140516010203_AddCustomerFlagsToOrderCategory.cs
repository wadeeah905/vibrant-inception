namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20140516010203)]
	public class AddCustomerFlagsToOrderCategory : Migration
	{
		public override void Up()
		{
			const string tableName = "[LU].[OrderCategory]";
			const string colName = "CustomerFlags";

			Database.AddColumn(tableName, new Column(colName, DbType.String, 120, ColumnProperty.Null));
		}
		public override void Down()
		{

		}
	}
}
