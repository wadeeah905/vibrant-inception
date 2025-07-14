namespace Crm.VisitReport.Controllers.ActionRoleProvider
{
	using Crm.Library.Model.Authorization;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;
	using Crm.VisitReport.Lookups;
	using Crm.VisitReport.Model;
	using Crm.VisitReport.Model.Relationships;

	public class VisitActionRoleProvider : RoleCollectorBase
	{
		public VisitActionRoleProvider(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
			Add(VisitReportPlugin.PermissionGroup.Visit, PermissionName.View, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(VisitReportPlugin.PermissionGroup.Visit, PermissionName.View, VisitReportPlugin.PermissionGroup.Visit, PermissionName.Index);
			Add(VisitReportPlugin.PermissionGroup.Visit, PermissionName.Index, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			Add(VisitReportPlugin.PermissionGroup.Visit, PermissionName.Read, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			Add(VisitReportPlugin.PermissionGroup.Visit, PermissionName.Create, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(VisitReportPlugin.PermissionGroup.Visit, PermissionName.Create, VisitReportPlugin.PermissionGroup.Visit, PermissionName.Read);
			Add(VisitReportPlugin.PermissionGroup.Visit, PermissionName.Edit, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(VisitReportPlugin.PermissionGroup.Visit, PermissionName.Edit, VisitReportPlugin.PermissionGroup.Visit, PermissionName.Create);
			Add(VisitReportPlugin.PermissionGroup.Visit, PermissionName.Delete, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(VisitReportPlugin.PermissionGroup.Visit, PermissionName.Delete, VisitReportPlugin.PermissionGroup.Visit, PermissionName.Edit);

			Add(VisitReportPlugin.PermissionGroup.Visit, VisitReportPlugin.PermissionName.AddContactPersonRelationship, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(VisitReportPlugin.PermissionGroup.Visit, VisitReportPlugin.PermissionName.AddContactPersonRelationship, VisitReportPlugin.PermissionGroup.Visit, PermissionName.Read);
			Add(VisitReportPlugin.PermissionGroup.Visit, VisitReportPlugin.PermissionName.EditAllUsersTourPlanning, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(VisitReportPlugin.PermissionGroup.Visit, VisitReportPlugin.PermissionName.EditAllUsersTourPlanning, VisitReportPlugin.PermissionGroup.Visit, PermissionName.Edit);
			Add(VisitReportPlugin.PermissionGroup.Visit, VisitReportPlugin.PermissionName.SeeAllUsersTourPlanning, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(VisitReportPlugin.PermissionGroup.Visit, VisitReportPlugin.PermissionName.SeeAllUsersTourPlanning, VisitReportPlugin.PermissionGroup.Visit, PermissionName.Read);
			Add(VisitReportPlugin.PermissionGroup.Visit, VisitReportPlugin.PermissionName.SetStatus, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(VisitReportPlugin.PermissionGroup.Visit, VisitReportPlugin.PermissionName.SetStatus, VisitReportPlugin.PermissionGroup.Visit, PermissionName.Edit);

			Add(VisitReportPlugin.PermissionGroup.Visit, MainPlugin.PermissionName.NotesTab, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(VisitReportPlugin.PermissionGroup.Visit, MainPlugin.PermissionName.NotesTab, VisitReportPlugin.PermissionGroup.Visit, PermissionName.Read);
			Add(VisitReportPlugin.PermissionGroup.Visit, MainPlugin.PermissionName.TasksTab, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(VisitReportPlugin.PermissionGroup.Visit, MainPlugin.PermissionName.TasksTab, VisitReportPlugin.PermissionGroup.Visit, PermissionName.Read);
			Add(VisitReportPlugin.PermissionGroup.Visit, VisitReportPlugin.PermissionName.TopicsTab, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(VisitReportPlugin.PermissionGroup.Visit, VisitReportPlugin.PermissionName.TopicsTab, VisitReportPlugin.PermissionGroup.Visit, PermissionName.Read);
			Add(VisitReportPlugin.PermissionGroup.Visit, MainPlugin.PermissionName.RelationshipsTab, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(VisitReportPlugin.PermissionGroup.Visit, MainPlugin.PermissionName.RelationshipsTab, VisitReportPlugin.PermissionGroup.Visit, PermissionName.Read);
			Add(MainPlugin.PermissionGroup.Company, VisitReportPlugin.PermissionName.VisitsTab, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(MainPlugin.PermissionGroup.Company, VisitReportPlugin.PermissionName.VisitsTab, MainPlugin.PermissionGroup.Company, PermissionName.Read);

			Add(VisitReportPlugin.PermissionGroup.Topic, PermissionName.Create, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			Add(VisitReportPlugin.PermissionGroup.Topic, PermissionName.Delete, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(VisitReportPlugin.PermissionGroup.Topic, PermissionName.Delete, VisitReportPlugin.PermissionGroup.Topic, PermissionName.Edit);
			Add(VisitReportPlugin.PermissionGroup.Topic, PermissionName.Edit, MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice);
			AddImport(VisitReportPlugin.PermissionGroup.Topic, PermissionName.Edit, VisitReportPlugin.PermissionGroup.Topic, PermissionName.Create);

			Add(PermissionGroup.WebApi, nameof(ContactPersonRelationship), MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(ContactPersonRelationshipType), MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(Visit), MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(VisitAim), MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(VisitTopic), MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice, Roles.APIUser);
			Add(PermissionGroup.WebApi, nameof(VisitStatus), MainPlugin.Roles.FieldSales, MainPlugin.Roles.HeadOfSales, MainPlugin.Roles.InternalSales, MainPlugin.Roles.SalesBackOffice, Roles.APIUser);
		}
	}
}
