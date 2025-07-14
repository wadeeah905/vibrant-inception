namespace Crm.Service.Controllers
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
	using Crm.Service.Model;

	using Microsoft.AspNetCore.Mvc;

	public class StoreListController : GenericListController<Store>
	{
		protected override string GetTitle()
		{
			return "Stores";
		}
		protected override string GetEmptySlate()
		{
			return resourceManager.GetTranslation("StoreEmptySlate");
		}
		[RequiredPermission(PermissionName.Index, Group = ServicePlugin.PermissionGroup.Store)]
		public override ActionResult FilterTemplate() => base.FilterTemplate();
		[RequiredPermission(PermissionName.Index, Group = ServicePlugin.PermissionGroup.Store)]
		public override ActionResult IndexTemplate()
		{
			return base.IndexTemplate();
		}
		[RequiredPermission(PermissionName.Create, Group = ServicePlugin.PermissionGroup.Store)]
		public override ActionResult MaterialPrimaryAction()
		{
			return PartialView();
		}
		[RenderAction("StoreItemTemplateActions")]
		public virtual ActionResult ActionDetails()
		{
			return PartialView();
		}
		public StoreListController(IPluginProvider pluginProvider, IEnumerable<IRssFeedProvider<Store>> rssFeedProviders, IEnumerable<ICsvDefinition<Store>> csvDefinitions, IEntityConfigurationProvider<Store> entityConfigurationProvider, IRepository<Store> repository, IAppSettingsProvider appSettingsProvider, IResourceManager resourceManager, RestTypeProvider restTypeProvider)
			: base(pluginProvider, rssFeedProviders, csvDefinitions, entityConfigurationProvider, repository, appSettingsProvider, resourceManager, restTypeProvider)
		{
		}
	}
}
