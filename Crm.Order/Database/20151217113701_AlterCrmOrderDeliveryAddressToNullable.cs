namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20151217113701)]
	public class AlterCrmOrderDeliveryAddressToNullable : Migration
	{
		public override void Up()
		{
			Database.ChangeColumn("[CRM].[Order]", new Column("DeliveryAddressName", DbType.String, 120, ColumnProperty.Null));
			Database.ChangeColumn("[CRM].[Order]", new Column("DeliveryAddressZipCode", DbType.String, 20, ColumnProperty.Null));
			Database.ChangeColumn("[CRM].[Order]", new Column("DeliveryAddressCity", DbType.String, 120, ColumnProperty.Null));
		}
	}
}