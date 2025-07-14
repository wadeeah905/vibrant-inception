using Microsoft.AspNetCore.Mvc;

namespace Sms.Checklists.Controllers
{

	using Crm.Library.Modularization;

	public class DynamicFormController : Controller
	{
		[RenderAction("MaterialFormDesignerElementExtension")]
		public virtual ActionResult MaterialCanAttachServiceCasesEditorTemplate()
		{
			return PartialView();
		}
	}
}
