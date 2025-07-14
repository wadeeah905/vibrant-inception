namespace Crm.VisitReport.Services
{
	using System;
	using System.Collections.Generic;
	using System.Linq;

	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.VisitReport.Model;
	using Crm.VisitReport.Model.Relationships;
	using Crm.VisitReport.Services.Interfaces;

	public class VisitService : IVisitService
	{
		private readonly IRepositoryWithTypedId<Visit, Guid> visitRepository;
		private readonly IRepositoryWithTypedId<ContactPersonRelationship, Guid> contactPersonRelationshipRepository;

		//Methods
		public virtual IQueryable<Visit> GetVisits()
		{
			return visitRepository.GetAll();
		}

		public virtual void DeleteVisit(Visit visit)
		{
			visitRepository.Delete(visit);
		}

		public virtual IEnumerable<string> GetUsedContactPersonRelationshipTypes()
		{
			return contactPersonRelationshipRepository.GetAll().Select(c => c.RelationshipTypeKey).Distinct();
		}

		public virtual IEnumerable<string> GetUsedVisitAims()
		{
			return visitRepository.GetAll().Select(c => c.VisitAimKey).Distinct();
		}

		public VisitService(IRepositoryWithTypedId<Visit, Guid> visitRepository, IRepositoryWithTypedId<ContactPersonRelationship, Guid> contactPersonRelationshipRepository)
		{
			this.visitRepository = visitRepository;
			this.contactPersonRelationshipRepository = contactPersonRelationshipRepository;
		}
	}
}
