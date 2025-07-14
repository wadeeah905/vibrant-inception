namespace Crm.Service.Controllers
{
	using Crm.Library.Model;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Microsoft.AspNetCore.Authorization;
	using Microsoft.AspNetCore.Mvc;

	[Authorize]
	public class StoreController : Controller
	{
		[RequiredPermission(PermissionName.Read, Group = ServicePlugin.PermissionGroup.Store)]
		public virtual ActionResult DetailsTemplate()
		{
			return PartialView();
		}
		[RequiredPermission(PermissionName.Edit, Group = ServicePlugin.PermissionGroup.Store)]
		public virtual ActionResult EditTemplate()
		{
			return PartialView();
		}
	}
}
