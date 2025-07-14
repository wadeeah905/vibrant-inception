namespace Crm.Order.EventHandlers
{
	using Crm.Library.Modularization.Events;
	using Crm.Order.EventHandler;
	using Crm.Order.Events;
	using Crm.Order.Model;
	using Crm.Order.Services.Interfaces;

	public class OrderStatusCreatedEventHandler : IEventHandler<EntityCreatedEvent<BaseOrder>>
	{
		private readonly IEventAggregator eventAggregator;
		private readonly IBaseOrderService baseOrderService;
		public OrderStatusCreatedEventHandler(IEventAggregator eventAggregator, IBaseOrderService baseOrderService)
		{
			this.eventAggregator = eventAggregator;
			this.baseOrderService = baseOrderService;
		}
		public virtual void Handle(EntityCreatedEvent<BaseOrder> e)
		{
			eventAggregator.Publish(new BaseOrderCreatedEvent(e.Entity));
			if (e.Entity.StatusKey != "Closed")
			{
				return;
			}
			eventAggregator.Publish(new BaseOrderStatusChangedEvent(e.Entity));
			baseOrderService.TrySendMail(e.Entity);
		}
	}
}
