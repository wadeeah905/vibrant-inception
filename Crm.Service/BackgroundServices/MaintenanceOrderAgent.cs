namespace Crm.Service.BackgroundServices
{
	using System;
	using System.Linq;

	using Crm.Library.BackgroundServices;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Data.NHibernateProvider;
	using Crm.Library.Helper;
	using Crm.Service.Model;
	using Crm.Service.Model.Extensions;
	using Crm.Service.Model.Lookup;
	using Crm.Service.SearchCriteria;
	using Crm.Service.Services.Interfaces;

	using log4net;

	using Microsoft.Extensions.Hosting;

	using NHibernate.Linq;

	using Quartz;

	[DisallowConcurrentExecution]
	public class MaintenanceOrderAgent : ManualSessionHandlingJobBase
	{
		private readonly IMaintenancePlanService maintenancePlanService;
		private readonly IServiceOrderService serviceOrderService;
		private readonly ILog logger;
		private readonly IRepositoryWithTypedId<MaintenancePlan, Guid> maintenancePlanRepository;
		private readonly IAppSettingsProvider appSettingsProvider;

		// Methods
		protected override void Run(IJobExecutionContext context)
		{
			var timespan = TimeSpan.FromDays(appSettingsProvider.GetValue(ServicePlugin.Settings.ServiceContract.CreateMaintenanceOrderTimeSpanDays));

			var criteria = new MaintenancePlanSearchCriteria
			{
				ToNextDate = DateTime.Today + timespan
			};

			var maintenancePlans = maintenancePlanRepository
															.GetAll()
															.Where(x => x.GenerateMaintenanceOrders)
															.Where(x => x.ServiceContract != null && x.ServiceContract.StatusKey == ServiceContractStatus.ActiveKey)
															.Filter(criteria)
															.Fetch(x => x.ServiceContract);

			var counter = 0;
			var batch = maintenancePlans.Skip(counter).Take(50);
			while (batch.Any())
			{
				if (receivedShutdownSignal)
				{
					break;
				}
				foreach (var maintenancePlan in batch)
				{
					if (receivedShutdownSignal)
					{
						break;
					}
					try
					{
						BeginTransaction();

						var orders = maintenancePlanService.EvaluateMaintenancePlanAndGenerateOrders(maintenancePlan, DateTime.Today + timespan);
						if (orders.Any())
						{
							foreach (var order in orders)
							{
								serviceOrderService.Save(order);
							}
						}

						EndTransaction();
					}
					catch (Exception ex)
					{
						logger.Error(String.Format("An error occured generating MaintenanceOrders for MaintenancePlan  {0}", maintenancePlan.Id), ex);
						RollbackTransaction();
					}
				}

				counter += 50;
				batch = maintenancePlans.Skip(counter).Take(50);
			}
		}

		public MaintenanceOrderAgent(IMaintenancePlanService maintenancePlanService, IRepositoryWithTypedId<MaintenancePlan, Guid> maintenancePlanRepository, IServiceOrderService serviceOrderService, ISessionProvider sessionProvider, ILog logger, IAppSettingsProvider appSettingsProvider, IHostApplicationLifetime hostApplicationLifetime)
			: base(sessionProvider, logger, hostApplicationLifetime)
		{
			this.maintenancePlanService = maintenancePlanService;
			this.maintenancePlanRepository = maintenancePlanRepository;
			this.serviceOrderService = serviceOrderService;
			this.logger = logger;
			this.appSettingsProvider = appSettingsProvider;
		}
	}
}