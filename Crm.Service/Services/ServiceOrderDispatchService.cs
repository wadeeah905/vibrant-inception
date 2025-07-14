using Crm.Library.Data.Domain.DataInterfaces;
using Crm.Service.Model;
using Crm.Service.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Crm.Service.Services
{
	public class ServiceOrderDispatchService : IServiceOrderDispatchService
	{
		private readonly IRepositoryWithTypedId<ServiceOrderDispatch, Guid> serviceOrderDispatchRepository;

		public ServiceOrderDispatchService(IRepositoryWithTypedId<ServiceOrderDispatch, Guid> serviceOrderDispatchRepository)
		{
			this.serviceOrderDispatchRepository = serviceOrderDispatchRepository;
		}

		public virtual IEnumerable<string> GetUsedCauseOfFailures()
		{
			return serviceOrderDispatchRepository.GetAll().Select(c => c.CauseOfFailureKey).Distinct();
		}

		public virtual IEnumerable<string> GetUsedComponents()
		{
			return serviceOrderDispatchRepository.GetAll().Select(c => c.ComponentKey).Distinct();
		}

		public virtual IEnumerable<string> GetUsedErrorCodes()
		{
			return serviceOrderDispatchRepository.GetAll().Select(c => c.ErrorCodeKey).Distinct();
		}

		public virtual IEnumerable<string> GetUsedServiceOrderDispatchRejectReasons()
		{
			return serviceOrderDispatchRepository.GetAll().Select(c => c.RejectReasonKey).Distinct();
		}
	}
}
