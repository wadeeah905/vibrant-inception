namespace Crm.VisitReport.Rest.Model
{
	using Crm.Library.Rest;
	using Crm.Rest.Model;
	using Crm.VisitReport.Model.Notes;

	[RestTypeFor(DomainType = typeof(VisitReportClosedNote))]
	[RestTypeFor(DomainType = typeof(VisitReportTopicNote))]
	public class VisitReportNoteRest : NoteRest
	{
	}
}
