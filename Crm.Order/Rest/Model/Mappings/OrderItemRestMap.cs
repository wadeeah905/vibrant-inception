namespace Crm.Order.Rest.Model.Mappings
{
	using System.Linq;

	using AutoMapper;

	using Crm.Article.Model.Lookups;
	using Crm.Library.AutoMapper;
	using Crm.Order.Model;

	public class OrderItemRestMap : IAutoMap
	{
		public virtual void CreateMap(IProfileExpression mapper)
		{
			mapper.CreateMap<OrderItem, OrderItemRest>()
				.ForMember(x => x.ArticleTypeKey, m => m.MapFrom(x => x.Article.ArticleTypeKey))
				.ForMember(x => x.VATLevelKey, m => m.MapFrom(x => x.Article.VATLevelKey))
				.ForMember(dst => dst.ArticleHasAccessory, m => m.MapFrom(src => src.Article.ArticleParentRelationships.Any(r => r.RelationshipTypeKey == ArticleRelationshipType.AccessoryKey)));
		}
	}
}
