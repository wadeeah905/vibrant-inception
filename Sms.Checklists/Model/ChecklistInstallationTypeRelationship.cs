namespace Sms.Checklists.Model
{
	using System;

	using Crm.DynamicForms.Model;
	using Crm.Library.BaseModel;
	using Crm.Library.BaseModel.Interfaces;
	using Crm.Service.Model.Lookup;

	using Newtonsoft.Json;

	public class ChecklistInstallationTypeRelationship : EntityBase<Guid>, INoAuthorisedObject
	{
		public virtual bool RequiredForServiceOrderCompletion { get; set; }
		public virtual bool SendToCustomer { get; set; }

		public virtual Guid DynamicFormKey { get; set; }
		[JsonIgnore]
		public virtual DynamicForm DynamicForm { get; set; }

		public virtual string ServiceOrderTypeKey { get; set; }
		public virtual ServiceOrderType ServiceOrderType
		{
			get
			{
				return ServiceOrderTypeKey != null ? LookupManager.Get<ServiceOrderType>(ServiceOrderTypeKey) : null;
			}
		}
		public virtual string InstallationTypeKey { get; set; }
		public virtual InstallationType InstallationType
		{
			get
			{
				return InstallationTypeKey != null ? LookupManager.Get<InstallationType>(InstallationTypeKey) : null;
			}
		}
	}
}