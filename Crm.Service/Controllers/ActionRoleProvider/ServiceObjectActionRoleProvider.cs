namespace Crm.Service.Controllers.ActionRoleProvider
{
	using Crm.Library.Licensing;
	using Crm.Library.Model.Authorization;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;
	using Crm.Service.Model;
	using Crm.Service.Model.Lookup;

	[Licensing(ModuleId = "FLD03160")]
	public class ServiceObjectActionRoleProvider : RoleCollectorBase
	{
		public ServiceObjectActionRoleProvider(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
			Add(ServicePlugin.PermissionGroup.ServiceObject, PermissionName.View, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.SalesBackOffice);
			Add(ServicePlugin.PermissionGroup.ServiceObject, PermissionName.Index, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.SalesBackOffice);
			Add(ServicePlugin.PermissionGroup.ServiceObject, PermissionName.Read, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(ServicePlugin.PermissionGroup.ServiceObject, PermissionName.Read, ServicePlugin.PermissionGroup.ServiceObject, PermissionName.Index);
			Add(ServicePlugin.PermissionGroup.ServiceObject, PermissionName.Create, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(ServicePlugin.PermissionGroup.ServiceObject, PermissionName.Edit, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			AddImport(ServicePlugin.PermissionGroup.ServiceObject, PermissionName.Edit, ServicePlugin.PermissionGroup.ServiceObject, PermissionName.Create);
			AddImport(ServicePlugin.PermissionGroup.ServiceObject, PermissionName.Edit, ServicePlugin.PermissionGroup.ServiceObject, PermissionName.Read);
			Add(ServicePlugin.PermissionGroup.ServiceObject, PermissionName.Delete, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			AddImport(ServicePlugin.PermissionGroup.ServiceObject, PermissionName.Delete, ServicePlugin.PermissionGroup.ServiceObject, PermissionName.Edit);
			Add(ServicePlugin.PermissionGroup.ServiceObject, MainPlugin.PermissionName.CreateAddress, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			AddImport(ServicePlugin.PermissionGroup.ServiceObject, MainPlugin.PermissionName.CreateAddress, ServicePlugin.PermissionGroup.ServiceObject, PermissionName.Read);
			AddImport(ServicePlugin.PermissionGroup.ServiceObject, MainPlugin.PermissionName.CreateAddress, ServicePlugin.PermissionGroup.ServiceObject, MainPlugin.PermissionName.EditAddress);
			Add(ServicePlugin.PermissionGroup.ServiceObject, MainPlugin.PermissionName.EditAddress, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			AddImport(ServicePlugin.PermissionGroup.ServiceObject, MainPlugin.PermissionName.EditAddress, ServicePlugin.PermissionGroup.ServiceObject, PermissionName.Read);
			Add(ServicePlugin.PermissionGroup.ServiceObject, MainPlugin.PermissionName.DeleteAddress, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			AddImport(ServicePlugin.PermissionGroup.ServiceObject, MainPlugin.PermissionName.DeleteAddress, ServicePlugin.PermissionGroup.ServiceObject, MainPlugin.PermissionName.EditAddress);

			Add(ServicePlugin.PermissionGroup.ServiceObject, MainPlugin.PermissionName.CreateTag, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(ServicePlugin.PermissionGroup.ServiceObject, MainPlugin.PermissionName.CreateTag, ServicePlugin.PermissionGroup.ServiceObject, MainPlugin.PermissionName.AssociateTag);
			AddImport(ServicePlugin.PermissionGroup.ServiceObject, MainPlugin.PermissionName.CreateTag, ServicePlugin.PermissionGroup.ServiceObject, MainPlugin.PermissionName.RemoveTag);
			Add(ServicePlugin.PermissionGroup.ServiceObject, MainPlugin.PermissionName.AssociateTag, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(ServicePlugin.PermissionGroup.ServiceObject, MainPlugin.PermissionName.AssociateTag, ServicePlugin.PermissionGroup.ServiceObject, PermissionName.Read);
			Add(ServicePlugin.PermissionGroup.ServiceObject, MainPlugin.PermissionName.RenameTag, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(ServicePlugin.PermissionGroup.ServiceObject, MainPlugin.PermissionName.RenameTag, ServicePlugin.PermissionGroup.ServiceObject, MainPlugin.PermissionName.CreateTag);
			AddImport(ServicePlugin.PermissionGroup.ServiceObject, MainPlugin.PermissionName.RenameTag, ServicePlugin.PermissionGroup.ServiceObject, MainPlugin.PermissionName.DeleteTag);
			Add(ServicePlugin.PermissionGroup.ServiceObject, MainPlugin.PermissionName.RemoveTag, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(ServicePlugin.PermissionGroup.ServiceObject, MainPlugin.PermissionName.RemoveTag, ServicePlugin.PermissionGroup.ServiceObject, MainPlugin.PermissionName.AssociateTag);
			Add(ServicePlugin.PermissionGroup.ServiceObject, MainPlugin.PermissionName.DeleteTag, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(ServicePlugin.PermissionGroup.ServiceObject, MainPlugin.PermissionName.DeleteTag, ServicePlugin.PermissionGroup.ServiceObject, MainPlugin.PermissionName.CreateTag);

			Add(ServicePlugin.PermissionGroup.ServiceObject, MainPlugin.PermissionName.NotesTab, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice);
			AddImport(ServicePlugin.PermissionGroup.ServiceObject, MainPlugin.PermissionName.NotesTab, ServicePlugin.PermissionGroup.ServiceObject, PermissionName.Read);
			Add(ServicePlugin.PermissionGroup.ServiceObject, MainPlugin.PermissionName.StaffTab, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice);
			AddImport(ServicePlugin.PermissionGroup.ServiceObject, MainPlugin.PermissionName.StaffTab, ServicePlugin.PermissionGroup.ServiceObject, PermissionName.Read);
			Add(ServicePlugin.PermissionGroup.ServiceObject, ServicePlugin.PermissionName.InstallationsTab, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice);
			AddImport(ServicePlugin.PermissionGroup.ServiceObject, ServicePlugin.PermissionName.InstallationsTab, ServicePlugin.PermissionGroup.ServiceObject, PermissionName.Read);

			Add(PermissionGroup.WebApi, nameof(ServiceObject), ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(ServiceObjectCategory), ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice, Roles.APIUser);
		}
	}
}