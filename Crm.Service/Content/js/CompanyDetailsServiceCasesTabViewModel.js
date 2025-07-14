namespace("Main.ViewModels").CompanyDetailsServiceCasesTabViewModel = function(parentViewModel) {
	var viewModel = this;
	window.Crm.Service.ViewModels.ServiceCaseListIndexViewModel.call(this, arguments);
	viewModel.isTabViewModel(true);
	viewModel.bookmark(viewModel.bookmarks().find(x => x.Key === "All"));
	viewModel.bulkActions([]);
	var companyId = parentViewModel.company().Id();
	viewModel.companyId = window.ko.observable(companyId);
	viewModel.infiniteScroll(true);
	viewModel.joins.remove("AffectedCompany");
};
namespace("Main.ViewModels").CompanyDetailsServiceCasesTabViewModel.prototype = Object.create(window.Crm.Service.ViewModels.ServiceCaseListIndexViewModel.prototype);
namespace("Main.ViewModels").CompanyDetailsServiceCasesTabViewModel.prototype.applyFilters = function(query) {
	var viewModel = this;
	query = window.Crm.Service.ViewModels.ServiceCaseListIndexViewModel.prototype.applyFilters.call(viewModel, query);
	query = query.filter(function(it) {
			return it.AffectedCompanyKey === this.companyId;
		},
		{ companyId: viewModel.companyId() });
	return query;
};