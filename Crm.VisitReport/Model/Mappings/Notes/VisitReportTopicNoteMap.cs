namespace Crm.VisitReport.Model.Mappings.Notes
{
	using Crm.VisitReport.Model.Notes;

	using NHibernate.Mapping.ByCode.Conformist;

	public class VisitReportTopicNoteMap : SubclassMapping<VisitReportTopicNote>
	{
		public VisitReportTopicNoteMap()
		{
			DiscriminatorValue("VisitReportTopicNote");
		}
	}
}