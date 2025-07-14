namespace Sms.Checklists.Rest.Model
{
	using System;

	using Crm.DynamicForms.Rest.Model;
	using Crm.Library.Api.Attributes;
	using Crm.Library.BaseModel;
	using Crm.Library.Rest;
	using Crm.Library.Rest.Interfaces;

	using Sms.Checklists.Model;

	[RestTypeFor(DomainType = typeof(ChecklistInstallationTypeRelationship))]
	public class ChecklistInstallationTypeRelationshipRest : IRestEntityWithExtensionValues
	{
		public Guid Id { get; set; }
		public SerializableDictionary<string, object> ExtensionValues { get; set; }
		[NotReceived]
		public DateTime CreateDate { get; set; }
		[NotReceived]
		public DateTime ModifyDate { get; set; }
		[NotReceived]
		public string CreateUser { get; set; }
		[NotReceived]
		public string ModifyUser { get; set; }
		public bool RequiredForServiceOrderCompletion { get; set; }
		public bool SendToCustomer { get; set; }
		public Guid DynamicFormKey { get; set; }
		public string ServiceOrderTypeKey { get; set; }
		public string InstallationTypeKey { get; set; }
		[ExplicitExpand]
		[NotReceived]
		public DynamicFormRest DynamicForm { get; set; }
	}
}
