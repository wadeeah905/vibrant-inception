namespace Crm.Service.Rest.Model
{
    using Crm.Library.Rest;
    using Crm.Rest.Model;
    using Crm.Service.Model.Notes;

    [RestTypeFor(DomainType = typeof(OrderStatusChangedNote))]
    [RestTypeFor(DomainType = typeof(ServiceCaseStatusChangedNote))]
    [RestTypeFor(DomainType = typeof(ServiceContractStatusChangedNote))]
    [RestTypeFor(DomainType = typeof(ServiceOrderHeadCreatedNote))]
    [RestTypeFor(DomainType = typeof(ServiceCaseCreatedNote))]
    public class ServiceNoteRest : NoteRest
	{
	}
}
