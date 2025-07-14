namespace Crm.Service.BusinessRules.StoreRules
{
	using Crm.Library.Validation.BaseRules;
	using Crm.Service.Model;

	public class StoreNoRequired : RequiredRule<Store>
	{
		public StoreNoRequired()
		{
			Init(c => c.StoreNo);
		}
	}
}