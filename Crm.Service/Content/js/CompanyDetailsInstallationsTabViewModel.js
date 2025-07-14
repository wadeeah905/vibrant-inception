namespace("Main.ViewModels").CompanyDetailsInstallationsTabViewModel = function (parentViewModel) {
	var viewModel = this;
	window.Crm.Service.ViewModels.InstallationListIndexViewModel.call(this, arguments);
	viewModel.isTabViewModel(true);
	var companyId = parentViewModel.company().Id();
	viewModel.companyId = window.ko.observable(companyId);
	viewModel.infiniteScroll(true);
	viewModel.joins.remove("Company");
};
namespace("Main.ViewModels").CompanyDetailsInstallationsTabViewModel.prototype = Object.create(window.Crm.Service.ViewModels.InstallationListIndexViewModel.prototype);
namespace("Main.ViewModels").CompanyDetailsInstallationsTabViewModel.prototype.applyFilters = function(query) {
	var viewModel = this;
	query = window.Crm.Service.ViewModels.InstallationListIndexViewModel.prototype.applyFilters.call(viewModel, query);
	query = query.filter(function(it) {
			return it.LocationContactId === this.companyId;
		},
		{ companyId: viewModel.companyId() });
	return query;
};