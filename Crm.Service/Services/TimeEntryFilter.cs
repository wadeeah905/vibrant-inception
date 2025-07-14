namespace Crm.Service.Services
{
	using System;
	using System.Collections.Generic;
	using System.Linq;

	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.PerDiem.Extensions;
	using Crm.PerDiem.Model;
	using Crm.PerDiem.SearchCriteria;
	using Crm.PerDiem.Services.Interfaces;
	using Crm.Service.Model;

	public class TimeEntryFilter : ITimeEntryFilter
	{
		private readonly IRepositoryWithTypedId<ServiceOrderTimePosting, Guid> serviceOrderTimePostingRepository;

		public TimeEntryFilter(IRepositoryWithTypedId<ServiceOrderTimePosting, Guid> serviceOrderTimePostingRepository)
		{
			this.serviceOrderTimePostingRepository = serviceOrderTimePostingRepository;
		}

		public virtual List<TimeEntry> Filter(List<TimeEntry> timeEntries, TimeEntrySearchCriteria criteria)
		{
			var serviceOrderTimePostings = serviceOrderTimePostingRepository.GetAll().Filter(criteria).ToList();
			return timeEntries.Concat(serviceOrderTimePostings).ToList();
		}
	}
}
