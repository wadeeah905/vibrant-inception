namespace Crm.VisitReport.Model.Relationships
{
	using Crm.Library.BaseModel;
	using Crm.Model;
	using Crm.VisitReport.Lookups;

	public class ContactPersonRelationship : LookupRelationship<Contact, Person, ContactPersonRelationshipType>
	{
	}
}