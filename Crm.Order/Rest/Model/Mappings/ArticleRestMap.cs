namespace Crm.Order.Rest.Model.Mappings
{
	using System.Linq;

	using AutoMapper;

	using Crm.Article.Model;
	using Crm.Article.Model.Lookups;
	using Crm.Article.Rest.Model;
	using Crm.Library.AutoMapper;

	public class ArticleRestMap : IAutoMap
	{
		public virtual void CreateMap(IProfileExpression mapper)
		{
			mapper.CreateMap<Article, ArticleRest>()
				.ForMember(dst => dst.HasAccessory, m => m.MapFrom(src => src.ArticleParentRelationships.Any(r => r.RelationshipTypeKey == ArticleRelationshipType.AccessoryKey)));
		}
	}
}
