namespace Crm.Service.Rest.Model
{
	using System;

	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;
	using Crm.Service.Model.Relationships;

	[RestTypeFor(DomainType = typeof(ServiceContractInstallationRelationship))]
	public class ServiceContractInstallationRelationshipRest : RestEntityWithExtensionValues
	{
		[ExplicitExpand]
		[NotReceived]
		public InstallationRest Child { get; set; }
		public Guid ChildId { get; set; }
		public string Information { get; set; }
		[ExplicitExpand]
		[NotReceived]
		public ServiceContractRest Parent { get; set; }
		public Guid ParentId { get; set; }
		public virtual TimeSpan? TimeAllocation { get; set; }
	}
}
