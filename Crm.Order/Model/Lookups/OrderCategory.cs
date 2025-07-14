namespace Crm.Order.Model.Lookups
{
	using System.Collections.Generic;

	using Crm.Library.Globalization.Lookup;

	[Lookup("[LU].[OrderCategory]", "OrderCategoryId")]
	public class OrderCategory : EntityLookup<string>, ILookupWithColor
	{
		[LookupProperty(Shared = true)]
		public virtual List<string> AllowedArticleTypeValues { get; set; }

		[LookupProperty(Shared = true)]
		public virtual List<string> AllowedArticleGroupValues { get; set; }

		[LookupProperty(Shared = true)]
		public virtual bool AllowNegativeQuantities { get; set; }

		[LookupProperty(Shared = true)]
		public virtual bool AllowPositiveQuantities { get; set; }

		[LookupProperty(Shared = true)]
		public virtual List<string> CustomerFlags { get; set; }

		//[LookupProperty()]
		//public virtual List<ArticleType> AllowedArticleTypes { get; set; }

		[LookupProperty(Shared = true)]
		public virtual string Color { get; set; }

		public OrderCategory()
		{
			AllowPositiveQuantities = true;
			Color = "#AAAAAA";
		}
	}
}