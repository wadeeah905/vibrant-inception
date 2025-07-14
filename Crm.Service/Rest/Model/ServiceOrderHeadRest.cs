namespace Crm.Service.Rest.Model
{
	using System;
	using System.Collections.Generic;

	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;
	using Crm.Library.Rest.Model;
	using Crm.Rest.Model;
	using Crm.Service.Model;

	using AddressRest = Crm.Rest.Model.AddressRest;
	using DocumentAttributeRest = Crm.Rest.Model.DocumentAttributeRest;
	using UserRest = Crm.Rest.Model.UserRest;

	[RestTypeFor(DomainType = typeof(ServiceOrderHead))]
	public class ServiceOrderHeadRest : ContactRest
	{
		public bool IsTemplate { get; set; }
		public string OrderNo { get; set; }
		public DateTime? Planned { get; set; }
		public TimeSpan? PlannedTime { get; set; }
		public bool PlannedDateFix { get; set; }
		public DateTime? Deadline { get; set; }
		public double? Latitude { get; set; }
		public double? Longitude { get; set; }
		public string TypeKey { get; set; }
		[ExplicitExpand, NotReceived] public UsergroupRest UserGroup { get; set; }
		public Guid? UserGroupKey { get; set; }
		public string StatusKey { get; set; }
		public string PriorityKey { get; set; }
		public bool IsCostLumpSum { get; set; }
		public bool IsMaterialLumpSum { get; set; }
		public bool IsTimeLumpSum { get; set; }
		public string InvoicingTypeKey { get; set; }
		public string NoInvoiceReasonKey { get; set; }
		public List<string> ReportRecipients { get; set; }
		public Guid? MaintenancePlanningRun { get; set; }
		public string ErrorMessage { get; set; }
		public DateTime? Reported { get; set; }
		public DateTime? Closed { get; set; }
		public string PurchaseOrderNo { get; set; }
		public DateTime? PurchaseDate { get; set; }
		public string CommissionNo { get; set; }
		public string CommissioningStatusKey { get; set; }
		public string Name1 { get; set; }
		public string Name2 { get; set; }
		public string Name3 { get; set; }
		public string Street { get; set; }
		public string City { get; set; }
		public string ZipCode { get; set; }
		public string CountryKey { get; set; }
		public string RegionKey { get; set; }
		public string ServiceLocationPhone { get; set; }
		public string ServiceLocationMobile { get; set; }
		public string ServiceLocationFax { get; set; }
		public string ServiceLocationEmail { get; set; }
		public string ServiceLocationResponsiblePerson { get; set; }
		public Guid? PreferredTechnicianUsergroupKey { get; set; }
		[ExplicitExpand, NotReceived] public UsergroupRest PreferredTechnicianUsergroupObject { get; set; }
		public string CloseReason { get; set; }
		public Guid? MaintenancePlanId { get; set; }
		[RestrictedField] public string[] RequiredSkillKeys { get; set; }
		public string PreferredTechnician { get; set; }
		[ExplicitExpand, NotReceived] public UserRest PreferredTechnicianUser { get; set; }
		[ExplicitExpand, NotReceived] public UserRest ResponsibleUserUser { get; set; }
		public Guid? StationKey { get; set; }
		[ExplicitExpand, NotReceived] public StationRest Station { get; set; }
		public Guid? CustomerContactId { get; set; }
		[ExplicitExpand, NotReceived] public CompanyRest Company { get; set; }
		public Guid? InitiatorId { get; set; }
		[ExplicitExpand, NotReceived] public CompanyRest Initiator { get; set; }
		public Guid? PayerId { get; set; }
		[ExplicitExpand, NotReceived] public CompanyRest Payer { get; set; }
		public Guid? PayerAddressId { get; set; }
		[ExplicitExpand, NotReceived] public AddressRest PayerAddress { get; set; }
		public Guid? InvoiceRecipientId { get; set; }
		[ExplicitExpand, NotReceived] public CompanyRest InvoiceRecipient { get; set; }
		public Guid? InvoiceRecipientAddressId { get; set; }
		[ExplicitExpand, NotReceived] public AddressRest InvoiceRecipientAddress { get; set; }
		public Guid? InitiatorPersonId { get; set; }
		[ExplicitExpand, NotReceived] public PersonRest InitiatorPerson { get; set; }
		public Guid? InstallationId { get; set; }
		[ExplicitExpand, NotReceived] public InstallationRest Installation { get; set; }
		public Guid? ServiceObjectId { get; set; }
		[ExplicitExpand, NotReceived] public ServiceObjectRest ServiceObject { get; set; }
		[ExplicitExpand, NotReceived] public ServiceOrderHeadRest ServiceOrderTemplate { get; set; }
		public Guid? ServiceOrderTemplateId { get; set; }
		public Guid? ServiceCaseKey { get; set; }
		[NotReceived] public string ServiceCaseNo { get; set; }
		[ExplicitExpand, NotReceived] public ServiceCaseRest ServiceCase { get; set; }
		public Guid? ServiceContractId { get; set; }
		[ExplicitExpand, NotReceived] public ServiceContractRest ServiceContract { get; set; }
		[ExplicitExpand, NotReceived] public ServiceOrderMaterialRest[] ServiceOrderMaterials { get; set; }
		[ExplicitExpand, NotReceived] public ServiceOrderTimeRest[] ServiceOrderTimes { get; set; }
		[ExplicitExpand, NotReceived] public ServiceOrderTimePostingRest[] ServiceOrderTimePostings { get; set; }
		[ExplicitExpand, NotReceived] public ServiceOrderDispatchRest[] Dispatches { get; set; }
		[ExplicitExpand, NotReceived] public DocumentAttributeRest[] DocumentAttributes { get; set; }
		[NotReceived] public override string Name { get; set; }
		[ExplicitExpand, NotReceived] public TagRest[] Tags { get; set; }
		public string StatisticsKeyProductTypeKey { get; set; }
		public string StatisticsKeyMainAssemblyKey { get; set; }
		public string StatisticsKeySubAssemblyKey { get; set; }
		public string StatisticsKeyAssemblyGroupKey { get; set; }
		public string StatisticsKeyFaultImageKey { get; set; }
		public string StatisticsKeyRemedyKey { get; set; }
		public string StatisticsKeyCauseKey { get; set; }
		public string StatisticsKeyWeightingKey { get; set; }
		public string StatisticsKeyCauserKey { get; set; }
		public string CurrencyKey { get; set; }
	}
}
