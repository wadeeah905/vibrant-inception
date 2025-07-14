namespace Sms.Checklists.Services
{
	using System;
	using System.Collections.Generic;
	using System.IO;
	using System.Linq;
	using System.Net.Mail;

	using Crm.DynamicForms.Model;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Extensions;
	using Crm.Library.Services.Interfaces;
	using Crm.Model;
	using Crm.Service.BackgroundServices;
	using Crm.Service.Model;
	using Crm.Services;

	using Sms.Checklists.Model;
	using Sms.Checklists.Model.Extensions;
	using Sms.Checklists.ViewModels;

	public class DispatchReportAttachmentProvider : IDispatchReportAttachmentProvider
	{
		private readonly IRepositoryWithTypedId<ServiceOrderChecklist, Guid> serviceOrderChecklistRepository;
		private readonly IPdfService pdfService;
		private readonly IRepositoryWithTypedId<FileResource, Guid> fileResourceRepository;
		private readonly IRenderViewToStringService renderViewToStringService;
		private readonly Func<DynamicFormReference, ServiceOrderChecklistResponseViewModel> responseViewModelFactory;

		public DispatchReportAttachmentProvider(IRepositoryWithTypedId<ServiceOrderChecklist, Guid> serviceOrderChecklistRepository, IPdfService pdfService, IRepositoryWithTypedId<FileResource, Guid> fileResourceRepository, IRenderViewToStringService renderViewToStringService, Func<DynamicFormReference, ServiceOrderChecklistResponseViewModel> responseViewModelFactory)
		{
			this.serviceOrderChecklistRepository = serviceOrderChecklistRepository;
			this.pdfService = pdfService;
			this.fileResourceRepository = fileResourceRepository;
			this.renderViewToStringService = renderViewToStringService;
			this.responseViewModelFactory = responseViewModelFactory;
		}

		public virtual IEnumerable<Attachment> GetAttachments(ServiceOrderDispatch dispatch, bool includeInternalInformation)
		{
			var result = new List<Attachment>();
			var serviceOrderHeadId = dispatch.OrderId;
			var serviceOrderChecklists = serviceOrderChecklistRepository.GetAll().Where(x => x.ReferenceKey == serviceOrderHeadId && x.DispatchId == dispatch.Id && x.IsActive && x.Completed && (x.SendToCustomer || includeInternalInformation) && x.DynamicForm.CategoryKey == "Checklist").ToList();
			foreach (ServiceOrderChecklist serviceOrderChecklist in serviceOrderChecklists)
			{
				result.Add(CreatePdf(serviceOrderChecklist));
			}

			var checklistAttachmentIds = serviceOrderChecklists.SelectMany(x => x.GetFileResourceIds());
			var checklistAttachments = fileResourceRepository.GetAll()
				.Where(x => x.ContentType.StartsWith("image/") == false && checklistAttachmentIds.Contains(x.Id))
				.Select(x => x.Content.CreateAttachment(x.ContentType, x.Filename));
			result.AddRange(checklistAttachments);
			return result.ToArray();
		}
		protected virtual Attachment CreatePdf(ServiceOrderChecklist serviceOrderChecklist)
		{
			var model = responseViewModelFactory(serviceOrderChecklist);

			// Use consistent margins similar to main service order reports
			const double contentHeaderMargin = 3.0;
			const double contentFooterMargin = 4.0;
			const double headerPositionMargin = 1.0;
			const double footerPositionMargin = 27.0;

			try
			{
				var viewAsPdf = pdfService.Html2Pdf(
					renderViewToStringService.RenderViewToString("Crm.DynamicForms", "DynamicForm", "Response", model),
					headerMargin: contentHeaderMargin,
					footerMargin: contentFooterMargin);

				var headerAsPdf = pdfService.Html2Pdf(
					renderViewToStringService.RenderViewToString("Crm.DynamicForms", "DynamicForm", "DynamicFormPageHeader", model),
					headerMargin: headerPositionMargin);

				var footerAsPdf = pdfService.Html2Pdf(
					renderViewToStringService.RenderViewToString("Crm.DynamicForms", "DynamicForm", "DynamicFormPageFooter", model),
					headerMargin: footerPositionMargin);

				var pdfWithHeaderAndFooter = pdfService.AddPageHeadersFooters(viewAsPdf, headerAsPdf, footerAsPdf);
				var file = new MemoryStream(pdfWithHeaderAndFooter);
				var attachment = new Attachment(file, serviceOrderChecklist.Filename.AppendIfMissing(".pdf"), "application/pdf");
				return attachment;
			}
			catch (Exception ex)
			{
				var fallbackPdf = pdfService.Html2Pdf(
					renderViewToStringService.RenderViewToString("Crm.DynamicForms", "DynamicForm", "Response", model),
					headerMargin: contentHeaderMargin,
					footerMargin: contentFooterMargin);
				var file = new MemoryStream(fallbackPdf);
				var attachment = new Attachment(file, serviceOrderChecklist.Filename.AppendIfMissing(".pdf"), "application/pdf");
				return attachment;
			}
		}
	}
}
