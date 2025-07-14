namespace("Crm.Service.ViewModels").ServiceContractDetailsDocumentsTabViewModel = function(parentViewModel) {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	window.Main.ViewModels.DocumentAttributeListIndexViewModel.call(viewModel, arguments);
	var serviceContractId = parentViewModel.serviceContract().Id();
	viewModel.bulkActions([]);
	viewModel.getFilter("ReferenceKey").extend({ filterOperator: "===" })(serviceContractId);
};
namespace("Crm.Service.ViewModels").ServiceContractDetailsDocumentsTabViewModel.prototype = Object.create(window.Main.ViewModels.DocumentAttributeListIndexViewModel.prototype);