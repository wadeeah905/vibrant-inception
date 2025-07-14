namespace Crm.VisitReport.Generators.NoteGenerators
{
	using System;

	using Crm.Generators.NoteGenerators.Infrastructure;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Model.Notes;
	using Crm.VisitReport.Events;
	using Crm.VisitReport.Model.Notes;

	public class VisitReportTopicNoteGenerator : NoteGenerator<VisitReportTopicNoteCreatedEvent>
	{
		private readonly Func<VisitReportTopicNote> noteFactory;
		public override Note GenerateNote(VisitReportTopicNoteCreatedEvent e)
		{
			var visitReport = e.VisitReport;

			var note = noteFactory();
			note.IsActive = true;
			note.ContactId = visitReport.ReferenceKey;
			note.Contact = visitReport.Company;
			note.AuthData = visitReport.AuthData != null ? new LMobile.Unicore.EntityAuthData { DomainId = visitReport.AuthData.DomainId } : null;
			note.Text = visitReport.Id.ToString();
			note.Plugin = "Crm.VisitReport";

			return note;
		}
		public VisitReportTopicNoteGenerator(IRepositoryWithTypedId<Note, Guid> noteRepository, Func<VisitReportTopicNote> noteFactory)
			: base(noteRepository)
		{
			this.noteFactory = noteFactory;
		}
	}
}
