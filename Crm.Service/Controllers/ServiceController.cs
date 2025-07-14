using Microsoft.AspNetCore.Mvc;

namespace Crm.Service.Controllers
{
	using Crm.Library.Helper;
	using Crm.Library.Modularization;
	using Microsoft.AspNetCore.Authorization;

	[Authorize]
	public class ServiceController : Controller
	{
		[AllowAnonymous]
		[RenderAction("MaterialHeadResource", Priority = 1990)]
		public virtual ActionResult ServiceMaterialHeadResource()
		{
			return Content(Url.JsResource("Crm.Service", "serviceMaterialJs") + Url.JsResource("Crm.Service", "serviceMaterialTs"));
		}
		
		[AllowAnonymous]
		[RenderAction("TemplateHeadResource", Priority = 1990)]
		public virtual ActionResult ServiceTemplateHeadResource()
		{
			return Content(Url.JsResource("Crm.Service", "serviceTemplateTs"));
		}
	}
}
