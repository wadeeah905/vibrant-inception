namespace("Crm.Service.ViewModels").ServiceContractDetailsServiceOrdersTabViewModel = function(parentViewModel) {
	var viewModel = this;
	window.Crm.Service.ViewModels.ServiceOrderHeadListIndexViewModel.call(this, arguments);
	viewModel.bookmark(viewModel.bookmarks().find(x => x.Key === "All"));
	viewModel.bulkActions([]);
	var serviceContractId = parentViewModel.serviceContract().Id();
	viewModel.serviceContractId = window.ko.observable(serviceContractId);
	viewModel.infiniteScroll(true);
};
namespace("Crm.Service.ViewModels").ServiceContractDetailsServiceOrdersTabViewModel.prototype =
	Object.create(window.Crm.Service.ViewModels.ServiceOrderHeadListIndexViewModel.prototype);
namespace("Crm.Service.ViewModels").ServiceContractDetailsServiceOrdersTabViewModel.prototype.applyFilters =
	function(query) {
		var viewModel = this;
		query = window.Crm.Service.ViewModels.ServiceOrderHeadListIndexViewModel.prototype.applyFilters.call(viewModel,
			query);
		query = query.filter(function(it) {
				return it.ServiceContractId === this.serviceContractId;
			},
			{ serviceContractId: viewModel.serviceContractId() });
		return query;
	};