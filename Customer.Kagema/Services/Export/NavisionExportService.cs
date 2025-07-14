namespace Customer.Kagema.Services.Export
{
	using System;
	using System.Collections.Generic;
	using System.IO;
	using System.Linq;
	using System.Linq.Dynamic.Core;
	using System.ServiceModel;
	using System.Threading;

	using AutoMapper;

	using Crm.Article.Model;
	using Crm.Article.Services.Interfaces;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Helper;
	using Crm.Library.Services.Interfaces;
	using Crm.Model;
	using Crm.Service;
	using Crm.Service.Model;
	using Crm.Service.Model.Extensions;
	using Crm.Service.Model.Lookup;
	using Crm.Service.Services.Interfaces;

	using Customer.Kagema.Model.Extensions;
	using Customer.Kagema.Services.Interfaces;

	using LMobile.Unicore.NHibernate;

	using log4net;



	using StackExchange.Profiling.Internal;

	using static Crm.Service.ServicePlugin.Settings;

	using ServiceOrderHeadExtensions = Model.Extensions.ServiceOrderHeadExtensions;
	using ServiceOrderMaterialExtensions = Model.Extensions.ServiceOrderMaterialExtensions;
	using ServiceOrderTimePosting = Crm.Service.Model.ServiceOrderTimePosting;

	public class NavisionExportService : INavisionExportService
	{
		private const int MaxFailedExportRetries = 5;
		private readonly IUserService userService;
		private readonly IAppSettingsProvider appSettingsProvider;
		private readonly IRepository<ServiceOrderHead> serviceOrderRepository;
		protected readonly IRepositoryWithTypedId<ServiceOrderTime, Guid> serviceOrderTimeRepository;
		private readonly LmobileFieldWebservice_PortClient serviceOrderOperations;
		private readonly IMapper mapper;
		private readonly IRepositoryWithTypedId<DocumentAttribute, Guid> documentAttributeRepository;
		private readonly IRepositoryWithTypedId<Article, Guid> articleRepository;
		private readonly ILog logger;


		public NavisionExportService(
			IRepository<ServiceOrderHead> serviceOrderRepository,
			IUserService userService,
			IAppSettingsProvider appSettingsProvider,
			IRepositoryWithTypedId<ServiceOrderTime, Guid> serviceOrderTimeRepository,
			ILog logger,
			IMapper mapper,
			IRepositoryWithTypedId<DocumentAttribute, Guid> documentAttributeRepository,
			IRepositoryWithTypedId<Article, Guid> articleRepository)
		{
			this.serviceOrderRepository = serviceOrderRepository;
			this.userService = userService;
			this.appSettingsProvider = appSettingsProvider;
			this.serviceOrderTimeRepository = serviceOrderTimeRepository;
			this.logger = logger;
			this.mapper = mapper;
			this.documentAttributeRepository = documentAttributeRepository;
			this.articleRepository = articleRepository;


			BasicHttpBinding binding = new BasicHttpBinding();
			// binding.Security
			binding.Security.Mode = BasicHttpSecurityMode.TransportCredentialOnly;
			binding.Security.Transport.ClientCredentialType = HttpClientCredentialType.Ntlm;
			binding.Security.Message.ClientCredentialType = BasicHttpMessageCredentialType.UserName;
			var endPointAddress = new EndpointAddress(appSettingsProvider.GetValue(KagemaPlugin.Settings.NavisionWebserviceUrl));
			serviceOrderOperations = new LmobileFieldWebservice_PortClient(binding, endPointAddress);
			//	serviceOrderOperations.ClientCredentials.ServiceCertificate.Authentication.CertificateValidationMode= System.ServiceModel.Security.X509CertificateValidationMode.None;

			serviceOrderOperations.ClientCredentials.Windows.ClientCredential.UserName = "admin_l-mobile";
			serviceOrderOperations.ClientCredentials.Windows.ClientCredential.Password = "Start123!";
			serviceOrderOperations.ClientCredentials.Windows.ClientCredential.Domain = "kgmnav";



		}

		public IQueryable<ServiceOrderHead> GetNewServiceOrders(int batchCount, int batchSize)
		{
			return serviceOrderRepository.GetAll()
			.Where(x => x.ModelExtension<Model.Extensions.ServiceOrderHeadExtensions, bool>(s => s.ExportNewServiceOrder) && (x.ModelExtension<Model.Extensions.ServiceOrderHeadExtensions, int?>(s => s.FailedExportRetries) == null
							|| x.ModelExtension<Model.Extensions.ServiceOrderHeadExtensions, int?>(s => s.FailedExportRetries) < MaxFailedExportRetries)).OrderBy(x => x.CreateDate)
				.Skip(batchCount * batchSize)
				.Take(batchSize);
			;

		}
		public IQueryable<ServiceOrderHead> GetPlannedServiceOrders(int batchCount, int batchSize)
		{
			return serviceOrderRepository.GetAll()
				.Where(
					x => (x.StatusKey == "Scheduled") || (x.StatusKey == "Released") && (x.ModelExtension<Model.Extensions.ServiceOrderHeadExtensions, int?>(s => s.FailedExportRetries) == null
							|| x.ModelExtension<Model.Extensions.ServiceOrderHeadExtensions, int?>(s => s.FailedExportRetries) < MaxFailedExportRetries))
				.Skip(batchCount * batchSize)
				.Take(batchSize);
		}
		public IQueryable<ServiceOrderHead> GetUnExportedServiceOrders(int batchCount, int batchSize)
		{
			return serviceOrderRepository.GetAll()
				.Where(x => !x.IsExported && (x.StatusKey == ServiceOrderStatus.CompletedKey) && (x.ModelExtension<Model.Extensions.ServiceOrderHeadExtensions, int?>(s => s.FailedExportRetries) == null
							|| x.ModelExtension<Model.Extensions.ServiceOrderHeadExtensions, int?>(s => s.FailedExportRetries) < MaxFailedExportRetries))
				.OrderBy(x => x.CreateDate)
				.Skip(batchCount * batchSize)
				.Take(batchSize);
		}

		public IQueryable<ServiceOrderHead> GetUnExportedLmobileStatusServiceOrders(int batchCount, int batchSize)
		{
			return serviceOrderRepository.GetAll()
				.Where(x => x.ModelExtension<Model.Extensions.ServiceOrderHeadExtensions, bool>(s => s.ExportServiceOrder)
							&& (x.ModelExtension<Model.Extensions.ServiceOrderHeadExtensions, int?>(s => s.FailedExportRetries) == null
							|| x.ModelExtension<Model.Extensions.ServiceOrderHeadExtensions, int?>(s => s.FailedExportRetries) < MaxFailedExportRetries)
							&& (x.StatusKey == ServiceOrderStatus.ReadyForSchedulingKey
							|| x.StatusKey == ServiceOrderStatus.InProgressKey
							|| x.StatusKey == ServiceOrderStatus.ScheduledKey
							|| x.StatusKey == ServiceOrderStatus.ReleasedKey
							|| x.StatusKey == ServiceOrderStatus.PartiallyCompletedKey)
							)
				.OrderBy(x => x.CreateDate)
				.Skip(batchCount * batchSize)
				.Take(batchSize);
		}
		public void ExportPlannedServiceOrder(ServiceOrderHead serviceOrderHead)
		{
			try
			{


				UpdatePlannedServiceOrder(serviceOrderHead);

				serviceOrderRepository.SaveOrUpdate(serviceOrderHead);

				logger.InfoFormat("updating planned Date service order {0}", serviceOrderHead.OrderNo);


			}
			catch (Exception ex)
			{
				logger.Error(String.Format("Exception updating planned service order (order no: {0}, legacy id: {1})", serviceOrderHead.OrderNo, serviceOrderHead.LegacyId), ex);
			}
		}
		private void UpdatePlannedServiceOrder(ServiceOrderHead serviceOrder)
		{
			logger.InfoFormat("update service Order No {0} (LegacyId {1})", serviceOrder.OrderNo, serviceOrder.LegacyId);

			// create transaction for service order head
			try
			{
				var extensionXml = CreatePlannedExtensionXml(serviceOrder);
				var updateExtensionForServiceOrders = new UpdateExtensionForServiceOrders(extensionXml);
				serviceOrderOperations.UpdateExtensionForServiceOrdersAsync(updateExtensionForServiceOrders);
			}
			catch (Exception exception)
			{
				throw new Exception("Service Order Head failed to update to BC365", exception);
			}
		}
		public void ExportNewServiceOrder(ServiceOrderHead serviceOrderHead)
		{
			try
			{
				logger.InfoFormat("Exporting new service order {0}", serviceOrderHead.OrderNo);
				ExportNewServiceOrderViaXml(serviceOrderHead);
				SetNewServiceOrderToExported(serviceOrderHead);
				logger.InfoFormat("Export of service order {0} successful", serviceOrderHead.OrderNo);
			}
			catch (Exception ex)
			{
				serviceOrderHead.GetExtension<Model.Extensions.ServiceOrderHeadExtensions>().ExportNewServiceOrder = true;
				var message = ex.ToString();
				serviceOrderHead.GetExtension<Model.Extensions.ServiceOrderHeadExtensions>().ExportDetails = message.Substring(0, message.Length > 2000 ? 2000 : message.Length);
				logger.Error(String.Format("Exception exporting new service order (order no: {0}, legacy id: {1})", serviceOrderHead.OrderNo, serviceOrderHead.LegacyId), ex);
			}
		}
		public void ExportCompletedServiceOrder(ServiceOrderHead serviceOrderHead)
		{
			try
			{
				logger.InfoFormat("Exporting service order {0}", serviceOrderHead.OrderNo);

				ExportCompleteServiceOrderViaXml(serviceOrderHead);
				//UpdatePlannedServiceOrder(serviceOrderHead);
				CloseAndSetExported(serviceOrderHead);
				logger.InfoFormat("Export of service order {0} successful", serviceOrderHead.OrderNo);
			}
			catch (Exception ex)
			{
				serviceOrderHead.IsExported = false;
				var message = ex.ToString();
				serviceOrderHead.GetExtension<Model.Extensions.ServiceOrderHeadExtensions>().ExportDetails = message.Substring(0, message.Length > 2000 ? 2000 : message.Length);
				logger.Error(String.Format("Exception exporting completed service order (order no: {0}, legacy id: {1})", serviceOrderHead.OrderNo, serviceOrderHead.LegacyId), ex);
			}
		}
		public void UpdateExportServiceOrder(ServiceOrderHead serviceOrder)
		{
			serviceOrder.GetExtension<Model.Extensions.ServiceOrderHeadExtensions>().ExportServiceOrder = true;
			serviceOrderRepository.SaveOrUpdate(serviceOrder);
		}
		public void UpdateExportNewServiceOrder(ServiceOrderHead serviceOrder)
		{
			serviceOrder.GetExtension<Model.Extensions.ServiceOrderHeadExtensions>().ExportNewServiceOrder = true;
			serviceOrder.GetExtension<Model.Extensions.ServiceOrderHeadExtensions>().ExportServiceOrder = true;
			serviceOrderRepository.SaveOrUpdate(serviceOrder);
		}

		//private void SetToReadyForScheduling(ServiceOrderHead serviceOrder)
		//{
		//	logger.InfoFormat("Setting Status to \"ReadyForScheduling\" (service order {0})", serviceOrder.OrderNo);
		//	//serviceOrder.StatusKey = "ReadyForScheduling";
		//	serviceOrder.GetExtension<Model.Extensions.ServiceOrderHeadExtensions>().ExportNewServiceOrder = true;

		//	serviceOrder.ModifyUser = "BCIntegrationService";
		//	serviceOrderRepository.SaveOrUpdate(serviceOrder);
		//}																									  start
		private void SetNewServiceOrderToExported(ServiceOrderHead serviceOrder)
		{
			logger.InfoFormat("Setting newExport to  (service order {0})", serviceOrder.OrderNo);
			//serviceOrder.StatusKey = "ReadyForScheduling";
			serviceOrder.GetExtension<ServiceOrderHeadExtensions>().ExportNewServiceOrder = false;

			serviceOrder.ModifyUser = "BCIntegrationService";
			serviceOrderRepository.SaveOrUpdate(serviceOrder);
		}
		private void CloseAndSetExported(ServiceOrderHead serviceOrder)
		{
			logger.InfoFormat("Setting IsExported flag to true (service order {0})", serviceOrder.OrderNo);
			serviceOrder.IsExported = true;
			serviceOrder.GetExtension<ServiceOrderHeadExtensions>().ExportServiceOrder = false;
			serviceOrder.GetExtension<ServiceOrderHeadExtensions>().ExportNewServiceOrder = false;
			logger.InfoFormat("Setting Status to \"Closed\" (service order {0})", serviceOrder.OrderNo);
			serviceOrder.Closed = DateTime.Now;
			serviceOrder.StatusKey = "Closed";
			serviceOrder.ModifyUser = "BCIntegrationService";
			serviceOrderRepository.SaveOrUpdate(serviceOrder);
		}
		private void SetStatusExported(ServiceOrderHead serviceOrder)
		{
			logger.InfoFormat("Setting ExportServiceOrder flag to false (service order {0})", serviceOrder.OrderNo);

			serviceOrder.GetExtension<ServiceOrderHeadExtensions>().ExportServiceOrder = false;
			serviceOrder.ModifyUser = "BCIntegrationService";
			serviceOrderRepository.SaveOrUpdate(serviceOrder);
		}
		public void UpdateStatusServiceOrder(ServiceOrderHead serviceOrder)
		{
			logger.InfoFormat("update lmstatus status of service Order with order No {0} (LegacyId {1})", serviceOrder.OrderNo, serviceOrder.LegacyId);
			try
			{

				var extensionXml = UpdateStatusServiceOrderExtensionXml(serviceOrder);
				var updateExtensionForServiceOrders = new UpdateExtensionForServiceOrders(extensionXml);

				var exceptionMessage = serviceOrderOperations.UpdateExtensionForServiceOrdersAsync(updateExtensionForServiceOrders);
				if (exceptionMessage.IsFaulted)
				{
					Exception exception = new Exception(exceptionMessage.Result.return_value.ToString());
					throw new Exception("UpdateStatusServiceOrder failed to post to BC365", exception);
				}


				SetStatusExported(serviceOrder);
			}
			catch (Exception exception)
			{
				serviceOrder.GetExtension<ServiceOrderHeadExtensions>().ExportServiceOrder = true;
				throw new Exception("lmstatus Status of Service Order Head failed to update to BC365", exception);
			}
		}

		private void ExportNewServiceOrderViaXml(ServiceOrderHead serviceOrder)
		{

			//create transaction for header
			ServiceOrderHeaderXML serviceHeaderXml = CreateServiceHeaderXml(serviceOrder);
			logger.InfoFormat("Create service Order No {0} (LegacyId {1})", serviceOrder.OrderNo, serviceOrder.LegacyId);
			//create transaction for service order time
			ServiceItemLineXML serviceItemLineXml = CreateServiceItemLineXml(serviceOrder);
			logger.InfoFormat("CreateServiceItemLineXmlTransaction for Order Head {0}, xml: {1}", serviceOrder.OrderNo, serviceItemLineXml.ToString());
			//create transaction for service order postings and service order materials
			//ServiceLineXML serviceLineXml = CreateServiceLineXml(serviceOrder);
			//logger.InfoFormat("CreateServiceLineXmlTransaction for Order No {0}, xml: {1}", serviceOrder.OrderNo, serviceLineXml);


			try
			{
				var createServiceOrderRequest = new CreateServiceOrders(serviceHeaderXml, serviceItemLineXml, new ServiceLineXML());
				var exceptionMessage = serviceOrderOperations.CreateServiceOrdersAsync(serviceHeaderXml, serviceItemLineXml, new ServiceLineXML());
				if (!String.IsNullOrEmpty(exceptionMessage.Result.return_value))
				{
					Exception exception = new Exception(exceptionMessage.Result.return_value);
					throw new Exception("CreateServiceOrders failed to post to BC365", exception);
				}

				UpdateStatusServiceOrder(serviceOrder);

			}
			catch (Exception exception)
			{
				throw new Exception("CreateServiceOrders failed to post to BC365", exception);
			}
		}

		private void ExportCompleteServiceOrderViaXml(ServiceOrderHead serviceOrder)
		{
			logger.InfoFormat("update service Order No {0} (LegacyId {1})", serviceOrder.OrderNo, serviceOrder.LegacyId);
			//create transaction for service order time
			ServiceItemLineXML serviceItemLineXml = CreateServiceItemLineXml(serviceOrder);
			logger.InfoFormat("CreateServiceItemLineXmlTransaction for Order Head {0}, xml: {1}", serviceOrder.OrderNo, serviceItemLineXml.ToString());
			//create transaction for service order postings and service order materials
			ServiceLineXML serviceLineXml = UpdateServiceLineXml(serviceOrder);
			logger.InfoFormat("UpdateServiceLineXmlTransaction for Order No {0}, xml: {1}", serviceOrder.OrderNo, serviceLineXml.ToJson());


			//create transaction for ServiceCommentLine
			ServiceCommentLineXML serviceCommentLineXml = CreateServiceCommentLineXml(serviceOrder);
			var hasCommentLine = serviceCommentLineXml.ServiceCommentLine != null; // todo jw: Aymens webservice should handle an empty XML. hasAttachement parameter is only temp.

			ExtensionUpdateXML extensionCompleteXml = CreateCompleteExtensionXml(serviceOrder);
			logger.InfoFormat("CreateExtensionXml for Order No {0}, xml: {1}", serviceOrder.OrderNo, extensionCompleteXml.ToJson());

			var serviceOrderDocuments = documentAttributeRepository.GetAll()
				.Where(x => x.ReferenceKey == serviceOrder.Id)
				.ToList();

			if (appSettingsProvider.GetValue(KagemaPlugin.Settings.EnableFileExport))
			{
				var attacheObjectXml = CreateServiceOrderFileAttachements(serviceOrder, serviceOrderDocuments);
				CopyFilesOnNetworkDrive(serviceOrder, serviceOrderDocuments);
				var hasAttachements = attacheObjectXml.AttacheFile != null; // todo jw: Aymens webservice should handle an empty XML. hasAttachement parameter is only temp. 
			}
			try
			{

				var updateServiceOrderRequest = new UpdateServiceOrders(extensionCompleteXml, serviceItemLineXml, serviceLineXml);
				var exceptionMessage = serviceOrderOperations.UpdateServiceOrdersAsync(extensionCompleteXml, serviceItemLineXml, serviceLineXml);
				if (!String.IsNullOrEmpty(exceptionMessage.Result.return_value))
				{
					Exception exception = new Exception(exceptionMessage.Result.return_value);
					throw new Exception("UpdateServiceOrders failed to post to BC365", exception);
				}
				else
				{

					try
					{
						var extensionXml = UpdateServiceItemLineExtensionXml(serviceOrder);
						var updateExtensionForServiceOrders = new UpdateExtensionForServiceOrders(extensionXml);
						serviceOrderOperations.UpdateExtensionForServiceOrdersAsync(updateExtensionForServiceOrders);
					}
					catch (Exception exception)
					{
						throw new Exception("Service Item Line  failed to update to BC365", exception);
					}

				}




				if (hasCommentLine)
				{
					var updateServicecommentLineRequest = new UpdateServiceCommentLine(serviceCommentLineXml);
					serviceOrderOperations.UpdateServiceCommentLineAsync(updateServicecommentLineRequest);
					//var exceptionCommentMessage = serviceOrderOperations.UpdateServiceCommentLineAsync(updateServicecommentLineRequest);
					//if (!String.IsNullOrEmpty(exceptionCommentMessage.Result.return_value))
					//{
					//	Exception exceptionComment = new Exception(exceptionCommentMessage.Result.return_value);
					//	throw new Exception("Comment line export failed to post to BC365", exceptionComment);
					//}
				}
			}
			catch (Exception exception)
			{
				throw new Exception("UpdateServiceOrders/CreateServiceOrders failed to post to BC365", exception);
			}
		}

		private ServiceOrderHeaderXML CreateServiceHeaderXml(ServiceOrderHead serviceOrder)
		{
			var dispatches = serviceOrder.Dispatches.Where(x => x.OrderId == serviceOrder.Id)
				.OrderBy(d => d.Date);
			var firstDispatch = dispatches.FirstOrDefault();
			var firstTimePosting = serviceOrder.ServiceOrderTimePostings.OrderBy(d => d.Date)
				.FirstOrDefault();


			var FinishingDate = serviceOrder.Completed;

			ServiceOrderHeaderXML xml = new ServiceOrderHeaderXML();
			var serviceHeaders = new List<ServiceOrderHeader>();
			serviceHeaders.Add(new ServiceOrderHeader
			{
				DocumentType = new[] { "1" },
				No = new[] { serviceOrder.OrderNo },
				CustomerNo = new[] { serviceOrder.CustomerContact?.LegacyId },
				Description = new[] { serviceOrder.ErrorMessage },
				ShiptoCode = new[] { serviceOrder.ServiceOrderTimes?.FirstOrDefault()?.Installation?.GetExtension<InstallationHeadExtensions>()?.ShipToCode == null ? "" : serviceOrder.ServiceOrderTimes?.FirstOrDefault()?.Installation?.GetExtension<InstallationHeadExtensions>()?.ShipToCode },
				ServiceOrderType = new[] { serviceOrder.TypeKey },

				//StrStartingDate = new[] { firstTimePosting?.Date.ToString("yyyy-MM-dd") },
				//StrStartingTime = new[] { firstTimePosting?.Date.ToString("HH:mm:ss") },
				//StrFinishingDate = new[] { FinishingDate?.ToString("yyyy-MM-dd") },
				//StrFinishingTime = new[] { FinishingDate?.ToString("HH:mm:ss") },
				LMNr = serviceOrder.OrderNo.StartsWith("S0") ? (serviceOrder.ServiceCase?.Name.Length > 10 ? new[] { serviceOrder.ServiceCase?.Name.Substring(0, 10) } : new[] { serviceOrder.ServiceCase?.Name }) : new[] { "" },


			}
		); ;


			xml.ServiceOrderHeader = serviceHeaders.ToArray();

			return xml;
		}

		private ServiceCommentLineXML CreateServiceCommentLineXml(ServiceOrderHead serviceOrder)
		{
			var xml = new ServiceCommentLineXML();
			var serviceComments = new List<ServiceCommentLine>();
			var allRemarkTimePosting = serviceOrder.ServiceOrderTimePostings.Where(x => x.InternalRemark != null).OrderBy(d => d.From).ToList();
			foreach (var timeposting in allRemarkTimePosting)
			{
				logger.InfoFormat("CreateCommentLine for Installation No {0}, intrenalRemark: {1}", timeposting.ServiceOrderTime.Installation?.InstallationNo, timeposting?.InternalRemark);

				serviceComments.Add(
					new ServiceCommentLine
					{
						TableName = "2",
						TableSubtype = "0",
						No = timeposting.ServiceOrderTime.Installation?.InstallationNo ?? "",
						Type = "0",
						TableLineNo = "0",
						Date = timeposting?.ModifyDate.ToLocalTime().ToString("yyyy-MM-dd"),
						Monteur = timeposting?.ServiceOrderDispatch?.DispatchedUsername ?? "",
						StrLineNo = new[] { "" },
						StrComment = new[] { timeposting?.InternalRemark ?? "" }

					}); ;
				;

			}


			xml.ServiceCommentLine = serviceComments.ToArray();

			return xml;
		}

		private void CopyFilesOnNetworkDrive(ServiceOrderHead serviceOrder, IList<DocumentAttribute> serviceOrderDocuments)
		{
			logger.Info("Start copying files to network drive with current principal: " + Thread.CurrentPrincipal.Identity.Name);

			FileStream fileStream = null;
			string fullFileName = null;

			if (serviceOrderDocuments.Any() == false)
			{
				return;
			}

			try
			{
				var targetDirectory = appSettingsProvider.GetValue(KagemaPlugin.Settings.NetworkDrivePathForFileStorage) + Path.DirectorySeparatorChar + serviceOrder.OrderNo;
				if (!Directory.Exists(targetDirectory))
				{
					logger.Info("Creating directory: " + targetDirectory);
					Directory.CreateDirectory(targetDirectory);
				}
				else
				{
					logger.Info("Directory already existing: " + targetDirectory);
				}

				foreach (var serviceOrderDocument in serviceOrderDocuments)
				{
					fullFileName = targetDirectory + Path.DirectorySeparatorChar + serviceOrderDocument.FileName;

					if (File.Exists(fullFileName))
					{
						logger.Info("File already exists and will be deleted: " + fullFileName);
						File.Delete(fullFileName);
					}

					var memoryStream = new MemoryStream(
						Convert.ToInt32((double)serviceOrderDocument.FileResource.Length));
					var responseBytes = memoryStream.ToArray();
					fileStream = File.Open(fullFileName, FileMode.Create, FileAccess.ReadWrite, FileShare.ReadWrite);

					fileStream.Write(serviceOrderDocument.FileResource.Content, 0, responseBytes.Length);
					logger.Info("File copied successfully on network path: " + fullFileName);
				}
			}
			catch (Exception ex)
			{
				logger.Error("Error when creating file on network path: '" + fullFileName + "'. Error message: " + ex.Message);
				throw;
			}
			finally
			{
				if (fileStream != null)
				{
					fileStream.Flush();
					fileStream.Close();
				}
			}
		}

		private AttacheObject CreateServiceOrderFileAttachements(ServiceOrderHead serviceOrder, IList<DocumentAttribute> documentAttributes)
		{
			var xml = new AttacheObject();

			if (!documentAttributes.Any())
			{
				return xml;
			}

			var links = new List<Link>();
			var targetDirectory = appSettingsProvider.GetValue(KagemaPlugin.Settings.NetworkDrivePathForFileStorage) + Path.DirectorySeparatorChar + serviceOrder.OrderNo;

			foreach (var document in documentAttributes)
			{
				links.Add(
					new Link { LinkURL = new[] { "File:" + targetDirectory + Path.DirectorySeparatorChar + document.FileName }, Description = new[] { document.Description }, IdUser = new[] { document.CreateUser } });
			}

			var linksArray = new Links[1];
			linksArray[0] = new Links();
			linksArray[0]
				.Link = links.ToArray();

			var attacheFiles = new List<AttacheFile>();
			attacheFiles.Add(new AttacheFile { documentNo = new[] { serviceOrder.OrderNo }, documentType = new[] { "order" }, tableName = new[] { "service header" }, Links = linksArray });

			xml.AttacheFile = attacheFiles.ToArray();

			return xml;
		}

		private ExtensionUpdateXML UpdateStatusServiceOrderExtensionXml(ServiceOrderHead serviceOrder)
		{
			var xml = new ExtensionUpdateXML();
			IList<extension> serviceExtensions = new List<extension>();
			var status = serviceOrder.StatusKey;

			switch (status)
			{
				case ServiceOrderStatus.ReadyForSchedulingKey:
					//serviceExtensions.Add(new extension { tablename = new[] { "Service Header" }, tablekey = new[] { "1," + serviceOrder.OrderNo }, columnname = new[] { "Status" }, value = new[] { "1" } });
					serviceExtensions.Add(new extension { tablename = new[] { "Service Header" }, tablekey = new[] { "1," + serviceOrder.OrderNo }, columnname = new[] { "lmstatus" }, value = new[] { "2" } });
					break;
				case ServiceOrderStatus.ReleasedKey:
					//serviceExtensions.Add(new extension { tablename = new[] { "Service Header" }, tablekey = new[] { "1," + serviceOrder.OrderNo }, columnname = new[] { "Status" }, value = new[] { "1" } });
					serviceExtensions.Add(new extension { tablename = new[] { "Service Header" }, tablekey = new[] { "1," + serviceOrder.OrderNo }, columnname = new[] { "lmstatus" }, value = new[] { "3" } });
					break;
				case ServiceOrderStatus.ScheduledKey:
					//serviceExtensions.Add(new extension { tablename = new[] { "Service Header" }, tablekey = new[] { "1," + serviceOrder.OrderNo }, columnname = new[] { "Status" }, value = new[] { "1" } });
					serviceExtensions.Add(new extension { tablename = new[] { "Service Header" }, tablekey = new[] { "1," + serviceOrder.OrderNo }, columnname = new[] { "lmstatus" }, value = new[] { "3" } });
					break;
				case ServiceOrderStatus.InProgressKey:
					//serviceExtensions.Add(new extension { tablename = new[] { "Service Header" }, tablekey = new[] { "1," + serviceOrder.OrderNo }, columnname = new[] { "Status" }, value = new[] { "1" } });
					serviceExtensions.Add(new extension { tablename = new[] { "Service Header" }, tablekey = new[] { "1," + serviceOrder.OrderNo }, columnname = new[] { "lmstatus" }, value = new[] { "3" } });
					break;
				case ServiceOrderStatus.PartiallyCompletedKey:
					//serviceExtensions.Add(new extension { tablename = new[] { "Service Header" }, tablekey = new[] { "1," + serviceOrder.OrderNo }, columnname = new[] { "Status" }, value = new[] { "1" } });
					serviceExtensions.Add(new extension { tablename = new[] { "Service Header" }, tablekey = new[] { "1," + serviceOrder.OrderNo }, columnname = new[] { "lmstatus" }, value = new[] { "3" } });
					break;
				//case ServiceOrderStatus.CompletedKey:
				//	serviceExtensions.Add(new extension { tablename = new[] { "Service Header" }, tablekey = new[] { "1," + serviceOrder.OrderNo }, columnname = new[] { "lmstatus" }, value = new[] { "3" } });
				//	break;
				default: throw new NotImplementedException($"Update of lmstatus cannot be executed because the status '{status}' is unknown");
			}

			xml.extension = mapper.Map<extension[]>(serviceExtensions);
			return xml;
		}
		private ExtensionUpdateXML CreateCompleteExtensionXml(ServiceOrderHead serviceOrder)
		{
			var xml = new ExtensionUpdateXML();
			IList<extension> serviceExtensions = new List<extension>();

			var dispatches = serviceOrder.Dispatches.Where(x => x.OrderId == serviceOrder.Id)
				.OrderBy(d => d.Date);
			var firstDispatch = dispatches.FirstOrDefault();
			var firstTimePosting = serviceOrder.ServiceOrderTimePostings.OrderBy(d => d.From)
				.FirstOrDefault();
			var lastTimePosting = serviceOrder.ServiceOrderTimePostings.OrderBy(d => d.From)
			.LastOrDefault();
			var StartingDate = DateTime.Now;
			if (firstTimePosting != null)
			{
				StartingDate = (DateTime)firstTimePosting.From;
			}
			else
			{
				StartingDate = firstDispatch.Date;
			}

			var FinishingDate = serviceOrder.Completed;

			if (lastTimePosting != null)
			{
				FinishingDate = (DateTime)lastTimePosting.To;
			}
			else
			{
				FinishingDate = DateTime.Now;
			}

			logger.Info("Start Date " + StartingDate.ToString());

			logger.Info("End Date " + FinishingDate.ToString());

			serviceExtensions.Add(new extension { tablename = new[] { "Service Header" }, tablekey = new[] { "1," + serviceOrder.OrderNo }, columnname = new[] { "lmstatus" }, value = new[] { "4" } });
			//serviceExtensions.Add(new extension { tablename = new[] { "Service Header" }, tablekey = new[] { "1," + serviceOrder.OrderNo }, columnname = new[] { "Starting Date" }, value = new[] { StartingDate.ToString("yyyy-MM-dd") } });
			//serviceExtensions.Add(new extension { tablename = new[] { "Service Header" }, tablekey = new[] { "1," + serviceOrder.OrderNo }, columnname = new[] { "Starting Time" }, value = new[] { StartingDate.ToLocalTime().ToString("HH:mm:ss") } });
			//serviceExtensions.Add(new extension { tablename = new[] { "Service Header" }, tablekey = new[] { "1," + serviceOrder.OrderNo }, columnname = new[] { "Finishing Date" }, value = new[] { FinishingDate?.ToString("yyyy-MM-dd") } });
			//serviceExtensions.Add(new extension { tablename = new[] { "Service Header" }, tablekey = new[] { "1," + serviceOrder.OrderNo }, columnname = new[] { "Finishing Time" }, value = new[] { FinishingDate?.ToLocalTime().ToString("HH:mm:ss") } });
			serviceExtensions.Add(new extension { tablename = new[] { "Service Header" }, tablekey = new[] { "1," + serviceOrder.OrderNo }, columnname = new[] { "KGM_Monteur" }, value = firstDispatch != null ? new[] { firstDispatch.DispatchedUsername } : new[] { "" } });


			foreach (var serviceOrderMaterial in serviceOrder.ServiceOrderMaterials)
			{
				if (serviceOrderMaterial.EstimatedQty != 0)
				{


					serviceExtensions.Add(new extension { tablename = new[] { "Service Line" }, tablekey = new[] { "1," + serviceOrderMaterial.ServiceOrderHead.OrderNo + "," + serviceOrderMaterial.GetExtension<ServiceOrderMaterialExtensions>().iPosNo }, columnname = new[] { "Quantity" }, value = new[] { serviceOrderMaterial.ActualQty.ToString().Replace('.', ',') } });
					//serviceExtensions.Add(new extension { tablename = new[] { "Service Line" }, tablekey = new[] { "1," + serviceOrderMaterial.ServiceOrderHead.OrderNo+"," + serviceOrderMaterial.GetExtension<ServiceOrderMaterialExtensions>().iPosNo}, columnname = new[] { "Vendor No_" }, value = new[] { serviceOrderMaterial.Article.GetExtension<KagemaArticleExtension>().VendorNo } });
					//serviceExtensions.Add(new extension { tablename = new[] { "Service Line" }, tablekey = new[] { "1," + serviceOrderMaterial.ServiceOrderHead.OrderNo+"," + serviceOrderMaterial.GetExtension<ServiceOrderMaterialExtensions>().iPosNo}, columnname = new[] { "ShelfNo" }, value = new[] { serviceOrderMaterial.Article.GetExtension<KagemaArticleExtension>().ShelfNo  } });

				}

			}

			xml.extension = mapper.Map<extension[]>(serviceExtensions);

			return xml;
		}


		private ExtensionUpdateXML UpdateServiceItemLineExtensionXml(ServiceOrderHead serviceOrder)
		{
			var xml = new ExtensionUpdateXML();
			IList<extension> serviceExtensions = new List<extension>();
			var firstDispatch = serviceOrder.Dispatches.Where(x => x.OrderId == serviceOrder.Id)
					 .OrderBy(d => d.Time)
					 .FirstOrDefault();
			var firstTimePosting = serviceOrder.ServiceOrderTimePostings.OrderBy(d => d.From)
			  .FirstOrDefault();
			var lastTimePosting = serviceOrder.ServiceOrderTimePostings.OrderBy(d => d.From)
			.LastOrDefault();
			var StartingDate = DateTime.Now;
			if (firstTimePosting != null)
			{
				StartingDate = (DateTime)firstTimePosting.From;
			}
			else
			{
				StartingDate = firstDispatch.Date;
			}
			if (serviceOrder.ServiceOrderTimes != null && serviceOrder.ServiceOrderTimes.Any())
			{
				foreach (var serviceOrderTime in serviceOrder.ServiceOrderTimes)
				{
					var installation = serviceOrderTime.Installation;

					if (installation != null)
					{
						//	var user = userService.GetActiveUsers()
						//		.Where(x => x.Id == firstDispatch.DispatchedUsername)
						//		.FirstOrDefault();
						serviceExtensions.Add(
											 new extension
											 {
												 tablename = new[] { "Service Item Line" },
												 tablekey = new[] { "1," + serviceOrder.OrderNo + "," + serviceOrderTime.PosNo },
												 columnname = new[] { "Ship-to Code" },
												 //value = new[] { serviceOrder.ServiceOrderTimes?.FirstOrDefault()?.Installation?.GetExtension<InstallationHeadExtensions>()?.ShipToCode == null ? "" : serviceOrder.ServiceOrderTimes?.FirstOrDefault()?.Installation?.GetExtension<InstallationHeadExtensions>()?.ShipToCode }
												 value = new[] { serviceOrderTime.Installation?.GetExtension<InstallationHeadExtensions>()?.ShipToCode == null ? "" : serviceOrderTime.Installation?.GetExtension<InstallationHeadExtensions>()?.ShipToCode }
											 });


						/*serviceExtensions.Add(
							new extension
							{
								tablename = new[] { "Service Item Line" },
								tablekey = new[] { "1," + serviceOrder.OrderNo + "," + serviceOrderTime.PosNo },
								columnname = new[] { "Starting Date" },
								value = new[]
								{
									StartingDate.ToLocalTime()
										.ToString("yyyy-MM-dd")
								}
							});


						serviceExtensions.Add(
							new extension
							{
								tablename = new[] { "Service Item Line" },
								tablekey = new[] { "1," + serviceOrder.OrderNo + "," + serviceOrderTime.PosNo },
								columnname = new[] { "Starting Time" },
								value = new[]
								{
									StartingDate.ToLocalTime()
										.ToString("HH:mm:ss")
								}
							});	*/

					}
				}
			}
			xml.extension = mapper.Map<extension[]>(serviceExtensions);

			return xml;
		}
		//private ServiceLineXML CreateServiceLineXml(ServiceOrderHead serviceOrderHead)
		//{
		//	ServiceLineXML transaction = new ServiceLineXML();

		//	IList<ServiceLine> serviceLines = new List<ServiceLine>();
		//	const int INCREMENT = 10000;


		//	//int lineNoServiceItemLine = serviceOrderHead.ServiceOrderMaterials.OrderBy(x => x.PosNo).FirstOrDefault().PosNo=="" ? 0 : Convert.ToInt32(serviceOrderHead.ServiceOrderMaterials.OrderBy(x => x.PosNo).FirstOrDefault()?.PosNo);
		//	int lineNoServiceItemLine = 0;

		//	try
		//	{
		//		// create line in BC for kilometer
		//		var bcItemNosForTraveling = articleRepository.GetAll().Where(x => x.ModelExtension<ArticleExtension, bool>(e => e.ShowDistanceInput)).Select(x => x.ItemNo);
		//		var timePostingWithKilometers = serviceOrderHead.ServiceOrderTimePostings.Where(x => x.Article.GetExtension<ArticleExtension>().ShowDistanceInput);
		//		var bcItemNoForKilometer = appSettingsProvider.GetValue(KagemaPlugin.Settings.ItemNoWithKilometerAmount);
		//		var bcNoForKilometer = appSettingsProvider.GetValue(KagemaPlugin.Settings.ItemNoForKilometer);
		//		var timePostingWithoutKilometers = serviceOrderHead.ServiceOrderTimePostings.Where(x => x.ItemNo != bcItemNoForKilometer);

		//		// create line for BC for serviceorderMaterials
		//		foreach (var serviceOrderMaterial in serviceOrderHead.ServiceOrderMaterials.OrderBy(x => Convert.ToInt32(x.PosNo)))
		//		{
		//			lineNoServiceItemLine = lineNoServiceItemLine + INCREMENT;
		//			var serviceOrderTime = serviceOrderMaterial.ServiceOrderTime;
		//			serviceLines.Add(
		//				new ServiceLine
		//				{
		//					CustomerNo = new[] { serviceOrderMaterial.ServiceOrderHead.CustomerContact.LegacyId },
		//					UnitofMeasureCode = new[] { serviceOrderMaterial.Article.QuantityUnit.Key },
		//					DocumentType = new[] { BcHelper.BcDocumentType.ServiceOrder }, //order
		//					DocumentNo = new[] { serviceOrderMaterial.ServiceOrderHead.OrderNo },
		//					LineNo = new[] { lineNoServiceItemLine }, // todo jw: lineno should be generated on mobile client so that it is the same on servicereport and BC
		//					ServiceItemLineNo = new[] { Int32.Parse(serviceOrderTime?.PosNo ?? "0") },
		//					Type = new[]
		//					{
		//						ResolveArticleTypeForBc(serviceOrderMaterial.Article.ArticleTypeKey)
		//							.ToString()
		//					},
		//					No = new[] { serviceOrderMaterial.Article.ItemNo },
		//					Quantity = new[] { serviceOrderMaterial.ActualQty },
		//					QtytoShip = new[] { serviceOrderMaterial.ActualQty },
		//					QtytoInvoice = new[] { serviceOrderMaterial.ActualQty },

		//					//LocationCode = new[] { serviceOrderMaterial.FromWarehouse ?? "" },
		//					StrPostingDate = new[] { serviceOrderMaterial.ModifyDate.ToString("yyyy-MM-dd") },
		//					Description = new[] { serviceOrderMaterial.Description },

		//					Calculate = new[] { serviceOrderMaterial.CreateUser == "Import" ? serviceOrderMaterial.GetExtension<ServiceOrderMaterialExtensions>().Calculate : true },
		//					OnReport = new[] { serviceOrderMaterial.GetExtension<ServiceOrderMaterialExtensions>().OnReport },
		//					EKStatus = new[] { serviceOrderMaterial.CreateUser == "Import" ? "0" : "1" }

		//				});
		//		}

		//		// create line for BC for serviceordertimepostingsWith Kilometer
		//		if ((bcItemNosForTraveling != null) && (!string.IsNullOrEmpty(bcItemNoForKilometer)))
		//		{
		//			var itemForKilometers = articleRepository.GetAll()
		//				.Single(x => x.ItemNo == bcItemNoForKilometer);

		//			foreach (var timePostingWithKilometer in timePostingWithKilometers)
		//			{
		//				lineNoServiceItemLine = lineNoServiceItemLine + INCREMENT;
		//				serviceLines.Add(
		//					new ServiceLine
		//					{
		//						CustomerNo = new[] { serviceOrderHead.CustomerContact?.LegacyId },
		//						//UnitofMeasureCode = new[] { itemForKilometers?.QuantityUnit.Value },
		//						DocumentType = new[] { BcHelper.BcDocumentType.ServiceOrder }, //order
		//						DocumentNo = new[] { serviceOrderHead.OrderNo },
		//						LineNo = new[] { lineNoServiceItemLine }, // todo jw: lineno should be generated on mobile client so that it is the same on servicereport and BC
		//						ServiceItemLineNo = new[] { Int32.Parse(timePostingWithKilometer.ServiceOrderTime?.PosNo ?? "0") },
		//						Type = new[] { "3" },//Cost
		//						No = new[] { bcNoForKilometer },
		//						//No = new[] { timePostingWithKilometer.User.PersonnelId },
		//						Quantity = new[] { Convert.ToDecimal(timePostingWithKilometer.Kilometers) },
		//						QtytoShip = new[] { Convert.ToDecimal(timePostingWithKilometer.Kilometers) },
		//						QtytoInvoice = new[] { Convert.ToDecimal(timePostingWithKilometer.Kilometers) },
		//						WorkTypeCode = new[] { timePostingWithKilometer.Article.ItemNo },
		//						StrPostingDate = new[] { timePostingWithKilometer.Date.ToString("yyyy-MM-dd") },
		//						EKStatus = new[] { "1" }
		//					});
		//			}
		//		}


		//		// create line for BC for serviceordertimepostings Without Kilometer
		//		foreach (var serviceOrderTimePosting in timePostingWithoutKilometers)
		//		{
		//			lineNoServiceItemLine = lineNoServiceItemLine + INCREMENT;

		//			serviceLines.Add(
		//				new ServiceLine
		//				{
		//					CustomerNo = new[] { serviceOrderTimePosting.ServiceOrderHead.CustomerContact.LegacyId },
		//					UnitofMeasureCode = new[] { serviceOrderTimePosting.Article.QuantityUnit.Value },
		//					DocumentType = new[] { BcHelper.BcDocumentType.ServiceOrder },
		//					DocumentNo = new[] { serviceOrderTimePosting.ServiceOrderHead.OrderNo },
		//					Type = new[]
		//					{
		//						ResolveArticleTypeForBc(serviceOrderTimePosting.Article.ArticleTypeKey)
		//							.ToString()
		//					}, //resource
		//					LineNo = new[] { lineNoServiceItemLine }, // todo jw: lineno should be generated on mobile client so that it is the same on servicereport and BC
		//					ServiceItemLineNo = new[] { Int32.Parse(serviceOrderTimePosting.ServiceOrderTime?.PosNo ?? "0") },
		//					No = new[] { serviceOrderTimePosting.User.PersonnelId },
		//					Quantity = new[] { ResolveServiceQuantity(serviceOrderTimePosting) },
		//					QtytoShip = new[] { ResolveServiceQuantity(serviceOrderTimePosting) },
		//					QtytoInvoice = new[] { ResolveServiceQuantity(serviceOrderTimePosting) },
		//					LocationCode = new[] { "" },
		//					StrPostingDate = new[] { serviceOrderTimePosting.Date.ToString("yyyy-MM-dd") },
		//					WorkTypeCode = new[] { serviceOrderTimePosting.Article.ItemNo },
		//					EKStatus = new[] { "1" }
		//				});
		//		}



		//		transaction.ServiceLine = mapper.Map<ServiceLine[]>(serviceLines);
		//	}
		//	catch (Exception exception)
		//	{
		//		throw new Exception("Servicelines failed to post to BC365", exception);
		//	}

		//	return transaction;
		//}


		private ServiceLineXML UpdateServiceLineXml(ServiceOrderHead serviceOrderHead)
		{
			ServiceLineXML transaction = new ServiceLineXML();

			IList<ServiceLine> serviceLines = new List<ServiceLine>();
			const int INCREMENT = 10000;


			//int lineNoServiceItemLine = serviceOrderHead.ServiceOrderMaterials.OrderBy(x => x.PosNo).FirstOrDefault().PosNo=="" ? 0 : Convert.ToInt32(serviceOrderHead.ServiceOrderMaterials.OrderBy(x => x.PosNo).FirstOrDefault()?.PosNo);
			int lineNoServiceItemLine = 0;

			try
			{
				// create line in BC for kilometer
				var bcItemNosForTraveling = articleRepository.GetAll().Where(x => x.ModelExtension<ArticleExtension, bool>(e => e.ShowDistanceInput)).Select(x => x.ItemNo);
				var timePostingWithKilometers = serviceOrderHead.ServiceOrderTimePostings.Where(x => x.Article.GetExtension<Crm.Service.Model.ArticleExtension>().ShowDistanceInput);
				var bcItemNoForKilometer = appSettingsProvider.GetValue(KagemaPlugin.Settings.ItemNoWithKilometerAmount);
				var bcNoForKilometer = appSettingsProvider.GetValue(KagemaPlugin.Settings.ItemNoForKilometer);
				var timePostingWithoutKilometers = serviceOrderHead.ServiceOrderTimePostings.Where(x => x.ItemNo != bcItemNoForKilometer);

				// create line for BC for serviceorderMaterials
				foreach (var serviceOrderMaterial in serviceOrderHead.ServiceOrderMaterials.Where(x=>x.DispatchId!=null))
				{

					lineNoServiceItemLine = Convert.ToInt32(serviceOrderMaterial.PosNo);

					var serviceOrderTime = serviceOrderMaterial.ServiceOrderTime;
					if (serviceOrderMaterial.EstimatedQty != 0)
					{

						//serviceLines.Add(
						//new ServiceLine
						//{
						//	DocumentType = new[] { BcHelper.BcDocumentType.ServiceOrder }, //order
						//	DocumentNo = new[] { serviceOrderMaterial.ServiceOrderHead.OrderNo },
						//	LineNo = new[] { serviceOrderMaterial.GetExtension<ServiceOrderMaterialExtensions>().iPosNo }, // todo jw: lineno should be generated on mobile client so that it is the same on servicereport and BC
						//	//ServiceItemLineNo = new[] { Int32.Parse(serviceOrderTime?.PosNo ?? "0") },
						//	//Type = new[]
						//	//{
						//	//	ResolveArticleTypeForBc(serviceOrderMaterial.Article.ArticleTypeKey)
						//	//		.ToString()
						//	//},
						//	//No = new[] { serviceOrderMaterial.Article.ItemNo },
						//	//QuantityB = new[] {serviceOrderMaterial.ActualQty},
						//	//Quantity = new[] {serviceOrderMaterial.ActualQty},
						//	QtytoShip = new[] { serviceOrderMaterial.ActualQty },
						//	//QtytoInvoice = new[] { serviceOrderMaterial.ActualQty },
						//	//LocationCode = new[] { serviceOrderMaterial.FromWarehouse ?? "" },
						//	//StrPostingDate = new[] { serviceOrderMaterial.ModifyDate.ToString("yyyy-MM-dd") },
						//	EKStatus = new[] {  "0"  }

						//});

					}
					else
					{
						if (serviceOrderMaterial.Article.ItemNo == appSettingsProvider.GetValue(KagemaPlugin.Settings.dummyArticleItemNo))
						{
							string sInternalRemark = serviceOrderMaterial.InternalRemark ?? "";
							string sExternalRemark = serviceOrderMaterial.ExternalRemark ?? "";
							string sFullDrescr2 = sInternalRemark + " " + sExternalRemark;
							if (serviceOrderMaterial.ServiceOrderHead.GetExtension<ServiceOrderHeadExtensions>().Tag13B)
							{
								serviceLines.Add(
									new ServiceLine
									{
										CustomerNo = new[] { serviceOrderMaterial.ServiceOrderHead.CustomerContact.LegacyId },
										//UnitofMeasureCode = new[] { "STCK" },
										DocumentType = new[] { BcHelper.BcDocumentType.ServiceOrder }, //order
										DocumentNo = new[] { serviceOrderMaterial.ServiceOrderHead.OrderNo },
										LineNo = new[] { 0 },
										LineNoCode = new[] { "0" },
										ServiceItemLineNo = new[] { Int32.Parse(serviceOrderTime?.PosNo ?? "0") },
										Type = new[]
										{
								           "1"
										},
										No = new[] { serviceOrderMaterial.Article.ItemNo },
										Quantity = new[] { serviceOrderMaterial.ActualQty },

										StrPostingDate = new[] { serviceOrderMaterial.ModifyDate.ToString("yyyy-MM-dd") },
										Description = new[] { serviceOrderMaterial.Description },
										Description2 = new[] { sFullDrescr2.Substring(0, sFullDrescr2.Length > 50 ? 50 : sFullDrescr2.Length) },

										UnitCost = new[] { serviceOrderMaterial.Price ?? 0 },
										UnitCostLCY = new[] { serviceOrderMaterial.Price ?? 0 },
										Calculate = new[] { true },
										OnReport = new[] { serviceOrderMaterial.GetExtension<ServiceOrderMaterialExtensions>().OnReport },
										EKStatus = new[] { "1" },
										LocationCode = new[] { appSettingsProvider.GetValue(KagemaPlugin.Settings.LocationCode) },
										ShortcutDimensionCode = new[] { appSettingsProvider.GetValue(KagemaPlugin.Settings.ShortcutDimensionCode) },
										VATProdPostingGroup = new[] { "13B" },
										GenBusPostingGroup = new[] { "13B" }


									});
							}
							else
							{
								serviceLines.Add(
							new ServiceLine
							{
								CustomerNo = new[] { serviceOrderMaterial.ServiceOrderHead.CustomerContact.LegacyId },
								//UnitofMeasureCode = new[] { "STCK" },
								DocumentType = new[] { BcHelper.BcDocumentType.ServiceOrder }, //order
								DocumentNo = new[] { serviceOrderMaterial.ServiceOrderHead.OrderNo },
								LineNo = new[] { 0 },
								LineNoCode = new[] { "0" },
								ServiceItemLineNo = new[] { Int32.Parse(serviceOrderTime?.PosNo ?? "0") },
								Type = new[]
								{
								"1"
								},
								No = new[] { serviceOrderMaterial.Article.ItemNo },
								Quantity = new[] { serviceOrderMaterial.ActualQty },

								StrPostingDate = new[] { serviceOrderMaterial.ModifyDate.ToString("yyyy-MM-dd") },
								Description = new[] { serviceOrderMaterial.Description },
								Description2 = new[] { sFullDrescr2.Substring(0, sFullDrescr2.Length > 50 ? 50 : sFullDrescr2.Length) },

								UnitCost = new[] { serviceOrderMaterial.Price ?? 0 },
								UnitCostLCY = new[] { serviceOrderMaterial.Price ?? 0 },
								Calculate = new[] { true },
								OnReport = new[] { serviceOrderMaterial.GetExtension<ServiceOrderMaterialExtensions>().OnReport },
								EKStatus = new[] { "1" },
								LocationCode = new[] { appSettingsProvider.GetValue(KagemaPlugin.Settings.LocationCode) },
								ShortcutDimensionCode = new[] { appSettingsProvider.GetValue(KagemaPlugin.Settings.ShortcutDimensionCode) },


							});
							}
						}
						else
						{
							if (serviceOrderMaterial.ServiceOrderHead.GetExtension<ServiceOrderHeadExtensions>().Tag13B)
							{
								serviceLines.Add(
									new ServiceLine
									{
										CustomerNo = new[] { serviceOrderMaterial.ServiceOrderHead.CustomerContact.LegacyId },
										//UnitofMeasureCode = new[] { serviceOrderMaterial.Article.QuantityUnit.Key },
										DocumentType = new[] { BcHelper.BcDocumentType.ServiceOrder }, //order
										DocumentNo = new[] { serviceOrderMaterial.ServiceOrderHead.OrderNo },
										LineNo = new[] { 0 },
										LineNoCode = new[] { "0" },
										ServiceItemLineNo = new[] { Int32.Parse(serviceOrderTime?.PosNo ?? "0") },
										Type = new[]
										{
									   ResolveArticleTypeForBc(serviceOrderMaterial.Article.ArticleTypeKey)
									   .ToString()
										},
										No = new[] { serviceOrderMaterial.Article.ItemNo },
										Quantity = new[] { serviceOrderMaterial.ActualQty },
										//QtytoShip = new[] { serviceOrderMaterial.ActualQty },
										//QtytoInvoice = new[] { serviceOrderMaterial.ActualQty },
										//LocationCode = new[] { serviceOrderMaterial.FromWarehouse ?? "" },
										StrPostingDate = new[] { serviceOrderMaterial.ModifyDate.ToString("yyyy-MM-dd") },
										//Description = new[] { serviceOrderMaterial.Description },
										Calculate = new[] { true },
										OnReport = new[] { serviceOrderMaterial.GetExtension<ServiceOrderMaterialExtensions>().OnReport },
										EKStatus = new[] { serviceOrderMaterial.CreateUser == "Import" ? "0" : "1" },
										VendorNo = new[] { serviceOrderMaterial.Article.GetExtension<KagemaArticleExtension>().VendorNo },
										ShelfNo = new[] { serviceOrderMaterial.Article.GetExtension<KagemaArticleExtension>().ShelfNo },
										LocationCode = new[] { appSettingsProvider.GetValue(KagemaPlugin.Settings.LocationCode) },
										ShortcutDimensionCode = new[] { appSettingsProvider.GetValue(KagemaPlugin.Settings.ShortcutDimensionCode) },
										VATProdPostingGroup = new[] { "13B" },
										GenBusPostingGroup = new[] { "13B" }


									});
							}
							else
							{
								serviceLines.Add(
							new ServiceLine
							{
								CustomerNo = new[] { serviceOrderMaterial.ServiceOrderHead.CustomerContact.LegacyId },
								//UnitofMeasureCode = new[] { serviceOrderMaterial.Article.QuantityUnit.Key },
								DocumentType = new[] { BcHelper.BcDocumentType.ServiceOrder }, //order
								DocumentNo = new[] { serviceOrderMaterial.ServiceOrderHead.OrderNo },
								LineNo = new[] { 0 },
								LineNoCode = new[] { "0" },
								ServiceItemLineNo = new[] { Int32.Parse(serviceOrderTime?.PosNo ?? "0") },
								Type = new[]
								{
								ResolveArticleTypeForBc(serviceOrderMaterial.Article.ArticleTypeKey)
									.ToString()
								},
								No = new[] { serviceOrderMaterial.Article.ItemNo },
								Quantity = new[] { serviceOrderMaterial.ActualQty },
								//QtytoShip = new[] { serviceOrderMaterial.ActualQty },
								//QtytoInvoice = new[] { serviceOrderMaterial.ActualQty },
								//LocationCode = new[] { serviceOrderMaterial.FromWarehouse ?? "" },
								StrPostingDate = new[] { serviceOrderMaterial.ModifyDate.ToString("yyyy-MM-dd") },
								//Description = new[] { serviceOrderMaterial.Description },
								Calculate = new[] { true },
								OnReport = new[] { serviceOrderMaterial.GetExtension<ServiceOrderMaterialExtensions>().OnReport },
								EKStatus = new[] { serviceOrderMaterial.CreateUser == "Import" ? "0" : "1" },
								VendorNo = new[] { serviceOrderMaterial.Article.GetExtension<KagemaArticleExtension>().VendorNo },
								ShelfNo = new[] { serviceOrderMaterial.Article.GetExtension<KagemaArticleExtension>().ShelfNo },
								LocationCode = new[] { appSettingsProvider.GetValue(KagemaPlugin.Settings.LocationCode) },
								ShortcutDimensionCode = new[] { appSettingsProvider.GetValue(KagemaPlugin.Settings.ShortcutDimensionCode) },

							});
							}
						}
					}
				}


				// create line for BC for serviceordertimepostings With Kilometer
				if ((bcItemNosForTraveling != null) && (!string.IsNullOrEmpty(bcItemNoForKilometer)))
				{
					var itemForKilometers = articleRepository.GetAll()
						.Single(x => x.ItemNo == bcItemNoForKilometer);
					var CalculateForTimeWithKilometer = true;

					foreach (var timePostingWithKilometer in timePostingWithKilometers)
					{
						if (serviceOrderHead.GetExtension<ServiceOrderHeadExtensions>().TravelFlateRate && timePostingWithKilometer.Article.GetExtension<KagemaArticleExtension>().lumpsum)
						{
							CalculateForTimeWithKilometer = false;
						}
						lineNoServiceItemLine = lineNoServiceItemLine + INCREMENT;
						if (serviceOrderHead.GetExtension<ServiceOrderHeadExtensions>().Tag13B)
						{
							serviceLines.Add(
								new ServiceLine
								{
									CustomerNo = new[] { serviceOrderHead.CustomerContact?.LegacyId },
									//UnitofMeasureCode = new[] { "KM" },
									DocumentType = new[] { BcHelper.BcDocumentType.ServiceOrder }, //order
									DocumentNo = new[] { serviceOrderHead.OrderNo },
									LineNo = new[] { 0 }, // todo jw: lineno should be generated on mobile client so that it is the same on servicereport and BC
									LineNoCode = new[] { "0" },
									ServiceItemLineNo = new[] { Int32.Parse(timePostingWithKilometer.ServiceOrderTime?.PosNo ?? "0") },
									Type = new[] { "2" },//resource instead of cost
									No = new[] { bcNoForKilometer },
									//No = new[] { timePostingWithKilometer.User.PersonnelId },
									Quantity = new[] { Convert.ToDecimal(timePostingWithKilometer.Kilometers??0) },
									Calculate = new[] { CalculateForTimeWithKilometer },
									WorkTypeCode = new[] { appSettingsProvider.GetValue(KagemaPlugin.Settings.FAHRTWorkType) },
									StrPostingDate = new[] { timePostingWithKilometer.Date.ToString("yyyy-MM-dd") },
									EKStatus = new[] { "1" },
									LocationCode = new[] { appSettingsProvider.GetValue(KagemaPlugin.Settings.LocationCode) },
									ShortcutDimensionCode = new[] { appSettingsProvider.GetValue(KagemaPlugin.Settings.ShortcutDimensionCode) },
									VATProdPostingGroup = new[] { "13B" },
									GenBusPostingGroup = new[] { "13B" }
								});

							serviceLines.Add(
						 new ServiceLine
						 {
							 CustomerNo = new[] { timePostingWithKilometer.ServiceOrderHead.CustomerContact.LegacyId },
							// UnitofMeasureCode = new[] { timePostingWithKilometer.Article.QuantityUnit.Value },
							 DocumentType = new[] { BcHelper.BcDocumentType.ServiceOrder },
							 DocumentNo = new[] { timePostingWithKilometer.ServiceOrderHead.OrderNo },
							 Type = new[]
							 {
								ResolveArticleTypeForBc(timePostingWithKilometer.Article.ArticleTypeKey)
									.ToString()
							 }, //resource
							 LineNo = new[] { 0 }, // todo jw: lineno should be generated on mobile client so that it is the same on servicereport and BC
							 LineNoCode = new[] { "0" },
							 ServiceItemLineNo = new[] { Int32.Parse(timePostingWithKilometer.ServiceOrderTime?.PosNo ?? "0") },
							 No = new[] { timePostingWithKilometer.User.PersonnelId },
							 Quantity = new[] { ResolveServiceQuantity(timePostingWithKilometer) },
							 Calculate = new[] { CalculateForTimeWithKilometer },
							 //LocationCode = new[] { "" },
							 StrPostingDate = new[] { timePostingWithKilometer.Date.ToString("yyyy-MM-dd") },
							 WorkTypeCode = new[] {  timePostingWithKilometer.Article.ItemNo },
							 EKStatus = new[] { "1" },
							 LocationCode = new[] { appSettingsProvider.GetValue(KagemaPlugin.Settings.LocationCode) },
							 ShortcutDimensionCode = new[] { appSettingsProvider.GetValue(KagemaPlugin.Settings.ShortcutDimensionCode) },
							 VATProdPostingGroup = new[] { "13B" },
							 GenBusPostingGroup = new[] { "13B" }

						 });
						}
						else
						{
							serviceLines.Add(
						new ServiceLine
						{
							CustomerNo = new[] { serviceOrderHead.CustomerContact?.LegacyId },
							//UnitofMeasureCode = new[] { "KM" },
							DocumentType = new[] { BcHelper.BcDocumentType.ServiceOrder }, //order
							DocumentNo = new[] { serviceOrderHead.OrderNo },
							LineNo = new[] { 0 }, // todo jw: lineno should be generated on mobile client so that it is the same on servicereport and BC
							LineNoCode = new[] { "0" },
							ServiceItemLineNo = new[] { Int32.Parse(timePostingWithKilometer.ServiceOrderTime?.PosNo ?? "0") },
							Type = new[] { "2" },//resource instead of Cost
							No = new[] { bcNoForKilometer },
							//No = new[] { timePostingWithKilometer.User.PersonnelId },
							Quantity = new[] { Convert.ToDecimal(timePostingWithKilometer.Kilometers ?? 0) },
							Calculate = new[] { CalculateForTimeWithKilometer },
							WorkTypeCode = new[] { appSettingsProvider.GetValue(KagemaPlugin.Settings.FAHRTWorkType)},
							StrPostingDate = new[] { timePostingWithKilometer.Date.ToString("yyyy-MM-dd") },
							EKStatus = new[] { "1" },
							LocationCode = new[] { appSettingsProvider.GetValue(KagemaPlugin.Settings.LocationCode) },
							ShortcutDimensionCode = new[] { appSettingsProvider.GetValue(KagemaPlugin.Settings.ShortcutDimensionCode) },

						});

							serviceLines.Add(
				new ServiceLine
				{
					CustomerNo = new[] { timePostingWithKilometer.ServiceOrderHead.CustomerContact.LegacyId },
					//UnitofMeasureCode = new[] { timePostingWithKilometer.Article.QuantityUnit.Value },
					DocumentType = new[] { BcHelper.BcDocumentType.ServiceOrder },
					DocumentNo = new[] { timePostingWithKilometer.ServiceOrderHead.OrderNo },
					Type = new[]
					{
								ResolveArticleTypeForBc(timePostingWithKilometer.Article.ArticleTypeKey)
									.ToString()
					}, //resource
					LineNo = new[] { 0 }, // todo jw: lineno should be generated on mobile client so that it is the same on servicereport and BC
					LineNoCode = new[] { "0" },
					ServiceItemLineNo = new[] { Int32.Parse(timePostingWithKilometer.ServiceOrderTime?.PosNo ?? "0") },
					No = new[] { timePostingWithKilometer.User?.PersonnelId },
					Quantity = new[] { ResolveServiceQuantity(timePostingWithKilometer) },
					Calculate = new[] { CalculateForTimeWithKilometer },
					//LocationCode = new[] { "" },
					StrPostingDate = new[] { timePostingWithKilometer.Date.ToString("yyyy-MM-dd") },
					WorkTypeCode = new[] {timePostingWithKilometer.Article.ItemNo  },
					EKStatus = new[] { "1" },
					LocationCode = new[] { appSettingsProvider.GetValue(KagemaPlugin.Settings.LocationCode) },
					ShortcutDimensionCode = new[] { appSettingsProvider.GetValue(KagemaPlugin.Settings.ShortcutDimensionCode) },

				});
					

						}
					}
				}

				var CalculateForTimeWithoutKilometer = true;
				// create line for BC for serviceordertimepostings Without Kilometer
				foreach (var serviceOrderTimePosting in timePostingWithoutKilometers)
				{

					if (serviceOrderHead.GetExtension<ServiceOrderHeadExtensions>().OfferFlateRate && serviceOrderTimePosting.Article.GetExtension<KagemaArticleExtension>().lumpsum)
					{
						CalculateForTimeWithoutKilometer = false;
					}
					lineNoServiceItemLine = lineNoServiceItemLine + INCREMENT;
					if (serviceOrderHead.GetExtension<ServiceOrderHeadExtensions>().Tag13B)
					{
						serviceLines.Add(
							new ServiceLine
							{
								CustomerNo = new[] { serviceOrderTimePosting.ServiceOrderHead.CustomerContact.LegacyId },
								//UnitofMeasureCode = new[] { serviceOrderTimePosting.Article.QuantityUnit.Value },
								DocumentType = new[] { BcHelper.BcDocumentType.ServiceOrder },
								DocumentNo = new[] { serviceOrderTimePosting.ServiceOrderHead.OrderNo },
								Type = new[]
								{
								ResolveArticleTypeForBc(serviceOrderTimePosting.Article.ArticleTypeKey)
									.ToString()
								}, //resource
								LineNo = new[] { 0 }, // todo jw: lineno should be generated on mobile client so that it is the same on servicereport and BC
								LineNoCode = new[] { "0" },
								ServiceItemLineNo = new[] { Int32.Parse(serviceOrderTimePosting.ServiceOrderTime?.PosNo ?? "0") },
								No = new[] { serviceOrderTimePosting.User.PersonnelId },
								Quantity = new[] { ResolveServiceQuantity(serviceOrderTimePosting) },
								Calculate = new[] { CalculateForTimeWithoutKilometer },
								//LocationCode = new[] { "" },
								StrPostingDate = new[] { serviceOrderTimePosting.Date.ToString("yyyy-MM-dd") },
								WorkTypeCode = new[] { serviceOrderTimePosting.Article.ItemNo },
								EKStatus = new[] { "1" },
								LocationCode = new[] { appSettingsProvider.GetValue(KagemaPlugin.Settings.LocationCode) },
								ShortcutDimensionCode = new[] { appSettingsProvider.GetValue(KagemaPlugin.Settings.ShortcutDimensionCode) },
								VATProdPostingGroup = new[] { "13B" },
								GenBusPostingGroup = new[] { "13B" }

							});
					}
					else
					{
						serviceLines.Add(
				new ServiceLine
				{
					CustomerNo = new[] { serviceOrderTimePosting.ServiceOrderHead.CustomerContact.LegacyId },
					//UnitofMeasureCode = new[] { serviceOrderTimePosting.Article.QuantityUnit.Value },
					DocumentType = new[] { BcHelper.BcDocumentType.ServiceOrder },
					DocumentNo = new[] { serviceOrderTimePosting.ServiceOrderHead.OrderNo },
					Type = new[]
					{
								ResolveArticleTypeForBc(serviceOrderTimePosting.Article.ArticleTypeKey)
									.ToString()
					}, //resource
					LineNo = new[] { 0 }, // todo jw: lineno should be generated on mobile client so that it is the same on servicereport and BC
					LineNoCode = new[] { "0" },
					ServiceItemLineNo = new[] { Int32.Parse(serviceOrderTimePosting.ServiceOrderTime?.PosNo ?? "0") },
					No = new[] { serviceOrderTimePosting.User?.PersonnelId },
					Quantity = new[] { ResolveServiceQuantity(serviceOrderTimePosting) },
					Calculate = new[] { CalculateForTimeWithoutKilometer },
					//LocationCode = new[] { "" },
					StrPostingDate = new[] { serviceOrderTimePosting.Date.ToString("yyyy-MM-dd") },
					WorkTypeCode = new[] { serviceOrderTimePosting.Article.ItemNo },
					EKStatus = new[] { "1" },
					LocationCode = new[] { appSettingsProvider.GetValue(KagemaPlugin.Settings.LocationCode) },
					ShortcutDimensionCode = new[] { appSettingsProvider.GetValue(KagemaPlugin.Settings.ShortcutDimensionCode) },

				});
					}
				}



				transaction.ServiceLine = mapper.Map<ServiceLine[]>(serviceLines);
			}
			catch (Exception exception)
			{
				throw new Exception("Servicelines failed to post to BC365", exception);
			}

			return transaction;
		}




		private decimal ResolveServiceQuantity(ServiceOrderTimePosting timePosting)
		{
			if (timePosting.DurationInMinutes == null)
			{
				return 0;
			}

			//if (timePosting.Article.QuantityUnitKey.ToUpper() == "STD")
			//{
			return Convert.ToDecimal(timePosting.DurationInMinutes) / 60;
			//}

			//throw new NotSupportedException(
			//	$"Trying to export a serviceordertimeposting with QTY Unit " +
			//	$"{timePosting.Article.QuantityUnitKey} which is not allowed. Only QTY Unit 'STD' is supported. " +
			//	$"Please change QTY Unit of {timePosting.Article.ItemNo}.");
		}
		private int ResolveArticleTypeForBc(string articleTypeKey)
		{
			var bcItemType = 0;
			switch (articleTypeKey)
			{
				case "Material":
					bcItemType = BcItemType.Inventory;
					break;
				case "Service":
					bcItemType = BcItemType.Service;
					break;
				case "Cost":
					bcItemType = BcItemType.NonInventory;
					break;
			}

			return bcItemType;
		}


		private ExtensionUpdateXML CreatePlannedExtensionXml(ServiceOrderHead serviceOrder)
		{
			var xml = new ExtensionUpdateXML();
			IList<extension> serviceExtensions = new List<extension>();
			var firstDispatch = serviceOrder.Dispatches.Where(x => x.OrderId == serviceOrder.Id)
					 .OrderBy(d => d.Time)
					 .FirstOrDefault();
			serviceExtensions.Add(new extension { tablename = new[] { "Service Header" }, tablekey = new[] { "1," + serviceOrder.OrderNo }, columnname = new[] { "Status" }, value = new[] { "1" } });
			serviceExtensions.Add(new extension { tablename = new[] { "Service Header" }, tablekey = new[] { "1," + serviceOrder.OrderNo }, columnname = new[] { "KGM_Monteur" }, value = firstDispatch != null ? new[] { firstDispatch.DispatchedUsername } : new[] { "" } });
			serviceExtensions.Add(new extension
			{
				tablename = new[] { "Service Header" },
				tablekey = new[] { "1," + serviceOrder.OrderNo },
				columnname = new[] { "Document Date" },
				value = firstDispatch != null ? new[]
			{
									firstDispatch?.Date.ToLocalTime()
										.ToString("yyyy-MM-dd")
								} : new[] { "" }
			});

			if (serviceOrder.ServiceOrderTimes != null && serviceOrder.ServiceOrderTimes.Any())
			{
				foreach (var serviceOrderTime in serviceOrder.ServiceOrderTimes)
				{
					var installation = serviceOrderTime.Installation;

					if (installation != null)
					{
						serviceExtensions.Add(
							 new extension
							 {
								 tablename = new[] { "Service Item Line" },
								 tablekey = new[] { "1," + serviceOrder.OrderNo + "," + serviceOrderTime.PosNo },
								 columnname = new[] { "Ship-to Code" },
								 //value = new[] { serviceOrder.ServiceOrderTimes?.FirstOrDefault()?.Installation?.GetExtension<InstallationHeadExtensions>()?.ShipToCode == null ? "" : serviceOrder.ServiceOrderTimes?.FirstOrDefault()?.Installation?.GetExtension<InstallationHeadExtensions>()?.ShipToCode }
								 value = new[] { serviceOrderTime.Installation?.GetExtension<InstallationHeadExtensions>()?.ShipToCode == null ? "" : serviceOrderTime.Installation?.GetExtension<InstallationHeadExtensions>()?.ShipToCode }

							 });
						/*serviceExtensions.Add(
							new extension
							{
								tablename = new[] { "Service Item Line" },
								tablekey = new[] { "1," + serviceOrder.OrderNo + "," + serviceOrderTime.PosNo },
								columnname = new[] { "Starting Date" },
								value = new[]
								{
									firstDispatch?.Date.ToLocalTime()
										.ToString("yyyy-MM-dd")
								}
							});


						serviceExtensions.Add(
							new extension
							{
								tablename = new[] { "Service Item Line" },
								tablekey = new[] { "1," + serviceOrder.OrderNo + "," + serviceOrderTime.PosNo },
								columnname = new[] { "Starting Time" },
								value = new[]
								{
									firstDispatch?.Time.ToLocalTime()
										.ToString("HH:mm:ss")
								}
							});	 */
					}
				}
			}

			xml.extension = mapper.Map<extension[]>(serviceExtensions);

			return xml;
		}

		private ExtensionUpdateXML CreateUnPlannedExtensionXml(ServiceOrderHead serviceOrder)
		{
			var xml = new ExtensionUpdateXML();
			IList<extension> serviceExtensions = new List<extension>();

			serviceExtensions.Add(new extension { tablename = new[] { "Service Header" }, tablekey = new[] { "1," + serviceOrder.OrderNo }, columnname = new[] { "Status" }, value = new[] { "1" } });

			xml.extension = mapper.Map<extension[]>(serviceExtensions);

			return xml;
		}

		private ServiceItemLineXML CreateServiceItemLineXml(ServiceOrderHead serviceOrderHead)
		{
			ServiceItemLineXML xml = new ServiceItemLineXML();
			IList<ServiceItemLine> serviceItemLines = new List<ServiceItemLine>();

			foreach (var serviceOrderTime in serviceOrderHead.ServiceOrderTimes)
			{
				serviceItemLines.Add(
					new ServiceItemLine
					{
						DocumentType = new[] { BcHelper.BcDocumentType.ServiceOrder },
						DocumentNo = new[] { serviceOrderTime.ServiceOrderHead.OrderNo },
						LineNo = new[] { Int32.Parse(serviceOrderTime.PosNo) },
						ServiceItemNo = new[] { serviceOrderTime.Installation?.LegacyId ?? "" },

						//ShiptoCode = new [] { serviceOrderTime.Installation?.GetExtension<InstallationHeadExtensions>().ShipToCode ?? "" },
						//ItemNo = new[] { serviceOrderTime.Installation?.InstallationNo ?? "" },
					});
			}

			xml.ServiceItemLine = mapper.Map<ServiceItemLine[]>(serviceItemLines);

			return xml;
		}
	}

	internal class BcItemType
	{
		/// <summary>
		/// L-mobile type Crm.Article ArticleType 'Material'
		/// </summary>
		public static int Inventory = 1;
		/// <summary>
		/// L-mobile type Crm.Article ArticleType 'Service'
		/// </summary>
		public static int Service = 2;
		/// <summary>
		/// L-mobile type Crm.Article ArticleType 'Cost'
		/// </summary>
		public static int NonInventory = 3;
	}
}
