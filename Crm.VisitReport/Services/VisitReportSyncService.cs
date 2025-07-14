namespace Crm.VisitReport.Services
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
	using Crm.Model;
	using Crm.VisitReport.Model;

	using NHibernate.Linq;

	public class VisitReportSyncService : DefaultSyncService<VisitReport, Guid>, IDynamicFormReferenceSyncService
	{
		public VisitReportSyncService(IRepositoryWithTypedId<VisitReport, Guid> repository, RestTypeProvider restTypeProvider, IRestSerializer restSerializer, IMapper mapper)
			: base(repository, restTypeProvider, restSerializer, mapper)
		{
		}
		public override Type[] SyncDependencies => new[] { typeof(Company), typeof(Visit) };
		public override IQueryable<VisitReport> GetAll(User user)
		{
			return repository.GetAll()
				.Where(x => x.Company != null && x.Company.IsActive)
				.Where(x => x.Visit == null || x.Visit.IsActive);
		}
		public override VisitReport Save(VisitReport entity)
		{
			repository.Session.Evict(entity);
			var visitReport = repository.Get(entity.Id) ?? entity;
			visitReport.Completed = entity.Completed;
			visitReport.Date = entity.Date;
			visitReport.ResponsibleUser = entity.ResponsibleUser;
			visitReport.VisitId = entity.VisitId;

			repository.SaveOrUpdate(visitReport);
			return visitReport;
		}
		public override void Remove(VisitReport entity)
		{
			repository.Delete(entity);
		}

		public override IQueryable<VisitReport> Eager(IQueryable<VisitReport> entities)
		{
			return entities
				.Fetch(x => x.Company)
				.Fetch(x => x.Visit);
		}

		public virtual IQueryable<DynamicFormReference> GetAllDynamicFormReferences(User user, IDictionary<string, int?> groups)
		{
			return GetAll(user);
		}
	}
}
