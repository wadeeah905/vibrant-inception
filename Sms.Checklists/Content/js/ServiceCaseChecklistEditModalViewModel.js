namespace("Sms.Checklists.ViewModels").ServiceCaseChecklistEditModalViewModel = function() {
	var viewModel = this;
	window.Crm.DynamicForms.ViewModels.DynamicFormDetailsViewModel.apply(viewModel, arguments);
	viewModel.applyChanges = function() {
		return window.database.saveChanges();
	};
};
namespace("Sms.Checklists.ViewModels").ServiceCaseChecklistEditModalViewModel.prototype =
	Object.create(window.Crm.DynamicForms.ViewModels.DynamicFormDetailsViewModel.prototype);
namespace("Sms.Checklists.ViewModels").ServiceCaseChecklistEditModalViewModel.prototype.init = function(id) {
	var viewModel = this;
	return window.database.SmsChecklists_ServiceCaseChecklist
		.includeDynamicFormElements()
		.include("DynamicForm.Languages")
		.include("Responses")
		.find(id)
		.then(function(result) {
			return window.Crm.DynamicForms.ViewModels.DynamicFormDetailsViewModel.prototype.init.call(viewModel,
				{ formReference: result.asKoObservable() });
		}).then(function() {
			viewModel.addValidationRules();
			viewModel.addRequiredValidationRules();
		});
};
namespace("Sms.Checklists.ViewModels").ServiceCaseChecklistEditModalViewModel.prototype.save = function() {
	var viewModel = this;
	viewModel.loading(true);
	if (viewModel.formReference().Completed() === true) {
		viewModel.addRequiredValidationRules();
	} else {
		viewModel.removeRequiredValidationRules();
	}
	var errors = window.ko.validation.group(viewModel);
	if (errors().length > 0) {
		viewModel.loading(false);
		errors.showAllMessages();
		return;
	}

	window.Crm.DynamicForms.ViewModels.DynamicFormDetailsViewModel.prototype.save.apply(viewModel).then(function() {
		viewModel.loading(false);
		if (viewModel.formReference().Completed() === true) {
			$(".modal:visible").modal("hide");
		}
	}).fail(function() {
		viewModel.loading(false);
		window.swal(window.Helper.String.getTranslatedString("UnknownError"),
			window.Helper.String.getTranslatedString("Error_InternalServerError"),
			"error");
	});
};