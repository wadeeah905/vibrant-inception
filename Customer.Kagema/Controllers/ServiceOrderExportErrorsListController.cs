using Crm.Service;

using Microsoft.AspNetCore.Mvc;

namespace Customer.Kagema.Controllers

{
	using Crm.Controllers;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.EntityConfiguration;
	using Crm.Library.EntityConfiguration.Interfaces;
	using Crm.Library.Globalization.Resource;
	using Crm.Library.Helper;

	
	using Crm.Library.Modularization.Interfaces;
	using Crm.Library.Rest;
	using Crm.Library.Services.Interfaces;

	

	using Customer.Kagema.Model;

	using System.Collections.Generic;



	public class ServiceOrderExportErrorsListController : GenericListController<ServiceOrderExportErrors>
	{
		public ServiceOrderExportErrorsListController(IPluginProvider pluginProvider, IEnumerable<IRssFeedProvider<ServiceOrderExportErrors>> rssFeedProviders, IEnumerable<ICsvDefinition<ServiceOrderExportErrors>> csvDefinitions, IEntityConfigurationProvider<ServiceOrderExportErrors> entityConfigurationProvider, IRepository<ServiceOrderExportErrors> repository, IAppSettingsProvider appSettingsProvider, IResourceManager resourceManager, RestTypeProvider restTypeProvider) : base(pluginProvider, rssFeedProviders, csvDefinitions, entityConfigurationProvider, repository, appSettingsProvider, resourceManager, restTypeProvider)
		{
		}

		public override ActionResult IndexTemplate()
		{
			return base.IndexTemplate();
		}

	}
}
