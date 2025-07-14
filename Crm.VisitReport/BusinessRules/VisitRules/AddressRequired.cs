namespace Crm.VisitReport.BusinessRules.VisitRules
{
	using Crm.Library.Validation;
	using Crm.Library.Validation.BaseRules;
	using Crm.VisitReport.Model;

	[Rule]
	public class AddressRequired : RequiredRule<Visit>
	{
		// Constructor
		public AddressRequired()
		{
			Init(x => x.AddressId, "CustomerAddress");
		}
	}
}