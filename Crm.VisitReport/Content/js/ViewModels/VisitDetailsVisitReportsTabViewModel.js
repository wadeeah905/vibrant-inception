namespace("Crm.VisitReport.ViewModels").VisitDetailsVisitReportsTabViewModel = function(parentViewModel) {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	var joinLocalizations = {
		Selector: "DynamicForm.Localizations",
		Operation: "filter(function(x) { return x.DynamicFormElementId == null })"
	};
	window.Main.ViewModels.GenericListViewModel.call(viewModel, "CrmVisitReport_VisitReport", ["Completed"], ["ASC"], ["DynamicForm", "DynamicForm.Languages", joinLocalizations, "ResponsibleUserUser", "Visit"]);
	viewModel.currentUser = window.ko.observable(null);
	viewModel.getFilter("ReferenceKey").extend({ filterOperator: "===" })(parentViewModel.visit().ParentId());
	viewModel.getFilter("VisitId").extend({ filterOperator: "===" })(parentViewModel.visit().Id());
	viewModel.lookups = {};
};
namespace("Crm.VisitReport.ViewModels").VisitDetailsVisitReportsTabViewModel.prototype = Object.create(window.Main.ViewModels.CompanyDetailsVisitReportsTabViewModel.prototype);