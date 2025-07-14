namespace Sms.Checklists.Rest.Model
{
	using System;

	using Crm.DynamicForms.Rest.Model;
	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;
	using Crm.Service.Rest.Model;

	using Sms.Checklists.Model;

	[RestTypeFor(DomainType = typeof(ServiceOrderChecklist))]
	public class ServiceOrderChecklistRest : DynamicFormReferenceRest
	{
		public bool RequiredForServiceOrderCompletion { get; set; }
		public bool SendToCustomer { get; set; }
		public Guid? DispatchId { get; set; }
		public Guid? ServiceOrderTimeKey { get; set; }
		[ExplicitExpand, NotReceived] public ServiceOrderTimeRest ServiceOrderTime { get; set; }
		[ExplicitExpand, NotReceived] public ServiceOrderHeadRest ServiceOrder { get; set; }
	}
}
