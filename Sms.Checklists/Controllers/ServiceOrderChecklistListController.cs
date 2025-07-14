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
	using Crm.Library.Modularization;
	using Crm.Library.Modularization.Interfaces;
	using Crm.Library.Rest;
	using Crm.Library.Services.Interfaces;

	using Microsoft.AspNetCore.Mvc;

	using Sms.Checklists.Model;

	public class ServiceOrderChecklistListController : GenericListController<ServiceOrderChecklist>
	{
		public ServiceOrderChecklistListController(IPluginProvider pluginProvider, IEnumerable<IRssFeedProvider<ServiceOrderChecklist>> rssFeedProviders, IEnumerable<ICsvDefinition<ServiceOrderChecklist>> csvDefinitions, IEntityConfigurationProvider<ServiceOrderChecklist> entityConfigurationProvider, IRepository<ServiceOrderChecklist> repository, IAppSettingsProvider appSettingsProvider, IResourceManager resourceManager, RestTypeProvider restTypeProvider)
			: base(pluginProvider, rssFeedProviders, csvDefinitions, entityConfigurationProvider, repository, appSettingsProvider, resourceManager, restTypeProvider)
		{
		}
		[RequiredPermission(PermissionName.Index, Group = ChecklistsPlugin.PermissionGroup.ServiceOrderChecklist)]
		public override ActionResult FilterTemplate() => base.FilterTemplate();

		[RequiredPermission(PermissionName.Index, Group = ChecklistsPlugin.PermissionGroup.ServiceOrderChecklist)]
		[RenderAction("ServiceOrderChecklistListFilterTemplate")]
		public virtual ActionResult JobFilterTemplate() => PartialView();
	}
}
