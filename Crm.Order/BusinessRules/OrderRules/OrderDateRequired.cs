namespace Crm.Order.BusinessRules.OrderRules
{
	using Crm.Library.Validation;
	using Crm.Library.Validation.BaseRules;
	using Crm.Order.Model;

	[Rule]
	public class OrderDateRequired : RequiredRule<Order>
	{
		public OrderDateRequired()
		{
			Init(x => x.OrderDate);
		}
	}
}