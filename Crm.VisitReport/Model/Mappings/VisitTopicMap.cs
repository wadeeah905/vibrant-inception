namespace Crm.VisitReport.Model.Mappings
{
	using System;

	using Crm.Library.BaseModel.Mappings;

	using NHibernate.Mapping.ByCode;

	public class VisitTopicMap : EntityClassMapping<VisitTopic>
	{
		public VisitTopicMap()
		{
			Schema("CRM");
			Table("VisitTopic");

			Id(x => x.Id, m =>
			{
				m.Column("VisitTopicId");
				m.Generator(LMobile.Unicore.NHibernate.GuidCombGeneratorDef.Instance);
				m.UnsavedValue(Guid.Empty);
			});

			Property(x => x.Description, m => m.Length(Int16.MaxValue));
			Property(x => x.Position);
			Property(x => x.Topic, m => m.Length(Int16.MaxValue));
			Property(x => x.VisitKey);

			ManyToOne(x => x.Visit, m =>
			{
				m.Column("VisitKey");
				m.Insert(false);
				m.Update(false);
				m.Lazy(LazyRelation.Proxy);
			});
		}
	}
}