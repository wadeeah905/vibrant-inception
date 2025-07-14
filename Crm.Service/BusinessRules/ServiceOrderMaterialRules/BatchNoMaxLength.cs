namespace Crm.Service.BusinessRules.ServiceOrderMaterialRules
{
	using Crm.Library.Validation.BaseRules;
	using Crm.Service.Model;

	public class BatchNoMaxLength : MaxLengthRule<ServiceOrderMaterial>
	{
		public BatchNoMaxLength()
		{
			Init(m => m.BatchNo, 250);
		}
	}
}