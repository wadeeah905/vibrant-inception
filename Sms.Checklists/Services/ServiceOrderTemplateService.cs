namespace Sms.Checklists.Services
{
	using System;
	using System.Linq;

	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Helper;
	using Crm.Service;
	using Crm.Service.Enums;
	using Crm.Service.Model;
	using Crm.Service.Model.Relationships;
	using Crm.Service.Services.Interfaces;

	using Sms.Checklists.Model;

	public class ServiceOrderTemplateService : IServiceOrderTemplateService
	{
		private readonly IRepositoryWithTypedId<ServiceOrderChecklist, Guid> serviceOrderChecklistRepository;
		private readonly Func<ServiceOrderChecklist> serviceOrderChecklistFactory;
		private readonly IAppSettingsProvider appSettingsProvider;

		public ServiceOrderTemplateService(IRepositoryWithTypedId<ServiceOrderChecklist, Guid> serviceOrderChecklistRepository, Func<ServiceOrderChecklist> serviceOrderChecklistFactory, IAppSettingsProvider appSettingsProvider)
		{
			this.serviceOrderChecklistRepository = serviceOrderChecklistRepository;
			this.serviceOrderChecklistFactory = serviceOrderChecklistFactory;
			this.appSettingsProvider = appSettingsProvider;
		}

		public virtual int Priority => 200;

		public virtual ServiceOrderChecklist CreateServiceOrderChecklistFromTemplate(ServiceOrderChecklist serviceOrderChecklistTemplate)
		{
			var serviceOrderChecklist = serviceOrderChecklistFactory();
			serviceOrderChecklist.DynamicFormKey = serviceOrderChecklistTemplate.DynamicFormKey;
			serviceOrderChecklist.ExtensionValues = serviceOrderChecklistTemplate.ExtensionValues;
			serviceOrderChecklist.Id = Guid.NewGuid();
			serviceOrderChecklist.RequiredForServiceOrderCompletion = serviceOrderChecklistTemplate.RequiredForServiceOrderCompletion;
			serviceOrderChecklist.SendToCustomer = serviceOrderChecklistTemplate.SendToCustomer;
			return serviceOrderChecklist;
		}

		public virtual void CreateTemplateData(ServiceOrderHead serviceOrder, ServiceOrderHead serviceOrderTemplate, Installation installation, ServiceContractInstallationRelationship relationship = null)
		{
			var maintenanceOrderGenerationMode = appSettingsProvider.GetValue(ServicePlugin.Settings.ServiceContract.MaintenanceOrderGenerationMode);
			var serviceOrderChecklistTemplates = serviceOrderChecklistRepository.GetAll().Where(x => x.ReferenceKey == serviceOrderTemplate.Id);
			foreach (var serviceOrderChecklistTemplate in serviceOrderChecklistTemplates)
			{
				if (serviceOrderChecklistTemplate.ServiceOrderTimeKey == null && maintenanceOrderGenerationMode == MaintenanceOrderGenerationMode.JobPerInstallation && installation != null)
				{
					continue;
				}

				if (serviceOrderChecklistTemplate.ServiceOrderTimeKey != null && maintenanceOrderGenerationMode == MaintenanceOrderGenerationMode.JobPerInstallation && installation == null)
				{
					continue;
				}

				var serviceOrderChecklist = CreateServiceOrderChecklistFromTemplate(serviceOrderChecklistTemplate);
				serviceOrderChecklist.ReferenceKey = serviceOrder.Id;
				if (serviceOrderChecklistTemplate.ServiceOrderTimeKey != null)
				{
					serviceOrderChecklist.ServiceOrderTimeKey = serviceOrder.ServiceOrderTimes.Single(x => x.PosNo == serviceOrderChecklistTemplate.ServiceOrderTime.PosNo && x.InstallationId == installation?.Id).Id;
				}

				serviceOrder.GetExtension<ServiceOrderExtension>().ServiceOrderChecklists.Add(serviceOrderChecklist);
			}
		}
	}
}