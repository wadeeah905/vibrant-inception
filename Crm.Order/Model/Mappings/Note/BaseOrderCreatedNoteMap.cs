namespace Crm.Order.Model.Mappings.Note
{
	using Crm.Order.Model.Notes;

	using NHibernate.Mapping.ByCode;
	using NHibernate.Mapping.ByCode.Conformist;

	public class BaseOrderCreatedNoteMap : SubclassMapping<BaseOrderCreatedNote>
	{
		public BaseOrderCreatedNoteMap()
		{
			DiscriminatorValue("BaseOrderCreatedNote");
			ManyToOne(x => x.BaseOrder,
				m =>
				{
					m.Column("EntityId");
					m.Fetch(FetchKind.Select);
					m.Insert(false);
					m.Update(false);
				});
		}
	}
}