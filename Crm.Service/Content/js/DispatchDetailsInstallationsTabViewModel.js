namespace("Crm.Service.ViewModels").DispatchDetailsInstallationsTabViewModel = function(parentViewModel) {
	window.Main.ViewModels.ViewModelBase.call(this, arguments);
	var viewModel = this;
	viewModel.dispatch = parentViewModel.dispatch;
	viewModel.lookups = parentViewModel.lookups;
	viewModel.lookups.installationHeadStatuses = viewModel.lookups.installationHeadStatuses || { $tableName: "CrmService_InstallationHeadStatus" };
	viewModel.lookups.installationTypes = viewModel.lookups.installationTypes || { $tableName: "CrmService_InstallationType" };
	viewModel.lookups.manufacturers = viewModel.lookups.manufacturers || { $tableName: "CrmService_Manufacturer" };
	viewModel.serviceOrder = parentViewModel.serviceOrder;
	window.Main.ViewModels.ContactListViewModel.call(viewModel,
		"CrmService_Installation",
		["InstallationNo"],
		["ASC"],
		["Address"]);
	if (viewModel.serviceOrder().InstallationId()) {
		viewModel.getFilter("Id").extend({ filterOperator: "===" })(viewModel.serviceOrder().InstallationId());
	}
	viewModel.infiniteScroll(true);
	viewModel.firstInstallationActive = window.ko.pureComputed(function() {
		if (viewModel.items().length === 1) {
			return true;
		}
		if (viewModel.dispatch() && viewModel.dispatch().CurrentServiceOrderTime() &&
			viewModel.dispatch().CurrentServiceOrderTime().InstallationId()) {
			return viewModel.items()[0].Id() === viewModel.dispatch().CurrentServiceOrderTime().InstallationId();
		}
		return false;
	});
};
namespace("Crm.Service.ViewModels").DispatchDetailsInstallationsTabViewModel.prototype =
	Object.create(window.Main.ViewModels.ContactListViewModel.prototype);
namespace("Crm.Service.ViewModels").DispatchDetailsInstallationsTabViewModel.prototype.init = function() {
	var viewModel = this;
	return window.Main.ViewModels.ContactListViewModel.prototype.init.apply(viewModel, arguments).then(function() {
		return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups);
	});
};
namespace("Crm.Service.ViewModels").DispatchDetailsInstallationsTabViewModel.prototype.applyFilters = function (query) {
	var viewModel = this;
	query = window.Crm.Service.ViewModels.InstallationListIndexViewModel.prototype.applyFilters.call(viewModel, query);
	if (viewModel.serviceOrder().InstallationId()) {
		return query;
	}
	return query.filter("filterByServiceOrderTimes", { orderId: viewModel.serviceOrder().Id() });
};
namespace("Crm.Service.ViewModels").DispatchDetailsInstallationsTabViewModel.prototype.applyOrderBy = function(query) {
	var viewModel = this;
	var id = null;
	if (viewModel.dispatch() && viewModel.dispatch().CurrentServiceOrderTime() && viewModel.dispatch().CurrentServiceOrderTime().InstallationId()) {
		id = viewModel.dispatch().CurrentServiceOrderTime().InstallationId();
	}
	query = query.orderByDescending("orderByCurrentServiceOrderTime", { currentServiceOrderTimeId: id });
	return window.Main.ViewModels.ContactListViewModel.prototype.applyOrderBy.call(viewModel, query);
};
namespace("Crm.Service.ViewModels").DispatchDetailsInstallationsTabViewModel.prototype.getAvatarColor = function(installation) {
	return "#9E9E9E";
};
namespace("Crm.Service.ViewModels").DispatchDetailsInstallationsTabViewModel.prototype.getAvatarText = function(installation) {
	var viewModel = this;
	var installationTypeKey = window.ko.unwrap(installation.InstallationTypeKey);
	if (installationTypeKey) {
		var installationType = viewModel.lookups.installationTypes[installationTypeKey];
		if (installationType && installationType.Value) {
			return installationType.Value[0];
		}
	}
	return "";
};