namespace Crm.VisitReport.Events
{
	using Crm.Library.Modularization.Events;
	using Crm.VisitReport.Model;

	public class VisitReportClosedEvent : IEvent
	{
		public VisitReport VisitReport { get; set; }

		// Constructor
		public VisitReportClosedEvent(VisitReport visitReport)
		{
			VisitReport = visitReport;
		}
	}
}