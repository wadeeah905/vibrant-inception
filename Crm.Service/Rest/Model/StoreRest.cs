namespace Crm.Service.Rest.Model
{
	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;
	using Crm.Service.Model;

	[RestTypeFor(DomainType = typeof(Store))]
	public class StoreRest : RestEntityWithExtensionValues
	{
		public string StoreNo { get; set; }
		public string Name { get; set; }
		public string LegacyId { get; set; }
		[ExplicitExpand, NotReceived] public LocationRest[] Locations { get; set; }
	}
}
