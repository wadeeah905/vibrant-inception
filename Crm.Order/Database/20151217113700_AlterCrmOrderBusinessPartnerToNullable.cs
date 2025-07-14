namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20151217113700)]
	public class AlterCrmOrderBusinessPartnerToNullable : Migration
	{
		public override void Up()
		{
			Database.ChangeColumn("[CRM].[Order]", new Column("BusinessPartnerName", DbType.String, 120, ColumnProperty.Null));
			Database.ChangeColumn("[CRM].[Order]", new Column("BusinessPartnerZipCode", DbType.String, 20, ColumnProperty.Null));
			Database.ChangeColumn("[CRM].[Order]", new Column("BusinessPartnerCity", DbType.String, 120, ColumnProperty.Null));
		}
	}
}