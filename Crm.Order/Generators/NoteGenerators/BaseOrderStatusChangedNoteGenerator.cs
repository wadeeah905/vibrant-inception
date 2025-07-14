namespace Crm.Order.Generators.NoteGenerators
{
	using System;

	using Crm.Generators.NoteGenerators.Infrastructure;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Model.Notes;
	using Crm.Order.Events;
	using Crm.Order.Model;
	using Crm.Order.Model.Notes;

	public class BaseOrderStatusChangedNoteGenerator : NoteGenerator<BaseOrderStatusChangedEvent>
	{
		private readonly Func<BaseOrderStatusChangedNote> noteFactory;
		public override Note GenerateNote(BaseOrderStatusChangedEvent e)
		{
			var baseOrder = e.BaseOrder;

			var note = noteFactory();
			note.IsActive = true;
			note.ContactId = baseOrder.ContactId;
			note.AuthData = baseOrder.AuthData != null ? new LMobile.Unicore.EntityAuthData { DomainId = baseOrder.AuthData.DomainId } : null;
			note.Text = baseOrder.Status.Key;
			note.Meta = baseOrder is Order ? "Order" : "Offer";
			note.EntityId = baseOrder.Id;
			note.EntityName = baseOrder.OrderNo;

			return note;
		}
		public BaseOrderStatusChangedNoteGenerator(IRepositoryWithTypedId<Note, Guid> noteRepository, Func<BaseOrderStatusChangedNote> noteFactory)
			: base(noteRepository)
		{
			this.noteFactory = noteFactory;
		}
	}
}
