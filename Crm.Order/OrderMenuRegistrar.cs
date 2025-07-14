namespace Crm.Order
{
	using System;
	using Crm.Library.Helper;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Menu;

	public class OrderMenuRegistrar : IMenuRegistrar<MaterialMainMenu>
	{
		private readonly IAppSettingsProvider appSettingsProvider;
		public OrderMenuRegistrar(IAppSettingsProvider appSettingsProvider)
		{
			this.appSettingsProvider = appSettingsProvider;
		}
		public virtual void Initialize(MenuProvider<MaterialMainMenu> menuProvider)
		{
			menuProvider.Register(null, "Sales", iconClass: "zmdi zmdi-money-box", priority: Int32.MaxValue - 100);
			if (appSettingsProvider.GetValue(OrderPlugin.Settings.System.Offers.Enabled))
			{
				menuProvider.Register("Sales", "Offers", priority: 400, url: "~/Crm.Order/OfferList/IndexTemplate");
				menuProvider.AddPermission("Sales", "Offers", OrderPlugin.PermissionGroup.Offer, PermissionName.View);
			}

			menuProvider.Register("Sales", "Orders", priority: 300, url: "~/Crm.Order/OrderList/IndexTemplate");
			menuProvider.AddPermission("Sales", "Orders", OrderPlugin.PermissionGroup.Order, PermissionName.View);
		}
	}
}
