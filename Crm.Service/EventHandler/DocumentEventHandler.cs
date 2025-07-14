namespace Crm.Service.EventHandler
{
	using Crm.Events;
	using Crm.Library.Modularization.Events;
	using Crm.Model.Enums;
	using Crm.Service.Services.Interfaces;

	public class DocumentEventHandler : IEventHandler<DocumentAddedEvent>, IEventHandler<DocumentDeletedEvent>
	{
		private readonly INoteHandlingService noteHandlingService;

		public virtual void Handle(DocumentAddedEvent e)
		{
			switch (e.ReferenceType)
			{
				case ReferenceType.Installation:
				case ReferenceType.ServiceOrder:
					noteHandlingService.AddNoteAfterAddingDeletingDoc(e.FileName, e.ReferenceKey, (int)e.ReferenceType, e.Username, "DocAddedTo");
					break;
			}
		}

		public virtual void Handle(DocumentDeletedEvent e)
		{
			switch (e.ReferenceType)
			{
				case ReferenceType.Installation:
				case ReferenceType.ServiceOrder:
					noteHandlingService.AddNoteAfterAddingDeletingDoc(e.FileName, e.ReferenceKey, (int)e.ReferenceType, e.Username, "DocRemovedFrom");
					break;
			}
		}

		// Constructor
		public DocumentEventHandler(INoteHandlingService noteHandlingService)
		{
			this.noteHandlingService = noteHandlingService;
		}
	}
}
