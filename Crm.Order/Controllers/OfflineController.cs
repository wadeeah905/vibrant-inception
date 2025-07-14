using Microsoft.AspNetCore.Mvc;

namespace Crm.Order.Controllers
{
	using Crm.Library.Helper;
	using Crm.Library.Modularization;
	using Microsoft.AspNetCore.Authorization;

	[Authorize]
	public class OfflineController : Controller
	{
		[AllowAnonymous]
		[RenderAction("MaterialHeadResource", Priority = 8990)]
		public virtual ActionResult HeadResource()
		{
			return Content(Url.JsResource("Crm.Order","orderMaterialJs"));
		}
		[RenderAction("MaterialTitleResource", Priority = 8990)]
		public virtual ActionResult TitleResource()
		{
			return Content(Url.CssResource("Crm.Order", "orderStyleCss"));
		}
	}
}
