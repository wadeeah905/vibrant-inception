namespace Crm.VisitReport.Events
{
	using Crm.Library.Modularization.Events;
	using Crm.VisitReport.Model;

	public class VisitReportTopicNoteCreatedEvent : IEvent
	{
		public VisitReport VisitReport { get; set; }

		// Constructor
		public VisitReportTopicNoteCreatedEvent(VisitReport visitReport)
		{
			VisitReport = visitReport;
		}
	}
}