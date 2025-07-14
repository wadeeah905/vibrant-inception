namespace("Crm.Service.ViewModels").ServiceOrderDetailsDispatchesTabViewModel = function(parentViewModel) {
	window.Main.ViewModels.ViewModelBase.call(this, arguments);
	var viewModel = this;
	viewModel.lookups = {
		serviceOrderDispatchRejectReasons: { $tableName: "CrmService_ServiceOrderDispatchRejectReason" },
		serviceOrderDispatchStatuses: { $tableName: "CrmService_ServiceOrderDispatchStatus" },
		serviceOrderStatuses: { $tableName: "CrmService_ServiceOrderStatus" }
	};
	viewModel.serviceOrder = parentViewModel.serviceOrder;
	viewModel.dispatchesCanBeAdded = window.ko.pureComputed(function() {
		if (!viewModel.serviceOrder()) {
			return false;
		}
		var serviceOrderStatus = viewModel.lookups.serviceOrderStatuses.$array.find(function(x) {
			return x.Key === viewModel.serviceOrder().StatusKey();
		});
		return window._.intersection((serviceOrderStatus.Groups || "").split(","), [
				"Scheduling", "InProgress"
			]).length > 0;
	});
	window.Main.ViewModels.GenericListViewModel.call(viewModel,
		"CrmService_ServiceOrderDispatch",
		["Date", "Time"],
		["ASC", "ASC"],
		["DispatchedUser"]);
	viewModel.getFilter("OrderId").extend({ filterOperator: "===" })(viewModel.serviceOrder().Id());
	viewModel.infiniteScroll(true);
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsDispatchesTabViewModel.prototype =
	Object.create(window.Main.ViewModels.GenericListViewModel.prototype);
namespace("Crm.Service.ViewModels").ServiceOrderDetailsDispatchesTabViewModel.prototype.applyJoins = function(query) {
	var viewModel = this;
	query = query.include("expandAvatar");
	return window.Main.ViewModels.GenericListViewModel.prototype.applyJoins.call(viewModel, query);
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsDispatchesTabViewModel.prototype.confirm =
	namespace("Crm.Service.ViewModels").ServiceOrderDispatchListIndexViewModel.prototype.confirm;
namespace("Crm.Service.ViewModels").ServiceOrderDetailsDispatchesTabViewModel.prototype.confirmDeleteDispatch =
	function(dispatch) {
		var viewModel = this;
		window.Helper.Confirm.confirmDelete().done(function() {
			viewModel.loading(true);
			return viewModel.deleteDispatch(dispatch);
		}).then(function() {
			return viewModel.filter();
		});
	};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsDispatchesTabViewModel.prototype.init = function() {
	var viewModel = this;
	var args = arguments;
	return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups)
		.then(function() {
			return window.Main.ViewModels.GenericListViewModel.prototype.init.apply(viewModel, args);
		});
};