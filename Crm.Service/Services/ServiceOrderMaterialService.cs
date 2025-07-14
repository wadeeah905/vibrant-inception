using Crm.Library.Data.Domain.DataInterfaces;
using Crm.Service.Model;
using Crm.Service.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Crm.Service.Services
{
	public class ServiceOrderMaterialService : IServiceOrderMaterialService
	{
		private readonly IRepositoryWithTypedId<ServiceOrderMaterial, Guid> serviceOrderMaterialRepository;
		private readonly IRepositoryWithTypedId<ServiceOrderMaterialSerial, Guid> serviceOrderMaterialSerialRepository;

		public ServiceOrderMaterialService(IRepositoryWithTypedId<ServiceOrderMaterial, Guid> serviceOrderMaterialRepository,
			IRepositoryWithTypedId<ServiceOrderMaterialSerial, Guid> serviceOrderMaterialSerialRepository)
		{
			this.serviceOrderMaterialRepository = serviceOrderMaterialRepository;
			this.serviceOrderMaterialSerialRepository = serviceOrderMaterialSerialRepository;
		}

		public virtual IEnumerable<string> GetUsedCommissioningStatuses()
		{
			return serviceOrderMaterialRepository.GetAll().Select(c => c.CommissioningStatusKey).Distinct();
		}

		public virtual IEnumerable<string> GetUsedNoPreviousSerialNoReasons()
		{
			return serviceOrderMaterialSerialRepository.GetAll().Select(c => c.NoPreviousSerialNoReasonKey).Distinct();
		}

		public virtual IEnumerable<string> GetUsedQuantityUnits()
		{
			return serviceOrderMaterialRepository.GetAll().Select(c => c.QuantityUnitKey).Distinct();
		}
	}
}
