namespace Crm.VisitReport.Services
{
	using System;
	using System.Linq;

	using AutoMapper;

	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Model;
	using Crm.Library.Rest;
	using Crm.Library.Services;
	using Crm.Model;
	using Crm.VisitReport.Model;
	using Crm.VisitReport.Model.Relationships;

	public class ContactPersonRelationshipSyncService : DefaultSyncService<ContactPersonRelationship, Guid>
	{
		public ContactPersonRelationshipSyncService(IRepositoryWithTypedId<ContactPersonRelationship, Guid> repository, RestTypeProvider restTypeProvider, IRestSerializer restSerializer, IMapper mapper)
			: base(repository, restTypeProvider, restSerializer, mapper)
		{
		}
		public override Type[] SyncDependencies => new[] { typeof(Person), typeof(Visit) };
		public override IQueryable<ContactPersonRelationship> GetAll(User user)
		{
			return repository.GetAll().Where(x => x.Parent.IsActive && x.Child.IsActive && x.Child.ContactType == "Person" && x.Parent.ContactType == "Visit");
		}
		public override ContactPersonRelationship Save(ContactPersonRelationship entity)
		{
			return repository.SaveOrUpdate(entity);
		}
	}
}