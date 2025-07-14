using Microsoft.AspNetCore.Mvc;

namespace Crm.VisitReport.Controllers
{
	using Crm.Library.Model;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization;
	using Crm.ViewModels;
	using Microsoft.AspNetCore.Authorization;
	using PermissionGroup = VisitReportPlugin.PermissionGroup;

	[Authorize]
	public class VisitDetailsController : Controller
	{
		[RenderAction("VisitDetailsMaterialTab", Priority = 100)]
		public virtual ActionResult MaterialDetailsTab()
		{
			return PartialView();
		}

		[RenderAction("VisitDetailsMaterialTabHeader", Priority = 100)]
		public virtual ActionResult MaterialDetailsTabHeader() => PartialView();

		[RenderAction("VisitDetailsMaterialTab", Priority = 90)]
		[RequiredPermission(VisitReportPlugin.PermissionName.TopicsTab, Group = PermissionGroup.Visit)]
		public virtual ActionResult MaterialTopicsTab() => PartialView();

		[RenderAction("VisitDetailsMaterialTabHeader", Priority = 90)]
		[RequiredPermission(VisitReportPlugin.PermissionName.TopicsTab, Group = PermissionGroup.Visit)]
		public virtual ActionResult MaterialTopicsTabHeader() => PartialView();

		[RenderAction("VisitDetailsMaterialTab", Priority = 80)]
		[RequiredPermission(MainPlugin.PermissionName.NotesTab, Group = PermissionGroup.Visit)]
		public virtual ActionResult MaterialNotesTab() => PartialView();

		[RenderAction("VisitDetailsMaterialTabHeader", Priority = 80)]
		[RequiredPermission(MainPlugin.PermissionName.NotesTab, Group = PermissionGroup.Visit)]
		public virtual ActionResult MaterialNotesTabHeader() => PartialView();

		[RenderAction("VisitDetailsMaterialTab", Priority = 60)]
		[RequiredPermission(PermissionName.Read, Group = PermissionGroup.Visit)]
		public virtual ActionResult MaterialRelationshipsTab() => PartialView();

		[RenderAction("VisitDetailsMaterialTabHeader", Priority = 60)]
		[RequiredPermission(PermissionName.Read, Group = PermissionGroup.Visit)]
		public virtual ActionResult MaterialRelationshipsTabHeader() => PartialView();

		[RenderAction("VisitDetailsMaterialTab", Priority = 70)]
		[RequiredPermission(MainPlugin.PermissionName.TasksTab, Group = PermissionGroup.Visit)]
		public virtual ActionResult MaterialTasksTab() => PartialView(new CrmModel());

		[RenderAction("VisitDetailsMaterialTabHeader", Priority = 70)]
		[RequiredPermission(MainPlugin.PermissionName.TasksTab, Group = PermissionGroup.Visit)]
		public virtual ActionResult MaterialTasksTabHeader() => PartialView();

		[RenderAction("VisitDetailsMaterialTabHeader", Priority = 60)]
		[RequiredPermission(VisitReportPlugin.PermissionName.VisitReportsTab, Group = PermissionGroup.Visit)]
		public virtual ActionResult MaterialVisitReportsTabHeader() => PartialView();

		[RenderAction("VisitDetailsMaterialTab", Priority = 60)]
		[RequiredPermission(VisitReportPlugin.PermissionName.VisitReportsTab, Group = PermissionGroup.Visit)]
		public virtual ActionResult MaterialVisitReportsTab() => PartialView();

		[RenderAction("VisitDetailsMaterialTabHeader", Priority = 50)]
		public virtual ActionResult MaterialDocumentsTabHeader()
		{
			return PartialView("ContactDetails/MaterialDocumentsTabHeader");
		}

		[RenderAction("VisitDetailsMaterialTab", Priority = 50)]
		public virtual ActionResult MaterialDocumentsTab()
		{
			return PartialView("ContactDetails/MaterialDocumentsTab");
		}

		[RenderAction("VisitDetailsTopMenu")]
		public virtual ActionResult TopMenu() => PartialView();
	}
}
