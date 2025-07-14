namespace Crm.Order.Database
{
	using System;

	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20180517091700)]
	public class RemoveTriggersForVisibilityChanges : Migration
	{
		public override void Up()
		{
			if (Convert.ToInt32(Database.ExecuteScalar("SELECT COUNT(*) FROM sys.triggers WHERE name = 'UpdateOrderOnOrderUserInsert'")) == 1)
			{
				Database.ExecuteNonQuery("DROP TRIGGER [CRM].[UpdateOrderOnOrderUserInsert]");
			}

			if (Convert.ToInt32(Database.ExecuteScalar("SELECT COUNT(*) FROM sys.triggers WHERE name = 'UpdateOrderOnOrderUserUpdate'")) == 1)
			{
				Database.ExecuteNonQuery("DROP TRIGGER [CRM].[UpdateOrderOnOrderUserUpdate]");
			}

			if (Convert.ToInt32(Database.ExecuteScalar("SELECT COUNT(*) FROM sys.triggers WHERE name = 'UpdateOrderOnOrderUserDelete'")) == 1)
			{
				Database.ExecuteNonQuery("DROP TRIGGER [CRM].[UpdateOrderOnOrderUserDelete]");
			}

			if (Convert.ToInt32(Database.ExecuteScalar("SELECT COUNT(*) FROM sys.triggers WHERE name = 'UpdateOrderOnOrderUsergroupInsert'")) == 1)
			{
				Database.ExecuteNonQuery("DROP TRIGGER [CRM].[UpdateOrderOnOrderUsergroupInsert]");
			}

			if (Convert.ToInt32(Database.ExecuteScalar("SELECT COUNT(*) FROM sys.triggers WHERE name = 'UpdateOrderOnOrderUsergroupUpdate'")) == 1)
			{
				Database.ExecuteNonQuery("DROP TRIGGER [CRM].[UpdateOrderOnOrderUsergroupUpdate]");
			}

			if (Convert.ToInt32(Database.ExecuteScalar("SELECT COUNT(*) FROM sys.triggers WHERE name = 'UpdateOrderOnOrderUsergroupDelete'")) == 1)
			{
				Database.ExecuteNonQuery("DROP TRIGGER [CRM].[UpdateOrderOnOrderUsergroupDelete]");
			}
		}
	}
}