using Microsoft.AspNetCore.Mvc;

namespace Crm.Service.Controllers
{
	using Crm.Library.Model;

	using Microsoft.AspNetCore.Authorization;

	[Authorize]
	public class ServiceOrderMaterialController : Controller
	{
		[RequiredPermission(ServicePlugin.PermissionGroup.ServiceOrder, false, ServicePlugin.PermissionName.EditCost, ServicePlugin.PermissionName.EditMaterial)]
		public virtual ActionResult EditTemplate() => PartialView();
	}
}
