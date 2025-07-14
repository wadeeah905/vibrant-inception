namespace Crm.VisitReport.Controllers
{
	using System;

	using Crm.Library.Helper;
	using Crm.Library.Model;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization;
	using Crm.ViewModels;
	using Crm.VisitReport.Model;
	using Microsoft.AspNetCore.Authorization;
	using Microsoft.AspNetCore.Mvc;

	[Authorize]
	public class VisitReportController : Controller
	{
		[RequiredPermission(PermissionName.Create, Group = VisitReportPlugin.PermissionGroup.VisitReport)]
		public virtual ActionResult CreateTemplate()
		{
			return PartialView();
		}

		[RequiredPermission(PermissionName.Read, Group = VisitReportPlugin.PermissionGroup.VisitReport)]
		public virtual ActionResult DetailsTemplate()
		{
			var model = new CrmModelItem<Type> { Item = typeof(VisitReport) };
			return PartialView("DynamicForm/DetailsModalTemplate", model);
		}

		[RenderAction("VisitReportDynamicFormDetailsModalBody")]
		public virtual ActionResult VisitReportDynamicFormDetailsModalBody()
		{
			return PartialView();
		}

		[RenderAction("VisitReportDynamicFormEditModalBody")]
		public virtual ActionResult VisitReportDynamicFormEditModalBody()
		{
			return PartialView();
		}

		[RequiredPermission(PermissionName.Edit, Group = VisitReportPlugin.PermissionGroup.VisitReport)]
		public virtual ActionResult EditTemplate()
		{
			var model = new CrmModelItem<Type> { Item = typeof(VisitReport) };
			return PartialView("DynamicForm/EditModalTemplate", model);
		}

		[RenderAction("CompanyMaterialDetailsTabExtensions")]
		public virtual ActionResult VisitReportExtensions()
		{
			return PartialView();
		}
		
		[AllowAnonymous]
		[RenderAction("TemplateHeadResource", Priority = 8990)]
		public virtual ActionResult VisitReportResponseResource()
		{
			return Content(Url.JsResource("Crm.VisitReport", "visitReportResponseJs"));
		}

		[AllowAnonymous]
		[RenderAction("DynamicFormResponseHeader")]
		public virtual ActionResult VisitReportResponseHeader()
		{
			return PartialView();
		}
	}
}
