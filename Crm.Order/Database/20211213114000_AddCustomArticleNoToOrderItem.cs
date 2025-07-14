namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20211213114000)]
	public class AddCustomArticleNoToOrderItem : Migration
	{
		public override void Up()
		{
			Database.AddColumn("[CRM].[OrderItem]", "CustomArticleNo", System.Data.DbType.String, ColumnProperty.Null);
		}
	}
}
