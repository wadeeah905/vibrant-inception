namespace Crm.Service.Controllers.ActionRoleProvider
{
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;

	public class BusinessRelationshipActionRoleProvider : RoleCollectorBase
	{
		public BusinessRelationshipActionRoleProvider(IPluginProvider pluginProvider) :
			base(pluginProvider)
		{
			Add(MainPlugin.PermissionGroup.BusinessRelationship, PermissionName.Edit, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
		}
	}
}