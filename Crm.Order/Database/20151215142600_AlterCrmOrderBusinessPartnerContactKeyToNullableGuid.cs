namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20151215142600)]
	public class AlterCrmOrderBusinessPartnerContactKeyToNullableGuid : Migration
	{
		public override void Up()
		{
			Database.ChangeColumn("[CRM].[Order]", new Column("BusinessPartnerContactKey", DbType.Guid, ColumnProperty.Null));
		}
	}
}