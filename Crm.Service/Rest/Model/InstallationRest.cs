namespace Crm.Service.Rest.Model
{
	using System;

	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;
	using Crm.Library.Rest.Model;
	using Crm.Rest.Model;
	using Crm.Service.Model;

	using AddressRest = Crm.Rest.Model.AddressRest;

	[RestTypeFor(DomainType = typeof(Installation))]
	public class InstallationRest : ContactRest
	{
		public string InstallationNo { get; set; }
		public string LegacyInstallationId { get; set; }
		public string InstallationTypeKey { get; set; }
		public string Description { get; set; }
		public Guid? LocationAddressKey { get; set; }
		public Guid? LocationContactId { get; set; }
		public Guid? LocationPersonId { get; set; }
		public Guid? FolderId { get; set; }
		public string StatusKey { get; set; }
		public virtual string ManufacturerKey { get; set; }
		public string PreferredUser { get; set; }
		public DateTime? ManufactureDate { get; set; }
		public DateTime? KickOffDate { get; set; }
		public DateTime? WarrantyFrom { get; set; }
		public DateTime? WarrantyUntil { get; set; }
		public string TechnicianInformation { get; set; }
		public string ExactPlace { get; set; }
		public string Room { get; set; }
		public string ExternalReference { get; set; }
		public Guid? StationKey { get; set; }
		[ExplicitExpand, NotReceived] public StationRest Station { get; set; }
		[ExplicitExpand, NotReceived] public AddressRest Address { get; set; }
		[ExplicitExpand, NotReceived] public CompanyRest Company { get; set; }
		[ExplicitExpand, NotReceived] public PersonRest Person { get; set; }
		[ExplicitExpand, NotReceived] public UserRest PreferredUserUser { get; set; }
		[ExplicitExpand, NotReceived] public UserRest ResponsibleUserUser { get; set; }
		[ExplicitExpand, NotReceived] public ServiceContractInstallationRelationshipRest[] ServiceContractInstallationRelationships { get; set; }
		[ExplicitExpand, NotReceived] public ServiceObjectRest ServiceObject { get; set; }
		[ExplicitExpand, NotReceived] public TagRest[] Tags { get; set; }
	}
}
