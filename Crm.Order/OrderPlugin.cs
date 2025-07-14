namespace Crm.Order
{
	using Crm.Library.Configuration;
	using Crm.Library.Modularization;

	[Plugin(Requires = "Crm.Article")]
	public class OrderPlugin : Plugin
	{
		public new static string Name = typeof(OrderPlugin).Namespace;

		public static class PermissionGroup
		{
			public const string Calculation = "Calculation";
			public const string Offer = "Offer";
			public const string OfferItem = "OfferItem";
			public const string Order = "Order";
			public const string OrderItem = "OrderItem";
			public const string Replication = "Replication";
		}

		public static class PermissionName
		{
			public const string AddAccessory = "AddAccessory";
			public const string AddAlternative = "AddAlternative";
			public const string AddDelivery = "AddDelivery";
			public const string AddOption = "AddOption";
			public const string Complete = "Complete";
			public const string CreateOrderFromOffer = "CreateOrderFromOffer";
			public const string CloseOrder = "CloseOrder";
			public const string OfferTab = "OfferTab";
			public const string OrderTab = "OrderTab";
			public const string PreviewOffer = "PreviewOffer";
			public const string PreviewOrder = "PreviewOrder";
			public const string SendOffer = "SendOffer";
			public const string SendOrder = "SendOrder";
			public const string SimpleTab = "SimpleTab";
			public const string SummaryTab = "SummaryTab";
			public const string TreeTab = "TreeTab";
			public const string SeeAllUsersOrders = "SeeAllUsersOrders";
			public const string SeeAllUsersOffers = "SeeAllUsersOffers";
			public const string ViewPurchasePrices = "ViewPurchasePrices";
		}

		public static class Settings
		{
			public static class System
			{
				public static class Offers
				{
					public static SettingDefinition<bool> Enabled => new SettingDefinition<bool>("OffersEnabled", Name);
					public static SettingDefinition<bool> EnableExport => new SettingDefinition<bool>("OffersEnableExport", Name);
					public static SettingDefinition<int> ValidToDefaultTimespan => new SettingDefinition<int>("ValidToDefaultTimespan", Name);
				}
				public static class Orders
				{
					public static SettingDefinition<bool> EnableExport => new SettingDefinition<bool>("OrdersEnableExport", Name);
				}
				public static SettingDefinition<bool> BarcodeEnabled => new SettingDefinition<bool>("OrderBarcodeEnabled", Name);
				public static SettingDefinition<bool> BillingAddressEnabled => new SettingDefinition<bool>("OrderBillingAddressEnabled", Name);
				public static SettingDefinition<bool> ComissionEnabled => new SettingDefinition<bool>("OrderComissionEnabled", Name);
				public static SettingDefinition<bool> DeliveryAddressEnabled => new SettingDefinition<bool>("OrderDeliveryAddressEnabled", Name);
				public static SettingDefinition<bool> ItemDiscountEnabled => new SettingDefinition<bool>("OrderItemDiscountEnabled", Name);
				public static SettingDefinition<bool> PrivateDescriptionEnabled => new SettingDefinition<bool>("OrderPrivateDescriptionEnabled", Name);
				public static SettingDefinition<bool> SignatureEnabled => new SettingDefinition<bool>("OrderSignatureEnabled", Name);
			}
			public static class Report
			{
				public static SettingDefinition<double> HeaderMargin => new SettingDefinition<double>("PDFHeaderMargin", Name);
				public static SettingDefinition<double> FooterMargin => new SettingDefinition<double>("PDFFooterMargin", Name);
				public static SettingDefinition<double> FooterTextPush => new SettingDefinition<double>("PDFFooterTextPush", Name);
			}
		}
	}
}
