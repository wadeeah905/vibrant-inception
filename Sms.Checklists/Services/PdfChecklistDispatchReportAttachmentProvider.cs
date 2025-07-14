using Crm.DynamicForms.Model;
using Crm.Library.Data.Domain.DataInterfaces;
using Crm.Model;
using Crm.Service.BackgroundServices;
using Crm.Service.Model;
using Sms.Checklists.Model;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mail;

namespace Sms.Checklists.Services
{
	public class PdfChecklistDispatchReportAttachmentProvider : IDispatchReportAttachmentProvider
	{
		private readonly IRepositoryWithTypedId<ServiceOrderChecklist, Guid> serviceOrderChecklistRepository;
		private readonly IRepositoryWithTypedId<DynamicFormFileResponse, Guid> dynamicFormFileResponseRepository;
		private readonly IRepositoryWithTypedId<FileResource, Guid> fileResourceRepository;

		public PdfChecklistDispatchReportAttachmentProvider(IRepositoryWithTypedId<ServiceOrderChecklist, Guid> serviceOrderChecklistRepository,
			IRepositoryWithTypedId<FileResource, Guid> fileResourceRepository, IRepositoryWithTypedId<DynamicFormFileResponse, Guid> dynamicFormFileResponseRepository)
		{
			this.serviceOrderChecklistRepository = serviceOrderChecklistRepository;
			this.fileResourceRepository = fileResourceRepository;
			this.dynamicFormFileResponseRepository = dynamicFormFileResponseRepository;
		}
		public virtual IEnumerable<Attachment> GetAttachments(ServiceOrderDispatch dispatch, bool includeInternalInformation = false)
		{
			var result = new List<Attachment>();
			var serviceOrderHeadId = dispatch.OrderId;

			var pdfServiceOrderChecklists = serviceOrderChecklistRepository.GetAll().Where(x => x.ReferenceKey == serviceOrderHeadId && x.DispatchId == dispatch.Id && x.IsActive && x.Completed && (x.SendToCustomer || includeInternalInformation) && x.DynamicForm.CategoryKey == "PDF-Checklist").ToList();
			foreach (ServiceOrderChecklist serviceOrderChecklist in pdfServiceOrderChecklists)
			{
				var fileResponses = dynamicFormFileResponseRepository.GetAll().Where(x => x.DynamicFormReferenceKey == serviceOrderChecklist.Id).ToList();
				foreach (DynamicFormFileResponse fileResponse in fileResponses)
				{
					var fileId = fileResponse.FileResourceId;
					var file = fileResourceRepository.Get((Guid)fileId);
					var attachment = new Attachment(new MemoryStream(file.Content), file.Filename, file.ContentType);
					result.Add(attachment);


				}
			}

			return result;
		}
	}
}
