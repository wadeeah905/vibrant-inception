namespace Sms.Checklists.Services
{
	using System;
	using System.Collections.Generic;
	using System.Linq;

	using AutoMapper;

	using Crm.DynamicForms.Model;
	using Crm.DynamicForms.Services;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Model;
	using Crm.Library.Rest;
	using Crm.Library.Services;
	using Crm.Library.Services.Interfaces;
	using Crm.Model;
	using Crm.Service.Model;

	using NHibernate.Linq;

	using Sms.Checklists.Model;

	public class ServiceOrderChecklistSyncService : DefaultSyncService<ServiceOrderChecklist, Guid>, IDynamicFormReferenceSyncService
	{
		private readonly IRepositoryWithTypedId<ServiceOrderDispatch, Guid> serviceOrderDispatchRepository;
		private readonly ISyncService<ServiceOrderHead> serviceOrderHeadSyncService;
		public ServiceOrderChecklistSyncService(IRepositoryWithTypedId<ServiceOrderChecklist, Guid> repository, RestTypeProvider restTypeProvider, IRestSerializer restSerializer, IRepositoryWithTypedId<ServiceOrderDispatch, Guid> serviceOrderDispatchRepository, IMapper mapper, ISyncService<ServiceOrderHead> serviceOrderHeadSyncService)
			: base(repository, restTypeProvider, restSerializer, mapper)
		{
			this.serviceOrderDispatchRepository = serviceOrderDispatchRepository;
			this.serviceOrderHeadSyncService = serviceOrderHeadSyncService;
		}
		public override Type[] SyncDependencies
		{
			get { return new[] { typeof(ServiceOrderHead), typeof(ServiceOrderDispatch), typeof(ServiceOrderTime), typeof(FileResource) }; }
		}
		public override IQueryable<ServiceOrderChecklist> GetAll(User user, IDictionary<string, int?> groups)
		{
			var serviceOrders = serviceOrderHeadSyncService.GetAll(user, groups);
			return repository.GetAll()
				.Where(x => serviceOrders.Any(y => y.Id == x.ReferenceKey));
		}
		public override ServiceOrderChecklist Save(ServiceOrderChecklist entity)
		{
			return repository.SaveOrUpdate(entity);
		}
		public override void Remove(ServiceOrderChecklist entity)
		{
			repository.Delete(entity);
		}
		public override IQueryable<ServiceOrderChecklist> Eager(IQueryable<ServiceOrderChecklist> entities)
		{
			return entities.Fetch(x => x.ServiceOrder);
		}

		public virtual IQueryable<DynamicFormReference> GetAllDynamicFormReferences(User user, IDictionary<string, int?> groups)
		{
			return GetAll(user, groups);
		}
	}
}
