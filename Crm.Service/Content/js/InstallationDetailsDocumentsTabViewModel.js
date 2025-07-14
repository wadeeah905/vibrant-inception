namespace("Crm.Service.ViewModels").InstallationDetailsDocumentsTabViewModel = function(parentViewModel) {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	window.Main.ViewModels.DocumentAttributeListIndexViewModel.call(viewModel, arguments);
	var installationId = parentViewModel.installation().Id();
	viewModel.bulkActions([]);
	viewModel.getFilter("ReferenceKey").extend({ filterOperator: "===" })(installationId);
};
namespace("Crm.Service.ViewModels").InstallationDetailsDocumentsTabViewModel.prototype = Object.create(window.Main.ViewModels.DocumentAttributeListIndexViewModel.prototype);