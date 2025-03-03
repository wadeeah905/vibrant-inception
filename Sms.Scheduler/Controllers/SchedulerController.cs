namespace Sms.Scheduler.Controllers
{
	using System.Linq;
	
	using Crm.Library.Helper;
	using Crm.Library.Model;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization;
	using Crm.Service.Rest.Model;
	using Microsoft.AspNetCore.Authorization;
	using Microsoft.AspNetCore.Mvc;

	public class SchedulerController : Controller
	{
		public static readonly string Name = nameof(SchedulerController).Replace("Controller", "");

		[RequiredPermission(PermissionName.Read, Group = SchedulerPlugin.PermissionGroup.Scheduler)]
		public virtual ActionResult DetailsTemplate() => View();
		public virtual ActionResult EditTemplate() => PartialView();

		[RenderAction("SchedulerDetailsTimelinePanel", Priority = 5500)]
		public virtual ActionResult TimelinePanel() => PartialView();

		[RenderAction("SchedulerDetailsTopMenu", Priority = 20)]
		public virtual ActionResult TopMenuProfile() => PartialView();
		[RequiredPermission(PermissionName.Edit, Group = SchedulerPlugin.PermissionGroup.Scheduler)]
		public virtual ActionResult AddResource() => PartialView();
		public virtual ActionResult LoadProfile() => PartialView();
		[RequiredPermission(SchedulerPlugin.PermissionName.AddProfile, Group = SchedulerPlugin.PermissionGroup.Scheduler)]
		public virtual ActionResult AddProfile() => PartialView();
		[RequiredPermission(SchedulerPlugin.PermissionName.EditProfile, Group = SchedulerPlugin.PermissionGroup.Scheduler)]
		public virtual ActionResult EditProfile() => PartialView();
		[RenderAction("DispatchDetailsTopMenu", Priority = 100)]
		public virtual ActionResult TopMenuShowDispatchInScheduler() => PartialView("../Dispatch/TopMenuShowDispatchInScheduler");
		
		[RenderAction("ServiceOrderDispatchItemTemplateActions", Priority = 80)]
		public virtual ActionResult TemplateActionShowDispatchInScheduler() => PartialView("../ServiceOrderDispatchList/TemplateActionShowDispatchInScheduler");
		public virtual ActionResult Map() => View();

		[AllowAnonymous]
		[RenderAction("MaterialHeadResource", Priority = 1990)]
		public ActionResult SchedulerResource() => Content(Url.JsResource("Sms.Scheduler", "schedulerTs"));

		[AllowAnonymous]
		[RenderAction("MaterialTitleResource", Priority = 4800)]
		public virtual ActionResult SchedulerTitleResourceCss() => Content(Url.CssResource("Sms.Scheduler", $"schedulerCss"));

		public virtual JsonResult GetResourceTooltipProperties()
		{
			//TODO: remove hardcoded property names.
			var props = new string[]
			{
				"Resource.DisplayName",
				"Resource."+nameof(Main.Rest.Model.UserRest.Email),
				"Resource."+nameof(Main.Rest.Model.UserRest.Remark),
				"Resource."+nameof(Main.Rest.Model.UserRest.PersonnelId),
				"Resource.Capacity",
				"Resource.Teams",
				"Resource.ValidSkills",
				"Resource.ExpiredSkills",
				"Resource.ValidAssets",
				"Resource.ExpiredAssets",
				"Resource.License",
			};

			return Json(props);
		}


		string[] _GetServiceOrderHeadTooltipProperties()
		{
			//TODO: remove hardcoded property names.
			return new string[]
			{
				"ServiceOrder."+nameof(ServiceOrderHeadRest.OrderNo),
				"ServiceOrder."+nameof(ServiceOrderHeadRest.ErrorMessage),
				"ServiceOrder."+nameof(ServiceOrderHeadRest.City),
				"ServiceOrder."+nameof(ServiceOrderHeadRest.ZipCode),
				"ServiceOrder."+nameof(ServiceOrderHeadRest.Street),
				"ServiceOrder."+nameof(ServiceOrderHeadRest.Dispatches),
				"ServiceOrder.Skills",
				"ServiceOrder.Assets",
				"ServiceOrder.DisplayPreferredUser",
				"ServiceOrder.DisplayPlannedDate",
				"ServiceOrder.InstallationNo",
				$"ServiceOrder.{nameof(ServiceOrderHeadRest.Installation.Description)}",
				"ServiceOrder.Status",
				"ServiceOrder.Type",
				"ServiceOrder.Country",
				"ServiceOrder.Region",
				"ServiceOrder.Priority",
				"ServiceOrder."+nameof(ServiceOrderHeadRest.Station),
				"ServiceOrder."+nameof(ServiceOrderHeadRest.Company),
				"ServiceOrder."+nameof(ServiceOrderHeadRest.Deadline),
				"ServiceOrder.PreferredTechnicianUsergroup",
			};
		}

		public virtual JsonResult GetServiceOrderHeadTooltipProperties()
		{
			return Json(_GetServiceOrderHeadTooltipProperties());
		}

		public virtual JsonResult GetServiceOrderDispatchTooltipProperties()
		{
			//TODO: remove hardcoded property names.
			var result = _GetServiceOrderHeadTooltipProperties().ToList();

			result.AddRange(new string[]
			{
				"ServiceOrderDispatch."+nameof(ServiceOrderDispatchRest.NetWorkMinutes),
				"ServiceOrderDispatch."+nameof(ServiceOrderDispatchRest.CreateDate),
				"ServiceOrderDispatch."+nameof(ServiceOrderDispatchRest.CreateUser),
				"ServiceOrderDispatch."+nameof(ServiceOrderDispatchRest.ModifyDate),
				"ServiceOrderDispatch."+nameof(ServiceOrderDispatchRest.ModifyUser),
				"ServiceOrderDispatch."+nameof(ServiceOrderDispatchRest.Remark),

			});

			return Json(result.ToArray());
		}

		[RequiredPermission(PermissionName.Create, Group = Crm.Service.ServicePlugin.PermissionGroup.Adhoc)]
		public virtual ActionResult AdHocTemplate() => PartialView();
		
		public virtual ActionResult ResourceReorder() => PartialView();

		public SchedulerController()
		{
		}
		
		public virtual ActionResult GetRoute() => PartialView();
		
	}
}
