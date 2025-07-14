namespace Crm.Service.Controllers.ActionRoleProvider
{
	using Crm.Library.Licensing;
	using Crm.Library.Model.Authorization;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;
	using Crm.Service.Model;
	using Crm.Service.Model.Lookup;

	[Licensing(ModuleId = "FLD03140")]
	public class ServiceCaseActionRoleProvider : RoleCollectorBase
	{
		public ServiceCaseActionRoleProvider(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
			Add(ServicePlugin.PermissionGroup.ServiceCase, PermissionName.View, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.SalesBackOffice);
			Add(ServicePlugin.PermissionGroup.ServiceCase, PermissionName.Index, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.SalesBackOffice);
			Add(ServicePlugin.PermissionGroup.ServiceCase, PermissionName.Read, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(ServicePlugin.PermissionGroup.ServiceCase, PermissionName.Read, ServicePlugin.PermissionGroup.ServiceCase, PermissionName.Index);
			Add(ServicePlugin.PermissionGroup.ServiceCase, PermissionName.Create, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			AddImport(ServicePlugin.PermissionGroup.ServiceCase, PermissionName.Create, ServicePlugin.PermissionGroup.ServiceCase, PermissionName.Read);
			Add(ServicePlugin.PermissionGroup.ServiceCase, PermissionName.Edit, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			AddImport(ServicePlugin.PermissionGroup.ServiceCase, PermissionName.Edit, ServicePlugin.PermissionGroup.ServiceCase, PermissionName.Create);
			AddImport(ServicePlugin.PermissionGroup.ServiceCase, PermissionName.Edit, ServicePlugin.PermissionGroup.ServiceCase, MainPlugin.PermissionName.SetStatus);
			Add(ServicePlugin.PermissionGroup.ServiceCase, ServicePlugin.PermissionName.EditClosed, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService);
			AddImport(ServicePlugin.PermissionGroup.ServiceCase, ServicePlugin.PermissionName.EditClosed, ServicePlugin.PermissionGroup.ServiceCase, PermissionName.Edit);
			Add(ServicePlugin.PermissionGroup.ServiceCase, ServicePlugin.PermissionName.EditNotAssigned, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService);
			AddImport(ServicePlugin.PermissionGroup.ServiceCase, ServicePlugin.PermissionName.EditNotAssigned, ServicePlugin.PermissionGroup.ServiceCase, PermissionName.Edit);
			Add(ServicePlugin.PermissionGroup.ServiceCase, PermissionName.Delete, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService);
			AddImport(ServicePlugin.PermissionGroup.ServiceCase, PermissionName.Delete, ServicePlugin.PermissionGroup.ServiceCase, PermissionName.Edit);

			Add(ServicePlugin.PermissionGroup.ServiceCaseTemplate, PermissionName.View, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService);
			Add(ServicePlugin.PermissionGroup.ServiceCaseTemplate, PermissionName.Index, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(ServicePlugin.PermissionGroup.ServiceCaseTemplate, PermissionName.Read, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService);
			AddImport(ServicePlugin.PermissionGroup.ServiceCaseTemplate, PermissionName.Read, ServicePlugin.PermissionGroup.ServiceCaseTemplate, PermissionName.Index);
			Add(ServicePlugin.PermissionGroup.ServiceCaseTemplate, PermissionName.Create, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService);
			Add(ServicePlugin.PermissionGroup.ServiceCaseTemplate, PermissionName.Read, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService);
			AddImport(ServicePlugin.PermissionGroup.ServiceCaseTemplate, PermissionName.Create, ServicePlugin.PermissionGroup.ServiceCase, PermissionName.Read);
			AddImport(ServicePlugin.PermissionGroup.ServiceCaseTemplate, PermissionName.Create, ServicePlugin.PermissionGroup.ServiceCase, PermissionName.Edit);
			Add(ServicePlugin.PermissionGroup.ServiceCaseTemplate, PermissionName.Edit, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService);
			AddImport(ServicePlugin.PermissionGroup.ServiceCaseTemplate, PermissionName.Edit, ServicePlugin.PermissionGroup.ServiceCase, PermissionName.Read);

			Add(ServicePlugin.PermissionGroup.ServiceCase, MainPlugin.PermissionName.CreateTag, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService);
			AddImport(ServicePlugin.PermissionGroup.ServiceCase, MainPlugin.PermissionName.CreateTag, ServicePlugin.PermissionGroup.ServiceCase, MainPlugin.PermissionName.AssociateTag);
			AddImport(ServicePlugin.PermissionGroup.ServiceCase, MainPlugin.PermissionName.CreateTag, ServicePlugin.PermissionGroup.ServiceCase, MainPlugin.PermissionName.RemoveTag);
			Add(ServicePlugin.PermissionGroup.ServiceCase, MainPlugin.PermissionName.AssociateTag, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService);
			AddImport(ServicePlugin.PermissionGroup.ServiceCase, MainPlugin.PermissionName.AssociateTag, ServicePlugin.PermissionGroup.ServiceCase, PermissionName.Read);
			Add(ServicePlugin.PermissionGroup.ServiceCase, MainPlugin.PermissionName.RenameTag, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService);
			AddImport(ServicePlugin.PermissionGroup.ServiceCase, MainPlugin.PermissionName.RenameTag, ServicePlugin.PermissionGroup.ServiceCase, MainPlugin.PermissionName.CreateTag);
			AddImport(ServicePlugin.PermissionGroup.ServiceCase, MainPlugin.PermissionName.RenameTag, ServicePlugin.PermissionGroup.ServiceCase, MainPlugin.PermissionName.DeleteTag);
			Add(ServicePlugin.PermissionGroup.ServiceCase, MainPlugin.PermissionName.RemoveTag, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			AddImport(ServicePlugin.PermissionGroup.ServiceCase, MainPlugin.PermissionName.RemoveTag, ServicePlugin.PermissionGroup.ServiceCase, MainPlugin.PermissionName.AssociateTag);
			Add(ServicePlugin.PermissionGroup.ServiceCase, MainPlugin.PermissionName.DeleteTag, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService);
			AddImport(ServicePlugin.PermissionGroup.ServiceCase, MainPlugin.PermissionName.DeleteTag, ServicePlugin.PermissionGroup.ServiceCase, MainPlugin.PermissionName.CreateTag);

			Add(ServicePlugin.PermissionGroup.ServiceCase, MainPlugin.PermissionName.SetStatus, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService);
			Add(ServicePlugin.PermissionGroup.ServiceCase, MainPlugin.PermissionName.SetStatusMultiple, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService);
			Add(ServicePlugin.PermissionGroup.ServiceCase, MainPlugin.PermissionName.NotesTab, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			AddImport(ServicePlugin.PermissionGroup.ServiceCase, MainPlugin.PermissionName.NotesTab, ServicePlugin.PermissionGroup.ServiceCase, PermissionName.Read);
			Add(ServicePlugin.PermissionGroup.ServiceCase, MainPlugin.PermissionName.TasksTab, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			AddImport(ServicePlugin.PermissionGroup.ServiceCase, MainPlugin.PermissionName.TasksTab, ServicePlugin.PermissionGroup.ServiceCase, PermissionName.Read);

			Add(MainPlugin.PermissionGroup.Company, ServicePlugin.PermissionName.ServiceCasesTab, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.ServiceBackOffice);
			Add(ServicePlugin.PermissionGroup.Installation, ServicePlugin.PermissionName.ServiceCasesTab, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			AddImport(ServicePlugin.PermissionGroup.Installation, ServicePlugin.PermissionName.ServiceCasesTab, ServicePlugin.PermissionGroup.Installation, PermissionName.Read);
			Add(ServicePlugin.PermissionGroup.ServiceOrder, ServicePlugin.PermissionName.ServiceCasesTab, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			AddImport(ServicePlugin.PermissionGroup.ServiceOrder, ServicePlugin.PermissionName.ServiceCasesTab, ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Read);
			Add(ServicePlugin.PermissionGroup.Dispatch, ServicePlugin.PermissionName.ServiceCasesTab, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			AddImport(ServicePlugin.PermissionGroup.Dispatch, ServicePlugin.PermissionName.ServiceCasesTab, ServicePlugin.PermissionGroup.Dispatch, PermissionName.Read);


			Add(PermissionGroup.WebApi, nameof(NotificationStandardAction), Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(ServiceCase), ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(ServiceCaseCategory), ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(ServiceCaseStatus), ServicePlugin.Roles.FieldService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(ServiceCaseTemplate), ServicePlugin.Roles.FieldService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice, Roles.APIUser);
		}
	}
}