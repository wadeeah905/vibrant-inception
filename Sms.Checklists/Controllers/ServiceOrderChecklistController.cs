namespace Sms.Checklists.Controllers
{
	using System;

	using Crm.DynamicForms;
	using Crm.Library.Helper;
	using Crm.Library.Model;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization;
	using Crm.Service;
	using Crm.ViewModels;

	using Microsoft.AspNetCore.Authorization;
	using Microsoft.AspNetCore.Mvc;

	using Sms.Checklists.Model;

	[Authorize]
	public class ServiceOrderChecklistController : Controller
	{
		[RequiredPermission(ChecklistsPlugin.PermissionName.AddChecklist, Group = ServicePlugin.PermissionGroup.ServiceOrder)]
		public virtual ActionResult CreateTemplate() => PartialView();

		[RequiredPermission(ChecklistsPlugin.PermissionName.AddPdfChecklist, Group = ServicePlugin.PermissionGroup.ServiceOrder)]
		[RequiredPermission(PermissionName.Read, Group = DynamicFormsPlugin.PermissionGroup.PdfFeature)]
		public virtual ActionResult CreatePdfTemplate() => PartialView();

		[RequiredPermission(PermissionName.Read, Group = ChecklistsPlugin.PermissionGroup.ServiceOrderChecklist)]
		public virtual ActionResult DetailsTemplate()
		{
			var model = new CrmModelItem<Type>
			{
				Item = typeof(ServiceOrderChecklist)
			};
			return PartialView("DynamicForm/DetailsModalTemplate", model);
		}

		[RequiredPermission(PermissionName.Read, Group = ChecklistsPlugin.PermissionGroup.ServiceOrderPdfChecklist)]
		[RequiredPermission(PermissionName.Read, Group = DynamicFormsPlugin.PermissionGroup.PdfFeature)]
		public virtual ActionResult DetailsPdfTemplate()
		{
			var model = new CrmModelItem<Type>
			{
				Item = typeof(ServiceOrderChecklist)
			};
			return PartialView("DynamicForm/DetailsPdfModalTemplate", model);
		}

		[RenderAction("DispatchJobTemplateAttributes", Priority = 50)]
		public virtual ActionResult DispatchJobTemplateAttributes()
		{
			return PartialView();
		}

		[RenderAction("DynamicFormElementActions")]
		[RequiredPermission(PermissionName.Create, Group = ServicePlugin.PermissionGroup.ServiceCase)]
		public virtual ActionResult DynamicFormElementActionCreateServiceCase()
		{
			return PartialView();
		}

		[RenderAction("ServiceOrderChecklistDynamicFormDetailsModalBody")]
		public virtual ActionResult ServiceOrderChecklistDynamicFormDetailsModalBody()
		{
			return PartialView();
		}

		[RenderAction("ServiceOrderChecklistEditModalDynamicFormElement")]
		[RequiredPermission(PermissionName.Create, Group = ServicePlugin.PermissionGroup.ServiceCase)]
		public virtual ActionResult ServiceOrderChecklistEditModalDynamicFormElementServiceCases()
		{
			return PartialView();
		}

		[RequiredPermission(PermissionName.Edit, Group = ChecklistsPlugin.PermissionGroup.ServiceOrderChecklist)]
		public virtual ActionResult EditTemplate()
		{
			var model = new CrmModelItem<Type>
			{
				Item = typeof(ServiceOrderChecklist)
			};
			return PartialView("DynamicForm/EditModalTemplate", model);
		}

		[RequiredPermission(PermissionName.Edit, Group = ChecklistsPlugin.PermissionGroup.ServiceOrderPdfChecklist)]
		[RequiredPermission(PermissionName.Read, Group = DynamicFormsPlugin.PermissionGroup.PdfFeature)]
		public virtual ActionResult EditPdfTemplate()
		{
			var model = new CrmModelItem<Type>
			{
				Item = typeof(ServiceOrderChecklist)
			};
			return PartialView("DynamicForm/EditPdfModalTemplate", model);
		}

		[RequiredPermission(PermissionName.Read, Group = DynamicFormsPlugin.PermissionGroup.PdfFeature)]
		public virtual ActionResult Viewer()
		{
			return View("DynamicForm/PdfViewer");
		}

		[AllowAnonymous]
		[RenderAction("TemplateHeadResource", Priority = 8990)]
		public virtual ActionResult SmsChecklistResponseResource()
		{
			return Content(Url.JsResource("Sms.Checklists", "smsChecklistsResponseJs"));
		}
	}
}
