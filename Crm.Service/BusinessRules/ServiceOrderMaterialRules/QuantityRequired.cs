namespace Crm.Service.BusinessRules.ServiceOrderMaterialRules
{
	using Crm.Library.Extensions;
	using Crm.Library.Globalization.Lookup;
	using Crm.Library.Validation.BaseRules;
	using Crm.Service.Model;
	using Crm.Service.Model.Lookup;

	public class EstimatedQuantityRequired : RequiredRule<ServiceOrderMaterial>
	{
		private readonly ILookupManager lookupManager;
		public EstimatedQuantityRequired(ILookupManager lookupManager)
		{
			this.lookupManager = lookupManager;
			Init(m => m.EstimatedQty);
		}

		protected override bool IsIgnoredFor(ServiceOrderMaterial material)
		{
			return material.ActualQty > 0 || material.InvoiceQty > 0 || Helper.OrderClosed(material, lookupManager);
		}
	}

	public class ActualQuantityRequired : RequiredRule<ServiceOrderMaterial>
	{
		private readonly ILookupManager lookupManager;
		public ActualQuantityRequired(ILookupManager lookupManager)
		{
			this.lookupManager = lookupManager;
			Init(m => m.ActualQty, "Quantity");
		}

		protected override bool IsIgnoredFor(ServiceOrderMaterial material)
		{
			return material.EstimatedQty > 0 || material.InvoiceQty > 0 || Helper.OrderClosed(material, lookupManager);
		}
	}

	public class InvoiceQuantityRequired : RequiredRule<ServiceOrderMaterial>
	{
		private readonly ILookupManager lookupManager;
		public InvoiceQuantityRequired(ILookupManager lookupManager)
		{
			this.lookupManager = lookupManager;
			Init(m => m.InvoiceQty);
		}

		protected override bool IsIgnoredFor(ServiceOrderMaterial material)
		{
			return material.ActualQty > 0 || material.EstimatedQty > 0 || Helper.OrderClosed(material, lookupManager);
		}
	}

	internal static class Helper
	{
		internal static bool OrderClosed(ServiceOrderMaterial material, ILookupManager lookupManager)
		{
			ServiceOrderStatus orderStatus = null;
			if (material.ServiceOrderHead != null && material.ServiceOrderHead.StatusKey.IsNotNullOrEmpty())
			{
				orderStatus = lookupManager.Get<ServiceOrderStatus>(material.ServiceOrderHead.StatusKey);
			}

			return orderStatus != null && orderStatus.BelongsToClosed();
		}
	}
}
