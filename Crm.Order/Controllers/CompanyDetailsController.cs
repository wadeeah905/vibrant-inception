using Microsoft.AspNetCore.Mvc;

namespace Crm.Order.Controllers
{
	using Crm.Library.Helper;
	using Crm.Library.Model;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization;
	using Crm.ViewModels;
	using Microsoft.AspNetCore.Authorization;

	[Authorize]
	public class CompanyDetailsController : Controller
	{
		private readonly IAppSettingsProvider appSettingsProvider;
		public CompanyDetailsController(IAppSettingsProvider appSettingsProvider)
		{
			this.appSettingsProvider = appSettingsProvider;
		}

		[RenderAction("CompanyDetailsMaterialTabHeader", Priority = 40)]
		[RequiredPermission(PermissionName.Read, Group = OrderPlugin.PermissionGroup.Offer)]
		[RequiredPermission(OrderPlugin.PermissionName.OfferTab, Group = MainPlugin.PermissionGroup.Company)]
		public virtual ActionResult MaterialOffersTabHeader()
		{
			if (!appSettingsProvider.GetValue(OrderPlugin.Settings.System.Offers.Enabled))
			{
				return new EmptyResult();
			}

			return PartialView();
		}

		[RenderAction("CompanyDetailsMaterialTab", Priority = 40)]
		[RequiredPermission(PermissionName.Read, Group = OrderPlugin.PermissionGroup.Offer)]
		[RequiredPermission(OrderPlugin.PermissionName.OfferTab, Group = MainPlugin.PermissionGroup.Company)]
		public virtual ActionResult MaterialOffersTab()
		{
			if (!appSettingsProvider.GetValue(OrderPlugin.Settings.System.Offers.Enabled))
			{
				return new EmptyResult();
			}

			return PartialView(new CrmModel());
		}

		[RenderAction("CompanyDetailsMaterialTabHeader", Priority = 30)]
		[RequiredPermission(PermissionName.Read, Group = OrderPlugin.PermissionGroup.Order)]
		[RequiredPermission(OrderPlugin.PermissionName.OrderTab, Group = MainPlugin.PermissionGroup.Company)]
		public virtual ActionResult MaterialOrdersTabHeader()
		{
			return PartialView();
		}

		[RenderAction("CompanyDetailsMaterialTab", Priority = 30)]
		[RequiredPermission(PermissionName.Read, Group = OrderPlugin.PermissionGroup.Order)]
		[RequiredPermission(OrderPlugin.PermissionName.OrderTab, Group = MainPlugin.PermissionGroup.Company)]
		public virtual ActionResult MaterialOrdersTab()
		{
			return PartialView(new CrmModel());
		}
	}
}
