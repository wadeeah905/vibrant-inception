namespace Crm.VisitReport.Model.Mappings.Notes
{
	using Crm.VisitReport.Model.Notes;

	using NHibernate.Mapping.ByCode.Conformist;

	public class VisitReportClosedNoteMap : SubclassMapping<VisitReportClosedNote>
	{
		public VisitReportClosedNoteMap()
		{
			DiscriminatorValue("VisitReportClosedNote");
		}
	}
}