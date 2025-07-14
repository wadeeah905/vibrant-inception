namespace Crm.Service.Controllers
{
	using Crm.Library.Modularization;

	using Microsoft.AspNetCore.Authorization;
	using Microsoft.AspNetCore.Mvc;

	[Authorize]
	public class UserDetailsController : Controller
	{
		[RenderAction("UserDetailsGeneralView")]
		public virtual ActionResult UserDetailsSkills() => PartialView("UserDetails/UserDetailsSkills");

		[RenderAction("UserDetailsGeneralEdit")]
		public virtual ActionResult UserDetailsEditSkills() => PartialView("UserDetails/UserDetailsEditSkills");
	}
}
