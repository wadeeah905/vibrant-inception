using Microsoft.AspNetCore.Mvc;

namespace Customer.Kagema.Controllers
{
	using Crm.Library.AutoFac;
	using Crm.Library.Model;
	using Crm.Service;

	public class ServiceOrderMaterialController : Crm.Service.Controllers.ServiceOrderMaterialController, IReplaceRegistration<Crm.Service.Controllers.ServiceOrderMaterialController>
	{
		[RequiredPermission(ServicePlugin.PermissionName.EditCost, Group = ServicePlugin.PermissionGroup.ServiceOrder)]
		[RequiredPermission(ServicePlugin.PermissionName.EditMaterial, Group = ServicePlugin.PermissionGroup.ServiceOrder)]
		public virtual ActionResult ReportPlanned() => PartialView();
	}
}
