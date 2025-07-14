namespace("Crm.Service.ViewModels").InstallationListIndexViewModel = function () {
	var viewModel = this;
	viewModel.currentUser = window.ko.observable(null);
	var joinTags = {
		Selector: "Tags",
		Operation: "orderBy(function(t) { return t.Name; })"
	};
	window.Main.ViewModels.GeolocationViewModel.apply(viewModel, arguments);
	window.Main.ViewModels.ContactListViewModel.call(viewModel,
		"CrmService_Installation",
		["InstallationNo", "Description"],
		["ASC", "ASC"],
		["Company", "ResponsibleUserUser", "ServiceObject", "Address", joinTags]);
	viewModel.lookups = {
		countries: { $tableName: "Main_Country" },
		regions: { $tableName: "Main_Region" },
		installationHeadStatuses: { $tableName: "CrmService_InstallationHeadStatus" },
		installationTypes: { $tableName: "CrmService_InstallationType" }
	};
	window.Main.ViewModels.GenericListMapViewModel.call(this);
	viewModel.latitudeFilterColumn = "Address.Latitude";
	viewModel.longitudeFilterColumn = "Address.Longitude";
};
namespace("Crm.Service.ViewModels").InstallationListIndexViewModel.prototype =
	Object.create(window.Main.ViewModels.ContactListViewModel.prototype);
namespace("Crm.Service.ViewModels").InstallationListIndexViewModel.prototype.init = function () {
	var viewModel = this;
	var args = arguments;
	return window.Helper.User.getCurrentUser().then(function (user) {
		viewModel.currentUser(user);
	}).then(function () {
		return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups);
	}).then(function () {
		return window.Main.ViewModels.ContactListViewModel.prototype.init.apply(viewModel, args);
	}).then(function () {
		return window.Main.ViewModels.GeolocationViewModel.prototype.init.apply(viewModel, args);
	});
};
namespace("Crm.Service.ViewModels").InstallationListIndexViewModel.prototype.applyFilters = function (query) {
	var viewModel = this;
	if (viewModel.filters["LocationAddress.City"]) {
		viewModel.filters["Address.City"] = viewModel.filters["LocationAddress.City"];
		delete viewModel.filters["LocationAddress.City"];
	}
	if (viewModel.filters["LocationAddress.Street"]) {
		viewModel.filters["Address.Street"] = viewModel.filters["LocationAddress.Street"];
		delete viewModel.filters["LocationAddress.Street"];
	}
	if (viewModel.filters["LocationAddress.ZipCode"]) {
		viewModel.filters["Address.ZipCode"] = viewModel.filters["LocationAddress.ZipCode"];
		delete viewModel.filters["LocationAddress.ZipCode"];
	}
	return window.Main.ViewModels.ContactListViewModel.prototype.applyFilters.apply(this, arguments);
};
namespace("Crm.Service.ViewModels").InstallationListIndexViewModel.prototype.dispose = function () {
	return window.Main.ViewModels.GeolocationViewModel.prototype.dispose.apply(this, arguments);
};
namespace("Crm.Service.ViewModels").InstallationListIndexViewModel.prototype.getAddress = function (item) {
	return window.ko.unwrap(item.Address);
};
namespace("Crm.Service.ViewModels").InstallationListIndexViewModel.prototype.getDirection =
	function (installation) {
		return window.Main.ViewModels.GeolocationViewModel.prototype.getDirection.call(this, installation);
	};
namespace("Crm.Service.ViewModels").InstallationListIndexViewModel.prototype.getDistance =
	function (installation) {
		return window.Main.ViewModels.GeolocationViewModel.prototype.getDistance.call(this, installation);
	};
namespace("Crm.Service.ViewModels").InstallationListIndexViewModel.prototype.getPopupInformation = function (item) {
	return window.Helper.Installation.getDisplayName(item);
};
namespace("Crm.Service.ViewModels").InstallationListIndexViewModel.prototype.getIconName = function (item) {
	return "marker_pin3";
};
namespace("Crm.Service.ViewModels").InstallationListIndexViewModel.prototype.getLatitude = function (item) {
	var address = this.getAddress(item);
	return address ? window.ko.unwrap(address.Latitude) : null;
};
namespace("Crm.Service.ViewModels").InstallationListIndexViewModel.prototype.getLongitude = function (item) {
	var address = this.getAddress(item);
	return address ? window.ko.unwrap(address.Longitude) : null;
};