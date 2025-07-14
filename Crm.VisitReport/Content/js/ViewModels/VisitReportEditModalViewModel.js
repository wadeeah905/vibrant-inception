namespace("Crm.VisitReport.ViewModels").VisitReportEditModalViewModel = function(parentViewModel) {
	var viewModel = this;
	if (parentViewModel instanceof window.Main.ViewModels.GenericListViewModel) {
		parentViewModel = parentViewModel.parentViewModel;
	}
	if (parentViewModel.visit) {
		viewModel.referenceKey = window.ko.unwrap(parentViewModel.visit().ParentId);
		viewModel.visitId = window.ko.unwrap(parentViewModel.visit().Id);
	} else {
		viewModel.referenceKey = window.ko.unwrap(parentViewModel.contactId);
		viewModel.visitId = null;
	}
	window.Crm.DynamicForms.ViewModels.DynamicFormDetailsViewModel.apply(viewModel, arguments);
	viewModel.applyChanges = function() {
		return window.database.saveChanges();
	};
};
namespace("Crm.VisitReport.ViewModels").VisitReportEditModalViewModel.prototype = Object.create(window.Crm.DynamicForms.ViewModels.DynamicFormDetailsViewModel.prototype);
namespace("Crm.VisitReport.ViewModels").VisitReportEditModalViewModel.prototype.init = function(id) {
	var viewModel = this;
	return window.database.CrmVisitReport_VisitReport
		.includeDynamicFormElements()
		.include("DynamicForm.Languages")
		.include2("Responses.orderByDescending(function(it) { return it.ModifyDate })")
		.find(id)
		.then(function (result) {
			return window.Crm.DynamicForms.ViewModels.DynamicFormDetailsViewModel.prototype.init.call(viewModel, { formReference: result.asKoObservable() });
		}).then(function() {
			viewModel.formReference().innerInstance.resetChanges();
			viewModel.addValidationRules();
			viewModel.addRequiredValidationRules();
		});
};
namespace("Crm.VisitReport.ViewModels").VisitReportEditModalViewModel.prototype.save = function() {
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
		viewModel.formReference().Completed(false);
		return;
	}
	window.Crm.DynamicForms.ViewModels.DynamicFormDetailsViewModel.prototype.save.apply(viewModel).then(function() {
		viewModel.loading(false);
		if (viewModel.formReference().Completed() === true || viewModel.page() === viewModel.pages()) {
			$(".modal:visible").modal("hide");
		}
	}).fail(function(e) {
		viewModel.loading(false);
		window.swal(window.Helper.String.getTranslatedString("UnknownError"), window.Helper.String.getTranslatedString("Error_InternalServerError"), "error");
	});
};