namespace Crm.Service.Services
{
	using System.Linq;

	using Crm.Controllers;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Model;
	using Crm.Service.Model;

	public class ServiceOrderRelatedServiceCases : IRelatedContact<ServiceOrderHead>
	{
		private readonly IRepository<ServiceCase> serviceCaseRepository;
		public ServiceOrderRelatedServiceCases(IRepository<ServiceCase> serviceCaseRepository)
		{
			this.serviceCaseRepository = serviceCaseRepository;
		}
		public virtual IQueryable<Contact> RelatedContact(Contact contact)
		{
			var serviceCaseKey = (contact as ServiceOrderHead)?.ServiceCaseKey;
			return serviceCaseRepository.GetAll().Where(x => x.Id == serviceCaseKey);
		}
	}
}
