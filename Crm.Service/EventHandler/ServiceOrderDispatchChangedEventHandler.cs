namespace Crm.Service.EventHandler
{
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Globalization.Lookup;
	using Crm.Library.Modularization.Events;
	using Crm.Service.Model;
	using Crm.Service.Model.Extensions;
	using Crm.Service.Model.Helpers;
	using Crm.Service.Model.Lookup;

	using log4net;

	public class ServiceOrderDispatchChangedEventHandler : IEventHandler<EntityModifiedEvent<ServiceOrderDispatch>>
	{
		private readonly IRepository<ServiceOrderHead> serviceOrderRepository;
		private readonly IServiceOrderStatusEvaluator serviceOrderStatusEvaluator;
		private readonly ILookupManager lookupManager;
		private readonly ILog logger;

		public ServiceOrderDispatchChangedEventHandler(IRepository<ServiceOrderHead> serviceOrderRepository, IServiceOrderStatusEvaluator serviceOrderStatusEvaluator, ILookupManager lookupManager, ILog logger)
		{
			this.serviceOrderRepository = serviceOrderRepository;
			this.serviceOrderStatusEvaluator = serviceOrderStatusEvaluator;
			this.lookupManager = lookupManager;
			this.logger = logger;
		}
		public virtual void Handle(EntityModifiedEvent<ServiceOrderDispatch> e)
		{
			logger.DebugFormat("Service Order no: {0} | Dispatch Id: {1} has been changed | Old Dispatch Status: {2}, New Dispatch Status: {3}", 
				e.Entity.OrderHead.OrderNo, e.Entity.Id, e.EntityBeforeChange.StatusKey, e.Entity.StatusKey);
			var persistedServiceOrder = e.EntityBeforeChange.OrderHead;
			var persistedServiceOrderStatus = lookupManager.Get<ServiceOrderStatus>(persistedServiceOrder.StatusKey);
			var isStaleServiceOrder = persistedServiceOrderStatus.BelongsToPostProcessing() || persistedServiceOrderStatus.BelongsToClosed();

			if (isStaleServiceOrder)
			{
				logger.DebugFormat("Service Order no : {0} | Dispatch Id: {1} is stale", e.Entity.OrderHead.OrderNo, e.Entity.Id);
				return;
			}

			var newDispatch = e.Entity;
			serviceOrderStatusEvaluator.DynamicUpdateOrderStatus(newDispatch.OrderHead);
			logger.DebugFormat("Service Order no: {0} | Service Order Status will be updated | Old: {1}, New: {2}",
				e.Entity.OrderHead.OrderNo, persistedServiceOrder.StatusKey, newDispatch.OrderHead.StatusKey);
		}
	}
}
