namespace Customer.Kagema.BackgroundServices
{
	using System;
	using System.IO;
	using System.Linq;

	using Crm.Library.AutoFac;
	using Crm.Library.BackgroundServices;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Data.NHibernateProvider;
	using Crm.Library.Environment.Network;
	using Crm.Library.Globalization.Resource;
	using Crm.Library.Helper;
	using Crm.Library.Services.Interfaces;
	using Crm.Service.Model;
	using Crm.Service.Services.Interfaces;
	using Crm.Service;
	using log4net;

	using Microsoft.Extensions.Hosting;

	using Quartz;
	using Microsoft.AspNetCore.Authorization;
	using Sms.Checklists.Model;
	using Crm.DynamicForms.Model;
	using Crm.DynamicForms.ViewModels;
	using Crm.Library.Extensions;
	using Crm.Services;
	using System.Collections.Generic;
	using Crm.Services.Interfaces;
	using Crm.Model;
	using Sms.Checklists.ViewModels;
	using Crm.Service.BackgroundServices;
	using System.Globalization;
	using System.Security.Principal;
	using System.Threading;

	using System.Net.Mail;
	using System.Net.Mime;
	using System.Text;

	using Crm.Library.Extensions.IIdentity;
	using Crm.Library.Globalization;
	using Crm.Library.Globalization.Lookup;
	using Crm.Service.Model.Lookup;
	using Ical.Net.DataTypes;


	[DisallowConcurrentExecution]
	public class KagemaServiceOrderDocumentSaverAgent : ServiceOrderDocumentSaverAgent
	{
		private readonly IServiceOrderService serviceOrderService;
		private readonly IRepositoryWithTypedId<ServiceOrderHead, Guid> serviceOrderRepository;
		private readonly IServiceOrderDocumentSaverConfiguration serviceOrderDocumentSaverConfiguration;
		private readonly IAppSettingsProvider appSettingsProvider;
		private readonly IFileService fileService;
		private readonly IEnumerable<IDispatchReportAttachmentProvider> dispatchReportAttachmentProviders;
		private readonly IRepositoryWithTypedId<DocumentAttribute, Guid> documentAttributeRepository;
		private readonly IClientSideGlobalizationService clientSideGlobalizationService;
		public KagemaServiceOrderDocumentSaverAgent(ISessionProvider sessionProvider, IServiceOrderDocumentSaverConfiguration serviceOrderDocumentSaverConfiguration, IServiceOrderService serviceOrderService, IRepositoryWithTypedId<ServiceOrderHead, Guid> serviceOrderRepository, ILog logger, IAppSettingsProvider appSettingsProvider, IHostApplicationLifetime hostApplicationLifetime, IFileService fileService, IRepositoryWithTypedId<DocumentAttribute, Guid> documentAttributeRepository, IEnumerable<IDispatchReportAttachmentProvider> dispatchReportAttachmentProviders, Func<DynamicFormReference, ServiceOrderChecklistResponseViewModel> responseViewModelFactory, IClientSideGlobalizationService clientSideGlobalizationService)
			: base(sessionProvider,serviceOrderDocumentSaverConfiguration,serviceOrderService,serviceOrderRepository,logger,appSettingsProvider,hostApplicationLifetime)
		{
			this.serviceOrderDocumentSaverConfiguration = serviceOrderDocumentSaverConfiguration;
			this.serviceOrderService = serviceOrderService;
			this.serviceOrderRepository = serviceOrderRepository;
			this.appSettingsProvider = appSettingsProvider;
			this.dispatchReportAttachmentProviders = dispatchReportAttachmentProviders;
			this.fileService = fileService;
			//this.userService = userService;
			this.documentAttributeRepository = documentAttributeRepository;
			this.clientSideGlobalizationService = clientSideGlobalizationService;

		}
		protected override void SaveServiceOrderReport(ServiceOrderHead order, string exportServiceOrderReportsPath)
		{
			ExportServiceReport(order);
			ExportServiceOrderChecklists(order);
			ExportServiceOrderDocuments(order);
		}

		[AllowAnonymous]
		private void ExportServiceReport(ServiceOrderHead order)
		{
			var bytes = serviceOrderService.CreateServiceOrderReportAsPdf(order);

			var exportPath = appSettingsProvider.GetValue(KagemaPlugin.Settings.ServiceOrderReportPath);
			var filename = serviceOrderDocumentSaverConfiguration.GetReportFileName(order);
			var directory = Path.Combine(exportPath, order.OrderNo);
			var directoryWithLmobileFolder = Path.Combine(directory, "L-Mobile");
			var ServiceOrderReportFullpath = Path.Combine(directoryWithLmobileFolder, filename);
			if (Directory.Exists(directoryWithLmobileFolder) == false)
			{
				Directory.CreateDirectory(directoryWithLmobileFolder);
			}
			File.WriteAllBytes(ServiceOrderReportFullpath, bytes);
		}

