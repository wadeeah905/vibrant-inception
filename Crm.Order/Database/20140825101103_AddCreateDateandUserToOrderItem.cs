namespace Crm.Order.Database
{
	using System.Data;
	
	using Crm.Library.Data.MigratorDotNet.Framework;
	using Crm.Library.Data.MigratorDotNet.Migrator.Extensions;

	[Migration(20140825101103)]
	public class AddCreateDateandUserToOrderItem : Migration
	{
		public override void Up()
		{
			Database.AddColumnIfNotExisting("CRM.OrderItem", new Column("CreateDate", DbType.DateTime));
			Database.AddColumnIfNotExisting("CRM.OrderItem", new Column("CreateUser", DbType.String, 120));
			Database.AddColumnIfNotExisting("CRM.OrderItem", new Column("ModifyUser", DbType.String, 120));
		}
		public override void Down()
		{

		}
	}
}
