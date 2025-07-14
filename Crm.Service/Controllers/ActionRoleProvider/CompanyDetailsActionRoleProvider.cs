namespace Crm.Service.Controllers.ActionRoleProvider
{
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;

	public class CompanyDetailsActionRoleProvider : RoleCollectorBase
	{
		public CompanyDetailsActionRoleProvider(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
			Add(MainPlugin.PermissionGroup.Company, MainPlugin.PermissionName.UpgradeProspect, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice);
			AddImport(MainPlugin.PermissionGroup.Company, MainPlugin.PermissionName.UpgradeProspect, MainPlugin.PermissionGroup.Company, PermissionName.Edit);
			Add(MainPlugin.PermissionGroup.Company, MainPlugin.PermissionName.EditAddress, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			AddImport(MainPlugin.PermissionGroup.Company, MainPlugin.PermissionName.EditAddress, MainPlugin.PermissionGroup.Company, PermissionName.Read);
			Add(MainPlugin.PermissionGroup.Company, MainPlugin.PermissionName.DeleteAddress, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			AddImport(MainPlugin.PermissionGroup.Company, MainPlugin.PermissionName.DeleteAddress, MainPlugin.PermissionGroup.Company, MainPlugin.PermissionName.EditAddress);
			Add(MainPlugin.PermissionGroup.Company, MainPlugin.PermissionName.DeleteCommunication, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Company, MainPlugin.PermissionName.CreateBusinessRelationship, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Company, MainPlugin.PermissionName.DeleteBusinessRelationship, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);

			Add(MainPlugin.PermissionGroup.Company, MainPlugin.PermissionName.SidebarBackgroundInfo, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Company, MainPlugin.PermissionName.SidebarBravo, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Company, MainPlugin.PermissionName.SidebarClientCompanies, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Company, MainPlugin.PermissionName.SidebarContactInfo, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Company, MainPlugin.PermissionName.SidebarStaffList, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);

			Add(MainPlugin.PermissionGroup.Company, MainPlugin.PermissionName.RelationshipsTab, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Company, MainPlugin.PermissionName.NotesTab, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Company, MainPlugin.PermissionName.StaffTab, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Company, MainPlugin.PermissionName.TasksTab, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
		}
	}
}