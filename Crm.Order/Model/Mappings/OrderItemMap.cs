namespace Crm.Order.Model.Mappings
{
	using System;

	using Crm.Library.BaseModel.Mappings;

	using NHibernate.Mapping.ByCode;

	public class OrderItemMap : EntityClassMapping<OrderItem>
	{
		public OrderItemMap()
		{
			Schema("CRM");
			Table("OrderItem");

			Id(x => x.Id,
				m =>
				{
					m.Column("OrderItemId");
					m.Generator(LMobile.Unicore.NHibernate.GuidCombGeneratorDef.Instance);
					m.UnsavedValue(Guid.Empty);
				});

			Property(x => x.OrderId,
				m =>
				{
					m.Column("OrderKey");
					m.NotNullable(true);
				});
			Property(x => x.Position);
			Property(x => x.ArticleId, m => m.Column("ArticleKey"));
			Property(x => x.ArticleNo);
			Property(x => x.ArticleDescription);
			Property(x => x.CustomDescription);
			Property(x => x.CustomArticleNo);
			Property(x => x.AdditionalInformation);
			Property(x => x.QuantityValue);
			Property(x => x.QuantityUnitKey);
			Property(x => x.DeliveryDate);
			Property(x => x.IsAlternative);
			Property(x => x.IsCarDump);
			Property(x => x.IsOption);
			Property(x => x.IsSample);
			Property(x => x.IsSerial);
			Property(x => x.IsRemoval);
			Property(x => x.IsAccessory);
			Property(x => x.LegacyId);
			Property(x => x.Price);
			Property(x => x.PurchasePrice);
            Property(x => x.Discount);
			Property(x => x.DiscountType);
			Property(x => x.ModifyDate);
			Property(x => x.IsActive);
			Property(x => x.ParentOrderItemId, m => m.Column("ParentOrderItemKey"));

			ManyToOne(x => x.Article, m =>
			{
				m.Fetch(FetchKind.Select);
				m.Lazy(LazyRelation.Proxy);
				m.Column("ArticleKey");
				m.Update(false);
				m.Insert(false);
			});
		}
	}
}