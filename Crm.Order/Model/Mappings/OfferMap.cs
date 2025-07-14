namespace Crm.Order.Model.Mappings
{
	using NHibernate.Mapping.ByCode.Conformist;

	public class OfferMap : SubclassMapping<Offer>
	{
		public OfferMap()
		{
			DiscriminatorValue("Offer");

			Property(x => x.ValidTo);
			Property(x => x.IsLocked);
			Property(x => x.CancelReasonText);
			Property(x => x.CancelReasonCategoryKey);
		}
	}
}