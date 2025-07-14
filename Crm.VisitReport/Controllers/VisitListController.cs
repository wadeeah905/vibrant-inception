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
	using Crm.Library.Modularization;
	using Crm.Library.Modularization.Interfaces;
	using Crm.Library.Rest;
	using Crm.Library.Services.Interfaces;
	using Crm.VisitReport.Model;

	using Microsoft.AspNetCore.Mvc;

	public class VisitListController : GenericListController<Visit>
	{
		public VisitListController(IPluginProvider pluginProvider, IEnumerable<IRssFeedProvider<Visit>> rssFeedProviders, IEnumerable<ICsvDefinition<Visit>> csvDefinitions, IEntityConfigurationProvider<Visit> entityConfigurationProvider, IRepository<Visit> repository, IAppSettingsProvider appSettingsProvider, IResourceManager resourceManager, RestTypeProvider restTypeProvider)
			: base(pluginProvider, rssFeedProviders, csvDefinitions, entityConfigurationProvider, repository, appSettingsProvider, resourceManager, restTypeProvider)
		{
		}
		[RequiredPermission(PermissionName.Read, Group = VisitReportPlugin.PermissionGroup.Visit)]
		[RenderAction("VisitItemTemplateActions", Priority = 100)]
		public virtual ActionResult ActionDetails()
		{
			return PartialView();
		}

		[RequiredPermission(PermissionName.Edit, Group = VisitReportPlugin.PermissionGroup.Visit)]
		[RenderAction("VisitItemTemplateActions", Priority = 100)]
		public virtual ActionResult ActionEdit()
		{
			return PartialView();
		}

		[RequiredPermission(PermissionName.Edit, Group = VisitReportPlugin.PermissionGroup.Visit)]
		[RenderAction("VisitItemTemplateActions", Priority = 80)]
		public virtual ActionResult ActionComplete()
		{
			return PartialView();
		}

		[RequiredPermission(PermissionName.Edit, Group = VisitReportPlugin.PermissionGroup.Visit)]
		[RenderAction("VisitItemTemplateActions", Priority = 90)]
		public virtual ActionResult ActionInProgress()
		{
			return PartialView();
		}

		[RequiredPermission(PermissionName.Index, Group = VisitReportPlugin.PermissionGroup.Visit)]
		public virtual ActionResult CircuitVisitIndexTemplate()
		{
			var model = GetGenericListViewModel();
			return PartialView(model);
		}
		[RequiredPermission(PermissionName.Index, Group = VisitReportPlugin.PermissionGroup.Visit)]
		public override ActionResult FilterTemplate() => base.FilterTemplate();
		[RequiredPermission(PermissionName.Index, Group = VisitReportPlugin.PermissionGroup.Visit)]
		public override ActionResult IndexTemplate() => base.IndexTemplate();
		[RequiredPermission(PermissionName.Create, Group = VisitReportPlugin.PermissionGroup.Visit)]
		public override ActionResult MaterialPrimaryAction()
		{
			return PartialView();
		}
		[RequiredPermission(PermissionName.Index, Group = VisitReportPlugin.PermissionGroup.Visit)]
		public virtual ActionResult PreparedVisitIndexTemplate()
		{
			var model = GetGenericListViewModel();
			return PartialView(model);
		}
		[RequiredPermission(PermissionName.Index, Group = VisitReportPlugin.PermissionGroup.Visit)]
		public virtual ActionResult RecommendedVisitIndexTemplate()
		{
			var model = GetGenericListViewModel();
			return PartialView(model);
		}
		[RenderAction("VisitListTopMenu")]
		public virtual ActionResult TopMenu() => PartialView();
		protected override string GetTitle()
		{
			return "TourPlanning";
		}
	}
}
