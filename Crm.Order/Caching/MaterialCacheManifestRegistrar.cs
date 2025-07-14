namespace Crm.Order.Caching
{

	using Crm.Library.Modularization.Interfaces;
	using Crm.Library.Offline;
	using Crm.Library.Offline.Interfaces;

	public class MaterialCacheManifestRegistrar : CacheManifestRegistrar<MaterialCacheManifest>
	{
		public MaterialCacheManifestRegistrar(IPluginProvider pluginProvider)
			: base(pluginProvider)
		{
		}
		protected override void Initialize()
		{
			CacheJs("orderMaterialJs");
			CacheCss("orderStyleCss");
			Cache("BaseOrder", "AddDelivery");
			Cache("Offer", "AccessoryList");
			Cache("Offer", "CreateOrder");
			Cache("Offer", "CreateTemplate");
			Cache("Offer", "Details");
			Cache("Offer", "Load");
			Cache("Offer", "Pdf");
			Cache("Offer", "Save");
			Cache("Offer", "Copy");
			Cache("Offer", "Cancel");
			Cache("Offer", "EnterCustomerEmail");
			Cache("OfferList", "FilterTemplate");
			Cache("OfferList", "IndexTemplate");
			Cache("OrderList", "FilterTemplate");
			Cache("OrderList", "IndexTemplate");
			Cache("Order", "CreateTemplate");
			Cache("Order", "DetailsTemplate");
			Cache("Order", "Load");
			Cache("Order", "Pdf");
			Cache("Order", "Save");
			Cache("OrderRest", "ArticleGroupsWithChildren");
		}
	}
}