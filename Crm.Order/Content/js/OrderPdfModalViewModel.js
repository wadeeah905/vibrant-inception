namespace("Crm.Order.ViewModels").OrderPdfModalViewModel = function (parentViewModel) {
	var viewModel = this;
	window.Crm.Order.ViewModels.BaseOrderPdfModalViewModel.apply(this, arguments);
}
namespace("Crm.Order.ViewModels").OrderPdfModalViewModel.prototype = Object.create(window.Crm.Order.ViewModels.BaseOrderPdfModalViewModel.prototype);

namespace("Crm.Order.ViewModels").OrderPdfModalViewModel.prototype.init = function (id) {
	var viewModel = this;
	viewModel.loading(true);
	if (viewModel.parentViewModel) {
		return window.Crm.Order.ViewModels.BaseOrderPdfModalViewModel.prototype.init.apply(viewModel, arguments).then(function () {
			viewModel.loading(false);
		});
	}
	else {
		return window.Helper.Database.initialize().then(function () {
			return window.Crm.Offline.Bootstrapper.initializeSettings();
		}).then(function () {
			return window.database.CrmOrder_Order
				.include("Company")
				.include("Person")
				.find(id)
				.then(function (order) {
					viewModel.order(order.asKoObservable());
					return window.database.CrmOrder_OrderItem
						.filter(function (orderItem) { return orderItem.OrderId === this.orderId; }, { orderId: viewModel.order().Id() })
						.orderBy("it.Position")
						.toArray(viewModel.items);
				}).then(function () {
					return window.Crm.Order.ViewModels.BaseOrderPdfModalViewModel.prototype.init.apply(viewModel, arguments).then(function () {
						viewModel.loading(false);
					});
				});
		});
	}
}