namespace Crm.Order.Rest.Model
{
	using Crm.Library.Rest;
	using Crm.Order.Model.Notes;
	using Crm.Rest.Model;

	[RestTypeFor(DomainType = typeof(BaseOrderCreatedNote))]
	public class BaseOrderCreatedNoteRest : NoteRest
	{
	}
}
