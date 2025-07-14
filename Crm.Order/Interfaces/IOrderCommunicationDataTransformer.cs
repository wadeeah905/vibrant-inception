namespace Crm.Order.Interfaces
{
	using Crm.Library.AutoFac;
	using Crm.Order.Model;

	public interface IOrderCommunicationDataTransformer : IDependency
	{
		/// <summary>
		/// Transform the communication data for an order. Order communication data has a field named
		/// <code>Handled</code> to signal that this transformer took care of the communication.
		/// If the Handled flag is not set to true, the returned communication data will be used to send an
		/// email to the recipient.
		/// </summary>
		/// <param name="order">The order itself to send the communicaitond data for</param>
		/// <param name="data">The data that will be used to send the email. Set Handled flag to true to prevent sending of an email.</param>
		/// <returns>The communication data for an order.</returns>
		OrderCommunicationData TransformData(BaseOrder order, OrderCommunicationData data = null);
	}
}