namespace Crm.Service.EventHandler
{
	using System;
	using System.Linq;

	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Extensions;
	using Crm.Library.Globalization.Resource;
	using Crm.Library.Modularization.Events;
	using Crm.Service.Model;
	using Crm.Service.Model.Lookup;

	public class ServiceOrderPostProcessingEventHandler : IEventHandler<EntityModifiedEvent<ServiceOrderHead>>
	{
		private readonly IRepository<ServiceOrderMaterial> serviceOrderMaterialRepository;
		private readonly IRepository<ServiceOrderTime> serviceOrderTimeRepository;
		private readonly IRepositoryWithTypedId<ServiceOrderDispatch, Guid> dispatchRepository;
		private readonly IResourceManager resourceManager;

		public ServiceOrderPostProcessingEventHandler(IRepository<ServiceOrderMaterial> serviceOrderMaterialRepository, IRepository<ServiceOrderTime> serviceOrderTimeRepository, IRepositoryWithTypedId<ServiceOrderDispatch, Guid> dispatchRepository, IResourceManager resourceManager)
		{
			this.serviceOrderMaterialRepository = serviceOrderMaterialRepository;
			this.serviceOrderTimeRepository = serviceOrderTimeRepository;
			this.dispatchRepository = dispatchRepository;
			this.resourceManager = resourceManager;
		}

		public virtual void Handle(EntityModifiedEvent<ServiceOrderHead> e)
		{
			if (e.Entity.Status.BelongsToPostProcessing() && !e.EntityBeforeChange.Status.BelongsToPostProcessing() && !e.Entity.IsTemplate)
			{
				var serviceOrderMaterials = e.Entity.ServiceOrderMaterials;
				foreach (var serviceOrderMaterial in serviceOrderMaterials)
				{
					serviceOrderMaterial.InvoiceQty = serviceOrderMaterial.ActualQty;
					serviceOrderMaterialRepository.SaveOrUpdate(serviceOrderMaterial);
				}
				var serviceOrderTimes = e.Entity.ServiceOrderTimes;
				foreach (var serviceOrderTime in serviceOrderTimes)
				{
					serviceOrderTime.InvoiceDuration = (float)serviceOrderTime.Postings.Sum(x => x.DurationInMinutes.GetValueOrDefault()) / 60;
					serviceOrderTimeRepository.SaveOrUpdate(serviceOrderTime);
				}
				
				var openDispatches = dispatchRepository.GetAll()
					.Where(
						x => x.OrderId == e.Entity.Id
							 && x.StatusKey != ServiceOrderDispatchStatus.ClosedCompleteKey
							 && x.StatusKey != ServiceOrderDispatchStatus.ClosedNotCompleteKey
							 && x.StatusKey != ServiceOrderDispatchStatus.RejectedKey);

				foreach (var openDispatch in openDispatches)
				{
					var existingRemark = openDispatch.Remark != null ? openDispatch.Remark + Environment.NewLine : null;
					var newRemark = existingRemark + (existingRemark.IsNotNullOrEmpty() ? "." : string.Empty) + resourceManager.GetTranslation("CorrespondingOrderWasSetToPostProcessing", openDispatch.DispatchedUser.DefaultLanguageKey);
					openDispatch.StatusKey = ServiceOrderDispatchStatus.RejectedKey;
					openDispatch.RejectReasonKey = ServiceOrderDispatchRejectReason.RejectedBySystem;
					openDispatch.RejectRemark = newRemark.Substring(0, Math.Min(newRemark.Length, 500));
					openDispatch.ModifyUser = "ServiceOrderPostProcessingEventHandler";
					dispatchRepository.SaveOrUpdate(openDispatch);
				}
			}
		}
	}
}
