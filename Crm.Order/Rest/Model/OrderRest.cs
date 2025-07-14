namespace Crm.Order.Rest.Model
{
	using System;

	using Crm.Library.Rest;
	using Crm.Order.Model;

	[RestTypeFor(DomainType = typeof(Order))]
	public class OrderRest : BaseOrderRest
	{
		public Guid? OfferId { get; set; }

		public OrderRest()
		{
			IsOffer = false;
		}
	}
}
