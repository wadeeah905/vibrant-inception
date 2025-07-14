using Microsoft.AspNetCore.Mvc;

namespace Crm.Service.Controllers
{
	using Crm.Library.Modularization;
	using Crm.Service.Model;
	using Microsoft.AspNetCore.Authorization;

	[Authorize]
	public class InstallationDetailsController : Controller
	{
		[RenderAction("MaterialInstallationSidebarExtensions", Priority = 50)]
		public virtual ActionResult DropboxBlock()
		{
			return PartialView("ContactDetailsDropboxBlock", typeof(Installation));
		}
	}
}
