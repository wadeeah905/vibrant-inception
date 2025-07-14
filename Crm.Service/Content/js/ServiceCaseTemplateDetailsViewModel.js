namespace("Crm.Service.ViewModels").ServiceCaseTemplateDetailsViewModel = function() {
	var viewModel = this;
	viewModel.tabs = window.ko.observable({});
	viewModel.loading = window.ko.observable(true);
	viewModel.serviceCaseTemplate = window.ko.observable(null);
	viewModel.lookups = {
		serviceCaseCategories: { $tableName: "CrmService_ServiceCaseCategory" },
		servicePriorities: { $tableName: "CrmService_ServicePriority" },
		skills: { $tableName: "Main_Skill" },
	};
};
namespace("Crm.Service.ViewModels").ServiceCaseTemplateDetailsViewModel.prototype =
	Object.create(window.Main.ViewModels.ViewModelBase.prototype);
namespace("Crm.Service.ViewModels").ServiceCaseTemplateDetailsViewModel.prototype.init = function(id) {
	var viewModel = this;
	return window.database.CrmService_ServiceCaseTemplate
		.include("ResponsibleUserUser")
		.find(id)
		.then(function(serviceCaseTemplate) {
			viewModel.serviceCaseTemplate(serviceCaseTemplate.asKoObservable());
			return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups);
		})
		.then(() => viewModel.setBreadcrumbs());
};


namespace("Crm.Service.ViewModels").ServiceCaseTemplateDetailsViewModel.prototype.setBreadcrumbs = function () {
	var viewModel = this;
	window.breadcrumbsViewModel.setBreadcrumbs([
		new Breadcrumb(Helper.String.getTranslatedString("ServiceCaseTemplate"), "#/Crm.Service/ServiceCaseTemplateList/IndexTemplate"),
		new Breadcrumb(viewModel.serviceCaseTemplate().Name(), window.location.hash)
	]);
};

namespace("Crm.Service.ViewModels").ServiceCaseTemplateDetailsViewModel.prototype.getSkillsFromKeys = function(keys) {
	var viewModel = this;
	return viewModel.lookups.skills.$array.filter(function(x) {
		return keys.indexOf(x.Key) !== -1;
	}).map(window.Helper.Lookup.mapLookupForSelect2Display);
};