namespace Crm.Service.Rest.Model
{
	using Crm.Library.Api.Attributes;
	using Crm.Library.Rest;
	using Crm.Rest.Model;
	using Crm.Service.Model;

	[RestTypeFor(DomainType = typeof(ServiceCaseTemplate))]
	public class ServiceCaseTemplateRest : RestEntityWithExtensionValues
	{
		public string CategoryKey { get; set; }
		public string Name { get; set; }
		public string PriorityKey { get; set; }
		public string ResponsibleUser { get; set; }
		[ExplicitExpand]
		[NotReceived]
		public UserRest ResponsibleUserUser { get; set; }
		[RestrictedField] public string[] RequiredSkillKeys { get; set; }

	}
}
