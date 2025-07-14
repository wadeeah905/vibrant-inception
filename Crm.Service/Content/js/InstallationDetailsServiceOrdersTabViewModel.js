namespace("Crm.Service.ViewModels").InstallationDetailsServiceOrdersTabViewModel = function(parentViewModel) {
	var viewModel = this;
	window.Crm.Service.ViewModels.ServiceOrderHeadListIndexViewModel.call(this, arguments);
	viewModel.isTabViewModel(true);
	viewModel.bookmark(viewModel.bookmarks().find(x => x.Key === "All"));
	viewModel.bulkActions([]);
	var installationId = parentViewModel.installation().Id();
	viewModel.installationId = window.ko.observable(installationId);
	viewModel.infiniteScroll(true);
	viewModel.joins.removeAll([
		"Installation", "Installation.Address", "Installation.Company", "Company", "ServiceObject"
	]);
};
namespace("Crm.Service.ViewModels").InstallationDetailsServiceOrdersTabViewModel.prototype =
	Object.create(window.Crm.Service.ViewModels.ServiceOrderHeadListIndexViewModel.prototype);
namespace("Crm.Service.ViewModels").InstallationDetailsServiceOrdersTabViewModel.prototype.applyFilters =
	function(query) {
		var viewModel = this;
		query = window.Crm.Service.ViewModels.ServiceOrderHeadListIndexViewModel.prototype.applyFilters.call(viewModel,
			query);
		if (window.database.storageProvider.supportedSetOperations.some) {
			query = query.filter(function(serviceOrder) {
					return serviceOrder.InstallationId === this.installationId ||
						serviceOrder.ServiceOrderTimes.some(function(serviceOrderTime) {
							return serviceOrderTime.InstallationId === this.installationId;
						});
				},
				{ installationId: viewModel.installationId() });
		} else {
			query = query.filter(function(serviceOrder) {
					return serviceOrder.InstallationId === this.installationId ||
						serviceOrder.ServiceOrderTimes.InstallationId === this.installationId;;
				},
				{ installationId: viewModel.installationId() });
		}
		return query;
	};