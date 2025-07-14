namespace("Crm.Service.ViewModels").ServiceCaseDetailsChecklistsTabViewModel = function(parentViewModel) {
	window.Main.ViewModels.ViewModelBase.call(this, arguments);
	var viewModel = this;
	viewModel.currentUser = window.ko.observable(null);
	viewModel.lookups = parentViewModel.lookups;
	viewModel.serviceCase = parentViewModel.serviceCase;
	var joinLocalizations = {
		Selector: "DynamicForm.Localizations",
		Operation: "filter(function(x) { return x.DynamicFormElementId == null })"
	};
	window.Main.ViewModels.GenericListViewModel.call(viewModel,
		"SmsChecklists_ServiceCaseChecklist",
		["IsCreationChecklist"],
		["DESC"],
		["DynamicForm", "DynamicForm.Languages", joinLocalizations]);
};
namespace("Crm.Service.ViewModels").ServiceCaseDetailsChecklistsTabViewModel.prototype = Object.create(window.Main.ViewModels.GenericListViewModel.prototype);
namespace("Crm.Service.ViewModels").ServiceCaseDetailsChecklistsTabViewModel.prototype.init = function() {
	var viewModel = this;
	return window.Helper.User.getCurrentUser().then(function(user) {
		viewModel.currentUser(user);
		return window.Main.ViewModels.GenericListViewModel.prototype.init.apply(viewModel, arguments);
	});
};
namespace("Crm.Service.ViewModels").ServiceCaseDetailsChecklistsTabViewModel.prototype.checklistIsDeletable = function(serviceCaseChecklist) {
	var viewModel = this;
	return viewModel.checklistIsEditable(serviceCaseChecklist);
};
namespace("Crm.Service.ViewModels").ServiceCaseDetailsChecklistsTabViewModel.prototype.checklistIsEditable = function(serviceCaseChecklist) {
	var viewModel = this;
	if (serviceCaseChecklist.Completed()) {
		return false;
	}
	return true;
};
namespace("Crm.Service.ViewModels").ServiceCaseDetailsChecklistsTabViewModel.prototype.deleteServiceCaseChecklist =
	function(serviceCaseChecklist) {
		var viewModel = this;
		return window.Helper.Confirm.confirmDelete().then(function() {
				viewModel.loading(true);
				window.database.remove(serviceCaseChecklist);
				return window.database.saveChanges();
			})
			.then(function() {
				return viewModel.filter();
			});
	};
namespace("Crm.Service.ViewModels").ServiceCaseDetailsChecklistsTabViewModel.prototype.applyFilter = function(query, filterValue, filterName) {
	if (filterName === "DynamicFormTitle") {
		return query.filter("filterByDynamicFormTitle", { filter: filterValue.Value, languageKey: this.currentUser().DefaultLanguageKey, statusKey: 'Released'});
	}
	return window.Main.ViewModels.GenericListViewModel.prototype.applyFilter.apply(this, arguments);
};
namespace("Crm.Service.ViewModels").ServiceCaseDetailsChecklistsTabViewModel.prototype.applyFilters = function(query) {
	var viewModel = this;
	query = window.Main.ViewModels.GenericListViewModel.prototype.applyFilters.call(viewModel, query);
	query = query
		.filter("it.ReferenceKey === this.serviceCaseId", { serviceCaseId: viewModel.serviceCase().Id() });
	if (!ko.unwrap(viewModel.getFilter("DynamicFormTitle"))) {
		query = viewModel.applyFilter(query, "", "DynamicFormTitle");
	}
	return query;
};
namespace("Crm.Service.ViewModels").ServiceCaseDetailsChecklistsTabViewModel.prototype.getChecklistTitle = function (serviceCaseChecklist) {
	return window.Helper.DynamicForm.getTitle(serviceCaseChecklist.DynamicForm);
};
namespace("Crm.Service.ViewModels").ServiceCaseDetailsChecklistsTabViewModel.prototype.getItemGroup = function (serviceCaseChecklist) {
	if (serviceCaseChecklist.IsCreationChecklist()) {
		return { title: window.Helper.String.getTranslatedString("CreationDynamicForm") };
	}
	if (serviceCaseChecklist.IsCompletionChecklist()) {
		return { title: window.Helper.String.getTranslatedString("CompletionDynamicForm") };
	}
	return null;
};