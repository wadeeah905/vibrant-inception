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

	using NHibernate.Linq;

	public class ServiceOrderMaterialSerialSyncService : DefaultSyncService<ServiceOrderMaterialSerial, Guid>
	{
		private readonly ISyncService<ServiceOrderMaterial> serviceOrderMaterialSyncService;
		public ServiceOrderMaterialSerialSyncService(IRepositoryWithTypedId<ServiceOrderMaterialSerial, Guid> repository, RestTypeProvider restTypeProvider, IRestSerializer restSerializer, IMapper mapper,ISyncService<ServiceOrderMaterial> serviceOrderMaterialSyncService)
			: base(repository, restTypeProvider, restSerializer, mapper)
		{
			this.serviceOrderMaterialSyncService = serviceOrderMaterialSyncService;
		}
		public override Type[] SyncDependencies
		{
			get { return new[] { typeof(ServiceOrderMaterial) }; }
		}
		public override IQueryable<ServiceOrderMaterialSerial> GetAll(User user, IDictionary<string, int?> groups)
		{	
			var serviceOrderMaterials = serviceOrderMaterialSyncService.GetAll(user, groups);
			return repository.GetAll()
				.Where(x => serviceOrderMaterials.Any(y => y.Id == x.OrderMaterialId));
		}
		public override ServiceOrderMaterialSerial Save(ServiceOrderMaterialSerial entity)
		{
			repository.SaveOrUpdate(entity);
			return entity;
		}
		public override IQueryable<ServiceOrderMaterialSerial> Eager(IQueryable<ServiceOrderMaterialSerial> entities)
		{
			return entities
				.Fetch(x => x.ServiceOrderMaterial)
				.ThenFetch(x => x.ServiceOrderHead);
		}
	}
}
