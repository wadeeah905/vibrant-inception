namespace Sms.Checklists.Model
{
	using System;

	using Crm.Library.BaseModel;
	using Crm.Library.BaseModel.Attributes;
	using Crm.Service.Model;

	public class ServiceCaseExtension : EntityExtension<ServiceCase>
	{
		[UI(Hidden = true)]
		public virtual Guid? AffectedDynamicFormElementId { get; set; }
		[UI(Hidden = true)]
		public virtual Guid? AffectedDynamicFormReferenceId { get; set; }
	}
}