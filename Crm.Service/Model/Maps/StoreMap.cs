namespace Crm.Service.Model.Maps
{
	using Crm.Library.BaseModel.Mappings;
	using NHibernate.Mapping.ByCode;
	using System;

	public class StoreMap : EntityClassMapping<Store>
	{
		public StoreMap()
		{
			Schema("SMS");
			Table("Store");

			Id(a => a.Id, m =>
			{
				m.Column("StoreId");
				m.Generator(LMobile.Unicore.NHibernate.GuidCombGeneratorDef.Instance);
				m.UnsavedValue(Guid.Empty);
			});

			Property(x => x.StoreNo);
			Property(x => x.Name);
			Property(x => x.LegacyId);

			this.EntitySet(x => x.Locations, map =>
			{
				map.Key(km => km.Column("StoreId"));
				map.Fetch(CollectionFetchMode.Select);
				map.Lazy(CollectionLazy.Lazy);
				map.Cascade(Cascade.Persist);
				map.Inverse(true);
			}, action => action.OneToMany());
		}
	}
}