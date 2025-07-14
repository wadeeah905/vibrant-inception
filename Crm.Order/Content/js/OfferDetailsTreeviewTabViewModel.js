namespace("Crm.Order.ViewModels").OfferDetailsTreeviewTabViewModel = function(parentViewModel) {
	var viewModel = this;
	window.Crm.Order.ViewModels.BaseOrderDetailsTreeviewTabViewModel.apply(viewModel, arguments);
}
namespace("Crm.Order.ViewModels").OfferDetailsTreeviewTabViewModel.prototype = Object.create(window.Crm.Order.ViewModels.BaseOrderDetailsTreeviewTabViewModel.prototype);