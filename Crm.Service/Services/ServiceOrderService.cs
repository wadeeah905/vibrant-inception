namespace Crm.Service.Services
{
	using System;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Services.Interfaces;
	using Crm.Service.Model;
	using Crm.Service.Model.Extensions;
	using Crm.Service.Model.Lookup;
	using Crm.Service.Services.Interfaces;
	using Crm.Service.ViewModels;
	using Crm.Services;
	using Crm.Services.Interfaces;

	public class ServiceOrderService : IServiceOrderService
	{
		private readonly Func<ServiceOrderDispatch, IDispatchReportViewModel> dispatchReportViewModelFactory;
		private readonly Func<ServiceOrderHead, IServiceOrderReportViewModel> serviceOrderReportViewModelFactory;
		private readonly IRenderViewToStringService renderViewToStringService;
		private readonly IRepositoryWithTypedId<ServiceOrderHead, Guid> serviceOrderRepository;
		private readonly IRepositoryWithTypedId<ServiceOrderDispatch, Guid> dispatchRepository;
		private readonly INumberingService numberingService;
		private readonly IPdfService pdfService;

		public virtual string GetNewOrderNo(ServiceOrderType serviceOrderType)
		{
			return numberingService.GetNextFormattedNumber(serviceOrderType.NumberingSequence);
		}

		public virtual byte[] CreateServiceOrderReportAsPdf(string orderNo)
		{
			var order = serviceOrderRepository.Get(orderNo);
			return CreateServiceOrderReportAsPdf(order);
		}
		public virtual byte[] CreateServiceOrderReportAsPdf(ServiceOrderHead order)
		{
			var model = serviceOrderReportViewModelFactory(order);
			var reportHtml = renderViewToStringService.RenderViewToString("Crm.Service", "ServiceOrder", "Report", model);
			var reportHeaderHtml = renderViewToStringService.RenderViewToString("Crm.Service", "ServiceOrder", "ReportHeader", model);
			var reportFooterHtml = renderViewToStringService.RenderViewToString("Crm.Service", "ServiceOrder", "ReportFooter", model);
			var reportPdf = pdfService.Html2Pdf(reportHtml, reportHeaderHtml, model.HeaderContentSize, model.HeaderContentSpacing, reportFooterHtml, model.FooterContentSize, model.FooterContentSpacing);
			return reportPdf;
		}
		public virtual byte[] CreateDispatchReportAsPdf(Guid dispatchId)
		{
			var dispatch = dispatchRepository.Get(dispatchId);
			return CreateDispatchReportAsPdf(dispatch);
		}
		public virtual byte[] CreateDispatchReportAsPdf(ServiceOrderDispatch dispatch)
		{
			var model = dispatchReportViewModelFactory(dispatch);
			var reportHtml = renderViewToStringService.RenderViewToString("Crm.Service", "Dispatch", "Report", model);
			var reportHeaderHtml = renderViewToStringService.RenderViewToString("Crm.Service", "Dispatch", "ReportHeader", model);
			var reportFooterHtml = renderViewToStringService.RenderViewToString("Crm.Service", "Dispatch", "ReportFooter", model);
			var reportPdf = pdfService.Html2Pdf(reportHtml, reportHeaderHtml, model.HeaderContentSize, model.HeaderContentSpacing, reportFooterHtml, model.FooterContentSize, model.FooterContentSpacing);
			return reportPdf;
		}
		public virtual void Save(ServiceOrderHead serviceOrderHead)
		{
			if (serviceOrderHead.OrderNo == null && serviceOrderHead.IsTransient())
			{
				serviceOrderHead.OrderNo = GetNewOrderNo(serviceOrderHead.Type);
			}
			serviceOrderRepository.SaveOrUpdate(serviceOrderHead);
		}

		// Constructor
		public ServiceOrderService(
			INumberingService numberingService,
			IRepositoryWithTypedId<ServiceOrderHead, Guid> serviceOrderRepository,
			IRepositoryWithTypedId<ServiceOrderDispatch, Guid> dispatchRepository,
			IRenderViewToStringService renderViewToStringService,
			IPdfService pdfService,
			Func<ServiceOrderDispatch, IDispatchReportViewModel> dispatchReportViewModelFactory,
			Func<ServiceOrderHead, IServiceOrderReportViewModel> serviceOrderReportViewModelFactory)
		{
			this.numberingService = numberingService;
			this.serviceOrderRepository = serviceOrderRepository;
			this.dispatchRepository = dispatchRepository;
			this.renderViewToStringService = renderViewToStringService;
			this.pdfService = pdfService;
			this.dispatchReportViewModelFactory = dispatchReportViewModelFactory;
			this.serviceOrderReportViewModelFactory = serviceOrderReportViewModelFactory;
		}
	}
}
