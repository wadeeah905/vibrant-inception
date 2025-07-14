namespace Crm.VisitReport.Services.Interfaces
{
	using System.Collections.Generic;
	using System.Linq;

	using Crm.Library.AutoFac;
	using Crm.VisitReport.Model;

	public interface IVisitService : ITransientDependency
	{
		IQueryable<Visit> GetVisits();
		void DeleteVisit(Visit visit);
		IEnumerable<string> GetUsedContactPersonRelationshipTypes();
		IEnumerable<string> GetUsedVisitAims();
	}
}
