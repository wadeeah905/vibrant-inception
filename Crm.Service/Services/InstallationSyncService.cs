namespace Crm.Service.Services
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
	using Crm.Service.Model;

	using NHibernate.Linq;

	public class InstallationSyncService : DefaultSyncService<Installation, Guid>
	{
		private readonly IVisibilityProvider visibilityProvider;
		public InstallationSyncService(
			IRepositoryWithTypedId<Installation, Guid> repository,
			RestTypeProvider restTypeProvider,
			IRestSerializer restSerializer,
			IMapper mapper,
			IVisibilityProvider visibilityProvider)
			: base(repository, restTypeProvider, restSerializer, mapper)
		{
			this.visibilityProvider = visibilityProvider;
		}

		public override Type[] SyncDependencies => new[] { typeof(Company), typeof(Person), typeof(Address) };

		public override IQueryable<Installation> GetAll(User user)
		{
			return visibilityProvider.FilterByVisibility(repository.GetAll());
		}
		public override IQueryable<Installation> Eager(IQueryable<Installation> entities)
		{
			return entities
				.Fetch(x => x.ServiceObject)
				.Fetch(x => x.LocationAddress)
				.Fetch(x => x.LocationCompany);
		}
	}
}
