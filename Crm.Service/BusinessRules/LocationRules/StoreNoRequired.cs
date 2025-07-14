namespace Crm.Service.BusinessRules.LocationRules
{
	using Crm.Library.Validation.BaseRules;
	using Crm.Service.Model;

	public class LocationNoRequired : RequiredRule<Location>
	{
		public LocationNoRequired()
		{
			Init(c => c.LocationNo);
		}
	}
}