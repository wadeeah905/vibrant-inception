namespace("Crm.Service.ViewModels").ServiceContractDetailsInstallationsTabViewModel = function (parentViewModel) {
	var viewModel = this;
	window.Main.ViewModels.GenericListViewModel.call(viewModel, "CrmService_ServiceContractInstallationRelationship", ["Child.InstallationNo", "Child.Description"], ["ASC", "ASC"], ["Child"]);
	viewModel.getFilter("ParentId").extend({ filterOperator: "===" })(parentViewModel.serviceContract().Id());
	viewModel.lookups = {
		installationTypes: { $tableName: "CrmService_InstallationType" }
	};
};
namespace("Crm.Service.ViewModels").ServiceContractDetailsInstallationsTabViewModel.prototype = Object.create(window.Main.ViewModels.GenericListViewModel.prototype);
namespace("Crm.Service.ViewModels").ServiceContractDetailsInstallationsTabViewModel.prototype.init = function () {
	var args = arguments;
	var viewModel = this;
	return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups)
		.then(function () {
			return window.Main.ViewModels.GenericListViewModel.prototype.init.apply(viewModel, args);
		});
};
namespace("Crm.Service.ViewModels").ServiceContractDetailsInstallationsTabViewModel.prototype.deleteRelationship = window.Main.ViewModels.BaseRelationshipsTabViewModel.prototype.deleteRelationship;
namespace("Crm.Service.ViewModels").ServiceContractDetailsInstallationsTabViewModel.prototype.getInverseRelationship = function() {
	return new $.Deferred().resolve(null).promise();
};