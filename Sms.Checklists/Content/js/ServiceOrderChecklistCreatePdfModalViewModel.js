namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistCreatePdfModalViewModel = function (parentViewModel) {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	viewModel.dynamicFormAutocomplete = window.ko.observable("");
	viewModel.currentUser = window.ko.observable(null);
	viewModel.dispatch = parentViewModel.dispatch;
	viewModel.serviceOrder = parentViewModel.serviceOrder;
	viewModel.serviceOrderChecklist = window.ko.observable(null);
	viewModel.newFileResource = window.ko.observable(null);
	viewModel.errors = window.ko.validation.group(viewModel.serviceOrderChecklist, { deep: true });
};
namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistCreatePdfModalViewModel.prototype.init = function (id, params) {
	var viewModel = this;
	return window.Helper.User.getCurrentUser()
		.then(function (user) {
			viewModel.currentUser(user);
			return user;
		}).then(function () {
			var newServiceOrderChecklist = window.database.SmsChecklists_ServiceOrderChecklist
				.SmsChecklists_ServiceOrderChecklist.create();
			newServiceOrderChecklist.DispatchId = params.dispatchId || (viewModel.dispatch && viewModel.dispatch() ? viewModel.dispatch().Id() : null) || null;
			newServiceOrderChecklist.ReferenceKey = viewModel.serviceOrder().Id();
			newServiceOrderChecklist.ServiceOrderTimeKey =
				params.serviceOrderTimeId || (viewModel.dispatch && viewModel.dispatch() ? viewModel.dispatch().CurrentServiceOrderTimeId() : null) || null;

			window.database.add(newServiceOrderChecklist);
			return newServiceOrderChecklist;
		})

		.then(function (serviceOrderChecklist) {
			viewModel.serviceOrderChecklist(serviceOrderChecklist.asKoObservable());
		});
};

namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistCreatePdfModalViewModel.prototype.dispose
	= window.Sms.Checklists.ViewModels.ServiceOrderChecklistCreateModalViewModel.prototype.dispose;

namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistCreatePdfModalViewModel.prototype.save = function () {
	var viewModel = this;
	viewModel.loading(true);

	if (viewModel.errors().length > 0) {
		viewModel.loading(false);
		viewModel.errors.showAllMessages();
		return;
	}



	window.database.saveChanges()
		.then(function () {
			viewModel.loading(false);
			$(".modal:visible").modal("hide");
		})
		.fail(function () {
			viewModel.loading(false);
			window.swal(window.Helper.String.getTranslatedString("UnknownError"),
				window.Helper.String.getTranslatedString("Error_InternalServerError"),
				"error");
		});
};

namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistCreatePdfModalViewModel.prototype.getDynamicFormAutocompleteFilter = function (query, term) {
	var viewModel = this;
	query = query
		.include2("Localizations.filter(function(x) { return x.DynamicFormElementId == null })")
		.include("Languages")
		.filter("it.CategoryKey === 'PDF-Checklist' ")
		.filter("filterByDynamicFormTitle", { filter: viewModel.dynamicFormAutocomplete(), languageKey: this.currentUser().DefaultLanguageKey, statusKey: 'Released' });
	if (term) {
		query = query.filter("filterByDynamicFormTitle", { filter: term, languageKey: this.currentUser().DefaultLanguageKey });
	}
	return query;
};

namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistCreatePdfModalViewModel.prototype.getServiceOrderTimeAutocompleteDisplay = function (serviceOrderTime) {
	var viewModel = this;
	return window.Helper.ServiceOrderTime.getAutocompleteDisplay(serviceOrderTime,
		viewModel.dispatch && viewModel.dispatch() ? viewModel.dispatch().CurrentServiceOrderTimeId() : null);
};
namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistCreatePdfModalViewModel.prototype.getServiceOrderTimeAutocompleteFilter = function (query) {
	var viewModel = this;
	query = query.filter(function (it) {
		return it.OrderId === this.orderId;
	},
		{ orderId: viewModel.serviceOrder().Id() });
	return query;
};

namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistCreatePdfModalViewModel.prototype.getDynamicFormAutocompleteDisplay
	= window.Sms.Checklists.ViewModels.ServiceOrderChecklistCreateModalViewModel.prototype.getDynamicFormAutocompleteDisplay
