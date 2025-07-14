namespace Crm.Order.Controllers
{
	using Crm.Configurator.ViewModels;
	using Crm.Library.Model;
	using Crm.Library.Model.Authorization.Interfaces;
	using Crm.Library.Modularization;
	using Crm.Library.Services.Interfaces;
	using Crm.Order.Model;
	using Crm.Order.Services.Interfaces;
	using Microsoft.AspNetCore.Authorization;
	using Microsoft.AspNetCore.Mvc;

	[Authorize]
	public class BaseOrderController : Controller
	{
		private readonly IUserService userService;
		private readonly IBaseOrderService baseOrderService;
		private readonly IAuthorizationManager authorizationManager;
		public BaseOrderController(IUserService userService, IBaseOrderService baseOrderService, IAuthorizationManager authorizationManager)
		{
			this.userService = userService;
			this.baseOrderService = baseOrderService;
			this.authorizationManager = authorizationManager;
		}
		[RequiredPermission(OrderPlugin.PermissionName.AddDelivery, Group = OrderPlugin.PermissionGroup.Offer)]
		[RequiredPermission(OrderPlugin.PermissionName.AddDelivery, Group = OrderPlugin.PermissionGroup.Order)]
		public virtual ActionResult AddDelivery()
		{
			return PartialView();
		}

		[RenderAction("OfferDetailsTabHeader", "OrderDetailsTemplateTabHeader", Priority = -100)]
		public virtual ActionResult CalculationTabHeader()
		{
			return PartialView();
		}

		[RenderAction("OfferDetailsTab", "OrderDetailsTemplateTab", Priority = -100)]
		public virtual ActionResult CalculationTab()
		{
			var model = new CalculationViewModel
			{
				DisplayPurchasePrices = authorizationManager.IsAuthorizedForAction(userService.CurrentUser, OrderPlugin.PermissionGroup.Calculation, OrderPlugin.PermissionName.ViewPurchasePrices)
			};
			return PartialView(model);
		}

		public virtual ActionResult Pdf(BaseOrder baseOrder)
		{
			var viewAsPdf = baseOrderService.CreatePdf(baseOrder);
			return new FileContentResult(viewAsPdf, "application/pdf");
		}

		[AllowAnonymous]
		[RenderAction("OrderReportResource", Priority = 100)]
		public virtual ActionResult ReportResources()
		{
			return PartialView();
		}
	}
}
