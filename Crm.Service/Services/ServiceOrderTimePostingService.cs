namespace Crm.Service.Services
{
	using System;
	using System.Collections.Generic;
	using System.Linq;

	using Crm.Article.Services.Interfaces;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Extensions;
	using Crm.Library.Helper;
	using Crm.Service.Extensions;
	using Crm.Service.Enums;
	using Crm.Service.Model;
	using Crm.Service.Model.Extensions;
	using Crm.Service.SearchCriteria;
	using Crm.Service.Services.Interfaces;

	public class ServiceOrderTimePostingService : IServiceOrderTimePostingService
	{
		private readonly IRepositoryWithTypedId<ServiceOrderTime, Guid> serviceOrderTimeRepository;
		private readonly IRepositoryWithTypedId<ServiceOrderMaterial, Guid> serviceOrderMaterialRepository;
		private readonly IRepositoryWithTypedId<ServiceOrderHead, Guid> serviceOrderHeadRepository;
		private readonly IArticleService articleService;
		private readonly IAppSettingsProvider appSettingsProvider;
		private readonly Func<ServiceOrderTime> serviceOrderTimeFactory;
		public ServiceOrderTimePostingService(
			IRepositoryWithTypedId<ServiceOrderTime, Guid> serviceOrderTimeRepository,
			IArticleService articleService,
			Func<ServiceOrderTime> serviceOrderTimeFactory,
			IRepositoryWithTypedId<ServiceOrderMaterial, Guid> serviceOrderMaterialRepository,
			IRepositoryWithTypedId<ServiceOrderHead, Guid> serviceOrderHeadRepository,
			IAppSettingsProvider appSettingsProvider)
		{
			this.serviceOrderTimeRepository = serviceOrderTimeRepository;
			this.serviceOrderHeadRepository = serviceOrderHeadRepository;
			this.articleService = articleService;
			this.serviceOrderTimeFactory = serviceOrderTimeFactory;
			this.serviceOrderMaterialRepository = serviceOrderMaterialRepository;
			this.appSettingsProvider = appSettingsProvider;
		}
		public virtual void SetOrderTimesId(ServiceOrderTimePosting serviceOrderTimePosting)
		{
			if (!appSettingsProvider.GetValue(ServicePlugin.Settings.ServiceOrder.GenerateAndAttachJobsToUnattachedTimePostings)
				|| !serviceOrderTimePosting.OrderTimesId.GetValueOrDefault().IsDefault()
				|| serviceOrderTimePosting.IsPrePlanned())
			{
				return;
			}
			var serviceOrderTimes = serviceOrderTimeRepository.GetAll().Where(x => x.OrderId == serviceOrderTimePosting.OrderId).ToList();
			var serviceOrderTime = serviceOrderTimes.FirstOrDefault(x => x.ArticleId == serviceOrderTimePosting.ArticleId && x.InstallationId == null);
			var serviceOrderMaterials = new List<ServiceOrderMaterial>();
			if (appSettingsProvider.GetValue(ServicePlugin.Settings.PosNoGenerationMethod) == PosNoGenerationMethod.MixedMaterialAndTimes)
			{
				serviceOrderMaterials = serviceOrderMaterialRepository.GetAll().Filter(new ServiceOrderMaterialSearchCriteria { OrderId = serviceOrderTimePosting.OrderId }).ToList();
			}
			int maxPosNo = 0;
			if (serviceOrderTimes.Any())
			{
				maxPosNo = Convert.ToInt32(serviceOrderTimes.OrderBy(t => t.PosNo).Last().PosNo);

				if (appSettingsProvider.GetValue(ServicePlugin.Settings.PosNoGenerationMethod) == PosNoGenerationMethod.MixedMaterialAndTimes && serviceOrderMaterials.Any())
				{
					var materialMaxPosNo = Convert.ToInt32(serviceOrderMaterials.OrderBy(t => t.PosNo).Last().PosNo);
					if (materialMaxPosNo > maxPosNo)
					{
						maxPosNo = materialMaxPosNo;
					}
				}
			}
			else if (appSettingsProvider.GetValue(ServicePlugin.Settings.PosNoGenerationMethod) == PosNoGenerationMethod.MixedMaterialAndTimes && serviceOrderMaterials.Any())
			{
				var materialMaxPosNo = Convert.ToInt32(serviceOrderMaterials.OrderBy(t => t.PosNo).Last().PosNo);
				if (materialMaxPosNo > maxPosNo)
				{
					maxPosNo = materialMaxPosNo;
				}
			}
			if (serviceOrderTime == null)
			{
				var order = serviceOrderHeadRepository.Get(serviceOrderTimePosting.OrderId);
				var article = serviceOrderTimePosting.ArticleId.HasValue ? articleService.GetArticle(serviceOrderTimePosting.ArticleId.Value) : null;
				var posNo = maxPosNo + 1;
				serviceOrderTime = serviceOrderTimeFactory();
				serviceOrderTime.ArticleId = article?.Id;
				serviceOrderTime.ItemNo = serviceOrderTimePosting.ItemNo;
				serviceOrderTime.OrderId = serviceOrderTimePosting.OrderId;
				serviceOrderTime.TrySetLumpSumData(order);
				serviceOrderTime.Description = article?.Description;
				serviceOrderTime.PosNo = posNo.ToString("D4");
				serviceOrderTime.Price = article?.Price;
				serviceOrderTime.Id = Guid.NewGuid();
				serviceOrderTime.AuthData = serviceOrderTimePosting.AuthData != null ? new LMobile.Unicore.EntityAuthData { DomainId = serviceOrderTimePosting.AuthData.DomainId } : null;
				serviceOrderTimeRepository.SaveOrUpdate(serviceOrderTime);
			}
			serviceOrderTimePosting.OrderTimesId = serviceOrderTime.Id;
		}
	}
}
