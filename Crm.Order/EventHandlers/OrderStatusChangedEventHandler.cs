namespace Crm.Order.EventHandlers
{
	using Crm.Library.Modularization.Events;
	using Crm.Order.Events;
	using Crm.Order.Model;

	public class OrderStatusChangedEventHandler : IEventHandler<EntityModifiedEvent<BaseOrder>>
	{
		private readonly IEventAggregator eventAggregator;
		public OrderStatusChangedEventHandler(IEventAggregator eventAggregator)
		{
			this.eventAggregator = eventAggregator;
		}
		public virtual void Handle(EntityModifiedEvent<BaseOrder> e)
		{
			if (e.Entity.StatusKey != e.EntityBeforeChange.StatusKey && e.Entity.StatusKey == "Closed")
			{
				eventAggregator.Publish(new BaseOrderStatusChangedEvent(e.Entity));
			}
		}
	}
}
