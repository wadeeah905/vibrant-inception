using System.Linq;

namespace Crm.VisitReport.Services
{
	using System;

	using Crm.Library.BaseModel.Interfaces;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Model;
	using Crm.VisitReport.Model;

	public class CrmMerger : IMerger<Company>
	{
		private readonly IRepositoryWithTypedId<Visit, Guid> visitRepository;
		private readonly IRepositoryWithTypedId<VisitReport, Guid> visitReportRepository;

		public CrmMerger(IRepositoryWithTypedId<Visit, Guid> visitRepository, IRepositoryWithTypedId<VisitReport, Guid> visitReportRepository)
		{
			this.visitRepository = visitRepository;
			this.visitReportRepository = visitReportRepository;
		}

		public virtual void Merge(Company loser, Company winner)
		{
			MergeVisitReports(loser, winner);
			MergeVisits(loser, winner);
		}

		protected virtual void MergeVisits(Company loser, Company winner)
		{
			var loserVisits = visitRepository.GetAll().Where(x => x.ParentId == loser.Id);
			foreach (var loserVisit in loserVisits)
			{
				loserVisit.ParentId = winner.Id;
				visitRepository.SaveOrUpdate(loserVisit);
			}
		}
		protected virtual void MergeVisitReports(Company loser, Company winner)
		{
			var loserVisitReports = visitReportRepository.GetAll().Where(x => x.ReferenceKey == loser.Id);
			foreach (var loserVisitReport in loserVisitReports)
			{
				loserVisitReport.ReferenceKey = winner.Id;
				loserVisitReport.Company = winner;
				visitReportRepository.SaveOrUpdate(loserVisitReport);
			}
		}
	}
}
