namespace Crm.Order.Controllers
{
	using System;

	using Crm.Library.Helper;
	using Crm.Library.Model;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization;
	using Crm.Library.Services.Interfaces;
	using Crm.Order.Services.Interfaces;
	using Crm.ViewModels;
	using Microsoft.AspNetCore.Authorization;
	using Microsoft.AspNetCore.Mvc;

	[Authorize]
	public class OrderController : Controller
	{
		private readonly IBaseOrderService baseOrderService;
		private readonly IUserService userService;
		private readonly IAppSettingsProvider appSettingsProvider;
		public OrderController(IBaseOrderService baseOrderService, IUserService userService, IAppSettingsProvider appSettingsProvider)
		{
			this.baseOrderService = baseOrderService;
			this.userService = userService;
			this.appSettingsProvider = appSettingsProvider;
		}

		[RequiredPermission(PermissionName.Create, Group = OrderPlugin.PermissionGroup.Order)]
		public virtual ActionResult CreateTemplate()
		{
			return PartialView();
		}

		[RequiredPermission(PermissionName.Read, Group = OrderPlugin.PermissionGroup.Order)]
		public virtual ActionResult DetailsTemplate()
		{
			return PartialView();
		}

		[RenderAction("OrderDetailsTemplateTabHeader")]
		[RequiredPermission(OrderPlugin.PermissionName.SimpleTab, Group = OrderPlugin.PermissionGroup.Order)]
		public virtual ActionResult ListViewTabHeader()
		{
			return PartialView();
		}

		[RenderAction("OrderDetailsTemplateTab")]
		[RequiredPermission(OrderPlugin.PermissionName.SimpleTab, Group = OrderPlugin.PermissionGroup.Order)]
		public virtual ActionResult ListViewTab()
		{
			return PartialView();
		}

		[RequiredPermission(PermissionName.Load, Group = OrderPlugin.PermissionGroup.Order)]
		public virtual ActionResult Load()
		{
			return PartialView();
		}
	
		[HttpGet]
		[RequiredPermission(OrderPlugin.PermissionName.PreviewOrder, Group = OrderPlugin.PermissionGroup.Order)]
		public virtual ActionResult PDF(Guid? orderId)
		{
			if (orderId == null)
			{
				return PartialView("Pdf");
			}
			var order = baseOrderService.GetOrder(orderId.Value);
			if (order == null)
			{
				return null;
			}

			var orderPdf = baseOrderService.CreatePdf(order);
			return new FileContentResult(orderPdf, "application/pdf");
		}

		[HttpGet]
		[RequiredPermission(PermissionName.Edit, Group = OrderPlugin.PermissionGroup.Order)]
		public virtual ActionResult Save()
		{
			return PartialView();
		}

		[RenderAction("OrderDetailsTopMenu", Priority = 100)]
		public virtual ActionResult CompleteTopMenu()
		{
			return PartialView();
		}

		[RenderAction("OrderDetailsTopMenu", Priority = 90)]
		public virtual ActionResult SaveTopMenu()
		{
			return PartialView();
		}

		[RenderAction("OrderDetailsTopMenu", Priority = 85)]
		public virtual ActionResult ExportTopMenu()
		{
			if (appSettingsProvider.GetValue(OrderPlugin.Settings.System.Orders.EnableExport))
				return PartialView();
			return new EmptyResult();
		}
		[RenderAction("OrderDetailsTopMenu", Priority = 80)]
		public virtual ActionResult LoadTopMenu()
		{
			return PartialView();
		}
		[RenderAction("OrderDetailsTopMenu", Priority = 70)]
		public virtual ActionResult SendTopMenu()
		{
			return PartialView();
		}	
		[RenderAction("OrderDetailsTopMenu", Priority = 60)]
		public virtual ActionResult VisibilityTopMenu()
		{
			return PartialView();
		}

		[RenderAction("OrderDetailsTopMenu", Priority = 75)]
		[RenderAction("OrderDetailsTopMenu", Priority = 65)]
		public virtual ActionResult TopMenuDivider()
		{
			return PartialView("ListDivider");
		}

		[RenderAction("OrderDetailsTemplateTabHeader")]
		[RequiredPermission(OrderPlugin.PermissionName.TreeTab, Group = OrderPlugin.PermissionGroup.Order)]
		public virtual ActionResult TreeViewTabHeader()
		{
			return PartialView();
		}

		[RenderAction("OrderDetailsTemplateTab")]
		[RequiredPermission(OrderPlugin.PermissionName.TreeTab, Group = OrderPlugin.PermissionGroup.Order)]
		public virtual ActionResult TreeViewTab()
		{
			return PartialView();
		}

		public virtual ActionResult GetArticlesByKey(string q, int limit)
		{
			return RedirectToAction("GetArticlesByKey", "OrderRest", new { q, limit });
		}

		public virtual ActionResult GetArticlesByDescription(string q, int limit)
		{
			return RedirectToAction("GetArticlesByDescription", "OrderRest", new { q, limit });
		}

		[HttpPost]
		public virtual ActionResult Delete(Guid id)
		{
			var currentUser = userService.CurrentUser;
			var order = baseOrderService.GetOrder(id);
			if (order == null)
			{
				return View("Error/Error", ErrorViewModel.NotFound);
			}
			if (!baseOrderService.OrderCanBeEditedByUser(currentUser, order))
			{
				return new UnauthorizedResult();
			}
			if (!order.IsExported && baseOrderService.OrderCanBeEditedByUser(currentUser, order))
			{ 
				baseOrderService.DeleteOrder(id);
			}
			return new EmptyResult();
		}

		public virtual ActionResult SendMail(Guid id)
		{
			var order = baseOrderService.GetOrder(id);

			return Json(new { wasMailSuccessfullySent = baseOrderService.TrySendMail(order) });
		}
		[RenderAction("ContactDetailsMainTemplate")]
		[RequiredPermission(OrderPlugin.PermissionName.OrderTab, Group = MainPlugin.PermissionGroup.Company)]
		public virtual ActionResult ContactDetailsMainTemplate()
		{
			var model = new CrmModel();
			return View("Template/ContactDetailsMainTemplate", model);
		}
		[RenderAction("ContactDetailsSidebarActionsTemplate")]
		[RequiredPermission(PermissionName.Create, Group = OrderPlugin.PermissionGroup.Order)]
		public virtual ActionResult ContactDetailsSidebarActionsTemplate()
		{
			var model = new CrmModel();
			return View("Template/ContactDetailsSidebarActionsTemplate", model);
		}
		[RenderAction("OrderDetailsPrimaryAction")]
		[RequiredPermission(OrderPlugin.PermissionName.CloseOrder, Group = OrderPlugin.PermissionGroup.Order)]
		public virtual ActionResult CloseOrderPrimaryAction()
		{
			return PartialView("Sidebar/CloseOrderPrimaryAction");
		}
		[RenderAction("OrderDetailsSecondaryAction")]
		public virtual ActionResult PdfSecondaryAction()
		{
			return PartialView("Sidebar/PdfSecondaryAction");
		}
		[RenderAction("OrderDetailsSecondaryAction")]
		[RequiredPermission(OrderPlugin.PermissionName.SendOrder, Group = OrderPlugin.PermissionGroup.Order)]
		public virtual ActionResult SendSecondaryAction()
		{
			return PartialView("Sidebar/SendSecondaryAction");
		}
		public virtual ActionResult AccessoryList()
		{
			return PartialView();
		}
	}
}
