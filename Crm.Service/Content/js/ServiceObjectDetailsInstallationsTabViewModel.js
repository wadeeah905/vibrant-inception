namespace("Crm.Service.ViewModels").ServiceObjectDetailsInstallationsTabViewModel = function (parentViewModel) {
	var viewModel = this;
	window.Crm.Service.ViewModels.InstallationListIndexViewModel.call(this, arguments);
	viewModel.serviceObjectId = window.ko.observable(null);
	viewModel.isTabViewModel(true);
	var serviceObjectId = parentViewModel.serviceObject().Id();
	viewModel.serviceObjectId = window.ko.observable(serviceObjectId);
	viewModel.getFilter("FolderId").extend({ filterOperator: "===" })(serviceObjectId);
	viewModel.joins().push("Company");
	viewModel.joins.remove("ServiceObject");
	viewModel.orderBy().unshift("Company.Name");
	viewModel.orderByDirection().unshift("ASC");
};
namespace("Crm.Service.ViewModels").ServiceObjectDetailsInstallationsTabViewModel.prototype = Object.create(window.Crm.Service.ViewModels.InstallationListIndexViewModel.prototype);
namespace("Crm.Service.ViewModels").ServiceObjectDetailsInstallationsTabViewModel.prototype.getItemGroup = function (x) {
	if (!x.Company()) {
		return null;
	}
	return { title: window.Helper.Company.getDisplayName(x.Company()) };
};
namespace("Crm.Service.ViewModels").ServiceObjectDetailsInstallationsTabViewModel.prototype.removeInstallation =
	function(installation) {
		var viewModel = this;
		return window.Helper.Confirm.confirmDelete().then(function() {
			viewModel.loading(true);
			window.database.attachOrGet(window.Helper.Database.getDatabaseEntity(installation));
			installation.FolderId(null);
			return window.database.saveChanges();
		});
	};