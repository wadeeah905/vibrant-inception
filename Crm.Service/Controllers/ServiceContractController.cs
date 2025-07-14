using Microsoft.AspNetCore.Mvc;

namespace Crm.Service.Controllers
{
	using System;

	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Model;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization;
	using Crm.Service.Model;
	using Crm.Service.Services.Interfaces;

	using Microsoft.AspNetCore.Authorization;
	using PermissionGroup = ServicePlugin.PermissionGroup;

	[Authorize]
	public class ServiceContractController : Controller
	{
		private readonly IRepositoryWithTypedId<MaintenancePlan, Guid> maintenancePlanRepository;
		private readonly IMaintenancePlanService maintenancePlanService;
		private readonly IServiceOrderService serviceOrderService;
		public ServiceContractController(IRepositoryWithTypedId<MaintenancePlan, Guid> maintenancePlanRepository, IMaintenancePlanService maintenancePlanService, IServiceOrderService serviceOrderService)
		{
			this.maintenancePlanRepository = maintenancePlanRepository;
			this.maintenancePlanService = maintenancePlanService;
			this.serviceOrderService = serviceOrderService;
		}
		[RenderAction("ServiceContractDetailsTopMenu")]
		public virtual ActionResult EditVisibilityTopMenu()
		{
			return PartialView();
		}

		[RenderAction("ServiceContractDetailsMaterialTab", Priority = 90)]
		[RequiredPermission(ServicePlugin.PermissionName.InstallationsTab, Group = PermissionGroup.ServiceContract)]
		public virtual ActionResult InstallationsTab()
		{
			return PartialView();
		}
		
		[RenderAction("ServiceContractDetailsMaterialTabHeader", Priority = 90)]
		[RequiredPermission(ServicePlugin.PermissionName.InstallationsTab, Group = PermissionGroup.ServiceContract)]
		public virtual ActionResult InstallationsTabHeader()
		{
			return PartialView();
		}

		[RenderAction("ServiceContractDetailsMaterialTab", Priority = 80)]
		[RequiredPermission(ServicePlugin.PermissionName.MaintenancePlansTab, Group = PermissionGroup.ServiceContract)]
		public virtual ActionResult MaintenancePlansTab()
		{
			return PartialView();
		}
		
		[RenderAction("ServiceContractDetailsMaterialTabHeader", Priority = 80)]
		[RequiredPermission(ServicePlugin.PermissionName.MaintenancePlansTab, Group = PermissionGroup.ServiceContract)]
		public virtual ActionResult MaintenancePlansTabHeader()
		{
			return PartialView();
		}
		
		[RenderAction("ServiceContractDetailsMaterialTab", Priority = 60)]
		[RequiredPermission(MainPlugin.PermissionName.NotesTab, Group = PermissionGroup.ServiceContract)]
		public virtual ActionResult NotesTab()
		{
			return PartialView("MaterialNotesTab");
		}

		[RenderAction("ServiceContractDetailsMaterialTabHeader", Priority = 60)]
		[RequiredPermission(MainPlugin.PermissionName.NotesTab, Group = PermissionGroup.ServiceContract)]
		public virtual ActionResult NotesTabHeader()
		{
			return PartialView("MaterialNotesTabHeader");
		}
		
		[RenderAction("ServiceContractDetailsMaterialTab", Priority = 70)]
		[RequiredPermission(MainPlugin.PermissionName.RelationshipsTab, Group = PermissionGroup.ServiceContract)]
		public virtual ActionResult RelationshipsTab()
		{
			return PartialView();
		}
		
		[RenderAction("ServiceContractDetailsMaterialTabHeader", Priority = 70)]
		[RequiredPermission(MainPlugin.PermissionName.RelationshipsTab, Group = PermissionGroup.ServiceContract)]
		public virtual ActionResult RelationshipsTabHeader()
		{
			return PartialView();
		}

		[RenderAction("ServiceContractDetailsMaterialTab", Priority = 40)]
		[RequiredPermission(MainPlugin.PermissionName.TasksTab, Group = PermissionGroup.ServiceContract)]
		public virtual ActionResult TasksTab()
		{
			return PartialView("MaterialTasksTab");
		}

