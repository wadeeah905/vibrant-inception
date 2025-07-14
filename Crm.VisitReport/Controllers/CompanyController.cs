using Microsoft.AspNetCore.Mvc;

namespace Crm.VisitReport.Controllers
{
	using Crm.Library.Model;
	using Crm.Library.Modularization;
	using Crm.ViewModels;
	using Microsoft.AspNetCore.Authorization;

	[Authorize]
	public class CompanyController : Controller
	{
		[RenderAction("CompanyDetailsMaterialTabHeader", Priority = 65)]
		[RequiredPermission(VisitReportPlugin.PermissionName.VisitsTab, Group = MainPlugin.PermissionGroup.Company)]
		public virtual ActionResult MaterialVisitsDetailsTabHeader() => PartialView();

		[RenderAction("CompanyDetailsMaterialTab", Priority = 65)]
		[RequiredPermission(VisitReportPlugin.PermissionName.VisitsTab, Group = MainPlugin.PermissionGroup.Company)]
		public virtual ActionResult MaterialVisitsDetailsTab() => PartialView(new CrmModel());

		[RenderAction("CompanyDetailsMaterialTabHeader", Priority = 60)]
		[RequiredPermission(VisitReportPlugin.PermissionName.VisitReportsTab, Group = MainPlugin.PermissionGroup.Company)]
		public virtual ActionResult MaterialVisitReportsTabHeader() => PartialView();

		[RenderAction("CompanyDetailsMaterialTab", Priority = 60)]
		[RequiredPermission(VisitReportPlugin.PermissionName.VisitReportsTab, Group = MainPlugin.PermissionGroup.Company)]
		public virtual ActionResult MaterialVisitReportsTab() => PartialView();
	}
}
