namespace("Crm.Order.ViewModels").OrderDetailsCalculationTabViewModel = function (parentViewModel) {
	var viewModel = this;
	window.Crm.Order.ViewModels.BaseOrderDetailsCalculationTabViewModel.apply(viewModel, arguments);
	viewModel.order = viewModel.baseOrder;
}
namespace("Crm.Order.ViewModels").OrderDetailsCalculationTabViewModel.prototype = Object.create(window.Crm.Order.ViewModels.BaseOrderDetailsCalculationTabViewModel.prototype);