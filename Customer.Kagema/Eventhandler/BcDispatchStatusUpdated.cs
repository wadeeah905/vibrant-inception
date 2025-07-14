using Crm.Library.Modularization.Events;
using Crm.Service.Model;
using Crm.Service.Model.Lookup;
using Customer.Kagema.Services.Interfaces;
using Quartz;

namespace Customer.Kagema.Eventhandler
{
	public class BcDispatchStatusUpdated : IEventHandler<EntityCreatedEvent<ServiceOrderDispatch>>, IEventHandler<EntityModifiedEvent<ServiceOrderDispatch>>
	{
		private readonly IScheduler scheduler;
		private readonly INavisionExportService navisionExportService;

		public BcDispatchStatusUpdated(IEventAggregator eventAggregator, IScheduler scheduler, INavisionExportService navisionExportService)
		{
			this.navisionExportService = navisionExportService;
			this.scheduler = scheduler;
		}

		public void Handle(EntityCreatedEvent<ServiceOrderDispatch> e)
		{

			if (e.Entity.Status.IsScheduled() || e.Entity.Status.IsReleased() || e.Entity.Status.IsRead())
			{
				navisionExportService.ExportPlannedServiceOrder(e.Entity.OrderHead);
			}
		}
		public void Handle(EntityModifiedEvent<ServiceOrderDispatch> e)
		{
			var entity = e.Entity;
			var entityBeforeChange = e.EntityBeforeChange;

			var rescheduled = !Equals(entity.Time, entityBeforeChange.Time) ||
					!Equals(entity.DurationInMinutes, entityBeforeChange.DurationInMinutes) ||
					!Equals(entity.DispatchedUser.Id, entityBeforeChange.DispatchedUser.Id);

			// It's easier to read that way, Either it's a step up from Planned to Released, a reschedule or a step down from released to scheduled
			if (entityBeforeChange.Status.IsScheduled() && entity.Status.IsReleased())
			{
				navisionExportService.ExportPlannedServiceOrder(e.Entity.OrderHead);
			}
			else if (entityBeforeChange.Status.IsScheduled() && entity.Status.IsScheduled() && rescheduled)
			{
				navisionExportService.ExportPlannedServiceOrder(e.Entity.OrderHead);
			}
			else if (entityBeforeChange.Status.IsReleased() && entity.Status.IsReleased() && rescheduled)
			{
				navisionExportService.ExportPlannedServiceOrder(e.Entity.OrderHead);
			}
			else if (entityBeforeChange.Status.IsReleased() && entity.Status.IsScheduled())
			{
				navisionExportService.ExportPlannedServiceOrder(e.Entity.OrderHead);
			}
		}

	}
}
