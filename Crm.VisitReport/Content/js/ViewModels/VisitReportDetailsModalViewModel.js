namespace("Crm.VisitReport.ViewModels").VisitReportDetailsModalViewModel = function(parentViewModel) {
	var viewModel = this;
	viewModel.Company = ko.observable(null);
	viewModel.Visit = ko.observable(null);
	viewModel.ResponsibleUser = ko.observable(null);
	viewModel.VisitAddress = ko.observable(null);
	window.Crm.DynamicForms.ViewModels.DynamicFormDetailsViewModel.apply(viewModel, arguments);
};
namespace("Crm.VisitReport.ViewModels").VisitReportDetailsModalViewModel.prototype = Object.create(window.Crm.DynamicForms.ViewModels.DynamicFormDetailsViewModel.prototype);
namespace("Crm.VisitReport.ViewModels").VisitReportDetailsModalViewModel.prototype.init = function(id, routeValues) {
	var viewModel = this;
	if (routeValues.DynamicFormReference) {
		result = window.Crm.DynamicForms.ViewModels.DynamicFormDetailsViewModel.prototype.init.apply(this, arguments);
	}else{
		result = window.database.CrmVisitReport_VisitReport
			.includeDynamicFormElements()
			.include("DynamicForm.Languages")
			.include2("Responses.orderByDescending(function(it) { return it.ModifyDate })")
			.include("ResponsibleUserUser")
			.include("Company")
			.include("Visit")
			.include("Visit.Address")
			.find(id)
			.then(function(visitReport) {
				return window.Crm.DynamicForms.ViewModels.DynamicFormDetailsViewModel.prototype.init.call(viewModel, { formReference: visitReport.asKoObservable() });
			});
	}
	return result;
};