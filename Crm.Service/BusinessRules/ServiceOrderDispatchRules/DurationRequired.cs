namespace Crm.Service.BusinessRules.ServiceOrderDispatchRules
{
	using Crm.Library.Validation.BaseRules;
	using Crm.Service.Model;

	public class DurationRequired : RequiredRule<ServiceOrderDispatch>
	{
		// Constructor
		public DurationRequired()
		{
			Init(d => d.DurationInMinutes);
		}
	}
}