using Microsoft.AspNetCore.Mvc;

namespace Crm.Order.Controllers
{
	using Crm.Library.Helper;
	using Crm.Library.Model;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization;
	using Microsoft.AspNetCore.Authorization;

	[Authorize]
	public class OfferController : Controller
	{
		private readonly IAppSettingsProvider appSettingsProvider;
		public OfferController(IAppSettingsProvider appSettingsProvider)
		{
			this.appSettingsProvider = appSettingsProvider;
		}
		
		[RequiredPermission(OrderPlugin.PermissionName.AddAccessory, Group = OrderPlugin.PermissionGroup.Offer)]
		public virtual ActionResult AccessoryList()
		{
			return PartialView();
		}
		[RequiredPermission(OrderPlugin.PermissionName.CreateOrderFromOffer, Group = OrderPlugin.PermissionGroup.Offer)]
		public virtual ActionResult CreateOrder()
		{
			return PartialView();
		}
		[RequiredPermission(OrderPlugin.PermissionName.CreateOrderFromOffer, Group = OrderPlugin.PermissionGroup.Offer)]
		public virtual ActionResult Copy()
		{
			return PartialView();
		}
		[RequiredPermission(OrderPlugin.PermissionName.SendOffer, Group = OrderPlugin.PermissionGroup.Offer)]
		public virtual ActionResult EnterCustomerEmail()
		{
			return PartialView();
		}
		[RequiredPermission(OrderPlugin.PermissionName.CreateOrderFromOffer, Group = OrderPlugin.PermissionGroup.Offer)]
		public virtual ActionResult Cancel()
		{
			return PartialView();
		}
		[RequiredPermission(PermissionName.Create, Group = OrderPlugin.PermissionGroup.Offer)]
		public virtual ActionResult CreateTemplate()
		{
			return PartialView();
		}

		[RequiredPermission(PermissionName.Read, Group = OrderPlugin.PermissionGroup.Offer)]
		public virtual ActionResult Details()
		{
			return PartialView();
		}

		[RenderAction("OfferDetailsTabHeader")]
		[RequiredPermission(OrderPlugin.PermissionName.SimpleTab, Group = OrderPlugin.PermissionGroup.Offer)]
		public virtual ActionResult ListViewTabHeader()
		{
			return PartialView();
		}

		[RenderAction("OfferDetailsTab")]
		[RequiredPermission(OrderPlugin.PermissionName.SimpleTab, Group = OrderPlugin.PermissionGroup.Offer)]
		public virtual ActionResult ListViewTab()
		{
			return PartialView();
		}

		[RequiredPermission(PermissionName.Load, Group = OrderPlugin.PermissionGroup.Offer)]
		public virtual ActionResult Load()
		{
			return PartialView();
		}

		[RequiredPermission(OrderPlugin.PermissionName.PreviewOffer, Group = OrderPlugin.PermissionGroup.Offer)]
		public virtual ActionResult Pdf()
		{
			return PartialView();
		}

		[RequiredPermission(PermissionName.Edit, Group = OrderPlugin.PermissionGroup.Offer)]
		public virtual ActionResult Save()
		{
			return PartialView();
		}

		[RenderAction("OfferDetailsTopMenu", Priority = 100)]
		public virtual ActionResult SaveTopMenu()
		{
			return PartialView();
		}
		[RenderAction("OfferDetailsTopMenu", Priority = 95)]
		public virtual ActionResult CancelTopMenu()
		{
			return PartialView();
		}
		[RenderAction("OfferDetailsTopMenu", Priority = 90)]
		public virtual ActionResult LoadTopMenu()
		{
			return PartialView();
		}
		[RenderAction("OfferDetailsTopMenu", Priority = 80)]
		public virtual ActionResult SendTopMenu()
		{
			return PartialView();
		}
		[RenderAction("OfferDetailsTopMenu", Priority = 77)]
		public virtual ActionResult ExportTopMenu()
		{
			if (appSettingsProvider.GetValue(OrderPlugin.Settings.System.Offers.EnableExport))
				return PartialView();
			return new EmptyResult();
		}
		[RenderAction("OfferDetailsTopMenu", Priority = 70)]
		public virtual ActionResult VisibilityTopMenu()
		{
			return PartialView();
		}
		[RenderAction("OfferDetailsTopMenu", Priority = 60)]
		public virtual ActionResult CopyOfferTopMenu()
		{
			return PartialView();
		}
		[RenderAction("OfferDetailsTopMenu", Priority = -50)]
		[RequiredPermission(OrderPlugin.PermissionName.CreateOrderFromOffer, Group = OrderPlugin.PermissionGroup.Offer)]
		public virtual ActionResult CreateOrderFromOfferTopMenu()
		{
			return PartialView();
		}
		[RenderAction("OfferDetailsTopMenu", Priority = 85)]
		[RenderAction("OfferDetailsTopMenu", Priority = 75)]
		public virtual ActionResult TopMenuDivider()
		{
			return PartialView("ListDivider");
		}

		[RenderAction("OfferDetailsTabHeader")]
		[RequiredPermission(OrderPlugin.PermissionName.TreeTab, Group = OrderPlugin.PermissionGroup.Offer)]
		public virtual ActionResult TreeViewTabHeader()
		{
			return PartialView();
		}

		[RenderAction("OfferDetailsTab")]
		[RequiredPermission(OrderPlugin.PermissionName.TreeTab, Group = OrderPlugin.PermissionGroup.Offer)]
		public virtual ActionResult TreeViewTab()
		{
			return PartialView();
		}
	}
}
