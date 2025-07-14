namespace Crm.Order.Rest.Model.Mappings
{
	using AutoMapper;

	using Crm.Library.AutoMapper;
	using Crm.Order.Model.Notes;
	using Crm.Rest.Model;

	public class BaseOrderStatusChangedNoteMap : IAutoMap
	{
		public virtual void CreateMap(IProfileExpression mapper)
		{
			mapper.CreateMap<BaseOrderStatusChangedNote, NoteRest>();
		}
	}
}
