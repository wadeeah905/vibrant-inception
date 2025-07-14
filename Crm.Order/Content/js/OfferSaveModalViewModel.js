namespace("Crm.Order.ViewModels").OfferSaveModalViewModel = function(parentViewModel) {
	var viewModel = this;
	window.Crm.Order.ViewModels.BaseOrderSaveModalViewModel.apply(viewModel, arguments);
	viewModel.offer = viewModel.baseOrder;
}
namespace("Crm.Order.ViewModels").OfferSaveModalViewModel.prototype = Object.create(window.Crm.Order.ViewModels.BaseOrderSaveModalViewModel.prototype);
namespace("Crm.Order.ViewModels").OfferSaveModalViewModel.prototype.init = function() {
	var viewModel = this;
	var args = arguments;
	return new $.Deferred().resolve().promise()
		.pipe(function() 
		{
			if (viewModel.baseOrder()) {
				return null;
			}
			return window.database.CrmOrder_Offer
				.find(viewModel.baseOrderId)
				.then(function(offer) {
					window.database.attachOrGet(offer);
					viewModel.baseOrder(offer.asKoObservable());
				});
		})
		.pipe(function() {
			return window.Crm.Order.ViewModels.BaseOrderSaveModalViewModel.prototype.init.apply(viewModel, args);
		});
};