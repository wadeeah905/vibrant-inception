namespace Crm.Service.Services
{
	using System;
	using System.Collections.Generic;
	using System.Linq;

	using AutoMapper;

	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Model;
	using Crm.Library.Rest;
	using Crm.Library.Services;
	using Crm.Library.Services.Interfaces;
	using Crm.Service.Model;
	using Crm.Service.Model.Relationships;

	using NHibernate.Linq;

	public class ServiceContractInstallationRelationshipSyncService : DefaultSyncService<ServiceContractInstallationRelationship, Guid>
	{
		private readonly ISyncService<ServiceContract> serviceContractSyncService;
		public ServiceContractInstallationRelationshipSyncService(IRepositoryWithTypedId<ServiceContractInstallationRelationship, Guid> repository, RestTypeProvider restTypeProvider, IRestSerializer restSerializer, IMapper mapper, ISyncService<ServiceContract> serviceContractSyncService)
			: base(repository, restTypeProvider, restSerializer, mapper)
		{
			this.serviceContractSyncService = serviceContractSyncService;
		}

		public override Type[] SyncDependencies => new[] { typeof(ServiceContract), typeof(Installation) };

		public override IQueryable<ServiceContractInstallationRelationship> GetAll(User user, IDictionary<string, int?> groups)
		{
			var serviceContracts = serviceContractSyncService.GetAll(user, groups);
			return repository.GetAll().Where(x => serviceContracts.Any(y => y.Id == x.ParentId));
		}
		public override IQueryable<ServiceContractInstallationRelationship> Eager(IQueryable<ServiceContractInstallationRelationship> entities)
		{
			entities = entities.Fetch(x => x.Parent);

			entities = entities
				.Fetch(x => x.Child)
				.ThenFetch(x => x.ServiceObject);
			entities = entities
				.Fetch(x => x.Child)
				.ThenFetch(x => x.LocationCompany);
			entities = entities
				.Fetch(x => x.Child)
				.ThenFetch(x => x.Parent);
			return entities;
		}
	}
}
