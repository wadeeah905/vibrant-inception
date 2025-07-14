namespace Crm.Service.Controllers.ActionRoleProvider
{
	using Crm.Library.Model.Authorization;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;
	using Crm.Service.Model;

	public class StoreActionRoleProvider : RoleCollectorBase
	{
		public StoreActionRoleProvider(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
			var roles = new[] {
				ServicePlugin.Roles.ServiceBackOffice,
				ServicePlugin.Roles.HeadOfService,
				ServicePlugin.Roles.InternalService
			};

			Add(PermissionGroup.WebApi, nameof(Store), roles);
			Add(ServicePlugin.PermissionGroup.Store, PermissionName.View, roles);
			Add(ServicePlugin.PermissionGroup.Store, PermissionName.Index, roles);
			Add(ServicePlugin.PermissionGroup.Store, PermissionName.Read, roles);
			Add(ServicePlugin.PermissionGroup.Store, PermissionName.Edit, roles);
			Add(ServicePlugin.PermissionGroup.Store, PermissionName.Create, roles);
		}
	}
}