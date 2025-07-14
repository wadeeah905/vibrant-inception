namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20220113061600)]
	public class AddAdditionalInformationToOrderItem : Migration
	{
		public override void Up()
		{
			Database.AddColumn("[CRM].[OrderItem]", "AdditionalInformation", System.Data.DbType.String, ColumnProperty.Null);
		}
	}
}
