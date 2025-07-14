namespace Crm.Service.Controllers.ActionRoleProvider
{
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;

	public class PersonActionRoleProvider : RoleCollectorBase
	{
		public PersonActionRoleProvider(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
			Add(MainPlugin.PermissionGroup.Person, PermissionName.View, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Person, PermissionName.Index, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Person, PermissionName.Read, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Person, PermissionName.Create, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Person, PermissionName.Edit, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Person, PermissionName.Delete, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice);

			Add(MainPlugin.PermissionGroup.Person, MainPlugin.PermissionName.Merge, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Person, MainPlugin.PermissionName.AddTask, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Person, MainPlugin.PermissionName.ImportFromVcf, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Person, MainPlugin.PermissionName.DeleteBusinessRelationship, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Person, MainPlugin.PermissionName.DeleteCommunication, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Person, MainPlugin.PermissionName.MakeStandardAddress, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Person, MainPlugin.PermissionName.EditAddress, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Person, MainPlugin.PermissionName.DeleteAddress, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice);

			Add(MainPlugin.PermissionGroup.Person, MainPlugin.PermissionName.NotesTab, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Person, MainPlugin.PermissionName.TasksTab, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Person, MainPlugin.PermissionName.RelationshipsTab, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);

			Add(MainPlugin.PermissionGroup.Person, MainPlugin.PermissionName.CreateTag, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Person, MainPlugin.PermissionName.AssociateTag, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Person, MainPlugin.PermissionName.RenameTag, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Person, MainPlugin.PermissionName.RemoveTag, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Person, MainPlugin.PermissionName.DeleteTag, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice);

			Add(MainPlugin.PermissionGroup.Person, MainPlugin.PermissionName.PublicHeaderInfo, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Person, MainPlugin.PermissionName.PrivateHeaderInfo, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Person, MainPlugin.PermissionName.SidebarBackgroundInfo, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Person, MainPlugin.PermissionName.SidebarBravo, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Person, MainPlugin.PermissionName.SidebarContactInfo, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(MainPlugin.PermissionGroup.Person, MainPlugin.PermissionName.SidebarStaffList, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
		}
	}
}