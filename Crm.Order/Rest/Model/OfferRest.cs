namespace Crm.Order.Rest.Model
{
	using System;

	using Crm.Library.Rest;

	[RestTypeFor(DomainType = typeof(Order.Model.Offer))]
	public class OfferRest: BaseOrderRest
	{
		public DateTime? ValidTo { get; set; }
		public bool IsLocked { get; set; }
		public string CancelReasonCategoryKey { get; set; }
		public string CancelReasonText { get; set; }
		public OfferRest()
		{
			IsOffer = true;
		}
	}
}
