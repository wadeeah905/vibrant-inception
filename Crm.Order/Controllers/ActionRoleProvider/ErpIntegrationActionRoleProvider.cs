namespace Crm.Order.Controllers.ActionRoleProvider
{
	using System.Linq;

	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;

	public class ErpIntegrationActionRoleProvider : RoleCollectorBase
	{
		public ErpIntegrationActionRoleProvider(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
			if (pluginProvider.ActivePluginNames.Contains("Main.Replication"))
			{
				Add(OrderPlugin.PermissionGroup.Replication,
					PermissionName.Import,
					MainPlugin.Roles.HeadOfSales,
					MainPlugin.Roles.SalesBackOffice);
				Add(OrderPlugin.PermissionGroup.Replication,
					PermissionName.Export,
					MainPlugin.Roles.HeadOfSales,
					MainPlugin.Roles.SalesBackOffice);
			}
		}
	}
}
