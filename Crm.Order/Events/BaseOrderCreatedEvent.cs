namespace Crm.Order.EventHandler
{
	using Crm.Library.Modularization.Events;
	using Crm.Order.Model;

	public class BaseOrderCreatedEvent : IEvent
	{
		public BaseOrder BaseOrder { get; protected set; }

		public BaseOrderCreatedEvent(BaseOrder baseOrder)
		{
			BaseOrder = baseOrder;
		}
	}
}