namespace Crm.Service.Controllers
{
	using Crm.Library.Model;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization;
	using Crm.Service.Model;
	using Microsoft.AspNetCore.Authorization;
	using Microsoft.AspNetCore.Mvc;

	[Authorize]
	public class ServiceCaseController : Controller
	{
		[RequiredPermission(PermissionName.Create, Group = ServicePlugin.PermissionGroup.ServiceOrder)]
		public virtual ActionResult AddToServiceOrder()
		{
			return PartialView();
		}

		[RenderAction("ServiceCaseDetailsTopMenu")]
		[RequiredPermission(PermissionName.Create, Group = ServicePlugin.PermissionGroup.ServiceOrder)]
		public virtual ActionResult AddToServiceOrderTopMenu()
		{
			return PartialView();
		}

		[RequiredPermission(PermissionName.Create, Group = ServicePlugin.PermissionGroup.ServiceOrder)]
		public virtual ActionResult CreateServiceOrderTemplate()
		{
			return PartialView();
		}

		[RenderAction("ServiceCaseDetailsTopMenu")]
		[RequiredPermission(PermissionName.Create, Group = ServicePlugin.PermissionGroup.ServiceOrder)]
		public virtual ActionResult CreateServiceOrderTopMenu()
		{
			return PartialView();
		}

		[RenderAction("ServiceCaseDetailsTopMenu")]
		public virtual ActionResult EditVisibilityTopMenu()
		{
			return PartialView();
		}

		[RenderAction("ServiceCaseDetailsMaterialTab", Priority = 100)]
		public virtual ActionResult DetailsTab()
		{
			return PartialView();
		}

		[RenderAction("ServiceCaseDetailsMaterialTabHeader", Priority = 100)]
		public virtual ActionResult DetailsTabHeader()
		{
			return PartialView();
		}

		[RequiredPermission(PermissionName.Read, Group = ServicePlugin.PermissionGroup.ServiceCase)]
		public virtual ActionResult DetailsTemplate()
		{
			return PartialView();
		}

		[RenderAction("MaterialServiceCaseSidebarExtensions", Priority = 50)]
		public virtual ActionResult DropboxBlock() => PartialView("ContactDetailsDropboxBlock", typeof(ServiceCase));

		[RequiredPermission(PermissionName.Create, Group = ServicePlugin.PermissionGroup.ServiceCase)]
		public virtual ActionResult CreateTemplate()
		{
			return PartialView();
		}

		[RenderAction("CreateServiceCaseForm", Priority = 100)]
		public virtual ActionResult CreateTemplateBasicInformation()
		{
			return PartialView();
		}

		[RenderAction("CreateServiceCaseForm", Priority = 50)]
		public virtual ActionResult CreateTemplateExtendedInformation()
		{
			return PartialView();
		}

		[RequiredPermission(MainPlugin.PermissionName.SetStatus, Group = ServicePlugin.PermissionGroup.ServiceCase)]
		public virtual ActionResult SetStatusTemplate()
		{
			return PartialView();
		}

		[RenderAction("ServiceCaseDetailsMaterialTab", Priority = 80)]
		[RequiredPermission(MainPlugin.PermissionName.NotesTab, Group = ServicePlugin.PermissionGroup.ServiceCase)]
		public virtual ActionResult NotesTab()
		{
			return PartialView("MaterialNotesTab");
		}

		[RenderAction("ServiceCaseDetailsMaterialTabHeader", Priority = 80)]
		[RequiredPermission(MainPlugin.PermissionName.NotesTab, Group = ServicePlugin.PermissionGroup.ServiceCase)]
		public virtual ActionResult NotesTabHeader()
		{
			return PartialView("MaterialNotesTabHeader");
		}

		[RenderAction("ServiceCaseDetailsMaterialTab", Priority = 70)]
		[RequiredPermission(MainPlugin.PermissionName.TasksTab, Group = ServicePlugin.PermissionGroup.ServiceCase)]
		public virtual ActionResult TasksTab()
		{
			return PartialView("MaterialTasksTab");
		}

		[RenderAction("ServiceCaseDetailsMaterialTabHeader", Priority = 80)]
		[RequiredPermission(MainPlugin.PermissionName.TasksTab, Group = ServicePlugin.PermissionGroup.ServiceCase)]
		public virtual ActionResult TasksTabHeader()
		{
			return PartialView("MaterialTasksTabHeader");
		}
	}
}
