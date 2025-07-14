namespace Sms.Checklists.Controllers
{
	using System;

	using Crm.Library.Model;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.ViewModels;

	using Microsoft.AspNetCore.Authorization;
	using Microsoft.AspNetCore.Mvc;

	using Sms.Checklists.Model;

	[Authorize]
	public class ServiceCaseChecklistController : Controller
	{
		[RequiredPermission(PermissionName.Read, Group = ChecklistsPlugin.PermissionGroup.ServiceCaseChecklist)]
		public virtual ActionResult DetailsTemplate()
		{
			var model = new CrmModelItem<Type> { Item = typeof(ServiceCaseChecklist) };
			return PartialView("DynamicForm/DetailsModalTemplate", model);
		}
		[RequiredPermission(PermissionName.Edit, Group = ChecklistsPlugin.PermissionGroup.ServiceCaseChecklist)]
		public virtual ActionResult EditTemplate()
		{
			var model = new CrmModelItem<Type> { Item = typeof(ServiceCaseChecklist) };
			return PartialView("DynamicForm/EditModalTemplate", model);
		}
	}
}
