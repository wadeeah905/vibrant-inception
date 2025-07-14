namespace Crm.Service.BusinessRules.ServiceOrderMaterialRules
{
	using Crm.Library.Validation;
	using Crm.Library.Validation.BaseRules;
	using Crm.Service.Model;

	[Rule]
	public class ActualQuantityDigitRule : NumberRule<ServiceOrderMaterial>
	{
		public ActualQuantityDigitRule()
		{
			Init(c => c.ActualQty);
		}
	}
}