		[AllowAnonymous]
		private void ExportServiceOrderChecklists(ServiceOrderHead order)
		{
			var exportPath = appSettingsProvider.GetValue(KagemaPlugin.Settings.ServiceOrderReportPath);
			var directory = Path.Combine(exportPath, order.OrderNo);
			var directoryWithLmobileFolder = Path.Combine(directory, "L-Mobile");

			var Checklists = new List<FileResource>();
			foreach (ServiceOrderDispatch dispatch in order.Dispatches)
			{

				var user = dispatch.DispatchedUser;
				if (user != null)
				{
					Thread.CurrentPrincipal = new GenericPrincipal(new GenericIdentity(user.GetIdentityString()), new string[0]);
					Thread.CurrentThread.CurrentUICulture = CultureInfo.GetCultureInfo(clientSideGlobalizationService.GetCurrentLanguageCultureNameOrDefault());
					Thread.CurrentThread.CurrentCulture = CultureInfo.GetCultureInfo(clientSideGlobalizationService.GetCurrentCultureNameOrDefault());
				}
				var bytes = serviceOrderService.CreateDispatchReportAsPdf(dispatch);
				Checklists.Add(fileService.CreateAndSaveFileResource(bytes, MediaTypeNames.Application.Pdf, GetDispatchReportFileName(dispatch).AppendIfMissing(".pdf")));

				foreach (var dispatchReportAttachmentProvider in dispatchReportAttachmentProviders)
				{
					Checklists.AddRange(dispatchReportAttachmentProvider.GetAttachments(dispatch, true).Select(x => fileService.CreateAndSaveFileResource(x.ContentStream.ReadAllBytes(), x.ContentType.MediaType, x.Name)));
				}
			}

			foreach (FileResource checklist in Checklists)
			{
				var fullPath = Path.Combine(directoryWithLmobileFolder, checklist.Filename);
				using (var unc = new UNCAccessWithCredentials())
				{

					if (Directory.Exists(directoryWithLmobileFolder) == false)
					{
						Directory.CreateDirectory(directoryWithLmobileFolder);
					}
					File.WriteAllBytes(fullPath, checklist.Content);
				}

			}
		}

		[AllowAnonymous]
		private string ExportServiceOrderDocuments(ServiceOrderHead order)
		{
			string folder = appSettingsProvider.GetValue(KagemaPlugin.Settings.ServiceOrderReportPath);


			var relatedDocuments = documentAttributeRepository.GetAll().Where(x => x.ReferenceKey == order.Id).ToList();
			var exportDocument = !String.IsNullOrEmpty(appSettingsProvider.GetValue(KagemaPlugin.Settings.ServiceOrderReportPath))
				&& relatedDocuments.Count() > 0;
			if (relatedDocuments.Count() == 0)
			{
				return null;
			}

			foreach (var document in relatedDocuments)
			{
				//var directory = Path.Combine(appSettingsProvider.GetValue(KagemaPlugin.Settings.ServiceOrderReportPath), order.OrderNo);

				var filename = "(" + relatedDocuments.IndexOf(document).ToString() + ")" + document.FileName;

				//var fullPath = Path.Combine(directory, filename);

				var directory = Path.Combine(appSettingsProvider.GetValue(KagemaPlugin.Settings.ServiceOrderReportPath), order.OrderNo);
				var directoryWithLmobileFolder = Path.Combine(directory, "L-Mobile");
				var fullPath = Path.Combine(directoryWithLmobileFolder, filename);


				using (var unc = new UNCAccessWithCredentials())
				{

					if (Directory.Exists(directoryWithLmobileFolder) == false)
					{
						Directory.CreateDirectory(directoryWithLmobileFolder);
					}
					File.WriteAllBytes(fullPath, document.FileResource.Content);
				}
			}

			return folder;
		}

		public virtual string GetDispatchReportFileName(ServiceOrderDispatch dispatch)
		{
			return $"{dispatch.OrderHead.OrderNo} - {dispatch.Date.ToLocalTime().ToIsoDateString()} {dispatch.Date.ToFormattedString("HH-mm")} - {dispatch.DispatchedUser.DisplayName}";
		}
	}

}
