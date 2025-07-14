using System;

namespace Customer.Kagema.BackgroundServices
{
	using System.Collections.Generic;
	using System.Diagnostics;
	using System.Linq;
	using System.Threading;

	using Crm.Library.BackgroundServices;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Data.NHibernateProvider;
	using Crm.Library.Extensions;
	using Crm.Library.Helper;
	using Crm.Service;
	using Crm.Service.Enums;
	using Crm.Service.Model;

	using Customer.Kagema.Model.Extensions;

	using LMobile.Unicore.NHibernate;

	using log4net;

	using Microsoft.Extensions.Hosting;

	using Quartz;

	using Sms.Checklists.Model;

	[DisallowConcurrentExecution]
	public class ChecklistAttacherForImportedOrder : ManualSessionHandlingJobBase
	{

		private readonly IRepositoryWithTypedId<Installation, Guid> installationRepository;
		private readonly IRepositoryWithTypedId<ServiceOrderHead, Guid> serviceOrderHeadRepository;
		private readonly IRepositoryWithTypedId<ServiceOrderChecklist, Guid> serviceOrderChecklistRepository;
		private readonly IRepositoryWithTypedId<ChecklistInstallationTypeRelationship, Guid> checklistInstallationTypeRelationshipRepository;
		private readonly Func<ServiceOrderChecklist> serviceOrderChecklistFactory;
		private readonly IAppSettingsProvider appSettingsProvider;
		private readonly Mutex mutex;

		private static readonly object Lock = new object();
		public ChecklistAttacherForImportedOrder(ISessionProvider sessionProvider, ILog logger,
		IHostApplicationLifetime hostApplicationLifetime, IRepositoryWithTypedId<Installation, Guid> installationRepository,
			IRepositoryWithTypedId<ServiceOrderHead, Guid> serviceOrderHeadRepository,
			IRepositoryWithTypedId<ServiceOrderChecklist, Guid> serviceOrderChecklistRepository,
			IRepositoryWithTypedId<ChecklistInstallationTypeRelationship, Guid> checklistInstallationTypeRelationshipRepository,
			Func<ServiceOrderChecklist> serviceOrderChecklistFactory,
			IAppSettingsProvider appSettingsProvider) : base(sessionProvider, logger, hostApplicationLifetime)
		{
			this.installationRepository = installationRepository;
			this.serviceOrderHeadRepository = serviceOrderHeadRepository;
			this.serviceOrderChecklistRepository = serviceOrderChecklistRepository;
			this.checklistInstallationTypeRelationshipRepository = checklistInstallationTypeRelationshipRepository;
			this.serviceOrderChecklistFactory = serviceOrderChecklistFactory;
			this.appSettingsProvider = appSettingsProvider;
			string name = "Checklist Attach Mutex " + appSettingsProvider.GetValue(KagemaPlugin.Settings.EnvironmentSettings.EnvironmentName);
			mutex = new Mutex(false, name);
		}


		public IQueryable<ServiceOrderHead> GetNewImportedOrder(int batchCount, int batchSize)
		{
			return serviceOrderHeadRepository.GetAll()
				.Where(
					x => x.ModelExtension<ServiceOrderHeadExtensions, bool>(s => s.AttachChecklist))
				.OrderBy(x => x.CreateDate)
				.Skip(batchCount * batchSize)
				.Take(batchSize);
		}

