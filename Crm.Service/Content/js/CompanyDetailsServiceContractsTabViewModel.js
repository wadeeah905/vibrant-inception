namespace("Main.ViewModels").CompanyDetailsServiceContractsTabViewModel = function(parentViewModel) {
	var viewModel = this;
	window.Crm.Service.ViewModels.ServiceContractListIndexViewModel.call(this, arguments);
	viewModel.bulkActions([]);
	viewModel.infiniteScroll(true);
	viewModel.joins.remove("ParentCompany");
	const companyId = parentViewModel.company().Id();
	viewModel.getFilter("ParentId").extend({ filterOperator: "===" })(companyId);
	viewModel.isTabViewModel(true);
};
namespace("Main.ViewModels").CompanyDetailsServiceContractsTabViewModel.prototype =
	Object.create(window.Crm.Service.ViewModels.ServiceContractListIndexViewModel.prototype);