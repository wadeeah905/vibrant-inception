namespace Crm.Order.Model.Mappings
{
	using NHibernate.Mapping.ByCode.Conformist;

	public class OrderMap : SubclassMapping<Order>
	{
		public OrderMap()
		{
			DiscriminatorValue("Order");

			Property(x => x.OfferId);
		}
	}
}