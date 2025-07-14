namespace Crm.Service.Services
{
	using System;
	using System.Collections.Generic;
	using System.Linq;

	using AutoMapper;

	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Extensions;
	using Crm.Library.Globalization.Lookup;
	using Crm.Library.Helper;
	using Crm.Library.Model;
	using Crm.Library.Rest;
	using Crm.Library.Services;
	using Crm.Library.Services.Interfaces;
	using Crm.Model;
	using Crm.Model.Lookups;
	using Crm.Service.Model;
	using Crm.Service.Model.Extensions;
	using Crm.Service.Model.Lookup;
	using Crm.Service.Rest.Model;

	using NHibernate.Linq;
	using ServiceObject = Model.ServiceObject;

	public class ServiceOrderHeadSyncService : DefaultSyncService<ServiceOrderHead, ServiceOrderHeadRest, Guid>
	{
		private readonly ILookupManager lookupManager;
		private readonly IVisibilityProvider visibilityProvider;
		private readonly IAppSettingsProvider appSettingsProvider;
		public static string ClosedServiceOrderHistory = "ClosedServiceOrderHistory";
		public ServiceOrderHeadSyncService(
			IRepositoryWithTypedId<ServiceOrderHead, Guid> repository,
			RestTypeProvider restTypeProvider,
			IRestSerializer restSerializer,
			ILookupManager lookupManager,
			IMapper mapper,
			IVisibilityProvider visibilityProvider,
			IAppSettingsProvider appSettingsProvider)
			: base(repository, restTypeProvider, restSerializer, mapper)
		{
			this.lookupManager = lookupManager;
			this.visibilityProvider = visibilityProvider;
			this.appSettingsProvider = appSettingsProvider;
		}

		protected virtual string[] SyncedStatusKeys => new[]
		{
			ServiceOrderStatus.NewKey,
			ServiceOrderStatus.ReadyForSchedulingKey,
			ServiceOrderStatus.ScheduledKey,
			ServiceOrderStatus.PartiallyReleasedKey,
			ServiceOrderStatus.ReleasedKey,
			ServiceOrderStatus.InProgressKey,
			ServiceOrderStatus.PartiallyCompletedKey,
			ServiceOrderStatus.CompletedKey,
			ServiceOrderStatus.PostProcessingKey,
			ServiceOrderStatus.ReadyForInvoiceKey,
			ServiceOrderStatus.InvoicedKey
		};

		public override Type[] SyncDependencies => new[] 
		{
			typeof(Company),
			typeof(Person),
			typeof(ServiceObject),
			typeof(Installation)
		};

		public override IQueryable<ServiceOrderHead> GetAll(User user, IDictionary<string, int?> groups)
		{
			var historySyncPeriod = groups == null ? 0 : ((groups.ContainsKey(ClosedServiceOrderHistory) ? groups[ClosedServiceOrderHistory] : null) ?? lookupManager.Get<ReplicationGroup>(ClosedServiceOrderHistory)?.DefaultValue ?? 0);
			var historySince = DateTime.UtcNow.AddDays(-1 * historySyncPeriod);
			var query = repository
					.GetAll()
					.Where(x => x.IsTemplate || SyncedStatusKeys.Contains(x.StatusKey) || x.Closed.HasValue && (historySyncPeriod == 0 || x.Closed.Value >= historySince));
			return visibilityProvider.FilterByVisibility(query);
		}
		public override ServiceOrderHead Save(ServiceOrderHead entity)
		{
			var persistedEntity = repository.Get(entity.OrderNo);
			if (entity.Id.IsDefault() && persistedEntity != null)
			{
				entity.Id = persistedEntity.Id;
			}

			return base.Save(entity);
		}
		protected override bool IsStale(ServiceOrderHeadRest serviceOrderHeadRest)
		{
			var persistedServiceOrderHead = repository.Get(serviceOrderHeadRest.OrderNo);
			if (persistedServiceOrderHead == null)
			{
				return false;
			}
			var serviceOrderHeadRestStatus = lookupManager.Get<ServiceOrderStatus>(serviceOrderHeadRest.StatusKey);
			var persistedServiceOrderStatus = lookupManager.Get<ServiceOrderStatus>(persistedServiceOrderHead.StatusKey);

			return persistedServiceOrderStatus.SortOrder > serviceOrderHeadRestStatus.SortOrder;
		}
		public override IQueryable<ServiceOrderHead> Eager(IQueryable<ServiceOrderHead> entities)
		{
			entities = entities
						.Fetch(x => x.CustomerContact)
						.Fetch(x => x.ServiceCase)
						.Fetch(x => x.ServiceObject)
						.Fetch(x => x.AffectedInstallation)
						.Fetch(x => x.UserGroup)
						.Fetch(x => x.PreferredTechnicianUsergroup);
			return entities;
		}
	}
}
