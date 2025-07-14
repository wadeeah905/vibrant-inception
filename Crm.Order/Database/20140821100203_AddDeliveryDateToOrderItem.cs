namespace Crm.Order.Database
{
	using System.Data;
	
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20140821100203)]
	public class AddDeliveryDateToOrderItem : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("CRM.OrderItem", new Column("DeliveryDate", DbType.DateTime));
		}
		public override void Down()
		{

		}
	}
}
