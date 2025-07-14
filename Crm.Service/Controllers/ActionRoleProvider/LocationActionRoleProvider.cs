namespace Crm.Service.Controllers.ActionRoleProvider
{
	using Crm.Library.Model.Authorization;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;
	using Crm.Service.Model;

	public class LocationActionRoleProvider : RoleCollectorBase
	{
		public LocationActionRoleProvider(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
			var roles = new[] {
				ServicePlugin.Roles.ServiceBackOffice,
				ServicePlugin.Roles.HeadOfService,
				ServicePlugin.Roles.InternalService
			};

			Add(PermissionGroup.WebApi, nameof(Location), roles);
			Add(ServicePlugin.PermissionGroup.Location, PermissionName.Edit, roles);
			Add(ServicePlugin.PermissionGroup.Location, PermissionName.Create, roles);
		}
	}
}