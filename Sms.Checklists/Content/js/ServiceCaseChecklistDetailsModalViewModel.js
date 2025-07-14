namespace("Sms.Checklists.ViewModels").ServiceCaseChecklistDetailsModalViewModel = function() {
	var viewModel = this;
	window.Crm.DynamicForms.ViewModels.DynamicFormDetailsViewModel.apply(viewModel, arguments);
};
namespace("Sms.Checklists.ViewModels").ServiceCaseChecklistDetailsModalViewModel.prototype =
	Object.create(window.Crm.DynamicForms.ViewModels.DynamicFormDetailsViewModel.prototype);
namespace("Sms.Checklists.ViewModels").ServiceCaseChecklistDetailsModalViewModel.prototype.init = function(id) {
	var viewModel = this;
	return window.database.SmsChecklists_ServiceCaseChecklist
		.includeDynamicFormElements()
		.include("DynamicForm.Languages")
		.include("Responses")
		.find(id)
		.then(function(serviceCaseChecklist) {
			return window.Crm.DynamicForms.ViewModels.DynamicFormDetailsViewModel.prototype.init.call(viewModel,
				{ formReference: serviceCaseChecklist.asKoObservable() });
		});
};