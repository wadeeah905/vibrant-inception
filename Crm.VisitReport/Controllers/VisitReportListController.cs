namespace Crm.VisitReport.Controllers
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
	using Crm.VisitReport.Model;

	using Microsoft.AspNetCore.Mvc;

	public class VisitReportListController : GenericListController<VisitReport>
	{
		public VisitReportListController(IPluginProvider pluginProvider, IEnumerable<IRssFeedProvider<VisitReport>> rssFeedProviders, IEnumerable<ICsvDefinition<VisitReport>> csvDefinitions, IEntityConfigurationProvider<VisitReport> entityConfigurationProvider, IRepository<VisitReport> repository, IAppSettingsProvider appSettingsProvider, IResourceManager resourceManager, RestTypeProvider restTypeProvider)
			: base(pluginProvider, rssFeedProviders, csvDefinitions, entityConfigurationProvider, repository, appSettingsProvider, resourceManager, restTypeProvider)
		{
		}
		[RequiredPermission(PermissionName.Index, Group = VisitReportPlugin.PermissionGroup.VisitReport)]
		public override ActionResult FilterTemplate() => base.FilterTemplate();
	}
}
