namespace Crm.Project.BusinessRules.ProjectRules
{
	using Crm.Library.Validation;
	using Crm.Service.Model;

	public class EstimatedQuantityNotNegative : Rule<ServiceOrderMaterial>
	{
		public override bool IsSatisfiedBy(ServiceOrderMaterial material)
		{
			return material.EstimatedQty >= 0;
		}

		protected override RuleViolation CreateRuleViolation(ServiceOrderMaterial material)
		{
			return RuleViolation(material, m => m.EstimatedQty);
		}

		public EstimatedQuantityNotNegative()
			: base(RuleClass.NotNegative)
		{
		}
	}

	public class ActualQuantityNotNegative : Rule<ServiceOrderMaterial>
	{
		public override bool IsSatisfiedBy(ServiceOrderMaterial material)
		{
			return material.ActualQty >= 0;
		}

		protected override RuleViolation CreateRuleViolation(ServiceOrderMaterial material)
		{
			return RuleViolation(material, m => m.ActualQty);
		}

		public ActualQuantityNotNegative()
			: base(RuleClass.NotNegative)
		{
		}
	}

	public class InvoiceQuantityNotNegative : Rule<ServiceOrderMaterial>
	{
		public override bool IsSatisfiedBy(ServiceOrderMaterial material)
		{
			return material.InvoiceQty >= 0;
		}

		protected override RuleViolation CreateRuleViolation(ServiceOrderMaterial material)
		{
			return RuleViolation(material, m => m.InvoiceQty);
		}

		public InvoiceQuantityNotNegative()
			: base(RuleClass.NotNegative)
		{
		}
	}
}