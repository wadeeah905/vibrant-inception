namespace Crm.Order.Controllers
{
	using System.Collections.Generic;
	using System.Linq;

	using Crm.Controllers;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.EntityConfiguration;
	using Crm.Library.EntityConfiguration.Interfaces;
	using Crm.Library.Extensions;
	using Crm.Library.Globalization.Lookup;
	using Crm.Library.Globalization.Resource;
	using Crm.Library.Helper;
	using Crm.Library.Model;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization;
	using Crm.Library.Modularization.Interfaces;
	using Crm.Library.Rest;
	using Crm.Library.Services.Interfaces;
	using Crm.Model.Lookups;
	using Crm.Order.Model;
	using Crm.Order.Model.Lookups;

	using Microsoft.AspNetCore.Mvc;

	using NHibernate.Linq;

	using PermissionGroup = OrderPlugin.PermissionGroup;

	public class OrderListController : GenericListController<Order>
	{
		public OrderListController(IPluginProvider pluginProvider, IEnumerable<IRssFeedProvider<Order>> rssFeedProviders, IEnumerable<ICsvDefinition<Order>> csvDefinitions, IEntityConfigurationProvider<Order> entityConfigurationProvider, IRepository<Order> repository, IAppSettingsProvider appSettingsProvider, IResourceManager resourceManager, RestTypeProvider restTypeProvider)
			: base(pluginProvider, rssFeedProviders, csvDefinitions, entityConfigurationProvider, repository, appSettingsProvider, resourceManager, restTypeProvider)
		{
		}
		[RequiredPermission(PermissionName.Read, Group = PermissionGroup.Order)]
		[RenderAction("OrderItemTemplateActions", Priority = 100)]
		public virtual ActionResult ActionDetails()
		{
			return PartialView();
		}

		[RequiredPermission(PermissionName.Index, Group = PermissionGroup.Order)]
		public override ActionResult FilterTemplate() => base.FilterTemplate();

		[RequiredPermission(PermissionName.Index, Group = PermissionGroup.Order)]
		public override ActionResult IndexTemplate()
		{
			return base.IndexTemplate();
		}
		protected override string GetTitle()
		{
			return "Orders";
		}

		protected override string GetEmptySlate()
		{
			return repository.GetAll().Any() ? resourceManager.GetTranslation("NoOrdersMatch") : resourceManager.GetTranslation("NoOrdersAvailable");
		}

		[RequiredPermission(PermissionName.Create, Group = PermissionGroup.Order)]
		public override ActionResult MaterialPrimaryAction()
		{
			return PartialView();
		}

		public class OrderCsvDefinition : CsvDefinition<Order>
		{
			private readonly IUserService userService;
			private readonly ILookupManager lookupManager;
			public override IQueryable<Order> Eager(IQueryable<Order> query)
			{
				return query
					.Fetch(x => x.Company)
					.Fetch(x => x.ContactPerson)
					.Fetch(x => x.ResponsibleUserObject)
					;
			}
			public OrderCsvDefinition(IUserService userService, IResourceManager resourceManager, ILookupManager lookupManager)
				: base(resourceManager)
			{
				this.userService = userService;
				this.lookupManager = lookupManager;
			}
			public override string GetCsv(IEnumerable<Order> items) {
				var orderCategories = lookupManager.List<OrderCategory>();
				var currencies = lookupManager.List<Currency>();

				Property("Id", x => x.Id);
				Property("OrderNo", x => x.OrderNo ?? string.Empty);
				Property("OrderCategory", x => x.OrderCategoryKey.IsNotNullOrEmpty() ? orderCategories.FirstOrDefault(c => c.Key == x.OrderCategoryKey)?.Value : string.Empty);
				Property("Company", x => x.Company != null ? x.Company.Name : string.Empty);
				Property("CustomerOrderNumber", x => x.CustomerOrderNumber);
				Property("ContactPerson", x => x.ContactPerson);
				Property("OrderDate", x => $"{x.OrderDate:d}");
				Property("Value", x => x.CalculatedPrice.ToString("N"));
				Property("Price", x => x.CalculatedPriceWithDiscount.ToString("N"));
				Property("Currency", x => x.CurrencyKey.IsNotNullOrEmpty() ? currencies.FirstOrDefault(c => c.Key == x.CurrencyKey)?.Value : string.Empty);
				Property("PublicDescription", x => x.PublicDescription);
				Property("ResponsibleUser", x => x.ResponsibleUserObject != null ? x.ResponsibleUserObject.DisplayName : x.ResponsibleUser);
				Property("CreateDate", x => $"{x.CreateDate:d}");
				Property("ModifyDate", x => $"{x.ModifyDate:d}");
				Property(
					"CreateUser",
					x =>
					{
						var user = userService.GetUser(x.CreateUser);
						return user?.DisplayName;
					});
				Property(
					"ModifyUser",
					x =>
					{
						var user = userService.GetUser(x.ModifyUser);
						return user?.DisplayName;
					});

				//Internal Ids
				Property("OrderCategoryKey", x => x.OrderCategoryKey);
				Property("CurrencyKey", x => x.CurrencyKey);

				return base.GetCsv(items);
			}
		}
	}
}
