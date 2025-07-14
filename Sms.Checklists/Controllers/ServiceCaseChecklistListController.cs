namespace Sms.Checklists.Controllers
{
	using System.Collections.Generic;

	using Crm.Controllers;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.EntityConfiguration;
	using Crm.Library.EntityConfiguration.Interfaces;
	using Crm.Library.Globalization.Resource;
	using Crm.Library.Helper;
	using Crm.Library.Model;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization.Interfaces;
	using Crm.Library.Rest;
	using Crm.Library.Services.Interfaces;

	using Microsoft.AspNetCore.Mvc;

	using Sms.Checklists.Model;

	public class ServiceCaseChecklistListController : GenericListController<ServiceCaseChecklist>
	{
		[RequiredPermission(PermissionName.Index, Group = ChecklistsPlugin.PermissionGroup.ServiceCaseChecklist)]
		public override ActionResult FilterTemplate()
		{
			return base.FilterTemplate();
		}
		public ServiceCaseChecklistListController(IPluginProvider pluginProvider, IEnumerable<IRssFeedProvider<ServiceCaseChecklist>> rssFeedProviders, IEnumerable<ICsvDefinition<ServiceCaseChecklist>> csvDefinitions, IEntityConfigurationProvider<ServiceCaseChecklist> entityConfigurationProvider, IRepository<ServiceCaseChecklist> repository, IAppSettingsProvider appSettingsProvider, IResourceManager resourceManager, RestTypeProvider restTypeProvider)
			: base(pluginProvider, rssFeedProviders, csvDefinitions, entityConfigurationProvider, repository, appSettingsProvider, resourceManager, restTypeProvider)
		{
		}
	}
}
