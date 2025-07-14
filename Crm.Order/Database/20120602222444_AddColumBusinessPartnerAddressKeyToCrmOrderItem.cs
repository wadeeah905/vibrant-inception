namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20120602222444)]
	public class AddColumBusinessPartnerAddressKeyToCrmOrderItem : Migration
	{
		public override void Up()
		{
			if (!Database.ColumnExists("[CRM].[Order]", "BusinessPartnerAddressKey")) 
				Database.ExecuteNonQuery("ALTER TABLE [CRM].[Order] ADD [BusinessPartnerAddressKey] int NOT NULL");
		}
		public override void Down()
		{
		}
	}
}