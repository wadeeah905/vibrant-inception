using Crm.Article.Model;
using Crm.Library.BaseModel;

namespace Customer.Kagema.Model.Extensions
{
	public class KagemaArticleExtension: EntityExtension<Article>
	{
	public virtual bool lumpsum { get; set; }
		public virtual string VendorNo { get; set; }
		public virtual string ShelfNo { get; set; }
		public virtual string DisplayDescription { get; set; }

	}
}
