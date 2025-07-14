namespace Crm.Order.Rest.Model.Mappings
{
	using AutoMapper;

	using Crm.Library.AutoMapper;
	using Crm.Order.Model;
	using Crm.Rest.Model;

	public class BaseOrderRestMap : IAutoMap
	{
		public virtual void CreateMap(IProfileExpression mapper)
		{
			mapper.CreateMap<BaseOrder, BaseOrderRest>()
				.ForMember(x => x.Person, m => m.MapFrom(x => x.ContactPerson))
				.ForMember(x => x.ResponsibleUserUser, m => m.MapFrom(x => x.ResponsibleUserObject));
			mapper.CreateMap<BaseOrder, DocumentGeneratorEntry>()
				.IncludeBase<object, DocumentGeneratorEntry>()
				.ForMember(x => x.ErrorMessage, m => m.MapFrom(x => x.ConfirmationSendingError))
				;
		}
	}
}
