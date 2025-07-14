namespace("Crm.Order.ViewModels").OrderDetailsViewModel = function() {
	var viewModel = this;
	window.Crm.Order.ViewModels.BaseOrderDetailsViewModel.apply(this, arguments);
	viewModel.order = viewModel.baseOrder;
	viewModel.isClosed = window.ko.computed(function() {
		return viewModel.order() != null && viewModel.order().StatusKey() === "Closed";
	});
	viewModel.isEditable = window.ko.computed(function() {
		return viewModel.order() != null && !viewModel.isClosed() && !viewModel.order().ReadyForExport();
	});
	window.Helper.Database.registerEventHandlers(viewModel, { CrmOrder_Order: { afterUpdate: viewModel.refresh } });
}
namespace("Crm.Order.ViewModels").OrderDetailsViewModel.prototype = Object.create(window.Crm.Order.ViewModels.BaseOrderDetailsViewModel.prototype);
namespace("Crm.Order.ViewModels").OrderDetailsViewModel.prototype.init = function(id, params) {
	var viewModel = this;
	var args = arguments
	viewModel.orderId = id;
	return new $.Deferred().resolve().promise()
		.pipe(function() {
			if (viewModel.orderId) {
				return viewModel.refresh();
			}
			var newOrder = window.database.CrmOrder_Order.CrmOrder_Order.create();
			window.database.add(newOrder);
			newOrder.Id = window.$data.createGuid().toString().toLowerCase();
			newOrder.OrderDate = new Date();
			viewModel.orderId = newOrder.Id;
			viewModel.baseOrder(newOrder.asKoObservable());
		})
		.pipe(function(order) {
			return window.Crm.Order.ViewModels.BaseOrderDetailsViewModel.prototype.init.apply(viewModel, args);
		})
		.then(() => viewModel.setBreadcrumbs());
};
namespace("Crm.Order.ViewModels").OrderDetailsViewModel.prototype.exportOrder = async function() {
	const viewModel = this;
	let confirm = await window.Helper.Confirm.genericConfirmAsync({
		text: window.Helper.String.getTranslatedString("ConfirmExportOrder"),
		type: "warning"
	});
	if (!confirm) {
		return;
	}
	viewModel.loading(true);
	window.database.attachOrGet(viewModel.baseOrder().innerInstance);
	viewModel.baseOrder().ReadyForExport(true);
	await window.database.saveChanges();
	viewModel.loading(false);
}
namespace("Crm.Order.ViewModels").OrderDetailsViewModel.prototype.cancelExport = async function() {
	const viewModel = this;
	viewModel.loading(true);
	let latestOrder = await database.CrmOrder_Order.find(viewModel.baseOrder().Id())
	if(latestOrder.IsExported === true) {
		await window.Helper.Confirm.genericConfirmAsync({
			text: window.Helper.String.getTranslatedString("OrderAlreadyExported"),
			type: "error"
		});
		viewModel.baseOrder(latestOrder.asKoObservable());
		viewModel.loading(false);
		return
	}
	window.database.attachOrGet(viewModel.baseOrder().innerInstance);
	viewModel.baseOrder().ReadyForExport(false);
	await window.database.saveChanges();
	viewModel.loading(false);
}
namespace("Crm.Order.ViewModels").OrderDetailsViewModel.prototype.complete = function() {
	var viewModel = this;
	var d = new $.Deferred();
	if(!viewModel.orderItems().length) {
		window.swal({
			title: window.Helper.String.getTranslatedString("CannotCompleteOrder"),
			text: window.Helper.String.getTranslatedString("NoOrderItemsInfo"),
			type: "warning",
			showCancelButton: false,
			confirmButtonText: window.Helper.String.getTranslatedString("Ok"),
			closeOnConfirm: true
		}, function() {
			d.reject();
		});
	} else {
		window.swal({
			title: window.Helper.String.getTranslatedString("CloseOrder"),
			text: window.Helper.String.getTranslatedString("ReallyCloseOrder"),
			type: "warning",
			showCancelButton: true,
			confirmButtonText: window.Helper.String.getTranslatedString("Complete"),
			cancelButtonText: window.Helper.String.getTranslatedString("Cancel")
		}, function (isConfirm) {
			if (isConfirm) {
				window.database.attachOrGet(viewModel.order().innerInstance);
				viewModel.order().StatusKey("Closed");
				window.database.saveChanges().then(d.resolve).fail(d.reject);
				viewModel.showSnackbar(window.Helper.String.getTranslatedString("OrderCompleted"));
			} else {
				d.reject();
			}
		});
	}
	return d.promise();
};
namespace("Crm.Order.ViewModels").OrderDetailsViewModel.prototype.refresh = function() {
	var viewModel = this;
	return window.Crm.Order.ViewModels.BaseOrderDetailsViewModel.prototype.refresh.apply(this, arguments).then(function() {
		return window.database.CrmOrder_Order
			.include("Company")
			.include("Person")
			.find(viewModel.orderId)
			.then(function(order) {
				viewModel.order(order.asKoObservable());
			});
	});
};

namespace("Crm.Order.ViewModels").OrderDetailsViewModel.prototype.setBreadcrumbs = function () {
	var viewModel = this;
	window.breadcrumbsViewModel.setBreadcrumbs([
		new Breadcrumb(Helper.String.getTranslatedString("Order"), "#/Crm.Order/OrderList/IndexTemplate"),
		new Breadcrumb(viewModel.order().OrderNo(), window.location.hash)
	]);
};
