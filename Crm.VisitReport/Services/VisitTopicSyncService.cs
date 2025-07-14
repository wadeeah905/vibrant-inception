namespace Crm.VisitReport.Services
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
	using Crm.VisitReport.Model;

	public class VisitTopicSyncService : DefaultSyncService<VisitTopic, Guid>
	{
		private readonly ISyncService<Visit> visitSyncService;
		public VisitTopicSyncService(IRepositoryWithTypedId<VisitTopic, Guid> repository, RestTypeProvider restTypeProvider, IRestSerializer restSerializer, IMapper mapper, ISyncService<Visit> visitSyncService)
			: base(repository, restTypeProvider, restSerializer, mapper)
		{
			this.visitSyncService = visitSyncService;
		}
		public override Type[] SyncDependencies => new[] { typeof(Visit) };
		public override IQueryable<VisitTopic> Eager(IQueryable<VisitTopic> entities)
		{
			return entities;
		}
		public override IQueryable<VisitTopic> GetAll(User user, IDictionary<string, int?> groups)
		{
			var visits = visitSyncService.GetAll(user, groups);
			return repository.GetAll()
				.Where(x => visits.Any(y => y.Id == x.VisitKey));
		}
		public override VisitTopic Save(VisitTopic entity)
		{
			repository.SaveOrUpdate(entity);

			return entity;
		}
	}
}
