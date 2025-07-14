namespace Crm.Service.Controllers.ActionRoleProvider
{
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;

	public class AccountActionRoleProvider : RoleCollectorBase
	{
		public AccountActionRoleProvider(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
			Add(MainPlugin.PermissionGroup.UserAccount, MainPlugin.PermissionName.ExportDropboxAddressAsVCard, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServicePlanner);
			Add(MainPlugin.PermissionGroup.UserAccount, PermissionName.Settings, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServicePlanner);
			Add(MainPlugin.PermissionGroup.UserAccount, MainPlugin.PermissionName.UpdateStatus, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServicePlanner);
		}
	}
}