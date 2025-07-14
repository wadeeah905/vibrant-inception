namespace Crm.Order.Services
{
	using System;
	using System.Linq;

	using AutoMapper;

	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Model;
	using Crm.Library.Model.Authorization.Interfaces;
	using Crm.Library.Rest;
	using Crm.Library.Services;
	using Crm.Library.Services.Interfaces;
	using Crm.Model;
	using Crm.Model.Extensions;
	using Crm.Order.Model;
	using Crm.Order.Services.Interfaces;

	using NHibernate.Linq;

	public class OfferSyncService : DefaultSyncService<Offer, Guid>
	{
		private readonly IBaseOrderService baseOrderService;
		private readonly IUserService userService;
		private readonly IAuthorizationManager authorizationManager;

		public OfferSyncService(IRepositoryWithTypedId<Offer, Guid> repository, RestTypeProvider restTypeProvider, IRestSerializer restSerializer, IBaseOrderService baseOrderService, IUserService userService, IMapper mapper, IAuthorizationManager authorizationManager)
			: base(repository, restTypeProvider, restSerializer, mapper)
		{
			this.baseOrderService = baseOrderService;
			this.userService = userService;
			this.authorizationManager = authorizationManager;
		}
		public override Type[] SyncDependencies
		{
			get { return new[] { typeof(Address), typeof(Company), typeof(Person) }; }
		}
		public override Offer Save(Offer entity)
		{
			if (String.IsNullOrEmpty(entity.ResponsibleUser))
			{
				entity.ResponsibleUser = userService.CurrentUser.Id;
			}
			var orig = baseOrderService.GetOrder(entity.Id);
			if (orig != null)
			{
				entity.Items = orig.Items;
			}
			baseOrderService.SaveOrder(entity);
			return entity;
		}
		public override IQueryable<Offer> GetAll(User user)
		{
			return repository.GetAll().VisibleTo(authorizationManager, user);
		}
		public override IQueryable<Offer> Eager(IQueryable<Offer> entities)
		{
			return entities
				.Fetch(x => x.Company);
		}
	}
}