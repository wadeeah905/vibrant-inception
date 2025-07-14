using Crm.Library.Helper;
using Crm.Library.Modularization;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Customer.Kagema.Controllers
{
	[Authorize]
	public class CustomerController : Controller
	{
		[AllowAnonymous]
		[RenderAction("MaterialHeadResource", Priority = 99)]
		public ActionResult CustomerJsMaterialHeadResource()
		{
			return Content(Url.JsResource("Customer.Kagema", "customerJs") + Url.JsResource("Customer.Kagema", "customerTs"));
		}

		[AllowAnonymous]
		[RenderAction("MaterialTitleResource")]
		public virtual ActionResult CustomerCssMaterialTitleResource()
		{
			return Content(Url.CssResource("Customer.Kagema", "customerCss"));
		}
	
		[AllowAnonymous]
		[RenderAction("TemplateHeadResource", Priority = 0)]
		public virtual ActionResult ServiceTemplateHeadResource()
		{
			return Content(Url.JsResource("Customer.Kagema", "templateReportTs"));
		}
	}
}
