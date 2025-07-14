namespace Crm.VisitReport.BusinessRules.CompanyRules
{
	using Crm.Library.Validation;
	using Crm.Model;
	using Crm.VisitReport.Model;

	public class VisitFrequencyTimeUnitKeyRequired : Rule<Company>
	{
		protected override bool IsIgnoredFor(Company entity)
		{
			return entity.GetExtension<CompanyExtension>().VisitFrequencyValue == 0;
		}

		protected override RuleViolation CreateRuleViolation(Company entity)
		{
			return new RuleViolation<CompanyExtension>(entity.GetExtension<CompanyExtension>(), x => x.VisitFrequencyTimeUnitKey, ruleClass: RuleClass.Required, propertyNameReplacementKey: "TimeUnit");
		}
		public override bool IsSatisfiedBy(Company entity)
		{
			return !string.IsNullOrWhiteSpace(entity.GetExtension<CompanyExtension>().VisitFrequencyTimeUnitKey);
		}

		public VisitFrequencyTimeUnitKeyRequired()
			: base(RuleClass.Required)
		{
		}
	}
}
