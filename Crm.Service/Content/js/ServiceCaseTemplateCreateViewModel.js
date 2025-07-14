namespace("Crm.Service.ViewModels").ServiceCaseTemplateCreateViewModel = function () {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	viewModel.serviceCaseTemplate = window.ko.observable(null);
	viewModel.errors = window.ko.validation.group(viewModel.serviceCaseTemplate, { deep: true });
	viewModel.lookups = {
		serviceCaseCategories: { $tableName: "CrmService_ServiceCaseCategory" },
		servicePriorities: { $tableName: "CrmService_ServicePriority" }
	}
};
namespace("Crm.Service.ViewModels").ServiceCaseTemplateCreateViewModel.prototype.init = function () {
	var viewModel = this;
	return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups).then(function() {
		var serviceCaseTemplate = window.database.CrmService_ServiceCaseTemplate.CrmService_ServiceCaseTemplate.create();
		var currentUserName = document.getElementById("meta.CurrentUser").content;
		serviceCaseTemplate.CategoryKey = window.Helper.Lookup.getDefaultLookupValueSingleSelect(viewModel.lookups.serviceCaseCategories, serviceCaseTemplate.CategoryKey);
		serviceCaseTemplate.PriorityKey = window.Helper.Lookup.getDefaultLookupValueSingleSelect(viewModel.lookups.servicePriorities, serviceCaseTemplate.PriorityKey);
		serviceCaseTemplate.ResponsibleUser = currentUserName;
		viewModel.serviceCaseTemplate(serviceCaseTemplate.asKoObservable());
		window.database.add(viewModel.serviceCaseTemplate().innerInstance);
	});
};
namespace("Crm.Service.ViewModels").ServiceCaseTemplateCreateViewModel.prototype.cancel = function () {
	window.database.detach(this.serviceCaseTemplate().innerInstance);
	window.history.back();
};
namespace("Crm.Service.ViewModels").ServiceCaseTemplateCreateViewModel.prototype.submit = function () {
	var viewModel = this;
	viewModel.loading(true);
	if (viewModel.errors().length > 0) {
		viewModel.loading(false);
		viewModel.errors.showAllMessages();
		viewModel.errors.scrollToError();
		return;
	}
	return window.database.saveChanges().then(function () {
		window.location.hash = "/Crm.Service/ServiceCaseTemplate/DetailsTemplate/" + viewModel.serviceCaseTemplate().Id();
	});
};