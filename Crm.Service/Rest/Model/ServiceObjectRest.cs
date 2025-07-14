namespace Crm.Service.Rest.Model
{
	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;
	using Crm.Rest.Model;

	[RestTypeFor(DomainType = typeof(Crm.Service.Model.ServiceObject))]
	public class ServiceObjectRest : ContactRest
	{
		public string ObjectNo { get; set; }
		public string CategoryKey { get; set; }
		[NotReceived, ExplicitExpand] public AddressRest StandardAddress { get; set; }
		[NotReceived, ExplicitExpand] public AddressRest[] Addresses { get; set; }
		[NotReceived, ExplicitExpand] public InstallationRest[] Installations { get; set; }
		[NotReceived, ExplicitExpand] public UserRest ResponsibleUserUser { get; set; }
		[NotReceived, ExplicitExpand] public Crm.Rest.Model.TagRest[] Tags { get; set; }
	}
}
