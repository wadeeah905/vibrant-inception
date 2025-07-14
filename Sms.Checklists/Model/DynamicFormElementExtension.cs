namespace Sms.Checklists.Model
{
	using Crm.DynamicForms.Model.BaseModel;
	using Crm.Library.BaseModel;

	public class DynamicFormElementExtension : EntityExtension<DynamicFormElement>
	{
		public bool CanAttachServiceCases { get; set; }
	}
}