namespace Sms.Checklists.Model
{
	using System;

	using Crm.Library.BaseModel;
	using Crm.Service.Model;

	public class ServiceCaseTemplateExtension : EntityExtension<ServiceCaseTemplate>
	{
		public virtual Guid? CompletionDynamicFormId { get; set; }
		public virtual Guid? CreationDynamicFormId { get; set; }
	}
}