namespace("Crm.Order.ViewModels").OfferDetailsViewModel = function() {
	var viewModel = this;
	window.Crm.Order.ViewModels.BaseOrderDetailsViewModel.apply(this, arguments);
	viewModel.offer = viewModel.baseOrder;
	viewModel.isEditable = window.ko.computed(function() {
		return viewModel.offer() && !viewModel.offer().IsLocked();
	});
	viewModel.showUpcomingArticles(true);
	viewModel.lookups = {
		...viewModel.lookups,
		orderStatuses: {$tableName: "CrmOrder_OrderStatus"},
		cancelReasonCategories: {$tableName: "CrmOrder_OrderCancelReasonCategory"}
	}
	window.Helper.Database.registerEventHandlers(viewModel, { CrmOrder_Offer: { afterUpdate: viewModel.refresh } });
}
namespace("Crm.Order.ViewModels").OfferDetailsViewModel.prototype = Object.create(window.Crm.Order.ViewModels.BaseOrderDetailsViewModel.prototype);
namespace("Crm.Order.ViewModels").OfferDetailsViewModel.prototype.init = function(id, params) {
	var viewModel = this;
	var args = arguments;
	viewModel.offerId = id;
	return new $.Deferred().resolve().promise()
		.pipe(function() {
			if (viewModel.offerId) {
				return viewModel.refresh();
			}
			var newOffer = window.database.CrmOrder_Offer.CrmOrder_Offer.create();
			window.database.add(newOffer);
			newOffer.Id = window.$data.createGuid().toString().toLowerCase();
			newOffer.OrderDate = new Date();
			viewModel.offerId = newOffer.Id;
			viewModel.baseOrder(newOffer.asKoObservable());
		})
		.pipe(function() {
			if (id) {
				return viewModel.setBreadcrumbs();
			}
			return null;
		})
		.pipe(function() {
			return Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups)
		})
		.pipe(function() {
			return window.Crm.Order.ViewModels.BaseOrderDetailsViewModel.prototype.init.apply(viewModel, args);
		});
}
namespace("Crm.Order.ViewModels").OfferDetailsViewModel.prototype.refresh = function() {
	var viewModel = this;
	return window.Crm.Order.ViewModels.BaseOrderDetailsViewModel.prototype.refresh.apply(this, arguments).then(function() {
		return window.database.CrmOrder_Offer
			.include("Company")
			.include("Person")
			.find(viewModel.offerId)
			.then(function(offer) {
				viewModel.offer(offer.asKoObservable());
			});
	});
};

namespace("Crm.Order.ViewModels").OfferDetailsViewModel.prototype.setBreadcrumbs = function () {
	var viewModel = this;
	return window.breadcrumbsViewModel.setBreadcrumbs([
		new Breadcrumb(Helper.String.getTranslatedString("Offer"), "#/Crm.Order/OfferList/IndexTemplate"),
		new Breadcrumb(viewModel.offer().OrderNo(), window.location.hash)
	]);
};

namespace("Crm.Order.ViewModels").OfferDetailsViewModel.prototype.exportOffer = async function() {
	const viewModel = this;
	let confirm = await window.Helper.Confirm.genericConfirmAsync({
		text: window.Helper.String.getTranslatedString("ConfirmExportOffer"),
		type: "warning"
	});
	if (!confirm) {
		return;
	}
	viewModel.loading(true);
	window.database.attachOrGet(viewModel.baseOrder().innerInstance);
	viewModel.baseOrder().IsLocked(true);
	viewModel.baseOrder().ReadyForExport(true);
	await window.database.saveChanges();
	viewModel.loading(false);
}
namespace("Crm.Order.ViewModels").OfferDetailsViewModel.prototype.cancelExport = async function() {
	const viewModel = this;
	viewModel.loading(true);
	let latestOffer = await database.CrmOrder_Offer.find(viewModel.baseOrder().Id())
	if(latestOffer.IsExported === true) {
		await window.Helper.Confirm.genericConfirmAsync({
			text: window.Helper.String.getTranslatedString("OfferAlreadyExported"),
			type: "error"
		});
		viewModel.baseOrder(latestOffer.asKoObservable());
		viewModel.loading(false);
		return
	} 
	window.database.attachOrGet(viewModel.baseOrder().innerInstance);
	viewModel.baseOrder().IsLocked(false);
	viewModel.baseOrder().ReadyForExport(false);
	await window.database.saveChanges();
	viewModel.loading(false);
}
namespace("Crm.Order.ViewModels").OfferDetailsViewModel.prototype.cancel = function() {
	var viewModel = this;
	window.database.attachOrGet(viewModel.baseOrder().innerInstance);
	viewModel.baseOrder().IsLocked(true);
	viewModel.baseOrder().StatusKey("Canceled");
	return window.database.saveChanges().then( function () {
		$(".modal:visible").modal("hide");
	})
}