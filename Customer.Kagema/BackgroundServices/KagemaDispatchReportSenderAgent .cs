
namespace Customer.Kagema.BackgroundServices
{
	using System;
	using System.Collections.Generic;
	using System.Globalization;
	using System.Linq;
	using System.Net.Mime;
	using System.Security.Principal;
	using System.Threading;

	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Data.NHibernateProvider;
	using Crm.Library.Extensions;
	using Crm.Library.Extensions.IIdentity;
	using Crm.Library.Globalization.Lookup;
	using Crm.Library.Helper;
	using Crm.Library.Services.Interfaces;
	using Crm.Model;
	using Crm.Service;
	using Crm.Service.BackgroundServices;
	using Crm.Service.Model;
	using Crm.Service.Model.Lookup;
	using Crm.Service.Services.Interfaces;
	using Crm.Services.Interfaces;

	using Customer.Kagema.Model.Extensions;

	using log4net;

	using Microsoft.Extensions.Hosting;

	using Quartz;

	[DisallowConcurrentExecution]
	public class KagemaDispatchReportSenderAgent : DispatchReportSenderAgent
	{
		private readonly IServiceOrderService serviceOrderService;
		private readonly IUserService userService;
		private readonly IDispatchReportSenderConfiguration dispatchReportSenderConfiguration;
		private readonly IEnumerable<IDispatchReportAttachmentProvider> dispatchReportAttachmentProviders;
		private readonly IRepositoryWithTypedId<ServiceOrderDispatch, Guid> serviceOrderDispatchRepository;
		private readonly ILog logger;
		private readonly IAppSettingsProvider appSettingsProvider;
		private readonly IRepositoryWithTypedId<Message, Guid> messageRepository;
		private readonly IFileService fileService;
		private readonly Func<Message> messageFactory;
		private readonly Func<ServiceOrderDispatchReportRecipient> serviceOrderDispatchReportRecipientFactory;
		private readonly IClientSideGlobalizationService clientSideGlobalizationService;
		private readonly ILookupManager lookupManager;

		public KagemaDispatchReportSenderAgent(ISessionProvider sessionProvider, IServiceOrderService serviceOrderService, IUserService userService, IDispatchReportSenderConfiguration dispatchReportSenderConfiguration, IEnumerable<IDispatchReportAttachmentProvider> dispatchReportAttachmentProviders, IRepositoryWithTypedId<ServiceOrderDispatch, Guid> serviceOrderDispatchRepository, IAppSettingsProvider appSettingsProvider, ILog logger, IHostApplicationLifetime hostApplicationLifetime, IRepositoryWithTypedId<Message, Guid> messageRepository, IFileService fileService, Func<Message> messageFactory, Func<ServiceOrderDispatchReportRecipient> serviceOrderDispatchReportRecipientFactory, IClientSideGlobalizationService clientSideGlobalizationService, ILookupManager lookupManager) : base(sessionProvider, serviceOrderService, userService, dispatchReportSenderConfiguration, dispatchReportAttachmentProviders, serviceOrderDispatchRepository, appSettingsProvider, logger, hostApplicationLifetime, messageRepository, fileService, messageFactory, serviceOrderDispatchReportRecipientFactory, clientSideGlobalizationService, lookupManager)
		{
			this.serviceOrderService = serviceOrderService;
			this.userService = userService;
			this.dispatchReportSenderConfiguration = dispatchReportSenderConfiguration;
			this.dispatchReportAttachmentProviders = dispatchReportAttachmentProviders;
			this.serviceOrderDispatchRepository = serviceOrderDispatchRepository;
			this.appSettingsProvider = appSettingsProvider;
			this.logger = logger;
			this.messageRepository = messageRepository;
			this.fileService = fileService;
			this.messageFactory = messageFactory;
			this.serviceOrderDispatchReportRecipientFactory = serviceOrderDispatchReportRecipientFactory;
			this.clientSideGlobalizationService = clientSideGlobalizationService;
			this.lookupManager = lookupManager;
		}

