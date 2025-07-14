namespace Crm.VisitReport.Controllers.ActionRoleProvider
{
	using Crm.DynamicForms;
	using Crm.DynamicForms.Model;
	using Crm.DynamicForms.Model.BaseModel;
	using Crm.DynamicForms.Model.Lookups;
	using Crm.Library.Licensing;
	using Crm.Library.Model.Authorization;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;
	using Crm.VisitReport.Model;

	[Licensing(ModuleId = "FLD03050")]
	public class VisitReportActionRoleProvider : RoleCollectorBase
	{
		public VisitReportActionRoleProvider(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
			Add(DynamicFormsPlugin.PermissionGroup.DynamicForms, PermissionName.View, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.InternalSales);
			Add(DynamicFormsPlugin.PermissionGroup.DynamicForms, PermissionName.Index, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.InternalSales);
			Add(DynamicFormsPlugin.PermissionGroup.DynamicForms, PermissionName.Read, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales);
			Add(DynamicFormsPlugin.PermissionGroup.DynamicForms, PermissionName.Create, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales);
			Add(DynamicFormsPlugin.PermissionGroup.DynamicForms, PermissionName.Edit, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales);
			Add(DynamicFormsPlugin.PermissionGroup.DynamicForms, PermissionName.Delete, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales);

			Add(VisitReportPlugin.PermissionGroup.Visit, VisitReportPlugin.PermissionName.VisitReportsTab, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(VisitReportPlugin.PermissionGroup.Visit, VisitReportPlugin.PermissionName.VisitReportsTab, VisitReportPlugin.PermissionGroup.Visit, PermissionName.Read);

			Add(VisitReportPlugin.PermissionGroup.VisitReport, PermissionName.View, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			Add(VisitReportPlugin.PermissionGroup.VisitReport, PermissionName.Create, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.FieldSales);
			AddImport(VisitReportPlugin.PermissionGroup.VisitReport, PermissionName.Create, VisitReportPlugin.PermissionGroup.VisitReport, PermissionName.Read);
			Add(VisitReportPlugin.PermissionGroup.VisitReport, PermissionName.Index, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.FieldSales);
			Add(VisitReportPlugin.PermissionGroup.VisitReport, PermissionName.Read, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.FieldSales);
			AddImport(VisitReportPlugin.PermissionGroup.VisitReport, PermissionName.Read, VisitReportPlugin.PermissionGroup.VisitReport, PermissionName.Index);
			Add(VisitReportPlugin.PermissionGroup.VisitReport, PermissionName.Edit, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.FieldSales);
			AddImport(VisitReportPlugin.PermissionGroup.VisitReport, PermissionName.Edit, VisitReportPlugin.PermissionGroup.VisitReport, PermissionName.Create);
			Add(VisitReportPlugin.PermissionGroup.VisitReport, PermissionName.Delete, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.FieldSales);
			AddImport(VisitReportPlugin.PermissionGroup.VisitReport, PermissionName.Delete, VisitReportPlugin.PermissionGroup.VisitReport, PermissionName.Edit);
			Add(VisitReportPlugin.PermissionGroup.VisitReport, MainPlugin.PermissionName.Close, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.FieldSales);
			Add(VisitReportPlugin.PermissionGroup.VisitReport, VisitReportPlugin.PermissionName.SaveTopic, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.FieldSales);
			Add(VisitReportPlugin.PermissionGroup.VisitReport, VisitReportPlugin.PermissionName.Print, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.FieldSales);

			Add(VisitReportPlugin.PermissionGroup.VisitReport, VisitReportPlugin.PermissionName.ViewAllReporting, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales);
			Add(VisitReportPlugin.PermissionGroup.VisitReport, VisitReportPlugin.PermissionName.EditAllUsersVisitReports, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales);
			AddImport(VisitReportPlugin.PermissionGroup.VisitReport, VisitReportPlugin.PermissionName.EditAllUsersVisitReports, VisitReportPlugin.PermissionGroup.VisitReport, PermissionName.Edit);
			Add(VisitReportPlugin.PermissionGroup.VisitReport, VisitReportPlugin.PermissionName.SeeAllUsersVisitReports, MainPlugin.Roles.SalesBackOffice, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales);
			AddImport(VisitReportPlugin.PermissionGroup.VisitReport, VisitReportPlugin.PermissionName.SeeAllUsersVisitReports, VisitReportPlugin.PermissionGroup.VisitReport, PermissionName.Read);

			Add(MainPlugin.PermissionGroup.Company, VisitReportPlugin.PermissionName.VisitReportsTab, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(MainPlugin.PermissionGroup.Company, VisitReportPlugin.PermissionName.VisitReportsTab, MainPlugin.PermissionGroup.Company, PermissionName.Read);
			Add(PermissionGroup.WebApi, nameof(DynamicForm), MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			Add(PermissionGroup.WebApi, nameof(DynamicFormCategory), MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			Add(PermissionGroup.WebApi, nameof(DynamicFormLanguage), MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			Add(PermissionGroup.WebApi, nameof(DynamicFormLocalization), MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			Add(PermissionGroup.WebApi, nameof(DynamicFormStatus), MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			Add(PermissionGroup.WebApi, nameof(DynamicFormElement), MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			Add(PermissionGroup.WebApi, nameof(DynamicFormElementRule), MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			Add(PermissionGroup.WebApi, nameof(DynamicFormElementRuleCondition), MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			Add(PermissionGroup.WebApi, nameof(DynamicFormResponse), MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			Add(PermissionGroup.WebApi, nameof(VisitReport), MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice, Roles.APIUser);
		}
	}
}
