namespace Sms.Checklists.Model
{
	using Crm.DynamicForms.Model;
	using Crm.Service.Model;

	using Newtonsoft.Json;

	public class ServiceCaseChecklist : DynamicFormReference
	{
		public virtual bool IsCompletionChecklist { get; set; }
		public virtual bool IsCreationChecklist { get; set; }
		[JsonIgnore]
		public virtual ServiceCase ServiceCase { get; set; }
	}
}