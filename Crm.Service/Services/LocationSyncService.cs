namespace Crm.Service.Services
{
	using AutoMapper;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Model;
	using Crm.Library.Rest;
	using Crm.Library.Services;
	using Crm.Service.Model;
	using System;
	using System.Linq;

	public class LocationSyncService : DefaultSyncService<Location, Guid>
	{
		public LocationSyncService(IRepositoryWithTypedId<Location, Guid> repository, RestTypeProvider restTypeProvider, IRestSerializer restSerializer, IMapper mapper)
			: base(repository, restTypeProvider, restSerializer, mapper)
		{
		}
		public override IQueryable<Location> GetAll(User user) => repository.GetAll();
	}
}