namespace Crm.Order.BusinessRules.OrderRules
{
	using Crm.Library.Validation;
	using Crm.Library.Validation.BaseRules;
	using Crm.Order.Model;

	[Rule]
	public class BillAddressIdRequired : RequiredRule<Order>
	{
		public BillAddressIdRequired()
		{
			Init(x => x.BillingAddressId);
		}
	}
}