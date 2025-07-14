namespace Crm.VisitReport.Model.Mappings
{
	using Crm.Library.BaseModel.Mappings;

	using NHibernate.Mapping.ByCode;
	using NHibernate.Mapping.ByCode.Conformist;
	using NHibernate.Type;

	public class VisitMap : SubclassMapping<Visit>
	{
		public VisitMap()
		{
			DiscriminatorValue("Visit");

			Join("Visit", join =>
			{
				join.Schema("CRM");
				join.Key(x => x.Column("ContactKey"));

				join.Property(x => x.AddressId, m => m.Column("AddressKey"));
				join.Property(x => x.PlannedDate);
				join.Property(x => x.PlannedTime);
				join.Property(x => x.PlannedEndDate);
				join.Property(x => x.CustomAim);
				join.Property(x => x.VisitAimKey);
				join.Property(x => x.ContactPerson);
				join.Property(x => x.StatusKey, map => map.Column("Status"));
				join.Property(x => x.PlannedDuration, m => m.Type<TimeAsTimeSpanType>());

				join.EntitySet(x => x.ContactPersonRelationships, m =>
				{
					m.Schema("CRM");
					m.Table("BusinessRelationship");
					m.Key(km => km.Column("ParentCompanyKey"));
					m.Where("((SELECT c.IsActive from CRM.Contact c where c.ContactId = ChildCompanyKey) = 1)");
					m.Inverse(true);
				}, action => action.OneToMany());

				join.EntitySet(x => x.Topics,
					m =>
					{
						m.Schema("CRM");
						m.Table("VisitTopic");
						m.Key(km => km.Column("VisitKey"));
						m.Inverse(true);
                        m.OrderBy(x => x.CreateDate);
					},
					a => a.OneToMany());

				join.EntitySet(x => x.VisitReports, map =>
				{
					map.Key(km => km.Column("VisitId"));
					map.Fetch(CollectionFetchMode.Select);
					map.Lazy(CollectionLazy.Lazy);
					map.Cascade(Cascade.Persist);
					map.Inverse(true);
				}, action => action.OneToMany());

				join.ManyToOne(x => x.Address, m =>
				{
					m.Column("AddressKey");
					m.Insert(false);
					m.Update(false);
				});
			});
		}
	}
}