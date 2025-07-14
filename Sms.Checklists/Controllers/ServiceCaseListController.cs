namespace Sms.Checklists.Controllers
{

	using Crm.Library.Modularization;

	using Microsoft.AspNetCore.Mvc;

	public class ServiceCaseListController : Controller
	{
		[RenderAction("ServiceCaseItemTemplateActions", Priority = 200)]
		public virtual ActionResult ItemTemplateServiceCaseChecklistActions()
		{
			return PartialView();
		}
	}
}
