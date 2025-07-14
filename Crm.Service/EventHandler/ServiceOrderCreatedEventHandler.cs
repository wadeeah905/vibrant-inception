namespace Crm.Service.EventHandler
{
	using Crm.Service.BackgroundServices;

	using Library.Modularization.Events;

	using Model;
	using Quartz;

	public class ServiceOrderCreatedEventHandler : IEventHandler<EntityCreatedEvent<ServiceOrderHead>>, ISeparateTransactionEventHandler
	{
		private readonly IScheduler scheduler;
		public ServiceOrderCreatedEventHandler(IScheduler scheduler)
		{
			this.scheduler = scheduler;
		}

		public virtual void Handle(EntityCreatedEvent<ServiceOrderHead> e)
		{
			ServiceOrderGeocodingAgent.Trigger(scheduler);
		}
	}
}
