namespace Crm.Service.Controllers
{
	using System;
	using Crm.Controllers;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Extensions;
	using Crm.Library.Helper;
	using Crm.Library.Model;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization;
	using Crm.Library.Services.Interfaces;
	using Crm.Service.Enums;
	using Crm.Service.Model;
	using Crm.Service.Services.Interfaces;
	using Crm.Service.ViewModels;
	using Crm.Services;
	using Microsoft.AspNetCore.Mvc;

	public class DispatchController : CrmController
	{
		private readonly IServiceOrderService serviceOrderService;
		private readonly IRepositoryWithTypedId<ServiceOrderDispatch, Guid> dispatchRepository;
		private readonly Func<ServiceOrderDispatch, IDispatchReportViewModel> dispatchReportViewModelFactory;
		private readonly IAppSettingsProvider appSettingsProvider;

		[RenderAction("DispatchInstallationTemplate")]
		public virtual ActionResult InstallationTemplate() => PartialView();

		[RenderAction("CreateAdHocServiceOrderForm", Priority = 200)]
		public virtual ActionResult CreateTemplateExtendedInformation()
		{
			return PartialView();
		}

		[RenderAction("CreateAdHocServiceOrderForm", Priority = 100)]
		public virtual ActionResult CreateTemplateDate()
		{
			return PartialView();
		}

		[RequiredPermission(PermissionName.Read, Group = ServicePlugin.PermissionGroup.Dispatch)]
		public virtual ActionResult DetailsTemplate()
		{
			return PartialView();
		}

		[RenderAction("DispatchDetailsMaterialTabHeader", Priority = 100)]
		public virtual ActionResult MaterialDetailsTabHeader()
		{
			return PartialView();
		}

		[RenderAction("DispatchDetailsMaterialTab", Priority = 100)]
		public virtual ActionResult MaterialDetailsTab()
		{
			return PartialView();
		}

		[RenderAction("DispatchDetailsMaterialTabHeader", Priority = 50)]
		[RequiredPermission(MainPlugin.PermissionName.DocumentsTab, Group = ServicePlugin.PermissionGroup.Dispatch)]
		public virtual ActionResult MaterialDocumentsTabHeader()
		{
			return PartialView("ContactDetails/MaterialDocumentsTabHeader");
		}

		[RenderAction("DispatchDetailsMaterialTab", Priority = 50)]
		[RequiredPermission(MainPlugin.PermissionName.DocumentsTab, Group = ServicePlugin.PermissionGroup.Dispatch)]
		public virtual ActionResult MaterialDocumentsTab()
		{
			return PartialView("ContactDetails/MaterialDocumentsTab");
		}

		[RenderAction("DocumentsTabPrimaryAction")]
		public virtual ActionResult MaterialDocumentsTabPrimaryAction()
		{
			return PartialView();
		}

		[RenderAction("DispatchDetailsMaterialTabHeader", Priority = 80)]
		public virtual ActionResult MaterialInstallationsTabHeader()
		{
			return PartialView();
		}

		[RenderAction("DispatchDetailsMaterialTab", Priority = 80)]
		public virtual ActionResult MaterialInstallationsTab()
		{
			return PartialView();
		}

		[RenderAction("DispatchDetailsMaterialTabHeader", Priority = 90)]
		public virtual ActionResult MaterialJobsTabHeader()
		{
			var maintenanceOrderGenerationMode = appSettingsProvider.GetValue(ServicePlugin.Settings.ServiceContract.MaintenanceOrderGenerationMode);
			if (maintenanceOrderGenerationMode == MaintenanceOrderGenerationMode.JobPerInstallation)
			{
				return PartialView();
			}

			return new EmptyResult();
		}

		[RenderAction("DispatchDetailsMaterialTab", Priority = 90)]
		public virtual ActionResult MaterialJobsTab()
		{
			var maintenanceOrderGenerationMode = appSettingsProvider.GetValue(ServicePlugin.Settings.ServiceContract.MaintenanceOrderGenerationMode);
			if (maintenanceOrderGenerationMode == MaintenanceOrderGenerationMode.JobPerInstallation)
			{
				return PartialView();
			}

			return new EmptyResult();
		}

		[RenderAction("DispatchDetailsMaterialTabHeader", Priority = 60)]
		public virtual ActionResult MaterialMaterialsTabHeader()
		{
			return PartialView();
		}

		[RenderAction("DispatchDetailsMaterialTab", Priority = 60)]
		public virtual ActionResult MaterialMaterialsTab()
		{
			return PartialView();
		}

		[RenderAction("DispatchDetailsMaterialTabHeader", Priority = 40)]
		[RequiredPermission(PermissionName.Index, Group = MainPlugin.PermissionGroup.Note)]
		public virtual ActionResult MaterialNotesTabHeader()
		{
			return PartialView();
		}

