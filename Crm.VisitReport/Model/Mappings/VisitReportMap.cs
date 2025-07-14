namespace Crm.VisitReport.Model.Mappings
{
	using Crm.VisitReport.Model;

	using NHibernate.Mapping.ByCode;
	using NHibernate.Mapping.ByCode.Conformist;

	public class VisitReportMap : SubclassMapping<VisitReport>
	{
		public VisitReportMap()
		{
			DiscriminatorValue("VisitReport");

			ManyToOne(x => x.Company, m =>
			{
				m.Column("ReferenceKey");
				m.Insert(false);
				m.Update(false);
				m.Fetch(FetchKind.Select);
				m.Lazy(LazyRelation.Proxy);
			});

			Join("VisitReportDynamicFormReference", join =>
			{
				join.Schema("CRM");
				join.Key(a =>
				{
					a.Column("DynamicFormReferenceKey");
					a.NotNullable(true);
				});

				join.Property(x => x.Date);
				join.Property(x => x.ResponsibleUser);
				join.ManyToOne(x => x.ResponsibleUserObject, m =>
				{
					m.Column("ResponsibleUser");
					m.Fetch(FetchKind.Select);
					m.Insert(false);
					m.Update(false);
				});

				join.Property(x => x.VisitId);
				join.ManyToOne(x => x.Visit, m =>
				{
					m.Column("VisitId");
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