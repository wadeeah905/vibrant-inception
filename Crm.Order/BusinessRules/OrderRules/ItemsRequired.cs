namespace Crm.Order.BusinessRules.OrderRules
{
	using System.Linq;

	using Crm.Library.Validation;
	using Crm.Order.Model;

	[Rule]
	public class ItemsRequired : Rule<Order>
	{
		protected override bool IsIgnoredFor(Order order)
		{
			return order.StatusKey == "Open";
		}
		public override bool IsSatisfiedBy(Order order)
		{
			return order.Items.Any();
		}

		protected override RuleViolation CreateRuleViolation(Order order)
		{
			return RuleViolation(order, o => o.Items);
		}

		public ItemsRequired()
			: base(RuleClass.Required)
		{
		}
	}
}