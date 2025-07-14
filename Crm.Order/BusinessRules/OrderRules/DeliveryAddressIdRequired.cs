namespace Crm.Order.BusinessRules.OrderRules
{
	using Crm.Library.Validation;
	using Crm.Library.Validation.BaseRules;
	using Crm.Order.Model;

	[Rule]
	public class DeliveryAddressIdRequired : RequiredRule<Order>
	{
		public DeliveryAddressIdRequired()
		{
			Init(x => x.DeliveryAddressId);
		}
	}
}