		protected override void Run(IJobExecutionContext context)
		{
			var sendDispatchReportsOnCompletion = appSettingsProvider.GetValue(ServicePlugin.Settings.Email.SendDispatchReportsOnCompletion);
			if (!sendDispatchReportsOnCompletion)
			{
				return;
			}

			var dispatchIdsWithoutReport = GetPendingDocuments().Cast<ServiceOrderDispatch>().ToList().Select(x => x.Id);

			foreach (var dispatchId in dispatchIdsWithoutReport)
			{
				if (receivedShutdownSignal)
				{
					break;
				}

				try
				{
					BeginRequest();
					var dispatch = serviceOrderDispatchRepository.Get(dispatchId);
					var user = dispatch.DispatchedUser;
					if (user != null)
					{
						Thread.CurrentPrincipal = new GenericPrincipal(new GenericIdentity(user.GetIdentityString()), new string[0]);
						Thread.CurrentThread.CurrentUICulture = CultureInfo.GetCultureInfo(clientSideGlobalizationService.GetCurrentLanguageCultureNameOrDefault());
						Thread.CurrentThread.CurrentCulture = CultureInfo.GetCultureInfo(clientSideGlobalizationService.GetCurrentCultureNameOrDefault());
					}
					else
					{
						logger.Warn($"could not set user '{dispatch.DispatchedUsername}' for localization");
					}
					SendDispatchReport(dispatch);
					serviceOrderDispatchRepository.SaveOrUpdate(dispatch);
				}
				catch (Exception exception)
				{
					EndRequest();
					BeginRequest();
					var dispatch = serviceOrderDispatchRepository.Get(dispatchId);
					dispatch.ReportSendingError = exception.ToString();
					serviceOrderDispatchRepository.SaveOrUpdate(dispatch);
				}
				finally
				{
					EndRequest();
				}
			}
		}
		protected override void SendDispatchReport(ServiceOrderDispatch dispatch)
		{
			var recipients = GetRecipients(dispatch);

			var currentUiCulture = Thread.CurrentThread.CurrentUICulture;

			foreach (var recipientsForLanguage in recipients.GroupBy(x => new { x.Language, x.Locale, x.Internal }))
			{
				Thread.CurrentThread.CurrentUICulture = CultureInfo.GetCultureInfo(recipientsForLanguage.Key.Language);
				clientSideGlobalizationService.SetCurrentLanguageName(recipientsForLanguage.Key.Language);
				clientSideGlobalizationService.SetCurrentCultureName(recipientsForLanguage.Key.Locale);
				var attachments = new List<FileResource>();

				var DisableDispatchReportAttachments = appSettingsProvider.GetValue(KagemaPlugin.Settings.DisableDispatchReportAttachments);

				if (!DisableDispatchReportAttachments ||  dispatch.StatusKey == ServiceOrderDispatchStatus.ClosedNotCompleteKey)

				{
					var bytes = serviceOrderService.CreateDispatchReportAsPdf(dispatch);
					attachments.Add(fileService.CreateAndSaveFileResource(bytes, MediaTypeNames.Application.Pdf, dispatchReportSenderConfiguration.GetReportFileName(dispatch).AppendIfMissing(".pdf")));

					if (!DisableDispatchReportAttachments) {
					foreach (var dispatchReportAttachmentProvider in dispatchReportAttachmentProviders)
					{
						attachments.AddRange(dispatchReportAttachmentProvider.GetAttachments(dispatch, recipientsForLanguage.Key.Internal).Select(x => fileService.CreateAndSaveFileResource(x.ContentStream.ReadAllBytes(), x.ContentType.MediaType, x.Name)));
					}
					foreach (var documentAttribute in dispatch.OrderHead.DocumentAttributes)
					{
						if (recipientsForLanguage.FirstOrDefault().Internal)
						{
							if (documentAttribute.GetExtension<DocumentAttributeExtensions>().SendToInternalSales)
							{
								attachments.Add(documentAttribute.FileResource);
							}
						}
						else
						{
							if (documentAttribute.GetExtension<DocumentAttributeExtensions>().SendToCustomer)
							{
								attachments.Add(documentAttribute.FileResource);
							}

						}
					}
					}
				}
				
				SendDispatchReport(dispatch, attachments.Select(x => x.Id).ToList(), recipientsForLanguage);
			}

			Thread.CurrentThread.CurrentUICulture = currentUiCulture;

			dispatch.ReportSent = true;
		}
		//protected override void SendServiceOrderReport(ServiceOrderHead order)
		//{
		//	var fileResource = fileService.CreateAndSaveFileResource(serviceOrderService.CreateServiceOrderReportAsPdf(order), MediaTypeNames.Application.Pdf, configuration.GetReportFileName(order));
		//	var message = messageFactory();
		//	message.Body = configuration.GetEmailText(order);
		//	message.Subject = configuration.GetSubject(order);
		//	var sendServiceOrderReportToDispatchers = appSettingsProvider.GetValue(ServicePlugin.Settings.Email.SendServiceOrderReportToDispatchers);
		//	if (sendServiceOrderReportToDispatchers)
		//	{
		//		var dispatchers = order.Dispatches.Select(x => x.CreateUser).Distinct().Select(x => userService.GetUser(x));
		//		var dispatcherEmails = dispatchers.Where(x => x.Email.IsNotNullOrEmpty()).Select(x => x.Email).Distinct();
		//		dispatcherEmails.ForEach(e => message.Recipients.Add(e));
		//	}
		//	foreach (var documentAttribute in order.DocumentAttributes)
		//	{
			
		//		if (documentAttribute.GetExtension<DocumentAttributeExtensions>().SendToInternalSales == true)
		//		{

		//			message.AttachmentIds.Add(documentAttribute.FileResource.Id);
		//		}
		//	}
		//	var dispatchReportRecipients = appSettingsProvider.GetValue(ServicePlugin.Settings.Email.DispatchReportRecipients);
		//	dispatchReportRecipients.ForEach(e => message.Bcc.Add(e));
		//	message.AttachmentIds.Add(fileResource.Id);
		//	messageRepository.SaveOrUpdate(message);
		//}
	}
}

