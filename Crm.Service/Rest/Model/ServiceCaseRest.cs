namespace Crm.Service.Rest.Model
{
	using System;

	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;
	using Crm.Library.Rest.Model;
	using Crm.Rest.Model;
	using Crm.Service.Model;

	using UserRest = Crm.Rest.Model.UserRest;

	[RestTypeFor(DomainType = typeof(ServiceCase))]
	public class ServiceCaseRest : ContactRest
	{
		public DateTime? CompletionDate { get; set; }
		[NotReceived]
		[ExplicitExpand]
		public ServiceOrderHeadRest CompletionServiceOrder { get; set; }
		public Guid? CompletionServiceOrderId { get; set; }
		public string CompletionUser { get; set; }
		[NotReceived]
		[ExplicitExpand]
		public UserRest CompletionUserUser { get; set; }
		[NotReceived]
		[ExplicitExpand]
		public ServiceOrderHeadRest OriginatingServiceOrder { get; set; }
		public Guid? OriginatingServiceOrderId { get; set; }
		[NotReceived]
		[ExplicitExpand]
		public ServiceOrderTimeRest OriginatingServiceOrderTime { get; set; }
		public Guid? OriginatingServiceOrderTimeId { get; set; }
		[NotReceived]
		[ExplicitExpand]
		public ServiceObjectRest ServiceObject { get; set; }
		public Guid? ServiceObjectId { get; set; }
		public string ErrorMessage { get; set; }
		public string ServiceCaseNo { get; set; }
		public Guid? ServiceCaseTemplateId { get; set; }
		[NotReceived]
		[ExplicitExpand]
		public ServiceOrderTimeRest ServiceOrderTime { get; set; }
		public Guid? ServiceOrderTimeId { get; set; }
		[NotReceived]
		[ExplicitExpand]
		public TagRest[] Tags { get; set; }
		public DateTime? Reported { get; set; }
		[NotReceived]
		[ExplicitExpand]
		public UserRest ResponsibleUserUser { get; set; }
		public DateTime? Planned { get; set; }
		public DateTime? Executed { get; set; }
		public DateTime? PickedUpDate { get; set; }
		[ExplicitExpand]
		[NotReceived]
		public InstallationRest AffectedInstallation { get; set; }
		public Guid? AffectedInstallationKey { get; set; }
		[ExplicitExpand]
		[NotReceived]
		public CompanyRest AffectedCompany { get; set; }
		public Guid? AffectedCompanyKey { get; set; }
		[ExplicitExpand]
		[NotReceived]
		public PersonRest ContactPerson { get; set; }
		public Guid? ContactPersonId { get; set; }
		public int StatusKey { get; set; }
		public string PriorityKey { get; set; }
		public string CategoryKey { get; set; }
		public int? ErrorCodeKey { get; set; }
		public Guid? StationKey { get; set; }
		[ExplicitExpand, NotReceived] public StationRest Station { get; set; }
		[RestrictedField] public string[] RequiredSkillKeys { get; set; }
		public DateTime ServiceCaseCreateDate { get; set; }
		public string ServiceCaseCreateUser { get; set; }

		public string StatisticsKeyProductTypeKey { get; set; }
		public string StatisticsKeyMainAssemblyKey { get; set; }
		public string StatisticsKeySubAssemblyKey { get; set; }
		public string StatisticsKeyAssemblyGroupKey { get; set; }
		public string StatisticsKeyFaultImageKey { get; set; }
		public string StatisticsKeyRemedyKey { get; set; }
		public string StatisticsKeyCauseKey { get; set; }
		public string StatisticsKeyWeightingKey { get; set; }
		public string StatisticsKeyCauserKey { get; set; }
	}
}
