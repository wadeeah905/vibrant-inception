namespace Crm.Service.BusinessRules.ServiceOrderMaterialRules
{
	using Crm.Library.Validation;
	using Crm.Service.Model;

	[Rule]
	public class EstimatedQuantityMaxValue : Rule<ServiceOrderMaterial>
	{
		public override bool IsSatisfiedBy(ServiceOrderMaterial material)
		{
			return material.EstimatedQty < 10000000000000000;
		}

		protected override RuleViolation CreateRuleViolation(ServiceOrderMaterial material)
		{
			return RuleViolation(material, c => c.EstimatedQty);
		}

		// Constructor
		public EstimatedQuantityMaxValue()
			: base(RuleClass.MaxValue)
		{
		}
	}

	[Rule]
	public class ActualQuantityMaxValue : Rule<ServiceOrderMaterial>
	{
		public override bool IsSatisfiedBy(ServiceOrderMaterial material)
		{
			return material.ActualQty < 10000000000000000;
		}

		protected override RuleViolation CreateRuleViolation(ServiceOrderMaterial material)
		{
			return RuleViolation(material, c => c.ActualQty);
		}

		// Constructor
		public ActualQuantityMaxValue()
			: base(RuleClass.MaxValue)
		{
		}
	}

	[Rule]
	public class InvoiceQuantityMaxValue : Rule<ServiceOrderMaterial>
	{
		public override bool IsSatisfiedBy(ServiceOrderMaterial material)
		{
			return material.InvoiceQty < 10000000000000000;
		}

		protected override RuleViolation CreateRuleViolation(ServiceOrderMaterial material)
		{
			return RuleViolation(material, c => c.InvoiceQty);
		}

		// Constructor
		public InvoiceQuantityMaxValue()
			: base(RuleClass.MaxValue)
		{
		}
	}
}
