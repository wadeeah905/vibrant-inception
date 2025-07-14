namespace Sms.Checklists.EventHandler
{
	using System;
	using System.Collections.Generic;
	using System.Linq;

	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Extensions;
	using Crm.Library.Helper;
	using Crm.Library.Modularization.Events;
	using Crm.Service;
	using Crm.Service.Enums;
	using Crm.Service.Model;

	using Sms.Checklists.Model;

	public class ServiceOrderChecklistAttacher : IEventHandler<EntityCreatedEvent<ServiceOrderHead>>, IEventHandler<EntityModifiedEvent<ServiceOrderHead>>, IEventHandler<EntityDeletedEvent<ServiceOrderHead>>, IEventHandler<EntityCreatedEvent<ServiceOrderTime>>, IEventHandler<EntityModifiedEvent<ServiceOrderTime>>, IEventHandler<EntityDeletedEvent<ServiceOrderTime>>
	{
		private readonly IRepositoryWithTypedId<Installation, Guid> installationRepository;
		private readonly IRepositoryWithTypedId<ServiceOrderHead, Guid> serviceOrderHeadRepository;
		private readonly IRepositoryWithTypedId<ServiceOrderChecklist, Guid> serviceOrderChecklistRepository;
		private readonly IRepositoryWithTypedId<ChecklistInstallationTypeRelationship, Guid> checklistInstallationTypeRelationshipRepository;
		private readonly Func<ServiceOrderChecklist> serviceOrderChecklistFactory;
		private readonly IAppSettingsProvider appSettingsProvider;

		public ServiceOrderChecklistAttacher(
			IRepositoryWithTypedId<Installation, Guid> installationRepository,
			IRepositoryWithTypedId<ServiceOrderHead, Guid> serviceOrderHeadRepository,
			IRepositoryWithTypedId<ServiceOrderChecklist, Guid> serviceOrderChecklistRepository,
			IRepositoryWithTypedId<ChecklistInstallationTypeRelationship, Guid> checklistInstallationTypeRelationshipRepository,
			Func<ServiceOrderChecklist> serviceOrderChecklistFactory,
			IAppSettingsProvider appSettingsProvider)
		{
			this.installationRepository = installationRepository;
			this.serviceOrderHeadRepository = serviceOrderHeadRepository;
			this.serviceOrderChecklistRepository = serviceOrderChecklistRepository;
			this.checklistInstallationTypeRelationshipRepository = checklistInstallationTypeRelationshipRepository;
			this.serviceOrderChecklistFactory = serviceOrderChecklistFactory;
			this.appSettingsProvider = appSettingsProvider;
		}

		public virtual void Handle(EntityCreatedEvent<ServiceOrderHead> e)
		{
			if(e.Entity.ServiceOrderTemplateId.HasValue)
			{
				return;
			}
			if (e.Entity.InstallationId.HasValue)
			{
				AttachChecklistsToOrder(e.Entity, e.Entity.InstallationId.Value);
			}
		}
		public virtual void Handle(EntityModifiedEvent<ServiceOrderHead> e)
		{
			if(e.Entity.ServiceOrderTemplateId.HasValue)
			{
				return;
			}
			if (e.Entity.InstallationId.HasValue && !e.EntityBeforeChange.InstallationId.HasValue)
			{
				AttachChecklistsToOrder(e.Entity, e.Entity.InstallationId.Value);
			}
			else if (!e.Entity.InstallationId.HasValue && e.EntityBeforeChange.InstallationId.HasValue)
			{
				RemoveChecklistsFromOrder(e.Entity, e.EntityBeforeChange.InstallationId.Value);
			}
			else if (e.Entity.InstallationId.HasValue && e.EntityBeforeChange.InstallationId.HasValue && e.Entity.InstallationId.Value != e.EntityBeforeChange.InstallationId.Value)
			{
				RemoveChecklistsFromOrder(e.Entity, e.EntityBeforeChange.InstallationId.Value);
				AttachChecklistsToOrder(e.Entity, e.Entity.InstallationId.Value);
			}
		}
		public virtual void Handle(EntityDeletedEvent<ServiceOrderHead> e)
		{
			if(e.Entity.ServiceOrderTemplateId.HasValue)
			{
				return;
			}
			if (e.Entity.InstallationId.HasValue)
			{
				RemoveChecklistsFromOrder(e.Entity, e.Entity.InstallationId.Value);
			}
		}
		public virtual void Handle(EntityCreatedEvent<ServiceOrderTime> e)
		{
			var serviceOrder = serviceOrderHeadRepository.Get(e.Entity.OrderId); 
			if(serviceOrder?.ServiceOrderTemplateId != null)
			{
				return;
			}
			if (e.Entity.InstallationId.HasValue)
			{
				AttachChecklistsToServiceOrderTime(e.Entity, e.Entity.InstallationId.Value);
			}
		}
		public virtual void Handle(EntityModifiedEvent<ServiceOrderTime> e)
		{
			var serviceOrder = serviceOrderHeadRepository.Get(e.Entity.OrderId); 
			if(serviceOrder?.ServiceOrderTemplateId != null)
			{
				return;
			}
			if (e.Entity.InstallationId.HasValue && !e.EntityBeforeChange.InstallationId.HasValue)
			{
				AttachChecklistsToServiceOrderTime(e.Entity, e.Entity.InstallationId.Value);
			}
			else if (!e.Entity.InstallationId.HasValue && e.EntityBeforeChange.InstallationId.HasValue)
			{
				RemoveChecklistsFromServiceOrderTime(e.Entity);
			}
			else if (e.Entity.InstallationId.HasValue && e.EntityBeforeChange.InstallationId.HasValue && e.Entity.InstallationId.Value != e.EntityBeforeChange.InstallationId.Value)
			{
				RemoveChecklistsFromServiceOrderTime(e.Entity);
				AttachChecklistsToServiceOrderTime(e.Entity, e.Entity.InstallationId.Value);
			}
		}
		public virtual void Handle(EntityDeletedEvent<ServiceOrderTime> e)
		{
			if (e.Entity.InstallationId.HasValue)
			{
				RemoveChecklistsFromServiceOrderTime(e.Entity);
			}
		}
		protected virtual void AttachChecklistsToServiceOrderTime(ServiceOrderTime serviceOrderTime, Guid installationId)
		{
			var installation = installationRepository.Get(installationId);
			if (installation == null)
				return;
			var serviceOrderHead = serviceOrderHeadRepository.Get(serviceOrderTime.OrderId);
			var checklistRelationships = GetChecklistsToAttach(installation.InstallationTypeKey, serviceOrderHead.TypeKey);
			foreach (ChecklistInstallationTypeRelationship checklistRelationship in checklistRelationships)
			{
				var serviceOrderChecklist = serviceOrderChecklistFactory();
				serviceOrderChecklist.RequiredForServiceOrderCompletion = checklistRelationship.RequiredForServiceOrderCompletion;
				serviceOrderChecklist.SendToCustomer = checklistRelationship.SendToCustomer;
				serviceOrderChecklist.ServiceOrder = serviceOrderHead;
				serviceOrderChecklist.ServiceOrderTimeKey = serviceOrderTime.Id;
				serviceOrderChecklist.ServiceOrderTime = serviceOrderTime;
				serviceOrderChecklist.DynamicFormKey = checklistRelationship.DynamicFormKey;
				serviceOrderChecklist.DynamicForm = checklistRelationship.DynamicForm;
				serviceOrderChecklist.ReferenceKey = serviceOrderHead.Id;
				serviceOrderChecklistRepository.SaveOrUpdate(serviceOrderChecklist);
			}
		}
		protected virtual void RemoveChecklistsFromServiceOrderTime(ServiceOrderTime serviceOrderTime)
		{
			var checklists = serviceOrderChecklistRepository.GetAll().Where(x => x.ServiceOrderTimeKey == serviceOrderTime.Id);
			foreach (var checklist in checklists)
			{
				serviceOrderChecklistRepository.Delete(checklist);
			}
		}
		protected virtual void AttachChecklistsToOrder(ServiceOrderHead serviceOrderHead, Guid installationId)
		{
			if (appSettingsProvider.GetValue(ServicePlugin.Settings.ServiceContract.MaintenanceOrderGenerationMode) == MaintenanceOrderGenerationMode.JobPerInstallation)
				return;

			var installation = installationRepository.Get(installationId);
			if (installation == null)
				return;
			var checklistRelationships = GetChecklistsToAttach(installation.InstallationTypeKey, serviceOrderHead.TypeKey);
			foreach (ChecklistInstallationTypeRelationship checklistRelationship in checklistRelationships)
			{
				var serviceOrderChecklist = serviceOrderChecklistFactory();
				serviceOrderChecklist.RequiredForServiceOrderCompletion = checklistRelationship.RequiredForServiceOrderCompletion;
				serviceOrderChecklist.SendToCustomer = checklistRelationship.SendToCustomer;
				serviceOrderChecklist.ServiceOrder = serviceOrderHead;
				serviceOrderChecklist.DynamicFormKey = checklistRelationship.DynamicFormKey;
				serviceOrderChecklist.DynamicForm = checklistRelationship.DynamicForm;
				serviceOrderChecklist.ReferenceKey = serviceOrderHead.Id;
				serviceOrderChecklistRepository.SaveOrUpdate(serviceOrderChecklist);
			}
		}
		protected virtual void RemoveChecklistsFromOrder(ServiceOrderHead serviceOrderHead, Guid installationId)
		{
			var installation = installationRepository.Get(installationId);
			if (installation.IsNull())
				return;
			var checklistRelationships = GetChecklistsToAttach(installation.InstallationTypeKey, serviceOrderHead.TypeKey);
			foreach (ChecklistInstallationTypeRelationship checklistRelationship in checklistRelationships)
			{
				var serviceOrderChecklist = serviceOrderChecklistRepository.GetAll().FirstOrDefault(x => x.ReferenceKey == serviceOrderHead.Id && x.DynamicFormKey == checklistRelationship.DynamicFormKey);
				if (serviceOrderChecklist != null)
				{
					serviceOrderChecklistRepository.Delete(serviceOrderChecklist);
				}
			}
		}
		protected virtual List<ChecklistInstallationTypeRelationship> GetChecklistsToAttach(string installationType, string serviceOrderType)
		{
			var relationships = checklistInstallationTypeRelationshipRepository.GetAll().Where(x => x.InstallationTypeKey == installationType && x.ServiceOrderTypeKey == serviceOrderType).ToList();
			return relationships;
		}
	}
}
