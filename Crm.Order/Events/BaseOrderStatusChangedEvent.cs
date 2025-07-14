namespace Crm.Order.Events
{
	using Crm.Library.Modularization.Events;
	using Crm.Order.Model;

	public class BaseOrderStatusChangedEvent : IEvent
	{
		public BaseOrder BaseOrder { get; protected set; }

		public BaseOrderStatusChangedEvent(BaseOrder baseOrder)
		{
			BaseOrder = baseOrder;
		}
	}
}