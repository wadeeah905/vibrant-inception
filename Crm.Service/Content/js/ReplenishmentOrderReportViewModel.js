;
(function(ko) {
	namespace("Crm.Service.ViewModels").ReplenishmentOrderReportViewModel = function() {
		var viewModel = this;
		viewModel.replenishmentOrder = ko.observable(null);
		viewModel.site = ko.observable(null);
		viewModel.lookups = {
			quantityUnits: { $tableName: "CrmArticle_QuantityUnit" }
		}
		viewModel.headerHeight = ko.observable(0);
		viewModel.footerHeight = ko.observable(0);
	};
	namespace("Crm.Service.ViewModels").ReplenishmentOrderReportViewModel.prototype.init = function(id) {
		var viewModel = this;
		return window.Helper.Database.initialize().then(function () {
			return window.Crm.Offline.Bootstrapper.initializeSettings();
		}).then(function () {
			return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups);
		}).then(function() {
			return window.database.CrmService_ReplenishmentOrder
				.include("Items")
				.include("Items.ServiceOrderMaterials")
				.include("Items.ServiceOrderMaterials.ServiceOrderHead")
				.include("ResponsibleUserObject")
				.find(id);
		}).then(function(replenishmentOrder) {
			viewModel.replenishmentOrder(replenishmentOrder.asKoObservable());
			viewModel.replenishmentOrder().Items(viewModel.replenishmentOrder().Items().sort(function (x, y) {
				return x.MaterialNo().localeCompare(y.MaterialNo());
			}));
		}).then(function() {
			return window.database.Main_Site.GetCurrentSite().first();
		}).then(function(site) {
			viewModel.site(site);
			if (window.Main &&
				window.Main.Settings &&
				window.Main.Settings.Report) {
				var headerHeight = +window.Main.Settings.Report.HeaderHeight +
					+window.Main.Settings.Report.HeaderSpacing;
				viewModel.headerHeight(headerHeight);
				var footerHeight = +window.Main.Settings.Report.FooterHeight +
					+window.Main.Settings.Report.FooterSpacing;
				viewModel.footerHeight(footerHeight);
			}
		});
	};
	namespace("Crm.Service.ViewModels").ReplenishmentOrderReportPreviewModalViewModel = namespace("Crm.Service.ViewModels").ReplenishmentOrderReportViewModel;
	namespace("Crm.Service.ViewModels").ReplenishmentOrderReportPreviewModalViewModel.prototype = namespace("Crm.Service.ViewModels").ReplenishmentOrderReportViewModel.prototype;
	namespace("Crm.Service.ViewModels").ReplenishmentOrderReportViewModel.prototype.sumQty = function(materialNo) {
		var viewModel = this;
		var sum = 0;
		viewModel.replenishmentOrder().Items().forEach(function (item) {
			if (item.MaterialNo() == materialNo)
				sum += item.Quantity();
		});
		return sum;
	}
})(ko);