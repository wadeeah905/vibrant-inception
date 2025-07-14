namespace("Main.ViewModels").CompanyDetailsServiceOrdersTabViewModel = function(parentViewModel) {
	var viewModel = this;
	window.Crm.Service.ViewModels.ServiceOrderHeadListIndexViewModel.call(this, arguments);
	viewModel.isTabViewModel(true);
	viewModel.bookmark(viewModel.bookmarks().find(x => x.Key === "All"));
	viewModel.bulkActions([]);
	var companyId = parentViewModel.company().Id();
	viewModel.companyId = window.ko.observable(companyId);
	viewModel.infiniteScroll(true);
	viewModel.joins.remove("Company");
};
namespace("Main.ViewModels").CompanyDetailsServiceOrdersTabViewModel.prototype =
	Object.create(window.Crm.Service.ViewModels.ServiceOrderHeadListIndexViewModel.prototype);
namespace("Main.ViewModels").CompanyDetailsServiceOrdersTabViewModel.prototype.applyFilters = function(query) {
	var viewModel = this;
	query = window.Crm.Service.ViewModels.ServiceOrderHeadListIndexViewModel.prototype.applyFilters.call(viewModel,
		query);
	query = query.filter(function(it) {
			return it.CustomerContactId === this.companyId;
		},
		{ companyId: viewModel.companyId() });
	return query;
};