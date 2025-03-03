﻿namespace Sms.Scheduler.Services
{
	using AutoMapper;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.Rest;
	using Crm.Library.Services;
	using Sms.Scheduler.Model;
	using System;

	public class DispatchArticleAssignmentSyncService : DefaultSyncService<DispatchArticleAssignment, Guid>
	{
		public DispatchArticleAssignmentSyncService(IRepositoryWithTypedId<DispatchArticleAssignment, Guid> repository, RestTypeProvider restTypeProvider, IRestSerializer restSerializer, IMapper mapper)
			: base(repository, restTypeProvider, restSerializer, mapper)
		{
		}
	}
}
