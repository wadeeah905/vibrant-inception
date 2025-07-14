namespace("Crm.Service.ViewModels").ServiceOrderTemplateDetailsChecklistsTabViewModel = function (parentViewModel) {
	var viewModel = this;
	window.Crm.Service.ViewModels.ServiceOrderDetailsChecklistsTabViewModel.apply(this, arguments);
	viewModel.dispatch = window.ko.observable(null);
	viewModel.canAddChecklist = parentViewModel.serviceOrderTemplateIsEditable;
};
namespace("Crm.Service.ViewModels").ServiceOrderTemplateDetailsChecklistsTabViewModel.prototype =
	Object.create(window.Crm.Service.ViewModels.ServiceOrderDetailsChecklistsTabViewModel.prototype);
namespace("Crm.Service.ViewModels").ServiceOrderTemplateDetailsChecklistsTabViewModel.prototype.checklistIsDeletable =
	function(serviceOrderChecklist) {
		return this.parentViewModel.serviceOrderTemplateIsEditable;
	};
namespace("Crm.Service.ViewModels").ServiceOrderTemplateDetailsChecklistsTabViewModel.prototype.checklistIsEditable =
	function(serviceOrderChecklist) {
		return false;
	};