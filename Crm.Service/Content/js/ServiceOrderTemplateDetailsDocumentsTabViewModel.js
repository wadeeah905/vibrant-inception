namespace("Crm.Service.ViewModels").ServiceOrderTemplateDetailsDocumentsTabViewModel = function () {
	window.Crm.Service.ViewModels.ServiceOrderDetailsDocumentsTabViewModel.apply(this, arguments);
	this.canAddDocument(false);
};
namespace("Crm.Service.ViewModels").ServiceOrderTemplateDetailsDocumentsTabViewModel.prototype =
	Object.create(window.Crm.Service.ViewModels.ServiceOrderDetailsDocumentsTabViewModel.prototype);