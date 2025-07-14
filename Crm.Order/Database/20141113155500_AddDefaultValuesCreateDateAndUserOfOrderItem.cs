namespace Crm.Order.Database
{
	using System.Data;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20141113160800)]
	public class AddDefaultValuesCreateDateAndUserOfOrderItem : Migration
	{
		public override void Up()
		{
			if (Database.ColumnExists("[CRM].[OrderItem]", "CreateDate") && !Database.ConstraintExists("[CRM].[OrderItem]", "[DF_OrderItem_CreateDate]"))
			{
				Database.ExecuteNonQuery("ALTER TABLE [CRM].[OrderItem] ADD CONSTRAINT [DF_OrderItem_CreateDate] DEFAULT GETUTCDATE() FOR CreateDate");
				Database.ExecuteNonQuery("UPDATE [CRM].[OrderItem] SET CreateDate = GETUTCDATE() WHERE CreateDate IS NULL");
				Database.ChangeColumn("[CRM].[OrderItem]", new Column("CreateDate", DbType.DateTime, ColumnProperty.NotNull));
			}
			if (Database.ColumnExists("[CRM].[OrderItem]", "ModifyDate") && !Database.ConstraintExists("[CRM].[OrderItem]", "[DF_OrderItem_ModifyDate]"))
			{
				Database.ExecuteNonQuery("ALTER TABLE [CRM].[OrderItem] ADD CONSTRAINT [DF_OrderItem_ModifyDate] DEFAULT GETUTCDATE() FOR ModifyDate");
				Database.ExecuteNonQuery("UPDATE [CRM].[OrderItem] SET ModifyDate = GETUTCDATE() WHERE ModifyDate IS NULL");
				Database.ChangeColumn("[CRM].[OrderItem]", new Column("ModifyDate", DbType.DateTime, ColumnProperty.NotNull));
			}
			if (Database.ColumnExists("[CRM].[OrderItem]", "CreateUser") && !Database.ConstraintExists("[CRM].[OrderItem]", "[DF_OrderItem_CreateUser]"))
			{
				Database.ExecuteNonQuery("ALTER TABLE [CRM].[OrderItem] ADD CONSTRAINT [DF_OrderItem_CreateUser] DEFAULT '' FOR CreateUser");
				Database.ExecuteNonQuery("UPDATE [CRM].[OrderItem] SET CreateUser = '' WHERE CreateUser IS NULL");
				Database.ChangeColumn("[CRM].[OrderItem]", new Column("CreateUser", DbType.String, 120, ColumnProperty.NotNull));
			}
			if (Database.ColumnExists("[CRM].[OrderItem]", "ModifyUser") && !Database.ConstraintExists("[CRM].[OrderItem]", "[DF_OrderItem_ModifyUser]"))
			{
				Database.ExecuteNonQuery("ALTER TABLE [CRM].[OrderItem] ADD CONSTRAINT [DF_OrderItem_ModifyUser] DEFAULT '' FOR ModifyUser");
				Database.ExecuteNonQuery("UPDATE [CRM].[OrderItem] SET ModifyUser = '' WHERE ModifyUser IS NULL");
				Database.ChangeColumn("[CRM].[OrderItem]", new Column("ModifyUser", DbType.String, 120, ColumnProperty.NotNull));
			}
		}
		public override void Down()
		{
		}
	}
}