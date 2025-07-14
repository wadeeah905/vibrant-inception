;
(function (ko) {
	var baseViewModel = window.Crm.Service.ViewModels.ServiceCaseTemplateDetailsViewModel;
	window.Crm.Service.ViewModels.ServiceCaseTemplateDetailsViewModel = function () {
		var viewModel = this;
		baseViewModel.apply(this, arguments);
		viewModel.completionDynamicForm = ko.observable(null);
		viewModel.creationDynamicForm = ko.observable(null);
	};
	window.Crm.Service.ViewModels.ServiceCaseTemplateDetailsViewModel.prototype = baseViewModel.prototype;
	var init = window.Crm.Service.ViewModels.ServiceCaseTemplateDetailsViewModel.prototype.init;
	window.Crm.Service.ViewModels.ServiceCaseTemplateDetailsViewModel.prototype.init = function () {
		var viewModel = this;
		return init.apply(this, arguments).then(function() {
			if (viewModel.serviceCaseTemplate().ExtensionValues().CreationDynamicFormId()) {
				return window.database.CrmDynamicForms_DynamicForm
					.include2("Languages.filter(function(x){ return x.StatusKey === 'Released'; })")
					.include2("Localizations.filter(function(x) { return x.DynamicFormElementId == null })")
					.find(viewModel.serviceCaseTemplate().ExtensionValues().CreationDynamicFormId());
			}
			return null;
		}).then(function(creationDynamicForm) {
			if (creationDynamicForm) {
				viewModel.creationDynamicForm(creationDynamicForm.asKoObservable());
			}
			if (viewModel.serviceCaseTemplate().ExtensionValues().CompletionDynamicFormId()) {
				return window.database.CrmDynamicForms_DynamicForm
					.include2("Languages.filter(function(x){ return x.StatusKey === 'Released'; })")
					.include2("Localizations.filter(function(x) { return x.DynamicFormElementId == null })")
					.find(viewModel.serviceCaseTemplate().ExtensionValues().CompletionDynamicFormId());
			}
			return null;
		}).then(function(completionDynamicForm) {
			if (completionDynamicForm) {
				viewModel.completionDynamicForm(completionDynamicForm.asKoObservable());
			}
		});
	};
	window.Crm.Service.ViewModels.ServiceCaseTemplateDetailsViewModel.prototype.getDynamicFormAutocompleteFilter = window.Crm.Service.ViewModels.ServiceCaseTemplateCreateViewModel.prototype.getDynamicFormAutocompleteFilter;
	window.Crm.Service.ViewModels.ServiceCaseTemplateDetailsViewModel.prototype.getDynamicFormAutocompleteFilterJoins = window.Crm.Service.ViewModels.ServiceCaseTemplateCreateViewModel.prototype.getDynamicFormAutocompleteFilterJoins;
	window.Crm.Service.ViewModels.ServiceCaseTemplateDetailsViewModel.prototype.onSaveChecklists = function(context) {
		context.viewContext.creationDynamicForm(context.editContext().creationDynamicForm());
		context.viewContext.completionDynamicForm(context.editContext().completionDynamicForm());
	};
})(window.ko);