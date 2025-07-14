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
	using Crm.Model;
	using Crm.Service.Model;
	using Crm.Service.Model.Relationships;

	public class ServiceContractAddressRelationshipSyncService : DefaultSyncService<ServiceContractAddressRelationship, Guid>
	{
		private readonly ISyncService<ServiceContract> serviceContractSyncService;

		public ServiceContractAddressRelationshipSyncService(IRepositoryWithTypedId<ServiceContractAddressRelationship, Guid> repository, RestTypeProvider restTypeProvider, IRestSerializer restSerializer, IMapper mapper, ISyncService<ServiceContract> serviceContractSyncService)
			: base(repository, restTypeProvider, restSerializer, mapper)
		{
			this.serviceContractSyncService = serviceContractSyncService;
		}

		public override Type[] SyncDependencies => new[] { typeof(ServiceContract), typeof(Address) };

		public override IQueryable<ServiceContractAddressRelationship> GetAll(User user, IDictionary<string, int?> groups)
		{
			var serviceContracts = serviceContractSyncService.GetAll(user, groups);
			return repository.GetAll().Where(x => serviceContracts.Any(y => y.Id == x.ParentId));
		}
	}
}
