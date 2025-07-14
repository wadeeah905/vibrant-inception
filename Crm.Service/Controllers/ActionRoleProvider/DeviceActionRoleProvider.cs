namespace Crm.Service.Controllers.ActionRoleProvider
{
	using Crm.Library.Model.Authorization;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;
	using Crm.Model;

	public class DeviceActionRoleProvider : RoleCollectorBase
	{
		public DeviceActionRoleProvider(IPluginProvider pluginProvider) : base(pluginProvider)
		{
			var roles = new[] { ServicePlugin.Roles.FieldService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServicePlanner, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice };

			Add(PermissionGroup.WebApi, nameof(Device), roles);
		}
	}
}
