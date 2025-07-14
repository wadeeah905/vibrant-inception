namespace Crm.VisitReport.Services
{
	using System;
	using System.Linq;

	using Crm.Controllers;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Model;
	using Crm.VisitReport.Model;

	public class VisitsRelatedToCompany : IRelatedContact<Company>
	{
		private readonly IRepositoryWithTypedId<Visit, Guid> visitRepository;
		public VisitsRelatedToCompany(IRepositoryWithTypedId<Visit, Guid> visitRepository)
		{
			this.visitRepository = visitRepository;
		}
		public virtual IQueryable<Contact> RelatedContact(Contact contact)
		{
			var contacts = visitRepository.GetAll().Where(x => x.ParentId == contact.Id);
			return contacts;
		}
	}
}
