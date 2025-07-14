namespace Crm.Service.Controllers
{
	using Crm.Library.Model;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization;
	using Crm.Service;
	using Microsoft.AspNetCore.Authorization;
	using Microsoft.AspNetCore.Mvc;

	[Authorize]
	public class StoreDetailsController : Controller
	{
		[RenderAction("StoreDetailsMaterialTabHeader", Priority = 100)]
		public virtual ActionResult MaterialDetailsTabHeader()
		{
			return PartialView();
		}

		[RenderAction("StoreDetailsMaterialTab", Priority = 100)]
		public virtual ActionResult MaterialDetailsTab()
		{
			return PartialView();
		}
		[RenderAction("StoreDetailsMaterialTabHeader", Priority = 100)]
		public virtual ActionResult MaterialLocationsTabHeader()
		{
			return PartialView();
		}

		[RenderAction("StoreDetailsMaterialTab", Priority = 100)]
		public virtual ActionResult MaterialLocationsTab()
		{
			return PartialView();
		}
		[RenderAction("LocationItemTemplateActions")]
		public virtual ActionResult LocationActionDetails()
		{
			return PartialView();
		}
		[RequiredPermission(PermissionName.Create, Group = ServicePlugin.PermissionGroup.Location)]
		[RenderAction("StoreMaterialsTabPrimaryAction")]
		public virtual ActionResult MaterialPrimaryActionAddLocation() => PartialView();
	}
}
