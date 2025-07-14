namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20151217113702)]
	public class AlterCrmOrderBillAddressToNullable : Migration
	{
		public override void Up()
		{
			Database.ChangeColumn("[CRM].[Order]", new Column("BillAddressName", DbType.String, 120, ColumnProperty.Null));
			Database.ChangeColumn("[CRM].[Order]", new Column("BillAddressZipCode", DbType.String, 20, ColumnProperty.Null));
			Database.ChangeColumn("[CRM].[Order]", new Column("BillAddressCity", DbType.String, 120, ColumnProperty.Null));
		}
	}
}