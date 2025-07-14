namespace Crm.Service.Controllers.ActionRoleProvider
{
	using Crm.Library.Model.Authorization;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;
	using Crm.Service.Model.Lookup;
	using Crm.Service.Model.Relationships;

	public class InstallationAddressRelationshipActionRoleProvider : RoleCollectorBase
	{
		public InstallationAddressRelationshipActionRoleProvider(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
			Add(ServicePlugin.PermissionGroup.Installation, MainPlugin.PermissionName.EditAddressRelationship, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService);
			AddImport(ServicePlugin.PermissionGroup.Installation, MainPlugin.PermissionName.EditAddressRelationship, ServicePlugin.PermissionGroup.Installation, MainPlugin.PermissionName.RelationshipsTab);
			Add(ServicePlugin.PermissionGroup.Installation, MainPlugin.PermissionName.RemoveAddressRelationship, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService);
			AddImport(ServicePlugin.PermissionGroup.Installation, MainPlugin.PermissionName.RemoveAddressRelationship, ServicePlugin.PermissionGroup.Installation, PermissionName.Index);
			AddImport(ServicePlugin.PermissionGroup.Installation, MainPlugin.PermissionName.RemoveAddressRelationship, ServicePlugin.PermissionGroup.Installation, MainPlugin.PermissionName.EditAddressRelationship);

			Add(PermissionGroup.WebApi, nameof(InstallationAddressRelationship), MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.HeadOfService, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(InstallationAddressRelationshipType), MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.HeadOfService, Roles.APIUser);
		}
	}
}