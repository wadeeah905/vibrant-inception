namespace("Crm.Service.ViewModels").ServiceOrderTemplateDetailsJobsTabViewModel = function(parentViewModel) {
	window.Crm.Service.ViewModels.ServiceOrderDetailsJobsTabViewModel.apply(this, arguments);
	var viewModel = this;
	viewModel.timesCanBeAdded = window.ko.pureComputed(function() {
		return parentViewModel.serviceOrderTemplateIsEditable() &&
			window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode === "JobPerInstallation";
	});
};
namespace("Crm.Service.ViewModels").ServiceOrderTemplateDetailsJobsTabViewModel.prototype =
	Object.create(window.Crm.Service.ViewModels.ServiceOrderDetailsJobsTabViewModel.prototype);
namespace("Crm.Service.ViewModels").ServiceOrderTemplateDetailsJobsTabViewModel.prototype.canDeleteServiceOrderTime =
	function(serviceOrderTime) {
		var viewModel = this;
		return viewModel.parentViewModel.serviceOrderTemplateIsEditable();
	};
namespace("Crm.Service.ViewModels").ServiceOrderTemplateDetailsJobsTabViewModel.prototype.canEditServiceOrderTime =
	function(serviceOrderTime) {
		var viewModel = this;
		return viewModel.parentViewModel.serviceOrderTemplateIsEditable();
	};