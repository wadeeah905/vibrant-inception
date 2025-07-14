namespace Crm.VisitReport.BusinessRules.Relationship
{
	using Crm.Library.Validation;
	using Crm.Library.Validation.BaseRules;
	using Crm.VisitReport.Model.Relationships;

	[Rule]
	public class ChildIdRequired : RequiredRule<ContactPersonRelationship>
	{
		public ChildIdRequired()
		{
			Init(r => r.ChildId, "Person");
		}
	}
}