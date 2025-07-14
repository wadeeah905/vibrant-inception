namespace Crm.Order.Rest.Model.Mappings
{
	using AutoMapper;

	using Crm.Library.AutoMapper;
	using Crm.Library.EntityConfiguration;
	using Crm.Order.Model;
	using Crm.Order.Model.Extensions;

	public class OrderRestMap : IAutoMap
	{
		public virtual void CreateMap(IProfileExpression mapper)
		{
			mapper.CreateMap<Order, OrderRest>()
				.IncludeBase<BaseOrder, BaseOrderRest>();
			mapper.CreateMap<Order, TimelineEvent>()
				.ForMember(x => x.Id, m => m.MapFrom(x => x.Id))
				.ForMember(x => x.Summary, m => m.MapFrom(x => x.Preview()))
				.ForMember(x => x.IsAllDay, m => m.MapFrom(x => true))
				.ForMember(x => x.Start, m => m.MapFrom(x => x.OrderDate))
				.ForMember(x => x.Link, m => m.MapFrom(x => "~/Crm.Order/Order/DetailsTemplate/" + x.Id))
				;
		}
	}
}
