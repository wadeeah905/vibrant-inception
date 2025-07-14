namespace Crm.Service.Controllers.ActionRoleProvider
{
	using Crm.Library.Model.Authorization;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;
	using Crm.Model.Lookups;
	using Crm.Service.Model;
	using Crm.Service.Model.Lookup;

	public class InstallationActionRoleProvider : RoleCollectorBase
	{
		public InstallationActionRoleProvider(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
			Add(ServicePlugin.PermissionGroup.Installation, PermissionName.View, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.HeadOfService);
			Add(ServicePlugin.PermissionGroup.Installation, PermissionName.Index, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.HeadOfService);
			Add(ServicePlugin.PermissionGroup.Installation, PermissionName.Read, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.HeadOfService);
			AddImport(ServicePlugin.PermissionGroup.Installation, PermissionName.Read, ServicePlugin.PermissionGroup.Installation, PermissionName.Index);
			Add(ServicePlugin.PermissionGroup.Installation, PermissionName.Create, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			AddImport(ServicePlugin.PermissionGroup.Installation, PermissionName.Create, ServicePlugin.PermissionGroup.Installation, PermissionName.Index);
			AddImport(ServicePlugin.PermissionGroup.Installation, PermissionName.Create, ServicePlugin.PermissionGroup.Installation, PermissionName.Read);
			Add(ServicePlugin.PermissionGroup.Installation, PermissionName.Copy, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(ServicePlugin.PermissionGroup.Installation, PermissionName.Edit, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			AddImport(ServicePlugin.PermissionGroup.Installation, PermissionName.Edit, ServicePlugin.PermissionGroup.Installation, PermissionName.Create);
			AddImport(ServicePlugin.PermissionGroup.Installation, PermissionName.Edit, ServicePlugin.PermissionGroup.Installation, PermissionName.Read);
			Add(ServicePlugin.PermissionGroup.Installation, PermissionName.Delete, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.FieldService);
			AddImport(ServicePlugin.PermissionGroup.Installation, PermissionName.Delete, ServicePlugin.PermissionGroup.Installation, PermissionName.Edit);

			Add(ServicePlugin.PermissionGroup.InstallationPosition, PermissionName.Index, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.HeadOfService);
			AddImport(ServicePlugin.PermissionGroup.InstallationPosition, PermissionName.Index, ServicePlugin.PermissionGroup.Installation, PermissionName.Read);
			Add(ServicePlugin.PermissionGroup.InstallationPosition, PermissionName.Create, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.HeadOfService);
			AddImport(ServicePlugin.PermissionGroup.InstallationPosition, PermissionName.Create, ServicePlugin.PermissionGroup.Installation, PermissionName.Read);
			Add(ServicePlugin.PermissionGroup.InstallationPosition, PermissionName.Edit, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.HeadOfService);
			AddImport(ServicePlugin.PermissionGroup.InstallationPosition, PermissionName.Edit, ServicePlugin.PermissionGroup.Installation, PermissionName.Read);
			Add(ServicePlugin.PermissionGroup.InstallationPosition, PermissionName.Delete, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.HeadOfService);
			AddImport(ServicePlugin.PermissionGroup.InstallationPosition, PermissionName.Delete, ServicePlugin.PermissionGroup.Installation, PermissionName.Edit);

			Add(ServicePlugin.PermissionGroup.InstallationPositionSerial, PermissionName.Index, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.HeadOfService);
			AddImport(ServicePlugin.PermissionGroup.InstallationPositionSerial, PermissionName.Index, ServicePlugin.PermissionGroup.Installation, PermissionName.Read);
			Add(ServicePlugin.PermissionGroup.InstallationPositionSerial, PermissionName.Create, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.HeadOfService);
			AddImport(ServicePlugin.PermissionGroup.InstallationPositionSerial, PermissionName.Create, ServicePlugin.PermissionGroup.Installation, PermissionName.Read);
			Add(ServicePlugin.PermissionGroup.InstallationPositionSerial, PermissionName.Edit, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.HeadOfService);
			AddImport(ServicePlugin.PermissionGroup.InstallationPositionSerial, PermissionName.Edit, ServicePlugin.PermissionGroup.Installation, PermissionName.Read);

			Add(ServicePlugin.PermissionGroup.Installation, MainPlugin.PermissionName.CreateTag, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice);
			AddImport(ServicePlugin.PermissionGroup.Installation, MainPlugin.PermissionName.CreateTag, ServicePlugin.PermissionGroup.Installation, MainPlugin.PermissionName.AssociateTag);
			AddImport(ServicePlugin.PermissionGroup.Installation, MainPlugin.PermissionName.CreateTag, ServicePlugin.PermissionGroup.Installation, MainPlugin.PermissionName.RemoveTag);
			Add(ServicePlugin.PermissionGroup.Installation, MainPlugin.PermissionName.AssociateTag, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.HeadOfService);
			Add(ServicePlugin.PermissionGroup.Installation, MainPlugin.PermissionName.RenameTag, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice);
			AddImport(ServicePlugin.PermissionGroup.Installation, MainPlugin.PermissionName.RenameTag, ServicePlugin.PermissionGroup.Installation, MainPlugin.PermissionName.DeleteTag);
			Add(ServicePlugin.PermissionGroup.Installation, MainPlugin.PermissionName.RemoveTag, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.HeadOfService);
			AddImport(ServicePlugin.PermissionGroup.Installation, MainPlugin.PermissionName.RemoveTag, ServicePlugin.PermissionGroup.Installation, MainPlugin.PermissionName.AssociateTag);
			Add(ServicePlugin.PermissionGroup.Installation, MainPlugin.PermissionName.DeleteTag, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice);
			AddImport(ServicePlugin.PermissionGroup.Installation, MainPlugin.PermissionName.DeleteTag, ServicePlugin.PermissionGroup.Installation, MainPlugin.PermissionName.CreateTag);

			Add(ServicePlugin.PermissionGroup.Installation, MainPlugin.PermissionName.DetailsBackgroundInfo, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.HeadOfService);
			AddImport(ServicePlugin.PermissionGroup.Installation, MainPlugin.PermissionName.DetailsBackgroundInfo, ServicePlugin.PermissionGroup.Installation, PermissionName.Read);
			Add(ServicePlugin.PermissionGroup.Installation, MainPlugin.PermissionName.DetailsContactInfo, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.HeadOfService);
			AddImport(ServicePlugin.PermissionGroup.Installation, MainPlugin.PermissionName.DetailsContactInfo, ServicePlugin.PermissionGroup.Installation, PermissionName.Read);
			Add(ServicePlugin.PermissionGroup.Installation, ServicePlugin.PermissionName.CreateStandardAction, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice);
			Add(ServicePlugin.PermissionGroup.Installation, ServicePlugin.PermissionName.EditStandardAction, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService);
			Add(ServicePlugin.PermissionGroup.Installation, ServicePlugin.PermissionName.TabMaterial, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.HeadOfService);
			AddImport(ServicePlugin.PermissionGroup.Installation, ServicePlugin.PermissionName.TabMaterial, ServicePlugin.PermissionGroup.Installation, PermissionName.Read);
			Add(ServicePlugin.PermissionGroup.Installation, MainPlugin.PermissionName.NotesTab, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.InternalSales);
			AddImport(ServicePlugin.PermissionGroup.Installation, MainPlugin.PermissionName.NotesTab, ServicePlugin.PermissionGroup.Installation, PermissionName.Read);
			Add(ServicePlugin.PermissionGroup.Installation, MainPlugin.PermissionName.RelationshipsTab, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.InternalSales);
			AddImport(ServicePlugin.PermissionGroup.Installation, MainPlugin.PermissionName.RelationshipsTab, ServicePlugin.PermissionGroup.Installation, PermissionName.Read);
			Add(ServicePlugin.PermissionGroup.Installation, ServicePlugin.PermissionName.ServiceOrdersTab, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			AddImport(ServicePlugin.PermissionGroup.Installation, ServicePlugin.PermissionName.ServiceOrdersTab, ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Read);
			Add(ServicePlugin.PermissionGroup.Installation, MainPlugin.PermissionName.TasksTab, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			AddImport(ServicePlugin.PermissionGroup.Installation, MainPlugin.PermissionName.TasksTab, MainPlugin.PermissionGroup.Task, PermissionName.Index);

			Add(PermissionGroup.WebApi, nameof(Installation), MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.HeadOfService, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(InstallationHeadStatus), MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.HeadOfService, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(InstallationType), MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.HeadOfService, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(InstallationPos), MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.HeadOfService, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(InstallationPosSerial), MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.HeadOfService, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(DocumentCategory), MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.HeadOfService, Roles.APIUser);
		}
	}
}
