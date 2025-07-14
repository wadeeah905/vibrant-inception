namespace Sms.Checklists.Services
{
	using System;
	using AutoMapper;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Rest;
	using Crm.Library.Services;
	using Sms.Checklists.Model;

	public class ChecklistInstallationTypeRelationshipSyncService : DefaultSyncService<ChecklistInstallationTypeRelationship, Guid>
	{
		public ChecklistInstallationTypeRelationshipSyncService(IRepositoryWithTypedId<ChecklistInstallationTypeRelationship, Guid> repository, RestTypeProvider restTypeProvider, IRestSerializer restSerializer, IMapper mapper)
			: base(repository, restTypeProvider, restSerializer, mapper)
		{
		}
	}
}
