namespace Crm.VisitReport.Services
{
	using System;
	using System.Linq;

	using AutoMapper;

	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Model;
	using Crm.Library.Rest;
	using Crm.Library.Services;
	using Crm.Library.Services.Interfaces;
	using Crm.Model;
	using Crm.VisitReport.Model;

	using NHibernate.Linq;

	public class VisitSyncService : DefaultSyncService<Visit, Guid>
	{
		private readonly IVisibilityProvider visibilityProvider;
		public VisitSyncService(
			IRepositoryWithTypedId<Visit, Guid> repository,
			RestTypeProvider restTypeProvider,
			IRestSerializer restSerializer,
			IMapper mapper,
			IVisibilityProvider visibilityProvider)
			: base(repository, restTypeProvider, restSerializer, mapper)
		{
			this.visibilityProvider = visibilityProvider;
		}
		public override Type[] SyncDependencies => new[] { typeof(Address), typeof(Company) };
		public override IQueryable<Visit> GetAll(User user)
		{
			return visibilityProvider.FilterByVisibility(repository.GetAll());
		}
		public override IQueryable<Visit> Eager(IQueryable<Visit> entities)
		{
			entities = entities.Fetch(x => x.Parent);
			return entities;
		}
	}
}