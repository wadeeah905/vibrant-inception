namespace Crm.Service.Services
{
	using System;
	using System.Collections.Generic;
	using System.Linq;
	using Crm.Article.Services.Interfaces;
	using Crm.Extensions;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Globalization.Lookup;
	using Crm.Library.Globalization.Resource;
	using Crm.Library.Helper;
	using Crm.Model;
	using Crm.Service.Enums;
	using Crm.Service.Extensions;
	using Crm.Service.Model;
	using Crm.Service.Model.Extensions;
	using Crm.Service.Model.Lookup;
	using Crm.Service.Services.Interfaces;

	using LMobile.Unicore.NHibernate;

	using log4net;

	public class MaintenancePlanService : IMaintenancePlanService
	{
		private readonly IRepositoryWithTypedId<MaintenancePlan, Guid> maintenancePlanRepository;
		private readonly ILookupManager lookupManager;
		private readonly IAppSettingsProvider appSettingsProvider;
		private readonly IServiceOrderService serviceOrderService;
		private readonly IArticleService articleService;
		private readonly IResourceManager resourceManager;
		private readonly Func<ServiceOrderTime> serviceOrderTimeFactory;
		private readonly Func<ServiceOrderHead> serviceOrderHeadFactory;
		private readonly IEnumerable<IServiceOrderTemplateService> serviceOrderTemplateServices;
		private readonly ILog logger;

		public virtual ICollection<ServiceOrderHead> EvaluateMaintenancePlanAndGenerateOrders(MaintenancePlan maintenancePlan, DateTime toDate)
		{
			var results = new List<ServiceOrderHead>();

			// Ignore missing Contracts and invalid contracts for the date of generation
			if (maintenancePlan.ServiceContract == null || !maintenancePlan.ServiceContract.IsValidOnDate(toDate))
			{
				return results;
			}

			if (!maintenancePlan.ServiceContract.IsActive)
			{
				return results;
			}

			// Plan does not generate orders, e.g. it was muted
			if (!maintenancePlan.GenerateMaintenanceOrders && !maintenancePlan.AllowPrematureMaintenance)
			{
				return results;
			}

			// Plan is not due for generation
			if (maintenancePlan.NextDate.GetValueOrDefault().Date > toDate.Date || maintenancePlan.FirstDate.GetValueOrDefault().Date > toDate.Date)
			{
				return results;
			}

			if (maintenancePlan.NextDate == null)
			{
				maintenancePlan.NextDate = CalculateNextMaintenanceDate(maintenancePlan);
			}

			var relatedOrders = maintenancePlan.ServiceOrders;
			// If there are open orders or not all closed we will skip generation
			if (relatedOrders != null && relatedOrders.Any() && (RelatedOrdersPending(maintenancePlan, relatedOrders) || !RelatedOrdersCompleted(maintenancePlan, relatedOrders)))
			{
				if (maintenancePlan.NextDate < DateTime.Today)
				{
					maintenancePlan.NextDate = CalculateNextMaintenanceDate(maintenancePlan);
					maintenancePlanRepository.SaveOrUpdate(maintenancePlan);
				}

				return results;
			}

			// Only if all checks are previously executed we now may generate a new set of orders
			var maintenanceOrderGenerationMode = appSettingsProvider.GetValue(ServicePlugin.Settings.ServiceContract.MaintenanceOrderGenerationMode); 
			if (!maintenancePlan.ServiceContract.Installations.Any())
			{
				var result = CreateUpcomingMaintenanceOrderNoInstallation(maintenancePlan);
				if(result != null)
				{
					results.Add(result);
				}
			}
			else if (maintenanceOrderGenerationMode == MaintenanceOrderGenerationMode.OrderPerInstallation)
			{
				results.AddRange(CreateUpcomingMaintenanceOrderPerInstallation(maintenancePlan));
			}
			else if (maintenanceOrderGenerationMode == MaintenanceOrderGenerationMode.JobPerInstallation)
			{
				var result = CreateUpcomingMaintenanceOrderJobPerInstallation(maintenancePlan);
				if (result != null)
				{
					results.Add(result);
				}
			}

			maintenancePlan.NextDate = CalculateNextMaintenanceDate(maintenancePlan);
			maintenancePlanRepository.SaveOrUpdate(maintenancePlan);

			return results;
		}

		public virtual IEnumerable<string> GetClosedStatusKeys()
		{
			var closedStatusLookups = lookupManager.List<ServiceOrderStatus>().Where(s => s.BelongsToPostProcessing() || s.BelongsToClosed());
			var closedStatusKeys = closedStatusLookups.Select(x => x.Key);
			return closedStatusKeys;
		}
		public virtual IEnumerable<string> GetPendingStatusKeys()
		{
			var openStatusLookups = lookupManager.List<ServiceOrderStatus>().Where(s => s.BelongsToPreparation() || s.BelongsToScheduling() || s.BelongsToInProgress());
			var openStatusKeys = openStatusLookups.Select(x => x.Key);
			return openStatusKeys;
		}
		protected virtual bool RelatedOrdersCompleted(MaintenancePlan maintenancePlan, ICollection<ServiceOrderHead> relatedOrders)
		{
			var closedStatusKeys = GetClosedStatusKeys();
			var closedOrders = relatedOrders.Where(x => closedStatusKeys.Contains(x.StatusKey)).ToArray();

			return closedOrders.All(x => closedStatusKeys.Contains(x.StatusKey));
		}
		protected virtual bool RelatedOrdersPending(MaintenancePlan maintenancePlan, ICollection<ServiceOrderHead> relatedOrders)
		{
			var openStatusKeys = GetPendingStatusKeys();
			var openOrders = relatedOrders.Where(x => openStatusKeys.Contains(x.StatusKey)).ToArray();

			return openOrders.Any(x => openStatusKeys.Contains(x.StatusKey));
		}
		public virtual DateTime? CalculateNextMaintenanceDate(MaintenancePlan maintenancePlan)
		{
			if (!maintenancePlan.FirstDate.HasValue || !maintenancePlan.RhythmValue.HasValue || string.IsNullOrWhiteSpace(maintenancePlan.RhythmUnitKey))
			{
				// Unable to calculate next maintenanceDate
				return null;
			}

			// Calculate from first day
			DateTime? nextDate;
			if (maintenancePlan.NextDate == null || maintenancePlan.NextDate < maintenancePlan.FirstDate)
			{
				nextDate = maintenancePlan.FirstDate;
				while (nextDate.Value.Date < DateTime.Today.Date)
				{
					nextDate = nextDate.Value.Date.AddTimeSpan(maintenancePlan.RhythmValue.Value, maintenancePlan.RhythmUnitKey);
				}
			}
			else
			{
				nextDate = maintenancePlan.NextDate;
				while (nextDate.Value.Date <= maintenancePlan.NextDate.Value.Date)
				{
					nextDate = nextDate.Value.Date.AddTimeSpan(maintenancePlan.RhythmValue.Value, maintenancePlan.RhythmUnitKey);
				}
			}

			return nextDate.Value.Date;
		}

		protected virtual ServiceOrderHead CreateUpcomingMaintenanceOrderNoInstallation(MaintenancePlan maintenancePlan)
		{
			var maintenanceOrder = CreateNewMaintenanceOrder(maintenancePlan, Guid.NewGuid());
			if (maintenanceOrder == null)
			{
				return null;
			}
			// Either to related ServiceObject or Customer that contract was signed for
			AssignContactLocation(maintenancePlan.ServiceContract.ServiceObject ?? maintenancePlan.ServiceContract.Parent, maintenanceOrder);

			if (maintenancePlan.ServiceOrderTemplate != null)
			{
				foreach (var serviceOrderTemplateService in serviceOrderTemplateServices)
				{
					serviceOrderTemplateService.CreateTemplateData(maintenanceOrder, maintenancePlan.ServiceOrderTemplate, null);
				}
			}

			return maintenanceOrder;
		}
		protected virtual void AssignContactLocation(Contact serviceLocationContact, ServiceOrderHead maintenanceOrder)
		{
			if (serviceLocationContact != null && serviceLocationContact.StandardAddress != null)
			{
				maintenanceOrder.Name1 = serviceLocationContact.StandardAddress.Name1;
				maintenanceOrder.Name2 = serviceLocationContact.StandardAddress.Name2;
				maintenanceOrder.Name3 = serviceLocationContact.StandardAddress.Name3;
				maintenanceOrder.Street = serviceLocationContact.StandardAddress.Street;
				maintenanceOrder.ZipCode = serviceLocationContact.StandardAddress.ZipCode;
				maintenanceOrder.City = serviceLocationContact.StandardAddress.City;
			}
		}
		protected virtual IEnumerable<ServiceOrderHead> CreateUpcomingMaintenanceOrderPerInstallation(MaintenancePlan maintenancePlan)
		{
			var results = new List<ServiceOrderHead>();
			var maintenancePlanningRun = Guid.NewGuid();
			foreach (var installation in maintenancePlan.ServiceContract.Installations.Select(x => x.Child))
			{
				var maintenanceOrder = CreateNewMaintenanceOrder(maintenancePlan, maintenancePlanningRun);
				if(maintenanceOrder != null)
				{
					maintenanceOrder.AffectedInstallation = installation;
					maintenanceOrder.InstallationId = installation.Id;
					// Either to related ServiceObject or Installation standard address
					AssignContactLocation((Contact)maintenancePlan.ServiceContract.ServiceObject ?? installation, maintenanceOrder);

					if (maintenancePlan.ServiceOrderTemplate != null)
					{
						foreach (var serviceOrderTemplateService in serviceOrderTemplateServices)
						{
							serviceOrderTemplateService.CreateTemplateData(maintenanceOrder, maintenancePlan.ServiceOrderTemplate, null);
						}
					}

					results.Add(maintenanceOrder);
				}
			}

			return results;
		}
		protected virtual ServiceOrderHead CreateUpcomingMaintenanceOrderJobPerInstallation(MaintenancePlan maintenancePlan)
		{
			var maintenanceOrder = CreateNewMaintenanceOrder(maintenancePlan, Guid.NewGuid());
			if (maintenanceOrder == null)
			{
				return null;
			}

			var position = 100;
			foreach (var relationship in maintenancePlan.ServiceContract.Installations)
			{
				if (maintenancePlan.ServiceOrderTemplate != null)
				{
					foreach (var serviceOrderTemplateService in serviceOrderTemplateServices)
					{
						serviceOrderTemplateService.CreateTemplateData(maintenanceOrder, maintenancePlan.ServiceOrderTemplate, relationship.Child, relationship);
					}
				}
				else if (maintenancePlan.ServiceOrderTemplate == null || !maintenancePlan.ServiceOrderTemplate.ServiceOrderTimes.Any())
				{
					var serviceOrderTimeItem = CreateNewMaintenanceOrderJob(maintenanceOrder, position, relationship.Child);
					serviceOrderTimeItem.EstimatedDuration = (float?)relationship.TimeAllocation?.TotalHours;
					maintenanceOrder.ServiceOrderTimes.Add(serviceOrderTimeItem);
					position += 100;
				}
			}

			if (maintenancePlan.ServiceOrderTemplate != null)
			{
				foreach (var serviceOrderTemplateService in serviceOrderTemplateServices)
				{
					serviceOrderTemplateService.CreateTemplateData(maintenanceOrder, maintenancePlan.ServiceOrderTemplate, null);
				}
			}

			// Either to related ServiceObject or Company the contract is related to
			AssignContactLocation(maintenancePlan.ServiceContract.ServiceObject ?? maintenancePlan.ServiceContract.Parent, maintenanceOrder);
			return maintenanceOrder;
		}
		protected virtual ServiceOrderTime CreateNewMaintenanceOrderJob(ServiceOrderHead maintenanceOrder, int position, Installation installation)
		{
			var article = articleService.GetArticles().FirstOrDefault(x => x.ModelExtension<ArticleExtension, bool>(e => e.CanBeAddedAfterCustomerSignature));
			var serviceOrderTimeItem = serviceOrderTimeFactory();
			serviceOrderTimeItem.Id = Guid.NewGuid();
			serviceOrderTimeItem.ArticleId = article?.Id;
			serviceOrderTimeItem.OrderId = maintenanceOrder.Id;
			serviceOrderTimeItem.PosNo = position.ToString("D");
			serviceOrderTimeItem.Installation = installation;
			serviceOrderTimeItem.InstallationId = installation.Id;
			serviceOrderTimeItem.Description = String.Format("Wartung für Anlage {0}", installation.Name);
			serviceOrderTimeItem.ItemNo = article?.ItemNo;
			serviceOrderTimeItem.ServiceOrderHead = maintenanceOrder;
			serviceOrderTimeItem.InvoicingTypeKey = maintenanceOrder.InvoicingTypeKey;
			serviceOrderTimeItem.TrySetLumpSumData(lookupManager);
			return serviceOrderTimeItem;
		}

		protected virtual ServiceOrderHead CreateNewMaintenanceOrder(MaintenancePlan maintenancePlan, Guid maintenancePlanningRun)
		{
			ServiceOrderType serviceOrderType = null;
			try
			{
				serviceOrderType = lookupManager.Get<ServiceOrderType>(t => t.IsMaintenance());
			}
			catch
			{
				logger.ErrorFormat("Could not create maintenance order because there is no service order type lookup checked as maintenance order.");
			}
			if (serviceOrderType == null)
				return null;
			var maintenanceOrder = serviceOrderHeadFactory();
			maintenanceOrder.Id = Guid.NewGuid();
			maintenanceOrder.OrderNo = serviceOrderService.GetNewOrderNo(serviceOrderType);
			maintenanceOrder.CustomerContactId = maintenancePlan.ServiceContract.ParentId;
			maintenanceOrder.PayerId = maintenancePlan.ServiceContract.PayerId;
			maintenanceOrder.PayerAddressId = maintenancePlan.ServiceContract.PayerAddressId;
			maintenanceOrder.InvoiceRecipientId = maintenancePlan.ServiceContract.InvoiceRecipientId;
			maintenanceOrder.InvoiceRecipientAddressId = maintenancePlan.ServiceContract.InvoiceAddressKey;
			maintenanceOrder.ServiceObjectId = maintenancePlan.ServiceContract.ServiceObjectId;
			maintenanceOrder.MaintenancePlanId = maintenancePlan.Id;
			maintenanceOrder.MaintenancePlanningRun = maintenancePlanningRun;
			maintenanceOrder.ErrorCode = ErrorCode.None;
			maintenanceOrder.ErrorMessage = $"{maintenancePlan.Name} - {string.Format(resourceManager.GetTranslation("MaintenanceOrderGenerated"), maintenancePlan.ServiceContract.ContractNo)}";
			maintenanceOrder.Component = null;
			maintenanceOrder.PriorityKey = ServicePriority.MiddleKey;
			maintenanceOrder.Reported = DateTime.Today;
			maintenanceOrder.Planned = maintenancePlan.NextDate;
			maintenanceOrder.ServiceContractId = maintenancePlan.ServiceContractId;
			maintenanceOrder.TypeKey = serviceOrderType.Key;
			maintenanceOrder.StatusKey = lookupManager.Get<ServiceOrderStatus>(s => s.IsReadyForScheduling()).Key;
			maintenanceOrder.IsActive = true;
			maintenanceOrder.CreateUser = "Maintenance Order Agent";
			maintenanceOrder.ModifyUser = "Maintenance Order Agent";
			maintenanceOrder.AuthData = maintenancePlan.AuthData != null ? new LMobile.Unicore.EntityAuthData { DomainId = maintenancePlan.AuthData.DomainId } : null;

			var serviceOrderTemplate = maintenancePlan.ServiceOrderTemplate;
			if (serviceOrderTemplate != null)
			{
				maintenanceOrder.ExtensionValues = serviceOrderTemplate.ExtensionValues;
				maintenanceOrder.PreferredTechnician = serviceOrderTemplate.PreferredTechnician;
				maintenanceOrder.PreferredTechnicianUsergroupKey = serviceOrderTemplate.PreferredTechnicianUsergroupKey;
				maintenanceOrder.PriorityKey = serviceOrderTemplate.PriorityKey;
				maintenanceOrder.RequiredSkillKeys = new List<string>(serviceOrderTemplate.RequiredSkillKeys);
				maintenanceOrder.ResponsibleUser = serviceOrderTemplate.ResponsibleUser;
				maintenanceOrder.ServiceOrderTemplate = serviceOrderTemplate;
				maintenanceOrder.ServiceOrderTemplateId = serviceOrderTemplate.Id;
				maintenanceOrder.StatusKey = serviceOrderTemplate.StatusKey;
				maintenanceOrder.TypeKey = serviceOrderTemplate.TypeKey;
				maintenanceOrder.UserGroupKey = serviceOrderTemplate.UserGroupKey;
				maintenanceOrder.InvoicingTypeKey = serviceOrderTemplate.InvoicingTypeKey;
				maintenanceOrder.TrySetLumpSumData(lookupManager);
			}

			return maintenanceOrder;
		}

		public virtual IEnumerable<string> GetUsedTimeUnits()
		{
			return maintenancePlanRepository.GetAll().Select(c => c.RhythmUnitKey).Distinct();
		}

		public MaintenancePlanService(
			IRepositoryWithTypedId<MaintenancePlan, Guid> maintenancePlanRepository,
			ILookupManager lookupManager,
			IAppSettingsProvider appSettingsProvider,
			IServiceOrderService serviceOrderService,
			IArticleService articleService,
			IResourceManager resourceManager,
			Func<ServiceOrderTime> serviceOrderTimeFactory,
			Func<ServiceOrderHead> serviceOrderHeadFactory,
			IEnumerable<IServiceOrderTemplateService> serviceOrderTemplateServices,
			ILog logger)
		{
			this.maintenancePlanRepository = maintenancePlanRepository;
			this.lookupManager = lookupManager;
			this.appSettingsProvider = appSettingsProvider;
			this.serviceOrderService = serviceOrderService;
			this.articleService = articleService;
			this.resourceManager = resourceManager;
			this.serviceOrderTimeFactory = serviceOrderTimeFactory;
			this.serviceOrderHeadFactory = serviceOrderHeadFactory;
			this.serviceOrderTemplateServices = serviceOrderTemplateServices.OrderBy(x => x.Priority);
			this.logger = logger;
		}
	}
}
