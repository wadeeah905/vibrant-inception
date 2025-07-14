namespace Crm.VisitReport.Controllers
{
	using Crm.Library.Helper;
	using Crm.Library.Model;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization;
	using Microsoft.AspNetCore.Authorization;
	using Microsoft.AspNetCore.Mvc;

	[Authorize]
	public class VisitController : Controller
	{
		[RequiredPermission(PermissionName.Create, Group = VisitReportPlugin.PermissionGroup.Visit)]
		public virtual ActionResult CreateTemplate() => PartialView();
		[RequiredPermission(PermissionName.Read, Group = VisitReportPlugin.PermissionGroup.Visit)]
		public virtual ActionResult DetailsTemplate() => PartialView();
		[RequiredPermission(PermissionName.Edit, Group = VisitReportPlugin.PermissionGroup.Visit)]
		public virtual ActionResult EditTemplate() => PartialView();
		[RenderAction("CompanyItemTemplateActions", Priority = 50)]
		[RequiredPermission(PermissionName.Create, Group = VisitReportPlugin.PermissionGroup.Visit)]
		public virtual ActionResult CompanyItemTemplateActions() => PartialView("CompanyItemTemplateActions");

		[RenderAction("MaterialHeadResource", Priority = 1990)]
		public virtual ActionResult HeadResource()
		{
			return Content(Url.JsResource("Crm.VisitReport", "visitReportMaterialJs") + Url.JsResource("Crm.VisitReport", "visitReportMaterialTs"));
		}
	}
}
