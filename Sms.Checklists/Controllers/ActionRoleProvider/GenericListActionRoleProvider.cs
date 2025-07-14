namespace Sms.Checklists.Controllers.ActionRoleProvider
{
	using Crm;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;
	using Crm.Service;

	public class GenericListActionRoleProvider : RoleCollectorBase
	{
		public GenericListActionRoleProvider(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
			Add(ChecklistsPlugin.PermissionGroup.ServiceOrderChecklist, MainPlugin.PermissionName.ExportAsCsv, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice);
			Add(ChecklistsPlugin.PermissionGroup.ServiceOrderChecklist, MainPlugin.PermissionName.Ics, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(ChecklistsPlugin.PermissionGroup.ServiceOrderChecklist, MainPlugin.PermissionName.Rss, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
		}
	}
}