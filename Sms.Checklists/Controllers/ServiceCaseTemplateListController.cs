using Microsoft.AspNetCore.Mvc;

namespace Sms.Checklists.Controllers
{
	using Crm.Library.Modularization;
	using Microsoft.AspNetCore.Authorization;

	[Authorize]
	public class ServiceCaseTemplateListController : Controller
	{
		[RenderAction("ServiceCaseTemplateListFilterTemplate")]
		public virtual ActionResult DynamicFormFilters()
		{
			return PartialView();
		}

		[RenderAction("ServiceCaseTemplateItemExtensions")]
		public virtual ActionResult ServiceCaseTemplateItemExtensions()
		{
			return PartialView();
		}
	}
}
