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

	public class ServiceContractSyncService : DefaultSyncService<ServiceContract, Guid>
	{
		private readonly IVisibilityProvider visibilityProvider;
		public ServiceContractSyncService(
			IRepositoryWithTypedId<ServiceContract, Guid> repository,
			RestTypeProvider restTypeProvider,
			IRestSerializer restSerializer,
			IMapper mapper,
			IVisibilityProvider visibilityProvider)
			: base(repository, restTypeProvider, restSerializer, mapper)
		{
			this.visibilityProvider = visibilityProvider;
		}
		public override Type[] SyncDependencies => new[] { typeof(ServiceObject), typeof(Company), typeof(Address)};

		public override IQueryable<ServiceContract> GetAll(User user)
		{
			return visibilityProvider.FilterByVisibility(repository.GetAll());
		}
		public override IQueryable<ServiceContract> Eager(IQueryable<ServiceContract> entities)
		{
			return entities
				.FetchMany(x => x.Installations)
				.ThenFetch(x => x.Child)
				.Fetch(x => x.InvoiceAddress)
				.Fetch(x => x.Parent)
				.Fetch(x => x.ServiceObject);
		}
	}
}