namespace Crm.VisitReport.EventHandler
{
	using System;
	using System.Linq;

	using Crm.Events;
	using Crm.Library.Modularization.Events;
	using Crm.VisitReport.Model;
	using Crm.VisitReport.Services.Interfaces;

	public class CompanyDeletedEventHandler : IEventHandler<CompanyDeletedEvent>
	{
		private readonly IVisitService visitService;

		// Methods
		public virtual void Handle(CompanyDeletedEvent e)
		{
			var companyIds = e.CompanyIds;
			var visitsToDelete = visitService.GetVisits().Where(v => v.ParentId != null && companyIds.Contains((Guid)v.ParentId));
			foreach (Visit visit in visitsToDelete)
			{
				visitService.DeleteVisit(visit);
			}
		}

		// Constructor
		public CompanyDeletedEventHandler(IVisitService visitService)
		{
			this.visitService = visitService;
		}
	}
}
