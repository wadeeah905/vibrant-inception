namespace("Crm.Order.ViewModels").OrderCreateViewModel = function (parentViewModel) {
	var viewModel = this;
	window.Crm.Order.ViewModels.BaseOrderCreateViewModel.apply(viewModel, arguments);
	viewModel.order = viewModel.baseOrder;
}
namespace("Crm.Order.ViewModels").OrderCreateViewModel.prototype = Object.create(window.Crm.Order.ViewModels.BaseOrderCreateViewModel.prototype);
namespace("Crm.Order.ViewModels").OrderCreateViewModel.prototype.numberingSequence = "CRM.Order";
namespace("Crm.Order.ViewModels").OrderCreateViewModel.prototype.init = async function () {
	const viewModel = this;
	const order = window.database.CrmOrder_Order.CrmOrder_Order.create();
	order.Id = window.$data.createGuid().toString().toLowerCase();
	order.OrderDate = new Date();
	viewModel.order(order.asKoObservable());
	await window.Crm.Order.ViewModels.BaseOrderCreateViewModel.prototype.init.apply(this, arguments)
	viewModel.order().ResponsibleUser(viewModel.user().Id);
	window.database.add(order);
}
namespace("Crm.Order.ViewModels").OrderCreateViewModel.prototype.submit = function () {
	const viewModel = this;
	const args = arguments;
	viewModel.loading(true);

	if (viewModel.errors().length > 0) {
		viewModel.loading(false);
		viewModel.errors.showAllMessages();
		viewModel.errors.scrollToError();
		return;
	}

	return window.NumberingService.createNewNumberBasedOnAppSettings(window.Crm.Order.Settings.Order.OrderNoIsGenerated, window.Crm.Order.Settings.Order.OrderNoIsCreateable, viewModel.order().OrderNo(), window.Crm.Order.ViewModels.OrderCreateViewModel.prototype.numberingSequence, window.database.CrmOrder_Order, "OrderNo")
		.pipe(function (orderNo) {
			if (orderNo !== undefined) {
				viewModel.order().OrderNo(orderNo);
			}
			return window.Crm.Order.ViewModels.BaseOrderCreateViewModel.prototype.submit.apply(viewModel, args)
				.pipe(function () {
					window.location.hash = "/Crm.Order/Order/DetailsTemplate/" + viewModel.order().Id();
				});
		})
}