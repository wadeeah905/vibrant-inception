namespace Crm.Order.Controllers
{
	using System;
	using System.Collections.Generic;
	using System.Linq;
	using Crm.Controllers;
	using Crm.Library.Data.Domain.DataInterfaces;
	using Crm.Library.EntityConfiguration;
	using Crm.Library.EntityConfiguration.Interfaces;
	using Crm.Library.Extensions;
	using Crm.Library.Globalization.Resource;
	using Crm.Library.Globalization.Lookup;
	using Crm.Library.Helper;
	using Crm.Library.Model;
	using Crm.Library.Model.Authorization.PermissionIntegration;
	using Crm.Library.Modularization;
	using Crm.Library.Modularization.Interfaces;
	using Crm.Library.Rest;
	using Crm.Library.Services.Interfaces;
	using Crm.Order.Model;
	using Microsoft.AspNetCore.Mvc;
	using Crm.Model.Lookups;
	using Crm.Order.Model.Lookups;
	using NHibernate.Linq;

	public class OfferListController : GenericListController<Offer>
	{
		public OfferListController(IPluginProvider pluginProvider, IEnumerable<IRssFeedProvider<Offer>> rssFeedProviders, IEnumerable<ICsvDefinition<Offer>> csvDefinitions, IEntityConfigurationProvider<Offer> entityConfigurationProvider, IRepository<Offer> repository, IAppSettingsProvider appSettingsProvider, IResourceManager resourceManager, RestTypeProvider restTypeProvider)
			: base(pluginProvider, rssFeedProviders, csvDefinitions, entityConfigurationProvider, repository, appSettingsProvider, resourceManager, restTypeProvider)
		{
		}
		[RequiredPermission(PermissionName.Read, Group = OrderPlugin.PermissionGroup.Offer)]
		[RenderAction("OfferItemTemplateActions", Priority = 100)]
		public virtual ActionResult ActionDetails()
		{
			return PartialView();
		}

		[RequiredPermission(PermissionName.Index, Group = OrderPlugin.PermissionGroup.Offer)]
		public override ActionResult FilterTemplate() => base.FilterTemplate();

		[RequiredPermission(PermissionName.Index, Group = OrderPlugin.PermissionGroup.Offer)]
		public override ActionResult IndexTemplate()
		{
			return base.IndexTemplate();
		}

		protected override string GetTitle()
		{
			return "Offers";
		}

		protected override string GetEmptySlate()
		{
			return repository.GetAll().Any() ? resourceManager.GetTranslation("NoOffersMatch") : resourceManager.GetTranslation("NoOffersAvailable");
		}

		public virtual ActionResult ExportOffers()
		{
			throw new NotImplementedException();
		}

		[RequiredPermission(PermissionName.Create, Group = OrderPlugin.PermissionGroup.Offer)]
		public override ActionResult MaterialPrimaryAction()
		{
			return PartialView();
		}

		public class OfferCsvDefinition : CsvDefinition<Offer>
		{
			private readonly ILookupManager lookupManager;
			private readonly IUserService userService;

			public override IQueryable<Offer> Eager(IQueryable<Offer> query)
			{
				return query
						.Fetch(x => x.Company)
						.Fetch(x => x.ContactPerson)
						.Fetch(x => x.ResponsibleUserObject)
					;
			}
			public OfferCsvDefinition(IUserService userService, IResourceManager resourceManager, ILookupManager lookupManager)
				: base(resourceManager)
			{
				this.userService = userService;
				this.lookupManager = lookupManager;
			}
			public override string GetCsv(IEnumerable<Offer> items) {
				var orderCategories = lookupManager.List<OrderCategory>();
				var currencies = lookupManager.List<Currency>();

				Property("Id", x => x.Id);
				Property("OrderNo", x => x.OrderNo ?? string.Empty);
				Property("OrderCategory", x => x.OrderCategoryKey.IsNotNullOrEmpty() ? orderCategories.FirstOrDefault(c => c.Key == x.OrderCategoryKey)?.Value : string.Empty);
				Property("Company", x => x.Company != null ? x.Company?.Name : string.Empty);
				Property("CustomerOrderNumber", x => x.CustomerOrderNumber);
				Property("ContactPerson", x => x.ContactPerson);
				Property("OrderDate", x => $"{x.OrderDate:d}");
				Property("ValidTo", x => x.ValidTo.ToShortDateString());
				Property("Value", x => x.CalculatedPrice.ToString("N"));
				Property("Price", x => x.CalculatedPriceWithDiscount.ToString("N"));
				Property("Currency", x => x.CurrencyKey.IsNotNullOrEmpty() ? currencies.FirstOrDefault(c => c.Key == x.CurrencyKey)?.Value : string.Empty);
				Property("PublicDescription", x => x.PublicDescription);
				Property("ResponsibleUser", x => x.ResponsibleUserObject != null ? x.ResponsibleUserObject.DisplayName : x.ResponsibleUser);

				Property("CreateDate", x => x.CreateDate.ToShortDateString());
				Property("ModifyDate", x => x.ModifyDate.ToShortDateString());
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
