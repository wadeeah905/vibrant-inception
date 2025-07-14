
namespace Customer.Kagema.Eventhandler
{
	using System;
	using System.Linq;

	using Crm.Library.AutoFac;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Extensions;
	using Crm.Library.Globalization.Lookup;
	using Crm.Library.Globalization.Resource;
	using Crm.Library.Modularization.Events;
	using Crm.Service.EventHandler;
	using Crm.Service.Model;
	using Crm.Service.Model.Extensions;
	using Crm.Service.Model.Helpers;
	using Crm.Service.Model.Lookup;

	using Customer.Kagema.Model.Extensions;

	using log4net;
	using Sms.Einsatzplanung.Connector.Model;

	using ServiceOrderHeadExtensions = Model.Extensions.ServiceOrderHeadExtensions;

	public class CustomerServiceOrderDispatchCreateEventHandler : IEventHandler<EntityCreatedEvent<ServiceOrderDispatch>>, IReplaceRegistration<ServiceOrderDispatchCreateEventHandler>
	{
		private readonly IRepository<ServiceOrderHead> serviceOrderRepository;
		private readonly IRepository<ServiceOrderDispatch> dispatchRepository;
		private readonly IRepository<RplDispatch> dispatchRplRepository;
		private readonly IServiceOrderStatusEvaluator serviceOrderStatusEvaluator;
		private readonly ILookupManager lookupManager;
		private readonly IResourceManager resourceManager;
		private readonly ILog logger;

		public CustomerServiceOrderDispatchCreateEventHandler(IRepository<ServiceOrderHead> serviceOrderRepository, IServiceOrderStatusEvaluator serviceOrderStatusEvaluator, IRepository<ServiceOrderDispatch> dispatchRepository, ILookupManager lookupManager, IResourceManager resourceManager, ILog logger,  IRepository<RplDispatch> dispatchRplRepository)
		{
			this.serviceOrderRepository = serviceOrderRepository;
			this.serviceOrderStatusEvaluator = serviceOrderStatusEvaluator;
			this.dispatchRepository = dispatchRepository;
			this.lookupManager = lookupManager;
			this.resourceManager = resourceManager;
			this.logger = logger;
			this.dispatchRplRepository= dispatchRplRepository;
		}
		public virtual void Handle(EntityCreatedEvent<ServiceOrderDispatch> e)
		{
			var serviceOrder = e.Entity.OrderHead;
			var dispatch = e.Entity;
			var serviceOrderStatus = lookupManager.Get<ServiceOrderStatus>(serviceOrder.StatusKey);
			if (serviceOrderStatus.IsClosed())
			{	
			    var existingRemark = dispatch.Remark != null ? dispatch.Remark + Environment.NewLine : null;
				var newRemark = existingRemark + resourceManager.GetTranslation("CorrespondingOrderWasClosed", dispatch.DispatchedUser.DefaultLanguageKey);
				dispatch.StatusKey = ServiceOrderDispatchStatus.ClosedCompleteKey;
				dispatch.ModifyUser = "ServiceOrderDispatchCreateEventHandler";
				dispatch.Remark = newRemark.Substring(0, Math.Min(newRemark.Length, 500));
				dispatchRepository.SaveOrUpdate(dispatch);
				return;
			}
			var serviceOrderDispatchTask = dispatchRplRepository.GetAll().FirstOrDefault(x => x.Dispatch.Id == dispatch.Id);
			if (serviceOrderDispatchTask == null)
			{
			//var existingRemarkdispatch = !string.IsNullOrEmpty(dispatch.Remark ) ? dispatch.Remark + Environment.NewLine : null;
			//var newRemarkdispatch = existingRemarkdispatch + serviceOrder.GetExtension<ServiceOrderHeadExtensions>().Remark?.ToString().Replace(";;", Environment.NewLine);
			var newRemarkdispatch =  serviceOrder.GetExtension<ServiceOrderHeadExtensions>().Remark?.ToString().Replace(";;", Environment.NewLine);
		
			dispatch.ModifyUser = "ServiceOrderDispatchCreateEventHandler";
			dispatch.Remark = !string.IsNullOrEmpty(newRemarkdispatch ) ?newRemarkdispatch.Substring(0, Math.Min(newRemarkdispatch.Length, 500)):null;
			dispatchRepository.SaveOrUpdate(dispatch);
			}

			//var serviceOrderDispatchTask = dispatchRplRepository.GetAll().FirstOrDefault(x => x.Dispatch.Id == dispatch.Id);
			//	 if (serviceOrderDispatchTask!=null)
			//	 {
			//			serviceOrderDispatchTask.TechnicianInformation=	 dispatch.Remark;
			//			 dispatchRplRepository.SaveOrUpdate(serviceOrderDispatchTask);
			//	 }

			logger.DebugFormat("Service Order No: {0} | New Dispatch Created | Id: {1} | Dispatch Status: {2}",
				e.Entity.OrderHead.OrderNo, e.Entity.Id, e.Entity.StatusKey);
			var oldStatusKey = e.Entity.OrderHead.StatusKey;

			serviceOrderStatusEvaluator.DynamicUpdateOrderStatus(e.Entity.OrderHead);
			logger.DebugFormat("Service Order No: {0} | Old Status: {1} | New Status: {2}",
				e.Entity.OrderHead.OrderNo, oldStatusKey, e.Entity.OrderHead);
			serviceOrderRepository.SaveOrUpdate(e.Entity.OrderHead);
		}
	}
}
