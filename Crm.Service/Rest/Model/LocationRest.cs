namespace Crm.Service.Rest.Model
{
	using System;

	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;
	using Crm.Service.Model;

	[RestTypeFor(DomainType = typeof(Location))]
	public class LocationRest : RestEntityWithExtensionValues
	{
		public string LocationNo { get; set; }
		public Guid StoreId { get; set; }
		[ExplicitExpand, NotReceived] public StoreRest Store { get; set; }
	}
}
