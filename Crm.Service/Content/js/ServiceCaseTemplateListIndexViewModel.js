namespace("Crm.Service.ViewModels").ServiceCaseTemplateListIndexViewModel = function() {
	var viewModel = this;
	viewModel.currentUser = window.ko.observable(null);
	window.Main.ViewModels.GenericListViewModel.call(viewModel,
		"CrmService_ServiceCaseTemplate",
		"Name",
		"ASC");
	viewModel.lookups = {
		serviceCaseCategories: { $tableName: "CrmService_ServiceCaseCategory" }
	};
};
namespace("Crm.Service.ViewModels").ServiceCaseTemplateListIndexViewModel.prototype =
	Object.create(window.Main.ViewModels.GenericListViewModel.prototype);
namespace("Crm.Service.ViewModels").ServiceCaseTemplateListIndexViewModel.prototype.init = function (id, params) {
	var viewModel = this;
	var args = arguments;
	return window.Helper.User.getCurrentUser().then(function (user) {
		viewModel.currentUser(user);
		return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups);
	}).then(function () {
		return window.Main.ViewModels.GenericListViewModel.prototype.init.apply(viewModel, args);
	});
};