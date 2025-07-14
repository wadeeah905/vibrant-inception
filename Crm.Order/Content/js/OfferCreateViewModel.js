namespace("Crm.Order.ViewModels").OfferCreateViewModel = function(parentViewModel) {
	var viewModel = this;
	window.Crm.Order.ViewModels.BaseOrderCreateViewModel.apply(viewModel, arguments);
	viewModel.offer = viewModel.baseOrder;
}
namespace("Crm.Order.ViewModels").OfferCreateViewModel.prototype = Object.create(window.Crm.Order.ViewModels.BaseOrderCreateViewModel.prototype);
namespace("Crm.Order.ViewModels").OfferCreateViewModel.prototype.numberingSequence = "CRM.Offer";
namespace("Crm.Order.ViewModels").OfferCreateViewModel.prototype.init = async function () {
	const viewModel = this;
	const offer = window.database.CrmOrder_Offer.CrmOrder_Offer.create();
	offer.Id = window.$data.createGuid().toString().toLowerCase();
	offer.OrderDate = new Date();
	offer.ValidTo = window.moment().startOf("day").add(parseInt(window.Crm.Order.Settings.ValidToDefaultTimespan), "days").toDate();
	viewModel.offer(offer.asKoObservable());
	await window.Crm.Order.ViewModels.BaseOrderCreateViewModel.prototype.init.apply(this, arguments);
	viewModel.offer().ResponsibleUser(viewModel.user().Id);
	window.database.add(offer);
}
namespace("Crm.Order.ViewModels").OfferCreateViewModel.prototype.submit = function() {
	const viewModel = this;
	const args = arguments;
	viewModel.loading(true);

	if (viewModel.errors().length > 0) {
		viewModel.loading(false);
		viewModel.errors.showAllMessages();
		viewModel.errors.scrollToError();
		return;
	}

	return window.NumberingService.createNewNumberBasedOnAppSettings(window.Crm.Order.Settings.Offer.OfferNoIsGenerated, window.Crm.Order.Settings.Offer.OfferNoIsCreateable, viewModel.offer().OrderNo(), window.Crm.Order.ViewModels.OfferCreateViewModel.prototype.numberingSequence, window.database.CrmOrder_Offer, "OrderNo")
		.pipe(function (offerNo) {
			if (!viewModel.offer().OrderNo()) {
				viewModel.offer().OrderNo(offerNo);
			}
			return window.Crm.Order.ViewModels.BaseOrderCreateViewModel.prototype.submit.apply(viewModel, args)
		})
		.pipe(function () {
			window.location.hash = "/Crm.Order/Offer/Details/" + viewModel.offer().Id();
		});
}

