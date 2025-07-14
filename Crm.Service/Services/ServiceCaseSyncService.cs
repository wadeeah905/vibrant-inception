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
	using Crm.Model;
	using Crm.Service.Model;

	public class ServiceCaseSyncService : DefaultSyncService<ServiceCase, Guid>
	{
		private readonly IVisibilityProvider visibilityProvider;
		public ServiceCaseSyncService(IRepositoryWithTypedId<ServiceCase, Guid> repository, RestTypeProvider restTypeProvider, IRestSerializer restSerializer, IMapper mapper, IVisibilityProvider visibilityProvider)
			: base(repository, restTypeProvider, restSerializer, mapper)
		{
			this.visibilityProvider = visibilityProvider;
		}
		public override IQueryable<ServiceCase> GetAll(User user)
		{
			return visibilityProvider.FilterByVisibility(repository.GetAll());
		}
		public override Type[] SyncDependencies => new[]
		{
			typeof(ServiceCaseTemplate),
			typeof(ServiceObject),
			typeof(Company),
			typeof(Person),
			typeof(Installation),
			typeof(ServiceOrderTime)
		};
	}
}