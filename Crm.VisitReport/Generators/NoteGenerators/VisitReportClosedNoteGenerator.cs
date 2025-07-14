namespace Crm.VisitReport.Generators.NoteGenerators
{
	using System;

	using Crm.Generators.NoteGenerators.Infrastructure;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Modularization.Interfaces;
	using Crm.Model.Notes;
	using Crm.VisitReport.Events;
	using Crm.VisitReport.Model.Notes;

	public class VisitReportClosedNoteGenerator : NoteGenerator<VisitReportClosedEvent>
	{
		private readonly Func<VisitReportClosedNote> noteFactory;
		private readonly IPluginProvider pluginProvider;

		public override Note GenerateNote(VisitReportClosedEvent e)
		{
			var visitReport = e.VisitReport;

			var note = noteFactory();
			note.IsActive = true;
			note.ContactId = visitReport.ReferenceKey;
			note.Contact = visitReport.Company;
			note.AuthData = visitReport.AuthData != null ? new LMobile.Unicore.EntityAuthData { DomainId = visitReport.AuthData.DomainId } : null;
			note.Text = visitReport.Id.ToString();
			note.Plugin = pluginProvider.FindPluginDescriptor(note.Contact.ActualType)?.PluginName ?? "Main";

			return note;
		}
		public VisitReportClosedNoteGenerator(IRepositoryWithTypedId<Note, Guid> noteRepository, Func<VisitReportClosedNote> noteFactory, IPluginProvider pluginProvider)
			: base(noteRepository)
		{
			this.noteFactory = noteFactory;
			this.pluginProvider = pluginProvider;
		}
	}
}