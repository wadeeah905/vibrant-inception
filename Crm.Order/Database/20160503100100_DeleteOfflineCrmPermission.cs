namespace Crm.Order.Database
{
	using Crm.Library.Data.MigratorDotNet.Framework;

	[Migration(20160503100100)]
	public class DeleteOfflineCrmPermission : Migration
	{
		public override void Up()
		{
			Database.ExecuteNonQuery("DELETE up FROM [CRM].[UserPermission] up JOIN [CRM].[Permission] p ON p.[PermissionId] = up.[PermissionKey] WHERE p.[PGroup] = 'Login' AND p.[Name] = 'OfflineCrm'");
			Database.ExecuteNonQuery("DELETE rp FROM [CRM].[RolePermission] rp JOIN [CRM].[Permission] p ON p.[PermissionId] = rp.[PermissionKey] WHERE p.[PGroup] = 'Login' AND p.[Name] = 'OfflineCrm'");
			Database.ExecuteNonQuery("DELETE FROM [CRM].[Permission] WHERE [PGroup] = 'Login' AND [Name] = 'OfflineCrm'");
		}
	}
}