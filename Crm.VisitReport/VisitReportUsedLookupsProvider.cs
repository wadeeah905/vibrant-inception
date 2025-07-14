using Crm.Library.Globalization.Lookup;
using Crm.VisitReport.Lookups;
using Crm.VisitReport.Services.Interfaces;
using System;
using System.Collections.Generic;

namespace Crm.VisitReport
{
	public class VisitReportUsedLookupsProvider : IUsedLookupsProvider
	{
		private readonly IVisitService visitService;
		public VisitReportUsedLookupsProvider(IVisitService visitService)
		{
			this.visitService = visitService;
		}

		public virtual IEnumerable<object> GetUsedLookupKeys(Type lookupType)
		{
			if (lookupType == typeof(ContactPersonRelationshipType))
			{
				visitService.GetUsedContactPersonRelationshipTypes();
			}

			if (lookupType == typeof(VisitAim))
			{
				visitService.GetUsedVisitAims();
			}

			return new List<object>();
		}
	}
}
