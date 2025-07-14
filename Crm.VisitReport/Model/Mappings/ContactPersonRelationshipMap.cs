namespace Crm.VisitReport.Model.Mappings
{
	using System;

	using Crm.Library.BaseModel.Mappings;
	using Crm.VisitReport.Model.Relationships;

	using NHibernate.Mapping.ByCode;

	public class ContactPersonRelationshipMap : EntityClassMapping<ContactPersonRelationship>
	{
		public ContactPersonRelationshipMap()
		{
			Schema("CRM");
			Table("BusinessRelationship");

			Id(x => x.Id, m =>
			{
				m.Column("BusinessRelationshipId");
				m.Generator(LMobile.Unicore.NHibernate.GuidCombGeneratorDef.Instance);
				m.UnsavedValue(Guid.Empty);
			});

			Property(x => x.ParentId, m => m.Column("ParentCompanyKey"));
			ManyToOne(x => x.Parent, m =>
			{
				m.Column("ParentCompanyKey");
				m.Insert(false);
				m.Update(false);
				m.Lazy(LazyRelation.Proxy);
			});
			Property(x => x.ChildId, m => m.Column("ChildCompanyKey"));
			ManyToOne(x => x.Child, m =>
			{
				m.Column("ChildCompanyKey");
				m.Insert(false);
				m.Update(false);
				m.Lazy(LazyRelation.Proxy);
			});
			Property(x => x.RelationshipTypeKey, m => m.Column("RelationshipType"));
			Property(x => x.Information);
			Where("(SELECT c.ContactType FROM CRM.Contact c WHERE c.ContactId = ChildCompanyKey AND c.IsActive = 1) = 'Person'");
		}
	}
}