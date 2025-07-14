namespace Crm.VisitReport.Rest.Model
{
	using System;

	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;
	using Crm.Rest.Model;
	using Crm.VisitReport.Model.Relationships;

	[RestTypeFor(DomainType = typeof(ContactPersonRelationship))]
	public class ContactPersonRelationshipRest : RestEntityWithExtensionValues
	{
		public Guid ParentId { get; set; }
		public Guid ChildId { get; set; }
		public string Information { get; set; }
		public string RelationshipTypeKey { get; set; }
		[ExplicitExpand, NotReceived] public PersonRest Child { get; set; }
	}
}
