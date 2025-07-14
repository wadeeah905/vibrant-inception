namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistDetailsModalViewModel = function(parentViewModel) {
	var viewModel = this;
	viewModel.serviceOrder = window.ko.observable(null);
	window.Crm.DynamicForms.ViewModels.DynamicFormDetailsViewModel.apply(viewModel, arguments);
};
namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistDetailsModalViewModel.prototype = Object.create(window.Crm.DynamicForms.ViewModels.DynamicFormDetailsViewModel.prototype);
namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistDetailsModalViewModel.prototype.init = function(id) {
	var viewModel = this;
	let checklist = null;
	return window.database.SmsChecklists_ServiceOrderChecklist
		.includeDynamicFormElements()
		.include("DynamicForm.Languages")
		.include("ServiceOrderTime.Installation")
		.find(id)
		.then(function (serviceOrderChecklist) {
			checklist = serviceOrderChecklist;
			return window.database.CrmDynamicForms_DynamicFormResponse
				.filter("it.DynamicFormReferenceKey === this.id", { id: id })
				.orderByDescending("it.ModifyDate")
				.toArray();
		}).then(function (responses) {
			checklist.Responses = responses;
			return window.Crm.DynamicForms.ViewModels.DynamicFormDetailsViewModel.prototype.init.call(viewModel, { formReference: checklist.asKoObservable() });
		}).then(function () {
			return window.database.CrmService_ServiceOrderHead
				.include("Company")
				.include("ResponsibleUserUser")
				.include("Installation")
				.find(viewModel.formReference().ReferenceKey())
				.then(function (serviceOrderHead) {
					viewModel.serviceOrder = serviceOrderHead.asKoObservable();
				});
		});
};