namespace Crm.Service.Rest.Model
{
	using System;

	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;
	using Crm.Rest.Model;
	using Crm.Service.Model.Relationships;

	[RestTypeFor(DomainType = typeof(InstallationAddressRelationship))]
	public class InstallationAddressRelationshipRest : RestEntityWithExtensionValues
	{
		public Guid ChildId { get; set; }
		public string Information { get; set; }
		public Guid ParentId { get; set; }
		public string RelationshipTypeKey { get; set; }
		[ExplicitExpand]
		[NotReceived]
		public AddressRest Child { get; set; }
		[ExplicitExpand]
		[NotReceived]
		public InstallationRest Parent { get; set; }
	}
}
