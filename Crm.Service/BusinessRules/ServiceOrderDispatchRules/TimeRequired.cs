namespace Crm.Service.BusinessRules.ServiceOrderDispatchRules
{
	using Crm.Library.Validation.BaseRules;
	using Crm.Service.Model;

	public class TimeRequired : RequiredRule<ServiceOrderDispatch>
	{
		// Constructor
		public TimeRequired()
		{
			Init(d => d.Time);
		}
	}
}