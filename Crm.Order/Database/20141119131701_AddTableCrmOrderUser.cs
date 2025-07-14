namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	using ForeignKeyConstraint = Crm.Library.Data.MigratorDotNet.Framework.ForeignKeyConstraint;

	[Migration(20141119131701)]
	public class AddTableCrmOrderUser : Migration
	{
		public override void Up()
		{
			if (!Database.TableExists("[CRM].[OrderUser]"))
			{
				Database.AddTable("[CRM].[OrderUser]",
					new Column("OrderKey", DbType.Int64, ColumnProperty.NotNull),
					new Column("Username", DbType.String, 256, ColumnProperty.NotNull),
					new Column("TenantKey", DbType.Int32, ColumnProperty.Null));
				Database.AddPrimaryKey("PK_OrderUser", "[CRM].[OrderUser]", "OrderKey", "Username");
				Database.AddForeignKey("FK_OrderUser_Order", "[CRM].[OrderUser]", "OrderKey", "[CRM].[Order]", "OrderId", ForeignKeyConstraint.Cascade);
				Database.AddForeignKey("FK_OrderUser_User", "[CRM].[OrderUser]", "Username", "[CRM].[User]", "Username", ForeignKeyConstraint.Cascade);
			}
		}
	}
}