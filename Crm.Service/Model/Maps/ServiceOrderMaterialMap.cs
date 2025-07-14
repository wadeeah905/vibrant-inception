namespace Crm.Service.Model.Maps
{
	using Crm.Library.BaseModel.Mappings;

	using NHibernate.Cfg.MappingSchema;
	using NHibernate.Mapping.ByCode;

	public class ServiceOrderMaterialMap : EntityClassMapping<ServiceOrderMaterial>
	{
		public ServiceOrderMaterialMap()
		{
			Schema("SMS");
			Table("ServiceOrderMaterial");

			Id(x => x.Id, map =>
				{
					map.Column("id");
					map.Generator(LMobile.Unicore.NHibernate.GuidCombGeneratorDef.Instance);
					map.UnsavedValue(HbmUnsavedValueType.Undefined.ToNullValue());
				});

			Property(x => x.OrderId);
			Property(x => x.PosNo);
			Property(x => x.ItemNo);
			Property(x => x.Description);
			Property(x => x.ArticleTypeKey);
			Property(x => x.EstimatedQty, map => map.Column("EstimatedQuantity"));
			Property(x => x.ActualQty, map => map.Column("ActualQuantity"));
			Property(x => x.InvoiceQty, map => map.Column("InvoiceQuantity"));
			Property(x => x.QuantityUnitKey, map => map.Column("QuantityUnit"));
			Property(x => x.FromLocation, map => map.Column("FromLocationNo"));
			Property(x => x.FromWarehouse);
			Property(x => x.ToLocation, map => map.Column("ToLocationNo"));
			Property(x => x.ToWarehouse);
			Property(x => x.Price, map => map.Column("HourlyRate"));
			Property(x => x.TotalValue);
			Property(x => x.Discount, m => m.Column("DiscountPercent"));
			Property(x => x.DiscountType);
			Property(x => x.Status);
			Property(x => x.TransferDate);
			Property(x => x.BuiltIn);
			Property(x => x.IsSerial);
			Property(x => x.InternalRemark);
			Property(x => x.ExternalRemark);
			Property(x => x.CommissioningStatusKey);
			Property(x => x.ServiceOrderTimeId);
			Property(x => x.ReplenishmentOrderItemId);
			Property(x => x.BatchNo);
			Property(x => x.IsBatch);
			ManyToOne(x => x.ReplenishmentOrderItem, map =>
			{
				map.Column("ReplenishmentOrderItemId");
				map.Fetch(FetchKind.Select);
				map.Lazy(LazyRelation.Proxy);
				map.Cascade(Cascade.None);
				map.Insert(false);
				map.Update(false);
			});
			Property(x => x.IsActive);

			Property(x => x.ArticleId);
			ManyToOne(x => x.Article, map =>
			{
				map.Column("ArticleId");
				map.Fetch(FetchKind.Select);
				map.Lazy(LazyRelation.Proxy);
				map.Cascade(Cascade.None);
				map.Insert(false);
				map.Update(false);
			});
			ManyToOne(x => x.ServiceOrderTime,
				m =>
					{
						m.Column("ServiceOrderTimeId");
						m.Fetch(FetchKind.Select);
						m.Insert(false);
						m.Update(false);
					});
			ManyToOne(x => x.ServiceOrderHead,
				m =>
					{
						m.Column("OrderId");
						m.Fetch(FetchKind.Select);
						m.Insert(false);
						m.Update(false);
					});
			
			Property(x => x.CreatedLocal);
			Property(x => x.DispatchId);
			Property(x => x.SignedByCustomer);

			this.EntitySet(x => x.ServiceOrderMaterialSerials, map =>
			{
				map.Key(km => km.Column("OrderMaterialId"));
				map.Fetch(CollectionFetchMode.Select);
				map.Lazy(CollectionLazy.Lazy);
				map.Cascade(Cascade.Persist);
				map.Inverse(true);
			}, action => action.OneToMany());

			this.EntitySet(x => x.DocumentAttributes, map =>
			{
				map.Key(km => km.Column("ServiceOrderMaterialId"));
				map.Fetch(CollectionFetchMode.Select);
				map.Lazy(CollectionLazy.Lazy);
				map.Cascade(Cascade.None);
				map.Inverse(true);
			}, action => action.OneToMany());
		}
	}
}
