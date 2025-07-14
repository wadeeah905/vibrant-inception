namespace Sms.Checklists.Model
{
	using System;
	using System.Collections.Generic;
	using System.IO;

	using Crm.DynamicForms.Model;
	using Crm.DynamicForms.Model.Extensions;
	using Crm.Library.Extensions;
	using Crm.Service.Model;

	using Newtonsoft.Json;

	public class ServiceOrderChecklist : DynamicFormReference
	{
		public virtual bool RequiredForServiceOrderCompletion { get; set; }
		public virtual bool SendToCustomer { get; set; }
		[JsonIgnore]
		public virtual ServiceOrderHead ServiceOrder { get; set; }
		public virtual Guid? ServiceOrderTimeKey { get; set; }
		[JsonIgnore]
		public virtual ServiceOrderTime ServiceOrderTime { get; set; }
		public virtual Guid? DispatchId { get; set; }
		[JsonIgnore]
		public virtual ServiceOrderDispatch Dispatch { get; set; }
		[JsonIgnore]
		public virtual Dictionary<Guid, string> Files { get; set; } 
		[Obsolete("must be moved to an extension or service")]
		public override string Filename
		{
			get
			{
				var filenameParts = new List<String>();
				if (DynamicForm != null)
				{
					filenameParts.Add(DynamicForm.GetTitle());
				}
				if (ServiceOrder != null)
				{
					filenameParts.Add(ServiceOrder.LegacyName);
				}
				if (ServiceOrderTime != null)
				{
					filenameParts.Add(ServiceOrderTime.PosNo);
					if (ServiceOrderTime.ItemNo.IsNotNullOrEmpty())
					{
						filenameParts.Add(ServiceOrderTime.ItemNo);
					}
					if (ServiceOrderTime.ItemDescription.IsNotNullOrEmpty())
					{
						filenameParts.Add(ServiceOrderTime.ItemDescription);
					}
					if (ServiceOrderTime.Installation != null)
					{
						filenameParts.Add(ServiceOrderTime.Installation.InstallationNo);
					}
				}
				return filenameParts.Join(" - ").Replace(Path.GetInvalidFileNameChars(), '_');
			}
		}
	}
}