		[RenderAction("DispatchDetailsMaterialTab", Priority = 40)]
		[RequiredPermission(PermissionName.Index, Group = MainPlugin.PermissionGroup.Note)]
		public virtual ActionResult MaterialNotesTab()
		{
			return PartialView();
		}

		[RenderAction("DispatchMaterialsTabPrimaryAction")]
		public virtual ActionResult MaterialPrimaryActionAddServiceOrderMaterial()
		{
			return PartialView();
		}

		[RenderAction("DispatchDetailsMaterialTabHeader", Priority = 10)]
		[RequiredPermission(ServicePlugin.PermissionName.RelatedOrdersTab, Group = ServicePlugin.PermissionGroup.Dispatch)]
		public virtual ActionResult MaterialRelatedOrdersTabHeader()
		{
			return PartialView();
		}

		[RenderAction("DispatchDetailsMaterialTab", Priority = 40)]
		[RequiredPermission(ServicePlugin.PermissionName.RelatedOrdersTab, Group = ServicePlugin.PermissionGroup.Dispatch)]
		public virtual ActionResult MaterialRelatedOrdersTab()
		{
			return PartialView();
		}

		[RenderAction("DispatchDetailsMaterialTab", Priority = 55)]
		[RequiredPermission(ServicePlugin.PermissionName.ServiceCasesTab, Group = ServicePlugin.PermissionGroup.Dispatch)]
		public virtual ActionResult MaterialServiceCasesTab()
		{
			return PartialView("../ServiceOrder/MaterialServiceCasesTab");
		}

		[RenderAction("DispatchDetailsMaterialTabHeader", Priority = 55)]
		[RequiredPermission(ServicePlugin.PermissionName.ServiceCasesTab, Group = ServicePlugin.PermissionGroup.Dispatch)]
		public virtual ActionResult MaterialServiceCasesTabHeader()
		{
			return PartialView("../ServiceOrder/MaterialServiceCasesTabHeader");
		}

		[RenderAction("DispatchDetailsMaterialTabHeader", Priority = 20)]
		[RequiredPermission(PermissionName.Index, Group = MainPlugin.PermissionGroup.Task)]
		public virtual ActionResult MaterialTasksTabHeader() => PartialView();

		[RenderAction("DispatchDetailsMaterialTab", Priority = 20)]
		[RequiredPermission(PermissionName.Index, Group = MainPlugin.PermissionGroup.Task)]
		public virtual ActionResult MaterialTasksTab() => PartialView();

		[RenderAction("DispatchDetailsMaterialTabHeader", Priority = 70)]
		public virtual ActionResult MaterialTimePostingsTabHeader()
		{
			return PartialView();
		}

		[RenderAction("DispatchDetailsMaterialTab", Priority = 70)]
		public virtual ActionResult MaterialTimePostingsTab()
		{
			return PartialView();
		}

		[RequiredPermission(PermissionName.Create, Group = MainPlugin.PermissionGroup.DocumentArchive)]
		public virtual ActionResult DocumentAttributeEditTemplate()
		{
			return PartialView();
		}

		[RequiredPermission(PermissionName.Edit, Group = ServicePlugin.PermissionGroup.Dispatch)]
		public virtual ActionResult SignatureEdit() => PartialView();

		[RequiredPermission(PermissionName.Read, Group = ServicePlugin.PermissionGroup.Dispatch)]
		public virtual ActionResult ReportPreview() => PartialView();

		[RequiredPermission(PermissionName.Edit, Group = ServicePlugin.PermissionGroup.Dispatch)]
		public virtual ActionResult ReportRecipientsTemplate() => PartialView();

		[RequiredPermission(PermissionName.Edit, Group = ServicePlugin.PermissionGroup.Dispatch)]
		public virtual ActionResult ChangeStatusTemplate() => PartialView();

		[RequiredPermission(PermissionName.Edit, Group = ServicePlugin.PermissionGroup.Dispatch)]
		public virtual ActionResult RejectTemplate() => View("RejectTemplate");

		[RequiredPermission(PermissionName.Create, Group = ServicePlugin.PermissionGroup.Adhoc)]
		public virtual ActionResult AdHocTemplate() => PartialView();

		[RequiredPermission(PermissionName.Read, Group = ServicePlugin.PermissionGroup.Dispatch)]
		public virtual ActionResult Appointment() => PartialView();

		public virtual ActionResult GetReportPdf(Guid dispatchId)
		{
			var dispatch = dispatchRepository.Get(dispatchId);
			var dispatchReport = serviceOrderService.CreateDispatchReportAsPdf(dispatchId);
			var filename = $"{dispatch.OrderHead.OrderNo} - {dispatch.Date.ToLocalTime().ToIsoDateString()} - {dispatch.DispatchedUsername}";

			return Pdf(dispatchReport, filename.RemoveIllegalCharacters());
		}

