namespace Sms.Scheduler.Controllers.OData
{
	using System;
	using System.Collections.Generic;
	using System.Linq;
	using Crm.Library.Api;
	using Crm.Library.Api.Attributes;
	using Crm.Library.Api.Controller;
	using Crm.Library.Api.Extensions;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Service.Model;
	using Microsoft.AspNetCore.Mvc;
	using Microsoft.AspNetCore.OData.Formatter;

	using Sms.Scheduler.Model;

	[ControllerName("CrmService_ServiceOrderDispatch")]
	public class DispatchODataController : ODataControllerEx, IEntityApiController
	{
		private readonly IRepositoryWithTypedId<DispatchPersonAssignment, Guid> dispatchPersonAssignmentRepository;
		public Type EntityType => typeof(ServiceOrderDispatch);
		public DispatchODataController(IRepositoryWithTypedId<DispatchPersonAssignment, Guid> dispatchPersonAssignmentRepository)
		{
			this.dispatchPersonAssignmentRepository = dispatchPersonAssignmentRepository;
		}

		[HttpPost]
		public virtual IActionResult GetDispatchesInRange(ODataActionParameters parameters)
		{
			var technicians = parameters.GetValue<IEnumerable<string>>("technicians").ToArray();
			var startDate = parameters.GetValue<DateTimeOffset>("startDate").UtcDateTime;
			var endDate = parameters.GetValue<DateTimeOffset>("endDate").UtcDateTime;

			var query = dispatchPersonAssignmentRepository
				.GetAll()
				//Overlap of two ranges can be checked like this:
				//range1Start < range2End && range2Start < range1End
				.Where(a => technicians.Contains(a.ResourceKey) && a.Dispatch.Date < endDate && startDate < a.Dispatch.EndDate)
				.Select(a => a.Dispatch.Id)
				.ToList();

			return Ok(query);
		}
	}
}
