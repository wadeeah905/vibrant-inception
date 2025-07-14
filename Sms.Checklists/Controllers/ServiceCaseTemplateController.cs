using Microsoft.AspNetCore.Mvc;

namespace Sms.Checklists.Controllers
{
	using Crm.Library.Modularization;
	using Microsoft.AspNetCore.Authorization;

	[Authorize]
	public class ServiceCaseTemplateController : Controller
	{
		[RenderAction("CreateServiceCaseTemplateForm")]
		public virtual ActionResult CreateServiceCaseTemplateForm()
		{
			return PartialView();
		}

		[RenderAction("ServiceCaseTemplateDetailsTabExtensions", Priority = 50)]
		public virtual ActionResult DetailsChecklistInformation()
		{
			return PartialView();
		}
	}
}
