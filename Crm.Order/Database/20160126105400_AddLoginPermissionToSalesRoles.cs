namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20160126105400)]
	public class AddLoginPermissionToSalesRoles : Migration
	{
		public override void Up()
		{
			if ((int)Database.ExecuteScalar("SELECT COUNT(*) FROM [CRM].[Permission] WHERE [PGroup] = 'Login' AND [Name] = 'OfflineCrm'") == 0)
			{
				Database.ExecuteNonQuery("INSERT INTO [CRM].[Permission] (Name, PluginName, PGroup) VALUES ('OfflineCrm', 'Crm.Order', 'Login')");
			}
			if ((int)Database.ExecuteScalar("SELECT COUNT(*) FROM [CRM].[Permission] WHERE [PGroup] = 'Login' AND [Name] = 'MaterialClient'") == 0)
			{
				Database.ExecuteNonQuery("INSERT INTO [CRM].[Permission] (Name, PluginName, PGroup) VALUES ('MaterialClient', 'Main', 'Login')");
			}
			Database.ExecuteNonQuery("INSERT INTO [CRM].[RolePermission] (RoleKey, PermissionKey) SELECT r.[RoleId], p.[PermissionId] FROM [CRM].[Role] r JOIN [CRM].[Permission] p ON 1 = 1 WHERE r.[Name] IN ('FieldSales', 'HeadOfSales', 'InternalSales', 'SalesBackOffice') AND p.[PGroup] = 'Login' AND p.[Name] IN ('MaterialClient', 'OfflineCrm') AND NOT EXISTS (SELECT TOP 1 NULL FROM [CRM].[RolePermission] rp WHERE rp.[RoleKey] = r.[RoleId] AND rp.[PermissionKey] = p.[PermissionId])");
		}
	}
}