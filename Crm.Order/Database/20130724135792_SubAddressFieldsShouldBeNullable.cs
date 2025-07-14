namespace Crm.Order.Database.Migrate
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20130724135792)]
	public class SubAddressFieldsShouldBeNullable : Migration
	{
		public override void Up()
		{
			var deliveryAddressStreetCol = new Column("DeliveryAddressStreet", DbType.String, ColumnProperty.Null);
			Database.ChangeColumn("[Crm].[Order]", deliveryAddressStreetCol);

			var businessPartnerStreetCol = new Column("BusinessPartnerStreet", DbType.String, ColumnProperty.Null);
			Database.ChangeColumn("[Crm].[Order]", businessPartnerStreetCol);

			var billAddressStreetCol = new Column("BillAddressStreet", DbType.String, ColumnProperty.Null);
			Database.ChangeColumn("[Crm].[Order]", billAddressStreetCol);
		}
		public override void Down()
		{
		}
	}
}