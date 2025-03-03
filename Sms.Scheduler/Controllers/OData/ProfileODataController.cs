namespace Sms.Scheduler.Controllers.OData
{
	using System;

	using Crm.Library.Api;
	using Crm.Library.Api.Attributes;
	using Crm.Library.Api.Controller;

	using Microsoft.AspNetCore.Mvc;
	using Microsoft.AspNetCore.OData.Query;

	using Sms.Scheduler.Model;
	using Sms.Scheduler.Rest.Model;
	using Sms.Scheduler.Services;

	[ControllerName("SmsScheduler_Profile")]
	public class ProfileODataController : ODataControllerEx, IEntityApiController
	{
		private readonly ProfileService profileService;
		public ProfileODataController(ProfileService profileService)
		{
			this.profileService = profileService;
		}

		public Type EntityType => typeof(Profile);
		
		[HttpGet]
		public virtual IActionResult GetDefaultProfileConfig(ODataQueryOptions<ProfileRest> options)
		{
			return new JsonResult(profileService.GetDefaultClientConfig());
		}

		[HttpGet]
		public virtual IActionResult GetGroupableResourceProperties(ODataQueryOptions<ProfileRest> options)
		{
			var result = new string[]{
				"Resource.Stations",
				"Resource.ResourceType",
				"Resource.Teams",
				"Resource.Assets",
				"Resource.Skills",
			};

			return Ok(result);
		}
	}
}
