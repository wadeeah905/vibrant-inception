namespace Crm.Service.Services
{
	using System;

	using Crm.Article.Services.Interfaces;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Model.Site;
	using Crm.Library.Globalization.Resource;
	using Crm.Model.Enums;
	using Crm.Model.Notes;
	using Crm.Service.Model;
	using Crm.Service.Services.Interfaces;
	using Crm.Model;

	public class NoteHandlingService : INoteHandlingService
	{
		// Members
		private readonly IInstallationService installationService;
		private readonly IArticleService articleService;
		private readonly IRepositoryWithTypedId<Installation, Guid> installationRepository;
		private readonly IRepositoryWithTypedId<ServiceOrderHead, Guid> serviceOrderRepository;
		private readonly IRepositoryWithTypedId<ServiceOrderMaterial, Guid> serviceOrderMaterialRepository;
		private readonly IRepositoryWithTypedId<ServiceOrderTime, Guid> serviceOrderTimeRepository;
		private readonly IRepositoryWithTypedId<Note, Guid> noteRepository;
		private readonly Site site;
		private readonly IResourceManager resourceManager;
		private readonly Func<UserNote> userNoteFactory;

		// Methods
		public virtual void AddNoteAfterAddingDeletingDoc(string fileName, Guid referenceKey, int referenceType, string userName, string localePrefix)
		{
			Guid? contactKey = null;
			string noteText = null;
			switch (referenceType)
			{
				case (int)ReferenceType.Installation:
					var installationHead = installationRepository.Get(referenceKey);
					if (installationHead != null)
					{
						contactKey = installationHead.Id;
						noteText = string.Format(resourceManager.GetTranslation(localePrefix + "Installation", site.GetExtension<DomainExtension>().DefaultLanguageKey), fileName, installationHead.InstallationNo);
					}
					break;
				case (int)ReferenceType.ServiceOrder:
					var orderHead = serviceOrderRepository.Get(referenceKey);
					if (orderHead != null)
					{
						contactKey = orderHead.Id;
						noteText = string.Format(resourceManager.GetTranslation(localePrefix + "ServiceOrder", site.GetExtension<DomainExtension>().DefaultLanguageKey), fileName, orderHead.OrderNo);
					}
					break;
				case (int)ReferenceType.InstallationMaterial:
					var installationPos = installationService.GetInstallationPosition(referenceKey);
					installationHead = (installationPos != null) ? installationRepository.Get(installationPos.InstallationId) : null;
					if (installationHead != null)
					{
						contactKey = installationHead.Id;
						noteText = string.Format(resourceManager.GetTranslation(localePrefix + "InstallationPos", site.GetExtension<DomainExtension>().DefaultLanguageKey), fileName, installationPos.ItemNo + " - " + installationPos.Description, installationPos.InstallationId);
					}
					break;
				case (int)ReferenceType.ServiceOrderMaterial:
					var orderMaterial = serviceOrderMaterialRepository.Get(referenceKey);
					orderHead = orderMaterial?.ServiceOrderHead;
					if (orderHead != null)
					{
						contactKey = orderHead.Id;
						noteText = string.Format(resourceManager.GetTranslation(localePrefix + "ServiceOrderMaterial", site.GetExtension<DomainExtension>().DefaultLanguageKey), fileName, orderMaterial.ItemNo + " - " + orderMaterial.Description, orderHead.OrderNo);
					}
					break;
				case (int)ReferenceType.ServiceOrderTime:
					var orderTime = serviceOrderTimeRepository.Get(referenceKey);
					orderHead = orderTime?.ServiceOrderHead;
					if (orderHead != null)
					{
						contactKey = orderHead.Id;
						noteText = string.Format(resourceManager.GetTranslation(localePrefix + "ServiceOrderTime", site.GetExtension<DomainExtension>().DefaultLanguageKey), fileName, orderTime.ItemNo + " - " + orderTime.Description, orderHead.OrderNo);
					}
					break;
				case (int)ReferenceType.Article:
					var article = articleService.GetArticle(referenceKey);
					if (article != null)
					{
						contactKey = article.Id;
						noteText = string.Format(resourceManager.GetTranslation(localePrefix + "Article", site.GetExtension<DomainExtension>().DefaultLanguageKey), fileName, article.ItemNo);
					}
					break;

				case (int)ReferenceType.QualityPlan:
				case (int)ReferenceType.RdsPp:
					//no notes can be assigned
					break;

				case (int)ReferenceType.ServiceCase:
				case (int)ReferenceType.ScannedValue:
				case (int)ReferenceType.ErrorCode:
					//no docs can be assigned
					break;
			}

			if (contactKey.HasValue)
			{
				var note = userNoteFactory();
				note.IsActive = true;
				note.ContactId = contactKey;
				note.CreateUser = userName;
				note.Text = noteText;
				note.Plugin = "Crm.Service";
				noteRepository.SaveOrUpdate(note);
			}
		}

		// Constructor
		public NoteHandlingService(
			IInstallationService installationService,
			IArticleService articleService,
			IRepositoryWithTypedId<ServiceOrderHead, Guid> serviceOrderRepository,
			IRepositoryWithTypedId<Installation, Guid> installationRepository,
			IRepositoryWithTypedId<ServiceOrderTime, Guid> serviceOrderTimeRepository,
			IRepositoryWithTypedId<ServiceOrderMaterial, Guid> serviceOrderMaterialRepository, 
			IRepositoryWithTypedId<Note, Guid> noteRepository,
			Site site,
			IResourceManager resourceManager,
			Func<UserNote> userNoteFactory)
		{
			this.installationService = installationService;
			this.articleService = articleService;
			this.serviceOrderRepository = serviceOrderRepository;
			this.installationRepository = installationRepository;
			this.serviceOrderMaterialRepository = serviceOrderMaterialRepository;
			this.noteRepository = noteRepository;
			this.site = site;
			this.resourceManager = resourceManager;
			this.userNoteFactory = userNoteFactory;
			this.serviceOrderTimeRepository = serviceOrderTimeRepository;
		}
	}
}
