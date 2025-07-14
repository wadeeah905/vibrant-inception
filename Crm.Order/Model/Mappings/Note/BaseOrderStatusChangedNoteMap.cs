namespace Crm.Order.Model.Mappings.Note
{
	using Crm.Order.Model.Notes;

	using NHibernate.Mapping.ByCode;
	using NHibernate.Mapping.ByCode.Conformist;

	public class BaseOrderStatusChangedNoteMap : SubclassMapping<BaseOrderStatusChangedNote>
	{
		public BaseOrderStatusChangedNoteMap()
		{
			DiscriminatorValue("BaseOrderStatusChangedNote");

			ManyToOne(x => x.BaseOrder, map =>
			{
				map.Column("EntityId");

				map.Fetch(FetchKind.Select);
				map.Lazy(LazyRelation.Proxy);
				map.Cascade(Cascade.None);
				map.Update(false);
				map.Insert(false);
			});
		}
	}
}