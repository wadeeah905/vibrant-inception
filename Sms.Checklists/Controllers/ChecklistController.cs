namespace Sms.Checklists.Controllers
{
	using Crm.Library.Helper;
	using Crm.Library.Model;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization;

	using Microsoft.AspNetCore.Mvc;
	using Microsoft.AspNetCore.Authorization;

	[Authorize]
	public class ChecklistController : Controller
	{
		[RenderAction("DispatchChecklistsTabPrimaryAction")]
		public virtual ActionResult PrimaryActionAddServiceOrderChecklist() => PartialView();

		[RenderAction("DispatchDetailsMaterialTabHeader", Priority = 55)]
		[RenderAction("ServiceOrderDetailsMaterialTabHeader", Priority = 55)]
		[RenderAction("ServiceOrderTemplateDetailsTabHeader", Priority = 55)]
		[RequiredPermission(PermissionName.Index, Group = ChecklistsPlugin.PermissionGroup.ServiceOrderChecklist)]
		public virtual ActionResult MaterialChecklistsTabHeader() => PartialView();

		[RenderAction("DispatchDetailsMaterialTab", Priority = 55)]
		[RenderAction("ServiceOrderDetailsMaterialTab", Priority = 55)]
		[RenderAction("ServiceOrderTemplateDetailsTab", Priority = 55)]
		[RequiredPermission(PermissionName.Index, Group = ChecklistsPlugin.PermissionGroup.ServiceOrderChecklist)]
		public virtual ActionResult MaterialChecklistsTab() => PartialView();

		[AllowAnonymous]
		[RenderAction("MaterialHeadResource", Priority = 1500)]
		public virtual ActionResult MaterialHeadResource() => Content(Url.JsResource("Sms.Checklists", "smsChecklistsMaterialJs") + Url.JsResource("Sms.Checklists", "smsChecklistsMaterialTs") + Url.JsResource("Crm.DynamicForms", "dynamicFormsViewerJs"));

		[RenderAction("DynamicFormResponseHeader")]
		[AllowAnonymous]
		public virtual ActionResult ChecklistResponseHeader() => PartialView("ChecklistResponseHeader");

		[RenderAction("DynamicFormResponseFooter")]
		[AllowAnonymous]
		public virtual ActionResult ChecklistResponseFooter() => PartialView("ChecklistResponseFooter");
	}
}
