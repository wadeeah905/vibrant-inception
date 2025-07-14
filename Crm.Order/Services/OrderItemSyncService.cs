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

	using NHibernate.Linq;

	public class OrderItemSyncService : DefaultSyncService<OrderItem, Guid>
	{
		private readonly ISyncService<Offer> offerSyncService;
		private readonly ISyncService<Order> orderSyncService;
		public OrderItemSyncService(IRepositoryWithTypedId<OrderItem, Guid> repository, RestTypeProvider restTypeProvider, IRestSerializer restSerializer, IMapper mapper, ISyncService<Offer> offerSyncService, ISyncService<Order> orderSyncService)
			: base(repository, restTypeProvider, restSerializer, mapper)
		{
			this.offerSyncService = offerSyncService;
			this.orderSyncService = orderSyncService;
		}
		public override Type[] SyncDependencies
		{
			get { return new[] { typeof(Offer), typeof(Order) }; }
		}
		public override IQueryable<OrderItem> GetAll(User user, IDictionary<string, int?> groups)
		{
			var offers = offerSyncService.GetAll(user, groups);
			var orders = orderSyncService.GetAll(user, groups);
			return repository.GetAll()
				.Where(x => offers.Any(y => y.Id == x.OrderId) || orders.Any(y => y.Id == x.OrderId));
		}
		public override IQueryable<OrderItem> Eager(IQueryable<OrderItem> entities)
		{
			return entities
				.Fetch(i => i.Article)
				.ThenFetch(a => a.ResponsibleUserObject);
		}
	}
}
