namespace Crm.Service.Services
{
	using System;
	using System.Collections.Generic;
	using System.Linq;

	using AutoMapper;

	using Crm.Article.Services.Interfaces;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Model;
	using Crm.Library.Rest;
	using Crm.Library.Services;
	using Crm.Library.Services.Interfaces;
	using Crm.Service.Model;
	using Crm.Service.Rest.Model;
	using Crm.Service.Services.Interfaces;

	using NHibernate.Linq;

	public class ServiceOrderMaterialSyncService : DefaultSyncService<ServiceOrderMaterial, ServiceOrderMaterialRest, Guid>
	{
		private readonly IArticleService articleService;
		private readonly IPositionNumberingService positionNumberingService;
		private readonly ISyncService<ServiceOrderHead> serviceOrderHeadSyncService;
		private readonly IRepositoryWithTypedId<ServiceOrderDispatch, Guid> serviceOrderDispatchRepository;

		public ServiceOrderMaterialSyncService(IRepositoryWithTypedId<ServiceOrderMaterial, Guid> repository,
			RestTypeProvider restTypeProvider,
			IRestSerializer restSerializer,
			IArticleService articleService,
			IPositionNumberingService positionNumberingService,
			IMapper mapper,
			ISyncService<ServiceOrderHead> serviceOrderHeadSyncService,
			IRepositoryWithTypedId<ServiceOrderDispatch, Guid> serviceOrderDispatchRepository)
			: base(repository, restTypeProvider, restSerializer, mapper)
		{
			this.articleService = articleService;
			this.positionNumberingService = positionNumberingService;
			this.serviceOrderHeadSyncService = serviceOrderHeadSyncService;
			this.serviceOrderDispatchRepository = serviceOrderDispatchRepository;
		}
		public override Type[] SyncDependencies
		{
			get { return new[] { typeof(ServiceOrderHead), typeof(ServiceOrderDispatch), typeof(ServiceOrderTime) }; }
		}
		public override IQueryable<ServiceOrderMaterial> GetAll(User user, IDictionary<string, int?> groups)
		{
			var serviceOrders = serviceOrderHeadSyncService.GetAll(user, groups);
			return repository.GetAll()
				.Where(x => serviceOrders.Any(y => y.Id == x.OrderId));
		}
		public override ServiceOrderMaterial Save(ServiceOrderMaterial entity)
		{
			var article = entity.ArticleId.HasValue ? articleService.GetArticle(entity.ArticleId.Value) : null;
			if (article != null)
			{
				entity.IsSerial = article.IsSerial;
				entity.QuantityUnitKey = article.QuantityUnitKey;
				entity.ArticleTypeKey = article.ArticleTypeKey;
			}
			if (string.IsNullOrWhiteSpace(entity.PosNo))
			{
				entity.PosNo = positionNumberingService.GetNextPositionNumber(entity.OrderId);
			}
			entity.FromLocation = entity.FromLocation;
			entity.FromWarehouse = entity.FromWarehouse;
			entity.Price = entity.Price.HasValue || article == null ? entity.Price : article.Price;

			return base.Save(entity);
		}

		protected override bool IsStale(ServiceOrderMaterialRest restEntity)
		{
			if (!restEntity.DispatchId.HasValue)
			{
				return false;
			}

			var dispatch = serviceOrderDispatchRepository.Get(restEntity.DispatchId.Value);
			if (dispatch == null)
			{
				return true;
			}

			return false;
		}
		public override IQueryable<ServiceOrderMaterial> Eager(IQueryable<ServiceOrderMaterial> entities)
		{
			return entities.Fetch(x => x.ServiceOrderHead);
		}
	}
}
