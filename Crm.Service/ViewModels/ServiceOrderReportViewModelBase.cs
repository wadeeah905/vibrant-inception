namespace Crm.Service.ViewModels
{
	using System;
	using System.Collections.Generic;
	using System.Linq;

	using Crm.Article.Model.Lookups;
	using Crm.Library.Globalization.Lookup;
	using Crm.Library.Helper;
	using Crm.Library.Model.Site;
	using Crm.Library.ViewModels;
	using Crm.Model;
	using Crm.Model.Lookups;
	using Crm.Service.Enums;
	using Crm.Service.Model;
	using Crm.Service.Model.Lookup;
	using Crm.Services.Interfaces;

	public abstract class ServiceOrderReportViewModelBase : HtmlTemplateViewModel
	{
		public ServiceOrderReportViewModelBase(ServiceOrderHead serviceOrder, IAppSettingsProvider appSettingsProvider, ILookupManager lookupManager, ISiteService siteService)
		{
			if (serviceOrder == null)
			{
				return;
			}
			this.serviceOrder = serviceOrder;
			var descriptions = new Dictionary<string, string>();
			var materialItemNos = serviceOrder?.ServiceOrderMaterials.Select(x => (ItemNo: x.ItemNo, Description: x.Article?.Description)) ?? Enumerable.Empty<(string, string)>();
			var timePostingItemNos = serviceOrder?.ServiceOrderTimePostings.Select(x => (ItemNo: x.ItemNo, Description: x.Article?.Description)) ?? Enumerable.Empty<(string, string)>();
			foreach (var (itemNo, description) in materialItemNos.Concat(timePostingItemNos))
			{
				if (itemNo != null && !descriptions.ContainsKey(itemNo))
				{
					descriptions.Add(itemNo, description);
				}
			}
			foreach (var articleDescription in lookupManager.List<ArticleDescription>(x => descriptions.Keys.ToArray().Contains(x.Key)))
			{
				descriptions[articleDescription.Key] = articleDescription.Value;
			}

			lookups = new Dictionary<string, object>
			{
				{ "quantityUnits", lookupManager.List<QuantityUnit>().ToDictionary(x => x.Key) },
				{ "countries", lookupManager.List<Country>().ToDictionary(x => x.Key) },
				{ "noPreviousSerialNoReasons", lookupManager.List<NoPreviousSerialNoReason>().ToDictionary(x => x.Key) },
				{ "installationStatus", lookupManager.List<InstallationHeadStatus>().ToDictionary(x => x.Key) },
				{ "serviceOrderTypes", lookupManager.List<ServiceOrderType>().ToDictionary(x => x.Key) },
				{ "articleDescriptions", descriptions },
				{ "timePostingUserDisplayNames", serviceOrder?.ServiceOrderTimePostings.Where(x => x.UserUsername != null).GroupBy(k => k.UserUsername, e => e.UserDisplayName).ToDictionary(k => k.Key, v => v.First()) },
				{ "invoicingTypes", lookupManager.List<InvoicingType>().ToDictionary(x => x.Key) },
				{ "manufacturers", lookupManager.List<Manufacturer>().ToDictionary(x => x.Key) },
				{ "installationTypes", lookupManager.List<InstallationType>().ToDictionary(x => x.Key) }
			};
			FooterContentSize = appSettingsProvider.GetValue(MainPlugin.Settings.Report.FooterHeight);
			FooterContentSpacing = appSettingsProvider.GetValue(MainPlugin.Settings.Report.FooterMargin);
			HeaderContentSize = appSettingsProvider.GetValue(MainPlugin.Settings.Report.HeaderHeight);
			HeaderContentSpacing = appSettingsProvider.GetValue(MainPlugin.Settings.Report.HeaderMargin);
			maintenanceOrderGenerationMode = Enum.GetName(typeof(MaintenanceOrderGenerationMode), appSettingsProvider.GetValue(ServicePlugin.Settings.ServiceContract.MaintenanceOrderGenerationMode));
			site = siteService.CurrentSite;
			suppressEmptyMaterialsInReport = appSettingsProvider.GetValue(ServicePlugin.Settings.Dispatch.SuppressEmptyMaterialsInReport);
			suppressEmptyTimePostingsInReport = appSettingsProvider.GetValue(ServicePlugin.Settings.Dispatch.SuppressEmptyTimePostingsInReport);
			suppressEmptyJobsInReport = appSettingsProvider.GetValue(ServicePlugin.Settings.Dispatch.SuppressEmptyJobsInReport);
		}

		public virtual Contact customerContact => serviceOrder?.CustomerContact;
		public virtual Address customerContactAddress => customerContact?.StandardAddress;
		public abstract ServiceOrderMaterial[] displayedMaterials { get; }
		public abstract ServiceOrderTimePosting[] displayedTimePostings { get; }
		public virtual ServiceOrderMaterialSerial[] displayedMaterialSerials => displayedMaterials.SelectMany(x => x.ServiceOrderMaterialSerials).OrderBy(x => x.CreateDate).ToArray();
		public virtual double FooterContentSize { get; }
		public virtual double FooterContentSpacing { get; }
		public virtual double HeaderContentSize { get; }
		public virtual double HeaderContentSpacing { get; }
		public virtual Company initiator => serviceOrder?.Initiator;
		public virtual Person initiatorPerson => serviceOrder?.InitiatorPerson;
		public virtual Address initiatorAddress => initiator?.StandardAddress;
		public virtual Email initiatorEmail => initiatorPerson?.Emails.OrderBy(x => x.CreateDate).FirstOrDefault() ?? initiatorAddress?.Emails.OrderBy(x => x.CreateDate).FirstOrDefault();
		public virtual Phone initiatorPhone => initiatorPerson?.Phones.OrderBy(x => x.CreateDate).FirstOrDefault(x => x.TypeKey != PhoneType.MobileKey) ?? initiatorAddress?.Phones.OrderBy(x => x.CreateDate).FirstOrDefault(x => x.TypeKey != PhoneType.MobileKey);
		public virtual Phone initiatorMobile => initiatorPerson?.Phones.OrderBy(x => x.CreateDate).FirstOrDefault(x => x.TypeKey == PhoneType.MobileKey) ?? initiatorAddress?.Phones.OrderBy(x => x.CreateDate).FirstOrDefault(x => x.TypeKey == PhoneType.MobileKey);
		public virtual Installation installation => serviceOrder?.AffectedInstallation;
		public virtual Installation[] installations => serviceOrder?.ServiceOrderTimes.Where(x => x.Installation != null).Select(x => x.Installation).Distinct().ToArray();
		public virtual Company invoiceRecipient => serviceOrder?.InvoiceRecipient;
		public virtual ServiceOrderMaterial[] materials => serviceOrder?.ServiceOrderMaterials.ToArray();
		public virtual Company payer => serviceOrder?.Payer;
		public virtual QuantityUnit[] quantityUnits { get; }
		public virtual NoPreviousSerialNoReason[] noPreviousSerialNoReasons { get; }
		public virtual ServiceObject serviceObject => serviceOrder?.ServiceObject;
		public virtual ServiceOrderHead serviceOrder { get; }
		public virtual ServiceOrderTimePosting[] serviceOrderTimePostings => serviceOrder?.ServiceOrderTimePostings.ToArray();
		public virtual ServiceOrderTime[] serviceOrderTimes => serviceOrder?.ServiceOrderTimes.ToArray();
		public virtual Site site { get; }
		public virtual string maintenanceOrderGenerationMode { get; }
		public virtual Dictionary<string, object> lookups { get; }
		public virtual bool suppressEmptyMaterialsInReport { get; }
		public virtual bool suppressEmptyTimePostingsInReport { get; }
		public virtual bool suppressEmptyJobsInReport { get; }
	}
}
