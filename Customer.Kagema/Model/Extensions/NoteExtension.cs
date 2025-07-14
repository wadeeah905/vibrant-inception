
using Crm.Library.BaseModel;
using Crm.Model.Notes;

namespace Customer.Kagema.Model.Extensions
{
	public class NoteExtension : EntityExtension<Note>
	{
		public virtual int iNoteLineNo { get; set; }

	}


}