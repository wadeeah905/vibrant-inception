namespace Sms.Checklists.Controllers.ActionRoleProvider
{
	using Crm.DynamicForms;
	using Crm.DynamicForms.Model;
	using Crm.DynamicForms.Model.BaseModel;
	using Crm.DynamicForms.Model.Lookups;
	using Crm.Library.Globalization;
	using Crm.Library.Model.Authorization;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;
	using Crm.Service;

	using Sms.Checklists.Model;

	public class ChecklistActionRoleProvider : RoleCollectorBase
	{
		public ChecklistActionRoleProvider(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
			Add(DynamicFormsPlugin.PermissionGroup.DynamicForms, PermissionName.View, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService);
			Add(DynamicFormsPlugin.PermissionGroup.DynamicForms, PermissionName.Index, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService);
			Add(DynamicFormsPlugin.PermissionGroup.DynamicForms, PermissionName.Read, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService);
			Add(DynamicFormsPlugin.PermissionGroup.DynamicForms, PermissionName.Create, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService);
			Add(DynamicFormsPlugin.PermissionGroup.DynamicForms, PermissionName.Edit, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService);
			Add(DynamicFormsPlugin.PermissionGroup.DynamicForms, PermissionName.Delete, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService);
			Add(DynamicFormsPlugin.PermissionGroup.PdfFeature, PermissionName.Read, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.FieldService);


			Add(ChecklistsPlugin.PermissionGroup.ServiceCaseChecklist, PermissionName.Edit, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService);
			Add(ChecklistsPlugin.PermissionGroup.ServiceCaseChecklist, PermissionName.Index, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService);
			Add(ChecklistsPlugin.PermissionGroup.ServiceCaseChecklist, PermissionName.View, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService);
			Add(ChecklistsPlugin.PermissionGroup.ServiceCaseChecklist, PermissionName.Read, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService);

			Add(ServicePlugin.PermissionGroup.ServiceOrder, ChecklistsPlugin.PermissionName.AddChecklist, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService);
			AddImport(ServicePlugin.PermissionGroup.ServiceOrder, ChecklistsPlugin.PermissionName.AddChecklist, ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Read);
			Add(ServicePlugin.PermissionGroup.ServiceOrderTime, ChecklistsPlugin.PermissionName.AddChecklist, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService);
			AddImport(ServicePlugin.PermissionGroup.ServiceOrderTime, ChecklistsPlugin.PermissionName.AddChecklist, ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Read);
			Add(ServicePlugin.PermissionGroup.ServiceOrder, ChecklistsPlugin.PermissionName.AddPdfChecklist, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService);
			AddImport(ServicePlugin.PermissionGroup.ServiceOrder, ChecklistsPlugin.PermissionName.AddPdfChecklist, ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Read);
			Add(ServicePlugin.PermissionGroup.ServiceOrderTime, ChecklistsPlugin.PermissionName.AddPdfChecklist, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.InternalService);
			AddImport(ServicePlugin.PermissionGroup.ServiceOrderTime, ChecklistsPlugin.PermissionName.AddPdfChecklist, ServicePlugin.PermissionGroup.ServiceOrder, PermissionName.Read);
			Add(ChecklistsPlugin.PermissionGroup.ServiceOrderChecklist, PermissionName.Delete, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.FieldService);
			AddImport(ChecklistsPlugin.PermissionGroup.ServiceOrderChecklist, PermissionName.Delete, ChecklistsPlugin.PermissionGroup.ServiceOrderChecklist, PermissionName.Edit);
			Add(ChecklistsPlugin.PermissionGroup.ServiceOrderChecklist, PermissionName.Edit, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			AddImport(ChecklistsPlugin.PermissionGroup.ServiceOrderChecklist, PermissionName.Edit, ServicePlugin.PermissionGroup.ServiceOrder, ChecklistsPlugin.PermissionName.AddChecklist);
			Add(ChecklistsPlugin.PermissionGroup.ServiceOrderChecklist, PermissionName.Index, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(ChecklistsPlugin.PermissionGroup.ServiceOrderChecklist, PermissionName.View, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(ChecklistsPlugin.PermissionGroup.ServiceOrderChecklist, PermissionName.Read, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(ChecklistsPlugin.PermissionGroup.ServiceOrderChecklist, ChecklistsPlugin.PermissionName.ToggleRequired, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService);

			Add(ChecklistsPlugin.PermissionGroup.ServiceOrderPdfChecklist, PermissionName.Delete, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.FieldService, ServicePlugin.Roles.FieldService);
			AddImport(ChecklistsPlugin.PermissionGroup.ServiceOrderPdfChecklist, PermissionName.Delete, ChecklistsPlugin.PermissionGroup.ServiceOrderPdfChecklist, PermissionName.Edit);
			Add(ChecklistsPlugin.PermissionGroup.ServiceOrderPdfChecklist, PermissionName.Edit, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			AddImport(ChecklistsPlugin.PermissionGroup.ServiceOrderPdfChecklist, PermissionName.Edit, ServicePlugin.PermissionGroup.ServiceOrder, ChecklistsPlugin.PermissionName.AddPdfChecklist);
			Add(ChecklistsPlugin.PermissionGroup.ServiceOrderPdfChecklist, PermissionName.Index, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(ChecklistsPlugin.PermissionGroup.ServiceOrderPdfChecklist, PermissionName.View, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(ChecklistsPlugin.PermissionGroup.ServiceOrderPdfChecklist, PermissionName.Read, ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);


			Add(PermissionGroup.WebApi, nameof(ChecklistInstallationTypeRelationship), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(DynamicForm), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(PermissionGroup.WebApi, nameof(DynamicFormCategory), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(PermissionGroup.WebApi, nameof(DynamicFormLanguage), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(PermissionGroup.WebApi, nameof(DynamicFormLocalization), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(PermissionGroup.WebApi, nameof(DynamicFormStatus), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(PermissionGroup.WebApi, nameof(DynamicFormElement), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(PermissionGroup.WebApi, nameof(DynamicFormElementRule), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(PermissionGroup.WebApi, nameof(DynamicFormElementRuleCondition), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(PermissionGroup.WebApi, nameof(DynamicFormResponse), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(PermissionGroup.WebApi, nameof(DynamicFormFileResponse), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(Language), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService);
			Add(PermissionGroup.WebApi, nameof(ServiceOrderChecklist), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(ServiceCaseChecklist), ServicePlugin.Roles.HeadOfService, ServicePlugin.Roles.ServiceBackOffice, ServicePlugin.Roles.InternalService, ServicePlugin.Roles.FieldService, Roles.APIUser);
		}
	}
}
