namespace Crm.Service.Model.Helpers
{
	using System;
	using System.Collections.Generic;
	using System.Linq;

	using Library.Data.Domain.DataInterfaces;
	using Library.Extensions;
	using Library.Globalization.Lookup;
	using Lookup;

	public class DefaultServiceOrderStatusEvaluator : IServiceOrderStatusEvaluator
	{
		private readonly IRepositoryWithTypedId<ServiceOrderDispatch, Guid> dispatchRepository;
		private readonly ILookupManager lookupManager;
		protected virtual IEnumerable<ServiceOrderStatus> Statuses
		{
			get { return lookupManager.List<ServiceOrderStatus>(); }
		}

		// Methods
		public virtual string Evaluate(ServiceOrderHead serviceOrderHead)
		{
			var status = lookupManager.Get<ServiceOrderStatus>(serviceOrderHead.StatusKey);
			var isCorrectServiceOrderStatus = status.BelongsToPostProcessing() || status.BelongsToClosed();

			if (isCorrectServiceOrderStatus)
			{
				return status.Key;
			}

			var dispatches = dispatchRepository.GetAll().Where(x => x.OrderId == serviceOrderHead.Id).ToList();

			// Service order statuses that can only be set manually and need no checking for dispatch status
			if (dispatches.None() && (status.IsNew() || status.IsPostProcessing() || status.IsReadyForInvoice() || status.IsInvoiced() || status.IsClosed()))
			{
				return status.Key;
			}

			if (dispatches.None())
			{
				return Statuses.First(s => s.IsReadyForScheduling()).Key;
			}

			if (dispatches.All(d => d.StatusKey == ServiceOrderDispatchStatus.ScheduledKey))
			{
				return Statuses.First(s => s.IsScheduled()).Key;
			}

			if (dispatches.All(d => d.StatusKey == ServiceOrderDispatchStatus.ReleasedKey || d.StatusKey == ServiceOrderDispatchStatus.ReadKey))
			{
				return Statuses.First(s => s.IsReleased()).Key;
			}

			var areAllDispatchesClosed = dispatches.All(d => d.StatusKey == ServiceOrderDispatchStatus.ClosedNotCompleteKey || d.StatusKey == ServiceOrderDispatchStatus.ClosedCompleteKey || d.StatusKey == ServiceOrderDispatchStatus.RejectedKey);
			var isAnyDispatchClosedComplete = dispatches.Any(x => x.StatusKey == ServiceOrderDispatchStatus.ClosedCompleteKey);
			if (areAllDispatchesClosed && isAnyDispatchClosedComplete)
			{
				return Statuses.First(s => s.IsCompleted()).Key;
			}

			if (dispatches.Any(d => d.StatusKey == ServiceOrderDispatchStatus.ClosedNotCompleteKey || d.StatusKey == ServiceOrderDispatchStatus.ClosedCompleteKey))
			{
				return Statuses.First(s => s.IsPartiallyCompleted()).Key;
			}

			if (dispatches.Any(d => d.StatusKey == ServiceOrderDispatchStatus.InProgressKey || d.StatusKey == ServiceOrderDispatchStatus.ReadKey || d.StatusKey == ServiceOrderDispatchStatus.SignedByCustomerKey))
			{
				return Statuses.First(s => s.IsInProgress()).Key;
			}

			if (dispatches.Any(d => d.StatusKey == ServiceOrderDispatchStatus.ScheduledKey))
			{
				var nonScheduledDispatches = dispatches.Where(x => x.StatusKey != ServiceOrderDispatchStatus.ScheduledKey);
				if (nonScheduledDispatches.All(x => x.StatusKey == ServiceOrderDispatchStatus.ReleasedKey))
				{
					return Statuses.First(s => s.IsPartiallyReleased()).Key;
				}
			}

			if (dispatches.Any(d => d.StatusKey == ServiceOrderDispatchStatus.RejectedKey))
			{
				var nonRejectedDispatches = dispatches.Where(x => x.StatusKey != ServiceOrderDispatchStatus.RejectedKey);
				if (nonRejectedDispatches.Any(d => d.StatusKey == ServiceOrderDispatchStatus.ReleasedKey))
				{
					if (nonRejectedDispatches.Any(x => x.StatusKey != ServiceOrderDispatchStatus.ReleasedKey))
					{
						return Statuses.First(s => s.IsPartiallyReleased()).Key;
					}
					else
					{
						return Statuses.First(s => s.IsReleased()).Key;
					}
				}

				if (nonRejectedDispatches.Any(x => x.StatusKey == ServiceOrderDispatchStatus.ScheduledKey))
				{
					return Statuses.First(s => s.IsScheduled()).Key;
				}

				if (dispatches.All(x => x.StatusKey == ServiceOrderDispatchStatus.RejectedKey && x.RejectReasonKey != null && x.RejectReason.ServiceOrderStatusKey != null))
				{
					var sortOrder = dispatches.Where(x => x.StatusKey == ServiceOrderDispatchStatus.RejectedKey && x.RejectReason != null && x.RejectReason.ServiceOrderStatusKey != null).Max(x => lookupManager.Get<ServiceOrderStatus>(x.RejectReason.ServiceOrderStatusKey).SortOrder);
					return Statuses.First(x => x.SortOrder == sortOrder);
				}
				return Statuses.First(s => s.IsReadyForScheduling()).Key;
			}

			throw new Exception("This code should be unreachable.");
		}

		public DefaultServiceOrderStatusEvaluator(IRepositoryWithTypedId<ServiceOrderDispatch, Guid> dispatchRepository, ILookupManager lookupManger)
		{
			this.dispatchRepository = dispatchRepository;
			this.lookupManager = lookupManger;
		}
	}
}
