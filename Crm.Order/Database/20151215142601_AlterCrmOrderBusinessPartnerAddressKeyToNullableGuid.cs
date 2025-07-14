namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20151215142601)]
	public class AlterCrmOrderBusinessPartnerAddressKeyToNullableGuid : Migration
	{
		public override void Up()
		{
			Database.ChangeColumn("[CRM].[Order]", new Column("BusinessPartnerAddressKey", DbType.Guid, ColumnProperty.Null));
		}
	}
}