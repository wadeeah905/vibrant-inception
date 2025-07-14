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

	public class MaintenancePlanSyncService : DefaultSyncService<MaintenancePlan, Guid>
	{
		private readonly ISyncService<ServiceContract> serviceContractSyncService;

		public override Type[] SyncDependencies => new[] { typeof(ServiceOrderHead) };

		public MaintenancePlanSyncService(IRepositoryWithTypedId<MaintenancePlan, Guid> repository, RestTypeProvider restTypeProvider, IRestSerializer restSerializer, IMapper mapper, ISyncService<ServiceContract> serviceContractSyncService)
			: base(repository, restTypeProvider, restSerializer, mapper)
		{
			this.serviceContractSyncService = serviceContractSyncService;
		}

		public override IQueryable<MaintenancePlan> GetAll(User user, IDictionary<string, int?> groups)
		{
			var serviceContract = serviceContractSyncService.GetAll(user, groups);
			return repository.GetAll()
				.Where(x => serviceContract.Any(y => y.Id == x.ServiceContractId));
		}
	}
}
