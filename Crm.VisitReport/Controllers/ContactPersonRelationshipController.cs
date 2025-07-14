using Microsoft.AspNetCore.Mvc;

namespace Crm.VisitReport.Controllers
{
	using Crm.Library.Model;
	using Crm.Library.Modularization;
	using Microsoft.AspNetCore.Authorization;

	[Authorize]
	public class ContactPersonRelationshipController : Controller
	{
		[RequiredPermission(MainPlugin.PermissionName.RelationshipsTab, Group = MainPlugin.PermissionGroup.Person)]
		public virtual ActionResult EditTemplate() => PartialView();
		[RenderAction("MaterialPersonItemExtensions", Priority = 70)]
		[RequiredPermission(MainPlugin.PermissionName.RelationshipsTab, Group = MainPlugin.PermissionGroup.Person)]
		public virtual ActionResult MaterialPersonItemExtensions() => PartialView();

		[RenderAction("PersonItemTemplateActions", Priority = 70)]
		[RequiredPermission(MainPlugin.PermissionName.RelationshipsTab, Group = MainPlugin.PermissionGroup.Person)]
		public virtual ActionResult PersonItemTemplateActions() => PartialView();
	}
}
