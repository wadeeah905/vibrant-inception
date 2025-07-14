namespace Crm.Service.Generators.NoteGenerators
{
	using System;

	using Crm.Generators.NoteGenerators.Infrastructure;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Extensions;
	using Crm.Library.Modularization.Events;
	using Crm.Model.Notes;
	using Crm.Service.Model;
	using Crm.Service.Model.Notes;

	public class ServiceCaseCreatedNoteGenerator : NoteGenerator<EntityCreatedEvent<ServiceCase>>
	{
		private readonly Func<ServiceCaseCreatedNote> noteFactory;
		// Methods
		public override Note GenerateNote(EntityCreatedEvent<ServiceCase> e)
		{
			var note = noteFactory();
			note.IsActive = true;
			note.ContactId = e.Entity.Id;
			note.AuthData = e.Entity.AuthData != null ? new LMobile.Unicore.EntityAuthData { DomainId = e.Entity.AuthData.DomainId } : null;
			note.Text = "Servicefall angelegt: {0}".WithArgs(e.Entity.ServiceCaseNo);
			note.Plugin = "Crm.Service";
			return note;
		}
		public ServiceCaseCreatedNoteGenerator(IRepositoryWithTypedId<Note, Guid> noteRepository, Func<ServiceCaseCreatedNote> noteFactory)
			: base(noteRepository)
		{
			this.noteFactory = noteFactory;
		}
	}
}
