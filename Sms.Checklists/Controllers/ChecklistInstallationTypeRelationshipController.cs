using Microsoft.AspNetCore.Mvc;

namespace Sms.Checklists.Controllers
{
	using Crm.Library.Modularization;
	using Microsoft.AspNetCore.Authorization;

	[Authorize]
	public class ChecklistInstallationTypeRelationshipController : Controller
	{
		[RenderAction("FormDesignerSidebarTabContent", Priority = 50)]
		public virtual ActionResult FormDesignerSidebarTabContent()
		{
			return PartialView();
		}
		
		[RenderAction("FormDesignerSidebarTabHeader", Priority = 50)]
		public virtual ActionResult FormDesignerSidebarTabHeader()
		{
			return PartialView();
		}
	}
}
