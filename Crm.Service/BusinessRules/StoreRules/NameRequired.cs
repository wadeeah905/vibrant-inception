namespace Crm.Service.BusinessRules.StoreRules
{
	using Crm.Library.Validation.BaseRules;
	using Crm.Service.Model;
	public class NameRequired : RequiredRule<Store>
	{
		public NameRequired()
		{
			Init(c => c.Name);
		}
	}
}