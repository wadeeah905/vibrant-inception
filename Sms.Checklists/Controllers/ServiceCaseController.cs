using Microsoft.AspNetCore.Mvc;

namespace Sms.Checklists.Controllers
{
	using Crm.Library.Model;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization;
	using Crm.Service;
	using Microsoft.AspNetCore.Authorization;

	[Authorize]
	public class ServiceCaseController : Controller
	{
		[RenderAction("ServiceCaseDetailsMaterialTab", Priority = 90)]
		[RequiredPermission(PermissionName.Index, Group = ChecklistsPlugin.PermissionGroup.ServiceCaseChecklist)]
		public virtual ActionResult ChecklistsTab()
		{
			return PartialView();
		}
		[RenderAction("ServiceCaseDetailsMaterialTabHeader", Priority = 90)]
		[RequiredPermission(PermissionName.Index, Group = ChecklistsPlugin.PermissionGroup.ServiceCaseChecklist)]
		public virtual ActionResult ChecklistsTabHeader()
		{
			return PartialView();
		}
		[RenderAction("CreateServiceCaseForm")]
		public virtual ActionResult CreateServiceCaseForm()
		{
			return PartialView();
		}
		[RenderAction("CreateServiceCaseFormBasicInformation")]
		public virtual ActionResult CreateServiceCaseFormBasicInformation()
		{
			return PartialView();
		}
		[RequiredPermission(PermissionName.Create, Group = ServicePlugin.PermissionGroup.ServiceCase)]
		public virtual ActionResult CreateTemplateForm()
		{
			return PartialView();
		}
		[RenderAction("ServiceCaseDetailsBasicInformationEdit")]
		public virtual ActionResult DetailsBasicInformationEdit()
		{
			return PartialView();
		}
		[RenderAction("ServiceCaseDetailsBasicInformationView")]
		public virtual ActionResult DetailsBasicInformationView()
		{
			return PartialView();
		}
	}
}
