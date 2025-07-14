namespace("Customer.Kagema.ViewModels").ServiceOrderExportErrorsListIndexViewModel = function () {
	var viewModel = this;
	viewModel.currentUser = window.ko.observable(null);
	var joinTags = {
		Selector: "Tags",
		Operation: "orderBy(function(t) { return t.Name; })"
	};
	window.Main.ViewModels.ContactListViewModel.call(this,
		"CrmService_ServiceOrderHead",
		["ModifyDate"],
		["DESC",],
		["Installation", "Installation.Address", "Installation.Company", "Company", "ServiceObject", "ServiceOrderTemplate", "ServiceOrderTimes", "ServiceOrderTimes.Installation", "Station", joinTags]);
	viewModel.lookups = {
		countries: { $tableName: "Main_Country" },
		installationHeadStatuses: { $tableName: "CrmService_InstallationHeadStatus" },
		regions: { $tableName: "Main_Region" },
		serviceOrderTypes: { $tableName: "CrmService_ServiceOrderType" },
		servicePriorities: { $tableName: "CrmService_ServicePriority" },
		serviceOrderStatuses: { $tableName: "CrmService_ServiceOrderStatus" }
	};
	viewModel.infiniteScroll(true);
	window.Main.ViewModels.GenericListMapViewModel.call(this);

	var OrderExportErrorsBookmark = {
		Category: window.Helper.String.getTranslatedString("Filter"),
		Name: window.Helper.String.getTranslatedString("ServiceOrderExportErrorsList"),
		Key: "ServiceOrderExportErrorsList",
		Expression: function (query) {
			return query.filter(function (it) { return it.ExtensionValues.ExportDetails !== null && it.StatusKey !== 'Closed'; })
		}
	};

	viewModel.bookmarks.push(OrderExportErrorsBookmark);
	viewModel.bookmark(OrderExportErrorsBookmark);
};



namespace("Customer.Kagema.ViewModels").ServiceOrderExportErrorsListIndexViewModel.prototype = Object.create(window.Main.ViewModels.ContactListViewModel.prototype);
namespace("Customer.Kagema.ViewModels").ServiceOrderExportErrorsListIndexViewModel.prototype.init = function () {
	var viewModel = this;
	var args = arguments;
	return window.Helper.User.getCurrentUser().then(function (user) {
		viewModel.currentUser(user);
	}).then(function () {
		return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups);
	}).then(function () {
		return window.Main.ViewModels.ContactListViewModel.prototype.init.apply(viewModel, args);
	}).then(function () {
		viewModel.infiniteScroll(false);
	})


};