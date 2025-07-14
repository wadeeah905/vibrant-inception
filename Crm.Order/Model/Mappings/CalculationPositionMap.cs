namespace Crm.Order.Model.Mappings
{
	using System;

	using Crm.Library.BaseModel.Mappings;

	using NHibernate.Mapping.ByCode;

	public class CalculationPositionMap : EntityClassMapping<CalculationPosition>
	{
		public CalculationPositionMap()
		{
			Schema("CRM");
			Table("CalculationPosition");

			Id(x => x.Id, m =>
			{
				m.Column("CalculationPositionId");
				m.Generator(LMobile.Unicore.NHibernate.GuidCombGeneratorDef.Instance);
				m.UnsavedValue(Guid.Empty);
			});

			Property(x => x.BaseOrderId,
				m =>
				{
					m.Column("OrderKey");
					m.NotNullable(true);
				});
			Property(x => x.CalculationPositionTypeKey);
			Property(x => x.LegacyId);
			Property(x => x.PurchasePrice);
			Property(x => x.Remark);
			Property(x => x.SalesPrice);
			Property(x => x.IsPercentage);

			ManyToOne(x => x.BaseOrder, m =>
			{
				m.Column("OrderKey");
				m.Insert(false);
				m.Update(false);
				m.Fetch(FetchKind.Select);
				m.Lazy(LazyRelation.Proxy);
			});
		}
	}
}