		protected virtual void RemoveChecklistsFromServiceOrderTime(ServiceOrderTime serviceOrderTime)
		{
			var checklists = serviceOrderChecklistRepository.GetAll().Where(x => x.ServiceOrderTimeKey == serviceOrderTime.Id);
			foreach (var checklist in checklists)
			{
				serviceOrderChecklistRepository.Delete(checklist);
			}
		}
		protected virtual void AttachChecklistsToServiceOrderTime(ServiceOrderTime serviceOrderTime, Guid installationId)
		{
			var installation = installationRepository.Get(installationId);
			if (installation == null)
				return;
			var serviceOrderHead = serviceOrderHeadRepository.Get(serviceOrderTime.OrderId);
			var checklistRelationships = GetChecklistsToAttach(installation.InstallationTypeKey, serviceOrderHead.TypeKey);
			foreach (ChecklistInstallationTypeRelationship checklistRelationship in checklistRelationships)
			{
				var serviceOrderChecklist = serviceOrderChecklistFactory();
				serviceOrderChecklist.RequiredForServiceOrderCompletion = checklistRelationship.RequiredForServiceOrderCompletion;
				serviceOrderChecklist.SendToCustomer = checklistRelationship.SendToCustomer;
				serviceOrderChecklist.ServiceOrder = serviceOrderHead;
				serviceOrderChecklist.ServiceOrderTimeKey = serviceOrderTime.Id;
				serviceOrderChecklist.ServiceOrderTime = serviceOrderTime;
				serviceOrderChecklist.DynamicFormKey = checklistRelationship.DynamicFormKey;
				serviceOrderChecklist.DynamicForm = checklistRelationship.DynamicForm;
				serviceOrderChecklist.ReferenceKey = serviceOrderHead.Id;
				serviceOrderChecklist.CreateUser = "KagemaChecklistAttacherAgent";
				serviceOrderChecklistRepository.SaveOrUpdate(serviceOrderChecklist);
			}
		}
		protected virtual void AttachChecklistsToOrder(ServiceOrderHead serviceOrderHead)
		{


			foreach (var time in serviceOrderHead.ServiceOrderTimes)
			{
				if (time.InstallationId.HasValue)
				{

					RemoveChecklistsFromServiceOrderTime(time);
					AttachChecklistsToServiceOrderTime(time, time.InstallationId.Value);
				}
			}
		}
		protected virtual List<ChecklistInstallationTypeRelationship> GetChecklistsToAttach(string installationType, string serviceOrderType)
		{
			var relationships = checklistInstallationTypeRelationshipRepository.GetAll().Where(x => x.InstallationTypeKey == installationType && x.ServiceOrderTypeKey == serviceOrderType).ToList();
			return relationships;
		}


		protected override void Run(IJobExecutionContext context)
		{
			var batchCount = 0;
			var batchSize = 25;


			var stopwatch = new Stopwatch();
			var elementStopwatch = new Stopwatch();
			stopwatch.Start();
			if (receivedShutdownSignal)
			{
				return;
			}
			mutex.WaitOne();
			try
			{
				lock (Lock)
				{
					var importedOrders = GetNewImportedOrder(batchCount, batchSize);
					Logger.InfoFormat("About the attachment of {0} for imported salesOrders", importedOrders.Count());

					while (importedOrders.ToList().Any())
					{
						foreach (var serviceOrder in importedOrders)
						{

							Logger.InfoFormat("Attach checklist for service order no {0} (id:{1})", serviceOrder.OrderNo, serviceOrder.Id);
							elementStopwatch.Restart();
							try
							{
								BeginTransaction();
								AttachChecklistsToOrder(serviceOrder);
								SetChecklistAttached(serviceOrder);

								EndTransaction();

							}
							catch (Exception ex)
							{
								RollbackTransaction();
							}

						}
						batchCount++;
						importedOrders = GetNewImportedOrder(batchCount, batchSize);

					}

					Logger.InfoFormat("Completed attach of checklist for {0} imported service orders in {1}ms.", importedOrders.Count(), stopwatch.ElapsedMilliseconds);
				}
			}
			catch (Exception exception)
			{
				Logger.Error("Error in kagema attach checklist", exception);
			}
			finally
			{
				mutex.ReleaseMutex();
			}
		}

		private void SetChecklistAttached(ServiceOrderHead serviceOrder)
		{
			Logger.InfoFormat("Setting AttachChecklist flag to false (service order {0})", serviceOrder.OrderNo);

			serviceOrder.GetExtension<ServiceOrderHeadExtensions>().AttachChecklist = false;
			serviceOrder.ModifyUser = "ChecklistAttacherAgent";
			serviceOrderHeadRepository.SaveOrUpdate(serviceOrder);
			serviceOrderHeadRepository.Session.Flush();
		}

	}
}
