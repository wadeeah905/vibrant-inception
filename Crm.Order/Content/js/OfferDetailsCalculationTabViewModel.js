namespace("Crm.Order.ViewModels").OfferDetailsCalculationTabViewModel = function (parentViewModel) {
	var viewModel = this;
	window.Crm.Order.ViewModels.BaseOrderDetailsCalculationTabViewModel.apply(viewModel, arguments);
	viewModel.offer = viewModel.baseOrder;
}
namespace("Crm.Order.ViewModels").OfferDetailsCalculationTabViewModel.prototype = Object.create(window.Crm.Order.ViewModels.BaseOrderDetailsCalculationTabViewModel.prototype);