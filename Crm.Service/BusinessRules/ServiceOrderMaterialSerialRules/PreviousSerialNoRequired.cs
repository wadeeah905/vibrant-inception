namespace Crm.Service.BusinessRules.ServiceOrderMaterialSerialRules
{
	using Crm.Library.Validation;
	using Crm.Service.Model;

	public class PreviousSerialNoRequired : Rule<ServiceOrderMaterialSerial>
	{
		public override bool IsSatisfiedBy(ServiceOrderMaterialSerial entity)
		{
			return entity.PreviousSerialNo != null || entity.NoPreviousSerialNoReasonKey != null;
		}
		protected override bool IsIgnoredFor(ServiceOrderMaterialSerial materialSerial)
		{
			return materialSerial.NoPreviousSerialNoReasonKey != null;
		}
		protected override RuleViolation CreateRuleViolation(ServiceOrderMaterialSerial entity)
		{
			return RuleViolation(entity, x => x.PreviousSerialNo, propertyNameReplacementKey: "PreviousSerialNoRequired", errorMessageKey: "PreviousSerialNoRequired");
		}

		public PreviousSerialNoRequired()
			: base(RuleClass.Required)
		{
		}
	}
}