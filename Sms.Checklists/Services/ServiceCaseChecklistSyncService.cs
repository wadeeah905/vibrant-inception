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

	using Sms.Checklists.Model;

	public class ServiceCaseChecklistSyncService : DefaultSyncService<ServiceCaseChecklist, Guid>, IDynamicFormReferenceSyncService
	{
		private readonly ISyncService<ServiceCase> serviceCaseSyncService;
		public ServiceCaseChecklistSyncService(IRepositoryWithTypedId<ServiceCaseChecklist, Guid> repository, RestTypeProvider restTypeProvider, IRestSerializer restSerializer, IMapper mapper, ISyncService<ServiceCase> serviceCaseSyncService)
			: base(repository, restTypeProvider, restSerializer, mapper)
		{
			this.serviceCaseSyncService = serviceCaseSyncService;
		}
		public override Type[] SyncDependencies
		{
			get { return new[] { typeof(ServiceCase), typeof(FileResource) }; }
		}
		public override IQueryable<ServiceCaseChecklist> GetAll(User user, IDictionary<string, int?> groups)
		{
			var serviceCases = serviceCaseSyncService.GetAll(user, groups);
			return repository.GetAll()
				.Where(x => serviceCases.Any(y => y.Id == x.ReferenceKey));
		}
		public override ServiceCaseChecklist Save(ServiceCaseChecklist entity)
		{
			repository.Session.Evict(entity);
			var serviceCaseChecklist = repository.Get(entity.Id) ?? entity;
			serviceCaseChecklist.Completed = entity.Completed;
			repository.SaveOrUpdate(serviceCaseChecklist);
			return serviceCaseChecklist;
		}
		public override void Remove(ServiceCaseChecklist entity)
		{
			repository.Delete(entity);
		}

		public virtual IQueryable<DynamicFormReference> GetAllDynamicFormReferences(User user, IDictionary<string, int?> groups)
		{
			return GetAll(user, groups);
		}
	}
}
