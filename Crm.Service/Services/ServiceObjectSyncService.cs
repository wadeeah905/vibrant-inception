namespace Crm.Service.Services
{
	using System;
	using System.Linq;

	using AutoMapper;

	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Model;
	using Crm.Library.Rest;
	using Crm.Library.Services;
	using Crm.Library.Services.Interfaces;
	using Crm.Service.Model;

	using NHibernate.Linq;

	public class ServiceObjectSyncService : DefaultSyncService<ServiceObject, Guid>
	{
		private readonly IVisibilityProvider visibilityProvider;
		public ServiceObjectSyncService(
			IRepositoryWithTypedId<ServiceObject, Guid> repository,
			RestTypeProvider restTypeProvider,
			IRestSerializer restSerializer,
			IMapper mapper,
			IVisibilityProvider visibilityProvider)
			: base(repository, restTypeProvider, restSerializer, mapper)
		{
			this.visibilityProvider = visibilityProvider;
		}
		public override IQueryable<ServiceObject> GetAll(User user)
		{
			return visibilityProvider.FilterByVisibility(repository.GetAll());
		}
		public override IQueryable<ServiceObject> Eager(IQueryable<ServiceObject> entities)
		{
			return entities.Fetch(x => x.StandardAddress);
		}
	}
}