namespace Sms.Checklists.Model.Mappings
{
	using NHibernate.Mapping.ByCode;
	using NHibernate.Mapping.ByCode.Conformist;

	public class ServiceOrderChecklistMap : SubclassMapping<ServiceOrderChecklist>
	{
		public ServiceOrderChecklistMap()
		{
			DiscriminatorValue("ServiceOrderChecklist");

			ManyToOne(x => x.ServiceOrder, m =>
			{
				m.Column("ReferenceKey");
				m.Insert(false);
				m.Update(false);
				m.Fetch(FetchKind.Select);
				m.Lazy(LazyRelation.Proxy);
			});

			Join("ServiceOrderChecklist", join =>
			{
				join.Schema("SMS");
				join.Key(a =>
				{
					a.Column("DynamicFormReferenceKey");
					a.NotNullable(true);
				});

				join.Property(x => x.RequiredForServiceOrderCompletion);
				join.Property(x => x.SendToCustomer);

				join.Property(x => x.ServiceOrderTimeKey);
				join.ManyToOne(x => x.ServiceOrderTime, m =>
				{
					m.Column("ServiceOrderTimeKey");
					m.Insert(false);
					m.Update(false);
					m.Fetch(FetchKind.Select);
					m.Lazy(LazyRelation.Proxy);
					m.Cascade(Cascade.None);
				});
				join.Property(x => x.DispatchId);
				join.ManyToOne(x => x.Dispatch, m =>
				{
					m.Column("DispatchId");
					m.Insert(false);
					m.Update(false);
					m.Fetch(FetchKind.Select);
					m.Lazy(LazyRelation.Proxy);
					m.Cascade(Cascade.None);
				});
			});
		}
	}
}