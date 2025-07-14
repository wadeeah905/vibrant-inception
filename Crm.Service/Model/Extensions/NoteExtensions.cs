namespace Crm.Service.Model.Extensions
{
	using Crm.Library.BaseModel;
	using Crm.Library.BaseModel.Attributes;
	using Crm.Model.Notes;
	using System;
	public class NoteExtensions : EntityExtension<Note>
	{
		[UI(Hidden = true)]
    		public Guid? DispatchId { get; set; }
	}
}