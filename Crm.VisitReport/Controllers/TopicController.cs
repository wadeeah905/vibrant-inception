using Microsoft.AspNetCore.Mvc;

namespace Crm.VisitReport.Controllers
{
	using Crm.Library.Model;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Microsoft.AspNetCore.Authorization;

	[Authorize]
	public class TopicController : Controller
	{
		[RequiredPermission(PermissionName.Edit, Group = VisitReportPlugin.PermissionGroup.Topic)]
		public virtual ActionResult EditTemplate() => PartialView();
	}
}
