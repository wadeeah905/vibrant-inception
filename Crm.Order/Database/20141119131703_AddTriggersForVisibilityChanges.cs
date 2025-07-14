namespace Crm.Order.Database
{
	using System;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20141119131703)]
	public class AddTriggersForVisibilityChanges : Migration
	{
		public override void Up()
		{
			{
				var action = Convert.ToInt32(Database.ExecuteScalar("SELECT COUNT(*) FROM sys.triggers WHERE name = 'UpdateOrderOnOrderUserInsert'")) == 0 ? "CREATE" : "ALTER";
				Database.ExecuteNonQuery(action + " TRIGGER [CRM].[UpdateOrderOnOrderUserInsert] " +
																 "ON [CRM].[OrderUser] FOR INSERT AS " +
																 "BEGIN " +
																 "SET NOCOUNT ON; " +
																 "UPDATE [CRM].[Order] SET [ModifyDate] = GETUTCDATE() WHERE [OrderId] IN (SELECT [OrderKey] FROM inserted) " +
																 "END");
			}
			{
				var action = Convert.ToInt32(Database.ExecuteScalar("SELECT COUNT(*) FROM sys.triggers WHERE name = 'UpdateOrderOnOrderUserUpdate'")) == 0 ? "CREATE" : "ALTER";
				Database.ExecuteNonQuery(action + " TRIGGER [CRM].[UpdateOrderOnOrderUserUpdate] " +
																			 "ON  [CRM].[OrderUser] FOR UPDATE AS " +
																			 "BEGIN " +
																			 "SET NOCOUNT ON; " +
																			 "UPDATE [CRM].[Order] SET [ModifyDate] = GETUTCDATE() WHERE [OrderId] IN (SELECT [OrderKey] FROM inserted) " +
																			 "END");
			}
			{
				var action = Convert.ToInt32(Database.ExecuteScalar("SELECT COUNT(*) FROM sys.triggers WHERE name = 'UpdateOrderOnOrderUserDelete'")) == 0 ? "CREATE" : "ALTER";
				Database.ExecuteNonQuery(action + " TRIGGER [CRM].[UpdateOrderOnOrderUserDelete] " +
																 "ON  [CRM].[OrderUser] FOR DELETE AS " +
																 "BEGIN " +
																 "SET NOCOUNT ON; " +
																 "UPDATE [CRM].[Order] SET [ModifyDate] = GETUTCDATE() WHERE [OrderId] IN (SELECT [OrderKey] FROM deleted) " +
																 "END");
			}
			{
				var action = Convert.ToInt32(Database.ExecuteScalar("SELECT COUNT(*) FROM sys.triggers WHERE name = 'UpdateOrderOnOrderUsergroupInsert'")) == 0 ? "CREATE" : "ALTER";
				Database.ExecuteNonQuery(action + " TRIGGER [CRM].[UpdateOrderOnOrderUsergroupInsert] " +
																 "ON [CRM].[OrderUsergroup] FOR INSERT AS " +
																 "BEGIN " +
																 "SET NOCOUNT ON; " +
																 "UPDATE [CRM].[Order] SET [ModifyDate] = GETUTCDATE() WHERE [OrderId] IN (SELECT [OrderKey] FROM inserted) " +
																 "END");
			}
			{
				var action = Convert.ToInt32(Database.ExecuteScalar("SELECT COUNT(*) FROM sys.triggers WHERE name = 'UpdateOrderOnOrderUsergroupUpdate'")) == 0 ? "CREATE" : "ALTER";
				Database.ExecuteNonQuery(action + " TRIGGER [CRM].[UpdateOrderOnOrderUsergroupUpdate] " +
																			 "ON  [CRM].[OrderUsergroup] FOR UPDATE AS " +
																			 "BEGIN " +
																			 "SET NOCOUNT ON; " +
																			 "UPDATE [CRM].[Order] SET [ModifyDate] = GETUTCDATE() WHERE [OrderId] IN (SELECT [OrderKey] FROM inserted) " +
																			 "END");
			}
			{
				var action = Convert.ToInt32(Database.ExecuteScalar("SELECT COUNT(*) FROM sys.triggers WHERE name = 'UpdateOrderOnOrderUsergroupDelete'")) == 0 ? "CREATE" : "ALTER";
				Database.ExecuteNonQuery(action + " TRIGGER [CRM].[UpdateOrderOnOrderUsergroupDelete] " +
																 "ON  [CRM].[OrderUsergroup] FOR DELETE AS " +
																 "BEGIN " +
																 "SET NOCOUNT ON; " +
																 "UPDATE [CRM].[Order] SET [ModifyDate] = GETUTCDATE() WHERE [OrderId] IN (SELECT [OrderKey] FROM deleted) " +
																 "END");
			}
		}
	}
}