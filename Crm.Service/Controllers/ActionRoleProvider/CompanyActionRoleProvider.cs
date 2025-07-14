namespace Crm.Service.Controllers.ActionRoleProvider
{
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;
	using Crm.Service;

	public class CompanyActionRoleProvider : RoleCollectorBase
	{
		public CompanyActionRoleProvider(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
			Add(MainPlugin.PermissionGroup.Company, ServicePlugin.PermissionName.InstallationsTab, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Company, ServicePlugin.PermissionName.ServiceContractsTab, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Company, ServicePlugin.PermissionName.ServiceOrdersTab, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Company, PermissionName.View, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Company, PermissionName.Index, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Company, PermissionName.Read, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Company, PermissionName.Create, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Company, PermissionName.Delete, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Company, PermissionName.Edit, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);

			Add(MainPlugin.PermissionGroup.Company, MainPlugin.PermissionName.ToggleActive, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Company, MainPlugin.PermissionName.Merge, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Company, MainPlugin.PermissionName.MakeStandardAddress, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice);

			Add(MainPlugin.PermissionGroup.Company, MainPlugin.PermissionName.CreateTag, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Company, MainPlugin.PermissionName.AssociateTag, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Company, MainPlugin.PermissionName.RenameTag, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Company, MainPlugin.PermissionName.RemoveTag, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Company, MainPlugin.PermissionName.DeleteTag, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice);
		}
	}
}