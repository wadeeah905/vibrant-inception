using Crm.Library.Modularization;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Sms.Scheduler.Controllers
{
	[Authorize]
	public class TemplateController : Controller
	{
		public ActionResult MapComponent() => PartialView();

		[RenderAction("CreateAdHocServiceOrderForm", Priority = 450)]
		public virtual ActionResult CreateAdHocServiceOrderFormDispatchResource()
		{
			return PartialView();
		}
	}
}
