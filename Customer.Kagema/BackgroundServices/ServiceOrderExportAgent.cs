using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Customer.Kagema.BackgroundServices
{
	using System;
	using System.Diagnostics;
	using System.Linq;

	using Crm.Library.BackgroundServices;
	using Crm.Library.Data.NHibernateProvider;
	using Crm.Library.Helper;
	using Customer.Kagema.Services.Interfaces;

	using log4net;
	using Microsoft.Extensions.Hosting;
	using Quartz;

	[DisallowConcurrentExecution]
	public class ServiceOrderExportAgent : ManualSessionHandlingJobBase
	{
		public const string JobGroup = "Customer.Kagema";
		public const string JobName = "ServiceOrderExportAgent";
		private readonly INavisionExportService navisionExportService;
		private readonly IAppSettingsProvider appSettingsProvider;

		public ServiceOrderExportAgent(ISessionProvider sessionProvider, ILog logger, INavisionExportService navisionExportService, IHostApplicationLifetime hostApplicationLifetime, IAppSettingsProvider appSettingProvider)
	: base(sessionProvider, logger, hostApplicationLifetime)
		{
			this.navisionExportService = navisionExportService;
			this.appSettingsProvider = appSettingProvider;
		}

		protected override void Run(IJobExecutionContext context)
		{

		
			//////////////////////////////////////New service orders///////////////////////////////
			var batchCount = 0;
			var batchSize = 25;
			var stopwatch = new Stopwatch();
			var elementStopwatch = new Stopwatch();

			var newServiceOrders = navisionExportService.GetNewServiceOrders(batchCount, batchSize);
			Logger.InfoFormat($"number of newServiceOrders is  {0} and batchcount= : {1}  and batchsize : {2} ", newServiceOrders.ToList().Count(), batchCount, batchSize);
			while (newServiceOrders.ToList().Count() > 0)
			{
				foreach (var serviceOrder in newServiceOrders)
				{
					if (receivedShutdownSignal)
					{
						return;
					}
					Logger.InfoFormat($"Exporting service order no {0} (id:{1})", serviceOrder.OrderNo, serviceOrder.Id);
					elementStopwatch.Restart();
					try
					{
						BeginTransaction();
						navisionExportService.ExportNewServiceOrder(serviceOrder);
						EndTransaction();
					}
					catch
					{
						RollbackTransaction();
					}
				}
				batchCount++;
				newServiceOrders = navisionExportService.GetNewServiceOrders(batchCount, batchSize);
			}
			Logger.InfoFormat($"export of {0} new serviceOrders in {1}ms.", newServiceOrders.ToList().Count(), stopwatch.ElapsedMilliseconds);



			//////////////////////////////////////////Planned service orders///////////////////////////////
			batchCount = 0;
			batchSize = 25;
			var plannedServiceOrders = navisionExportService.GetPlannedServiceOrders(batchCount, batchSize);
			Logger.InfoFormat($"number of planned ServiceOrders is  {0} and batchcount= : {1}  and batchsize : {2} ", plannedServiceOrders.ToList().Count(), batchCount, batchSize);
			while (plannedServiceOrders.ToList().Count() > 0)
			{
				foreach (var serviceOrder in plannedServiceOrders)
				{
					if (receivedShutdownSignal)
					{
						return;
					}
					Logger.InfoFormat($"Exporting service order no {0} (id:{1})", serviceOrder.OrderNo, serviceOrder.Id);
					elementStopwatch.Restart();
					try
					{
						BeginTransaction();
						navisionExportService.ExportPlannedServiceOrder(serviceOrder);
						EndTransaction();
					}
					catch
					{
						RollbackTransaction();
					}
				}
				batchCount++;
				plannedServiceOrders = navisionExportService.GetPlannedServiceOrders(batchCount, batchSize);
			}
			Logger.InfoFormat($"export of {0} planned serviceOrders in {1}ms.", plannedServiceOrders.ToList().Count(), stopwatch.ElapsedMilliseconds);


			//////////////////////////////////////Complete service orders///////////////////////////////

			batchCount = 0;
			batchSize = 25;
			var serviceOrders = navisionExportService.GetUnExportedServiceOrders(batchCount, batchSize);
			Logger.InfoFormat($"number of complete serviceOrders is  {0} and batchcount= : {1}  and batchsize : {2} ", serviceOrders.ToList().Count(), batchCount, batchSize);
			while (serviceOrders.ToList().Count() > 0)
			{
				foreach (var serviceOrder in serviceOrders)
				{
					if (receivedShutdownSignal)
					{
						return;
					}

					Logger.InfoFormat($"Exporting service order no {0} (id:{1})", serviceOrder.OrderNo, serviceOrder.Id);
					elementStopwatch.Restart();
					try
					{
						BeginTransaction();
						navisionExportService.ExportCompletedServiceOrder(serviceOrder);
						EndTransaction();
					}
					catch
					{
						RollbackTransaction();
					}
				}

				batchCount++;
				serviceOrders = navisionExportService.GetUnExportedServiceOrders(batchCount, batchSize);
			}
			Logger.InfoFormat($"Completed export of {0} serviceOrders in {1}ms.", serviceOrders.ToList().Count(), stopwatch.ElapsedMilliseconds);


				//////////////////////////////////////update statuses///////////////////////////////
			 batchCount = 0;
			 batchSize = 25;


		

			var updatedStatusInServiceOrders = navisionExportService.GetUnExportedLmobileStatusServiceOrders(batchCount, batchSize);
			stopwatch.Start();
			Logger.InfoFormat($"number of updatedStatusInServiceOrders is  {0} and batchcount= : {1}  and batchsize : {2} ", updatedStatusInServiceOrders.ToList().Count(), batchCount, batchSize);
			while (updatedStatusInServiceOrders.ToList().Count() > 0)
			{
				foreach (var serviceOrder in updatedStatusInServiceOrders)
				{
					if (receivedShutdownSignal)
					{
						return;
					}

					Logger.InfoFormat($"Updating  lmstatus of service order with order no {0} (id:{1})", serviceOrder.OrderNo, serviceOrder.Id);
					elementStopwatch.Restart();
					try
					{
						BeginTransaction();
						navisionExportService.UpdateStatusServiceOrder(serviceOrder);
						EndTransaction();
					}
					catch
					{
						RollbackTransaction();
					}
				}

				batchCount++;
				updatedStatusInServiceOrders = navisionExportService.GetUnExportedLmobileStatusServiceOrders(batchCount, batchSize);
			}
			Logger.InfoFormat($"Completed status export of serviceOrders in {0}ms.", stopwatch.ElapsedMilliseconds);


			if (appSettingsProvider.GetValue(KagemaPlugin.Settings.EnableStatusUpdateInBc) == false)
			{
				return;
			}

		}
	}
}
