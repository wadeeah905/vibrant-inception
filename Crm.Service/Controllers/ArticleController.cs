namespace Crm.Service.Controllers;

using Crm.Library.Modularization;
using Microsoft.AspNetCore.Mvc;

public class ArticleController : Controller
{
	[RenderAction("ArticleMaterialDetailsTabExtensions")]
	public virtual ActionResult ArticleMaterialDetailsTabExtensions() => PartialView();
}