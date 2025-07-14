namespace Sms.Checklists.Rest.Model
{
	using Crm.DynamicForms.Rest.Model;
	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;
	using Crm.Service.Rest.Model;

	using Sms.Checklists.Model;

	[RestTypeFor(DomainType = typeof(ServiceCaseChecklist))]
	public class ServiceCaseChecklistRest : DynamicFormReferenceRest
	{
		public bool IsCompletionChecklist { get; set; }
		public bool IsCreationChecklist { get; set; }
		[ExplicitExpand]
		[NotReceived]
		public ServiceCaseRest ServiceCase { get; set; }
	}
}
