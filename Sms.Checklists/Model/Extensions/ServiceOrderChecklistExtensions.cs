namespace Sms.Checklists.Model.Extensions
{
	using System;
	using System.Collections.Generic;
	using System.Linq;

	using Crm.DynamicForms.Model;
	using Crm.DynamicForms.ViewModels;
	using Crm.Service.Model;

	using Newtonsoft.Json;

	using Sms.Checklists.Model;

	public static class ServiceOrderChecklistExtensions
	{
		public static Installation GetInstallation(this ServiceOrderChecklist serviceOrderChecklist)
		{
			if (serviceOrderChecklist.ServiceOrderTime == null && serviceOrderChecklist.ServiceOrder != null && serviceOrderChecklist.ServiceOrder.AffectedInstallation != null)
			{
				return serviceOrderChecklist.ServiceOrder.AffectedInstallation.Self as Installation;
			}
			if (serviceOrderChecklist.ServiceOrderTime != null && serviceOrderChecklist.ServiceOrderTime.Installation != null)
			{
				return serviceOrderChecklist.ServiceOrderTime.Installation;
			}
			return null;
		}
		public static IEnumerable<Guid> GetFileResourceIds(this ServiceOrderChecklist serviceOrderChecklist)
		{
			return serviceOrderChecklist.Responses
				.Where(x => x.DynamicFormElementType == FileAttachmentDynamicFormElement.DiscriminatorValue)
				.SelectMany(x => JsonConvert.DeserializeObject<FileAttachmentResponse>(x.ValueAsString));
		}
	}
}