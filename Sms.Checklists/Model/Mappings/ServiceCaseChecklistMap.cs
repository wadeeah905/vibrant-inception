namespace Sms.Checklists.Model.Mappings
{
	using NHibernate.Mapping.ByCode;
	using NHibernate.Mapping.ByCode.Conformist;

	public class ServiceCaseChecklistMap : SubclassMapping<ServiceCaseChecklist>
	{
		public ServiceCaseChecklistMap()
		{
			DiscriminatorValue("ServiceCaseChecklist");

			ManyToOne(
				x => x.ServiceCase,
				m =>
				{
					m.Column("ReferenceKey");
					m.Insert(false);
					m.Update(false);
					m.Fetch(FetchKind.Select);
					m.Lazy(LazyRelation.Proxy);
				});
			Join(
				"ServiceCaseChecklist",
				join =>
				{
					join.Schema("SMS");
					join.Key(
						a =>
						{
							a.Column("DynamicFormReferenceKey");
							a.NotNullable(true);
						});
					join.Property(x => x.IsCompletionChecklist);
					join.Property(x => x.IsCreationChecklist);
				});
		}
	}
}