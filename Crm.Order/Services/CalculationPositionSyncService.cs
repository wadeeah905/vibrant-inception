namespace Crm.Order.Services
{
	using System;
	using System.Collections.Generic;
	using System.Linq;

	using AutoMapper;

	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Model;
	using Crm.Library.Rest;
	using Crm.Library.Services;
	using Crm.Library.Services.Interfaces;
	using Crm.Order.Model;
	using NHibernate.Mapping;

	public class CalculationPositionSyncService : DefaultSyncService<CalculationPosition, Guid>
	{
		private readonly ISyncService<Offer> offerSyncService;
		private readonly ISyncService<Order> orderSyncService;
		public CalculationPositionSyncService(IRepositoryWithTypedId<CalculationPosition, Guid> repository, RestTypeProvider restTypeProvider, IRestSerializer restSerializer, IMapper mapper, ISyncService<Offer> offerSyncService, ISyncService<Order> orderSyncService)
			: base(repository, restTypeProvider, restSerializer, mapper)
		{
			this.offerSyncService = offerSyncService;
			this.orderSyncService = orderSyncService;
		}
		public override Type[] SyncDependencies
		{
			get { return new[] { typeof(Offer), typeof(Order) }; }
		}
		public override IQueryable<CalculationPosition> GetAll(User user, IDictionary<string, int?> groups)
		{
			var offers = offerSyncService.GetAll(user, groups);
			var orders = orderSyncService.GetAll(user, groups);
			return repository.GetAll()
				.Where(x => offers.Any(y => y.Id == x.BaseOrderId) || orders.Any(y => y.Id == x.BaseOrderId));
		}
	}
}
