namespace("Crm.Service.ViewModels").ServiceObjectListIndexViewModel = function() {
	var viewModel = this;
	viewModel.currentUser = window.ko.observable(null);
	viewModel.currentUserUsergroups = window.ko.pureComputed(function() {
		return viewModel.currentUser()
			? viewModel.currentUser().Usergroups
			: [];
	});
	var joinAddresses = {
		Selector: "Addresses",
		Operation: "filter(function(a) { return a.IsCompanyStandardAddress === true; })"
	};
	var joinTags = {
		Selector: "Tags",
		Operation: "orderBy(function(t) { return t.Name; })"
	};
	window.Main.ViewModels.GeolocationViewModel.apply(viewModel, arguments);
	window.Main.ViewModels.ContactListViewModel.call(viewModel,
		"CrmService_ServiceObject",
		["ObjectNo", "Name"],
		["ASC", "ASC"],
		["ResponsibleUserUser", joinAddresses, joinTags]);
	viewModel.lookups = {
		countries: { $tableName: "Main_Country" },
		regions: { $tableName: "Main_Region" },
		serviceObjectCategories: { $tableName: "CrmService_ServiceObjectCategory" }
	};
	viewModel.getFilter("StandardAddress.IsCompanyStandardAddress")(true);
	window.Main.ViewModels.GenericListMapViewModel.call(this);
	viewModel.latitudeFilterColumn = "StandardAddress.Latitude";
	viewModel.longitudeFilterColumn = "StandardAddress.Longitude";
};
namespace("Crm.Service.ViewModels").ServiceObjectListIndexViewModel.prototype =
	Object.create(window.Main.ViewModels.ContactListViewModel.prototype);
namespace("Crm.Service.ViewModels").ServiceObjectListIndexViewModel.prototype.init = function() {
	var viewModel = this;
	var args = arguments;
	return window.Helper.User.getCurrentUser().then(function(user) {
			viewModel.currentUser(user);
		}).then(function() {
			return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups);
		}).then(function() {
			return window.Main.ViewModels.ContactListViewModel.prototype.init.apply(viewModel, args);
		}).then(function() {
			return window.Main.ViewModels.GeolocationViewModel.prototype.init.apply(viewModel, args);
		});
};
namespace("Crm.Service.ViewModels").ServiceObjectListIndexViewModel.prototype.initItems = function (items) {
	const viewModel = this;
	const args = arguments;
	var queries = [];
	items.forEach(function (serviceObject) {
		queries.push({
			queryable: window.database.CrmService_Installation.filter(function (it) {
					return it.FolderId === this.serviceObjectId;
				},
				{ serviceObjectId: serviceObject.Id }),
			method: "count",
			handler: function (count) {
				serviceObject.InstallationsCount = count;
				return items;
			}
		});
	});
	return Helper.Batch.Execute(queries).then(function () {
		return window.Main.ViewModels.ContactListViewModel.prototype.initItems.apply(viewModel, args);
	});
};
namespace("Crm.Service.ViewModels").ServiceObjectListIndexViewModel.prototype.dispose = function() {
	return window.Main.ViewModels.GeolocationViewModel.prototype.dispose.apply(this, arguments);
};
namespace("Crm.Service.ViewModels").ServiceObjectListIndexViewModel.prototype.getAddress = function (item) {
	return (window.ko.unwrap(item.Addresses) || [])[0];
};
namespace("Crm.Service.ViewModels").ServiceObjectListIndexViewModel.prototype.getDirection =
	function(serviceObject) {
		return window.Main.ViewModels.GeolocationViewModel.prototype.getDirection.call(this, serviceObject);
	};
namespace("Crm.Service.ViewModels").ServiceObjectListIndexViewModel.prototype.getDistance =
	function(serviceObject) {
		return window.Main.ViewModels.GeolocationViewModel.prototype.getDistance.call(this, serviceObject);
	};
namespace("Crm.Service.ViewModels").ServiceObjectListIndexViewModel.prototype.getPopupInformation = function (item) {
	return window.Helper.ServiceObject.getDisplayName(item);
};
namespace("Crm.Service.ViewModels").ServiceObjectListIndexViewModel.prototype.getIconName = function(item) {
	return "marker_pin3";
};
namespace("Crm.Service.ViewModels").ServiceObjectListIndexViewModel.prototype.getLatitude = function (item) {
	var address = this.getAddress(item);
	return address ? window.ko.unwrap(address.Latitude) : null;
};
namespace("Crm.Service.ViewModels").ServiceObjectListIndexViewModel.prototype.getLongitude = function (item) {
	var address = this.getAddress(item);
	return address ? window.ko.unwrap(address.Longitude) : null;
};