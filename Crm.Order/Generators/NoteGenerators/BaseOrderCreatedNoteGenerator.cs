namespace Crm.Order.Generators.NoteGenerators
{
	using System;

	using Crm.Generators.NoteGenerators.Infrastructure;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Model.Notes;
	using Crm.Order.EventHandler;
	using Crm.Order.Model;
	using Crm.Order.Model.Notes;

	public class BaseOrderCreatedNoteGenerator : NoteGenerator<BaseOrderCreatedEvent>
	{
		private readonly Func<BaseOrderCreatedNote> noteFactory;
		public override Note GenerateNote(BaseOrderCreatedEvent e)
		{
			var order = e.BaseOrder;

			var isOrder = order is Order;
			var note = noteFactory();
			note.IsActive = true;
			note.ContactId = order.ContactId;
			note.AuthData = order.AuthData != null ? new LMobile.Unicore.EntityAuthData { DomainId = order.AuthData.DomainId } : null;
			note.Text = isOrder ? "CreatedOrder" : "CreatedOffer";
			note.Meta = isOrder ? "Order" : "Offer";
			note.EntityId = order.Id;
			note.EntityName = order.OrderNo;
			note.CreateDate = DateTime.UtcNow.AddSeconds(-2);
			return note;
		}
		public BaseOrderCreatedNoteGenerator(IRepositoryWithTypedId<Note, Guid> noteRepository, Func<BaseOrderCreatedNote> noteFactory)
			: base(noteRepository)
		{
			this.noteFactory = noteFactory;
		}
	}
}
