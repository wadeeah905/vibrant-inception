namespace Crm.VisitReport.Model.Notes
{
	using Crm.Library.Extensions;
	using Crm.Model.Notes;

	public class VisitReportTopicNote : Note, INoteWithSubject
	{
		public override string ImageVirtualUrl
		{
			get { return "~/Content/img/{0}.gif".WithArgs(Contact.ContactType); }
		}
		public override string PermanentLabelResourceKey
		{
			get { return "TopicBy"; }
		}
		public override string NoteTitle
		{
			get { return "Topic"; }
		}
		public VisitReportTopicNote()
		{
			IsSystemGenerated = false;
		}
	}
}