namespace("Crm.Service.ViewModels").ServiceOrderTemplateListIndexViewModel = function() {
	var viewModel = this;
	window.Main.ViewModels.GenericListViewModel.call(viewModel,
		"CrmService_ServiceOrderHead",
		"OrderNo",
		"ASC",
		["ResponsibleUserUser", "UserGroup"]);
	viewModel.lookups = {
		serviceOrderTypes: { $tableName: "CrmService_ServiceOrderType" },
		servicePriorities: { $tableName: "CrmService_ServicePriority" }
	};
};
namespace("Crm.Service.ViewModels").ServiceOrderTemplateListIndexViewModel.prototype =
	Object.create(window.Main.ViewModels.GenericListViewModel.prototype);
namespace("Crm.Service.ViewModels").ServiceOrderTemplateListIndexViewModel.prototype.applyFilters = function(query) {
	var viewModel = this;
	query = window.Main.ViewModels.GenericListViewModel.prototype.applyFilters.call(viewModel, query);
	query = query.filter(function(serviceOrder) { return serviceOrder.IsTemplate === true; });
	return query;
};
namespace("Crm.Service.ViewModels").ServiceOrderTemplateListIndexViewModel.prototype.init = function() {
	var viewModel = this;
	var args = arguments;
	return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups).then(function() {
		return window.Main.ViewModels.GenericListViewModel.prototype.init.apply(viewModel, args);
	});
};