		public virtual ActionResult GetReport(Guid dispatchId, string orderNo, string format = "PDF")
		{
			var dispatch = dispatchRepository.Get(dispatchId);
			if (format.Equals("PDF", StringComparison.InvariantCultureIgnoreCase))
			{
				return Pdf(serviceOrderService.CreateDispatchReportAsPdf(dispatch));
			}

			if (format.Equals("HTML", StringComparison.InvariantCultureIgnoreCase))
			{
				var model = dispatchReportViewModelFactory(dispatch);
				return View("Report", model);
			}

			throw new ArgumentException(string.Format("Unknown format: {0}", format));
		}

		[RequiredPermission(PermissionName.Edit, Group = ServicePlugin.PermissionGroup.Dispatch)]
		public virtual ActionResult Schedule()
		{
			return PartialView();
		}

		[RequiredPermission(ServicePlugin.PermissionName.AppointmentConfirmation, Group = ServicePlugin.PermissionGroup.Dispatch)]
		[RenderAction("DispatchDetailsTopMenu", Priority = 90)]
		public virtual ActionResult TopMenuAppointmentConfirmation() => PartialView();

		[RequiredPermission(ServicePlugin.PermissionName.AppointmentRequest, Group = ServicePlugin.PermissionGroup.Dispatch)]
		[RenderAction("DispatchDetailsTopMenu", Priority = 100)]
		public virtual ActionResult TopMenuAppointmentRequest() => PartialView();

		[RenderAction("DispatchDetailsTopMenu", Priority = 85)]
		public virtual ActionResult TemplateActionDivider()
		{
			return PartialView("ListDivider");
		}

		[RequiredPermission(ServicePlugin.PermissionName.Complete, Group = ServicePlugin.PermissionGroup.Dispatch)]
		[RenderAction("DispatchDetailsTopMenu", Priority = 700)]
		public virtual ActionResult TopMenuCompleteDispatch() => PartialView();

		[RequiredPermission(ServicePlugin.PermissionName.ConfirmScheduled, Group = ServicePlugin.PermissionGroup.Dispatch)]
		[RenderAction("DispatchDetailsTopMenu", Priority = 70)]
		public virtual ActionResult TopMenuConfirmAppointment() => PartialView();

		[RequiredPermission(ServicePlugin.PermissionName.RejectReleased, Group = ServicePlugin.PermissionGroup.Dispatch)]
		[RenderAction("DispatchDetailsTopMenu", Priority = 90)]
		public virtual ActionResult TopMenuRejectDispatch() => PartialView();

		[RequiredPermission(ServicePlugin.PermissionName.ReportPreview, Group = ServicePlugin.PermissionGroup.Dispatch)]
		[RenderAction("DispatchDetailsTopMenu", Priority = 900)]
		public virtual ActionResult TopMenuReportPreview() => PartialView();

		[RequiredPermission(ServicePlugin.PermissionName.ReportRecipients, Group = ServicePlugin.PermissionGroup.Dispatch)]
		[RenderAction("DispatchDetailsTopMenu", Priority = 1000)]
		public virtual ActionResult TopMenuReportRecipients() => PartialView();

		[RequiredPermission(ServicePlugin.PermissionName.Reschedule, Group = ServicePlugin.PermissionGroup.Dispatch)]
		[RenderAction("DispatchDetailsTopMenu", Priority = 60)]
		public virtual ActionResult TopMenuReschedule() => PartialView();

		[RequiredPermission(ServicePlugin.PermissionName.ConfirmReleased, Group = ServicePlugin.PermissionGroup.Dispatch)]
		[RenderAction("DispatchDetailsTopMenu", Priority = 100)]
		public virtual ActionResult TopMenuSetDispatchInProgress() => PartialView();

		[RequiredPermission(ServicePlugin.PermissionName.Signature, Group = ServicePlugin.PermissionGroup.Dispatch)]
		[RenderAction("DispatchDetailsTopMenu", Priority = 800)]
		public virtual ActionResult TopMenuSignature() => PartialView();

		[RenderAction("DispatchReportDetails", Priority = 800)]
		public virtual ActionResult DetailsTabReportDetails() => View("ServiceOrderMaterialDetails/DetailsTabReportDetails");

		[RenderAction("DispatchGeneralInformation", Priority = 800)]
		public virtual ActionResult DetailsTabGeneralInformation() => View("ServiceOrderMaterialDetails/DetailsTabGeneralInformation");

		public DispatchController(IPdfService pdfService, IRenderViewToStringService renderViewToStringService, IServiceOrderService serviceOrderService, IRepositoryWithTypedId<ServiceOrderDispatch, Guid> dispatchRepository, IAppSettingsProvider appSettingsProvider, Func<ServiceOrderDispatch, IDispatchReportViewModel> dispatchReportViewModelFactory)
			: base(pdfService, renderViewToStringService)
		{
			this.serviceOrderService = serviceOrderService;
			this.dispatchRepository = dispatchRepository;
			this.dispatchReportViewModelFactory = dispatchReportViewModelFactory;
			this.appSettingsProvider = appSettingsProvider;
		}
	}
}
