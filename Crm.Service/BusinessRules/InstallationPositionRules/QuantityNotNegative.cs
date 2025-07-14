namespace Crm.Service.BusinessRules.InstallationPositionRules
{
	using Crm.Library.Validation;
	using Crm.Service.Model;

	public class EstimatedQuantityNotNegative : Rule<InstallationPos>
	{
		public override bool IsSatisfiedBy(InstallationPos pos)
		{
			return pos.Quantity >= 0;
		}

		protected override RuleViolation CreateRuleViolation(InstallationPos pos)
		{
			return RuleViolation(pos, p => p.Quantity);
		}

		protected override bool IsIgnoredFor(InstallationPos pos)
		{
			return double.IsNaN(pos.Quantity);
		}

		public EstimatedQuantityNotNegative()
			: base(RuleClass.NotNegative)
		{
		}
	}
}