		[RenderAction("ServiceContractDetailsMaterialTabHeader", Priority = 40)]
		[RequiredPermission(MainPlugin.PermissionName.TasksTab, Group = PermissionGroup.ServiceContract)]
		public virtual ActionResult TasksTabHeader()
		{
			return PartialView("MaterialTasksTabHeader");
		}
		
		[RequiredPermission(PermissionName.Edit, Group = PermissionGroup.ServiceContract)]
		public virtual ActionResult GenerateOrderFromMaintenancePlan(Guid maintenancePlanId)
		{
			var maintenancePlan = maintenancePlanRepository.Get(maintenancePlanId);
			if (maintenancePlan.FirstDate.HasValue == false || maintenancePlan.FirstDate > DateTime.Now)
			{
				maintenancePlan.FirstDate = DateTime.Now.Date;
			}
			maintenancePlan.NextDate = DateTime.Now;
			var date = maintenancePlanService.CalculateNextMaintenanceDate(maintenancePlan);
			var orders = maintenancePlanService.EvaluateMaintenancePlanAndGenerateOrders(maintenancePlan, date ?? DateTime.Now );
			foreach (var order in orders)
			{
				serviceOrderService.Save(order);
				maintenancePlan.ServiceOrders.Add(order);
			}

			return new EmptyResult();
		}

		[RequiredPermission(PermissionName.Create, Group = PermissionGroup.ServiceContract)]
		public virtual ActionResult CreateTemplate()
		{
			return PartialView();
		}

		[RenderAction("ServiceContractDetailsMaterialTab", Priority = 100)]
		public virtual ActionResult DetailsTab()
		{
			return PartialView();
		}
		
		[RenderAction("ServiceContractDetailsMaterialTabHeader", Priority = 100)]
		public virtual ActionResult DetailsTabHeader()
		{
			return PartialView();
		}

		[RequiredPermission(PermissionName.Read, Group = PermissionGroup.ServiceContract)]
		public virtual ActionResult DetailsTemplate()
		{
			return PartialView();
		}

		[RequiredPermission(PermissionName.Create, Group = PermissionGroup.DocumentArchive)]
		public virtual ActionResult DocumentAttributeEditTemplate()
		{
			return PartialView();
		}

		[RenderAction("ServiceContractDetailsMaterialTab", Priority = 50)]
		[RequiredPermission(ServicePlugin.PermissionName.DocumentArchive, Group = PermissionGroup.ServiceContract)]
		public virtual ActionResult DocumentsTab()
		{
			return PartialView();
		}

		[RenderAction("ServiceContractDetailsMaterialTabHeader", Priority = 50)]
		[RequiredPermission(ServicePlugin.PermissionName.DocumentArchive, Group = PermissionGroup.ServiceContract)]
		public virtual ActionResult DocumentsTabHeader()
		{
			return PartialView();
		}

		[RenderAction("ServiceContractDocumentsTabPrimaryAction")]
		[RequiredPermission(PermissionName.Create, Group = PermissionGroup.DocumentArchive)]
		public virtual ActionResult DocumentsTabPrimaryAction()
		{
			return PartialView();
		}

		[RenderAction("MaterialServiceContractSidebarExtensions", Priority = 50)]
		public virtual ActionResult DropboxBlock()
		{
			return PartialView("ContactDetailsDropboxBlock", typeof(ServiceContract));
		}

		[RenderAction("ServiceContractDetailsMaterialTab", Priority = 30)]
		[RequiredPermission(ServicePlugin.PermissionName.ServiceOrdersTab, Group = PermissionGroup.ServiceContract)]
		public virtual ActionResult ServiceOrdersTab()
		{
			return PartialView();
		}
		
		[RenderAction("ServiceContractDetailsMaterialTabHeader", Priority = 30)]
		[RequiredPermission(ServicePlugin.PermissionName.ServiceOrdersTab, Group = PermissionGroup.ServiceContract)]
		public virtual ActionResult ServiceOrdersTabHeader()
		{
			return PartialView();
		}
	}
}
