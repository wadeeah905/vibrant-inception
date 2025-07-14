namespace Crm.Order.BusinessRules.OrderRules
{
	using Crm.Library.Validation;
	using Crm.Library.Validation.BaseRules;
	using Crm.Order.Model;

	[Rule]
	public class ContactIdRequired : RequiredRule<Order>
	{
		public ContactIdRequired()
		{
			Init(x => x.ContactId);
		}
	}
}