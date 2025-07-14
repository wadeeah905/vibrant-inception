using Crm.Library.Modularization.Events;
using Crm.Service.Model;
using Customer.Kagema.Services.Interfaces;

namespace Customer.Kagema.Eventhandler
{
    public class BcServiceOrderStatusUpdated : IEventHandler<EntityModifiedEvent<ServiceOrderHead>>	 , IEventHandler<EntityCreatedEvent<ServiceOrderHead>>
    {
		private readonly INavisionExportService navisionExportService;
		public BcServiceOrderStatusUpdated(INavisionExportService navisionExportService)
		{
			this.navisionExportService = navisionExportService;
		}

		public void Handle(EntityCreatedEvent<ServiceOrderHead> e)
		{
			
				navisionExportService.UpdateExportNewServiceOrder(e.Entity);
		}
		public void Handle(EntityModifiedEvent<ServiceOrderHead> e)
		{
			var StatusUpdated = e.Entity.StatusKey != e.EntityBeforeChange.StatusKey;

			if (StatusUpdated)
			{
				navisionExportService.UpdateExportServiceOrder(e.Entity);
			}
		}
	}
}
