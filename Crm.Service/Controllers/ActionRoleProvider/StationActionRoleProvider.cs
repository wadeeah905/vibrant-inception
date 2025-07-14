namespace Crm.Service.Controllers.ActionRoleProvider
{
	using Crm.Library.Model;
	using Crm.Library.Model.Authorization;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;
	using System.Linq;

	public class StationActionRoleProvider : RoleCollectorBase
	{
		public StationActionRoleProvider(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
			var roles = new[] {
				ServicePlugin.Roles.ServiceBackOffice,
				ServicePlugin.Roles.HeadOfService,
				ServicePlugin.Roles.InternalService,
				ServicePlugin.Roles.FieldService
			};

			Add(PermissionGroup.WebApi, nameof(Station), roles);

			if (pluginProvider.ActivePluginNames.Contains("Crm.Offline"))
			{
				Add(PermissionGroup.Sync, nameof(Station), new[] {ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService });
				AddImport(PermissionGroup.Sync, nameof(Station), PermissionGroup.WebApi, nameof(Station));
			}
		}
	}
}