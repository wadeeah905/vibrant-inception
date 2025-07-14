namespace Sms.Checklists.Model
{
	using System.Collections.Generic;

	using Crm.Library.Api.Attributes;
	using Crm.Library.BaseModel;
	using Crm.Library.BaseModel.Attributes;
	using Crm.Library.Rest;
	using Crm.Service.Model;

	using Newtonsoft.Json;

	public class ServiceOrderExtension : EntityExtension<ServiceOrderHead>
	{
		[ExplicitExpand]
		[JsonIgnore]
		[NotReceived]
		[UI(UIignore = true)]
		public virtual ICollection<ServiceOrderChecklist> ServiceOrderChecklists { get; set; } = new List<ServiceOrderChecklist>();
	}
}