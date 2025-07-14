namespace("Crm.Order.ViewModels").OrderSaveModalViewModel = function(parentViewModel) {
	var viewModel = this;
	window.Crm.Order.ViewModels.BaseOrderSaveModalViewModel.apply(viewModel, arguments);
	viewModel.order = viewModel.baseOrder;
	viewModel.signatureAcceptanceRequired = window.Crm.Order.Settings.Order.Show.PrivacyPolicy;
	viewModel.site = window.ko.observable(null);
}
namespace("Crm.Order.ViewModels").OrderSaveModalViewModel.prototype = Object.create(window.Crm.Order.ViewModels.BaseOrderSaveModalViewModel.prototype);
namespace("Crm.Order.ViewModels").OrderSaveModalViewModel.prototype.init = function() {
	var viewModel = this;
	var args = arguments;
	return new $.Deferred().resolve().promise()
		.pipe(function() {
			if (viewModel.baseOrder()) {
				return null;
			}
			return window.database.CrmOrder_Order
				.find(viewModel.baseOrderId)
				.then(function(order) {
					window.database.attachOrGet(order);
					viewModel.baseOrder(order.asKoObservable());
					viewModel.order().SignPrivacyPolicyAccepted.extend({
						validation: {
							validator: function (val, showPrivacyPolicy) {
								return !showPrivacyPolicy || !viewModel.order().Signature() || !!viewModel.order().Signature() && val;
							},
							message: window.Helper.String.getTranslatedString("PleaseAcceptDataPrivacyPolicy"),
							params: viewModel.signatureAcceptanceRequired
						}
					});
				});
		})
		.pipe(function() {
			return window.database.Main_Site.GetCurrentSite().first();
		}).then(function(site) {
			viewModel.site(site);
			return window.Crm.Order.ViewModels.BaseOrderSaveModalViewModel.prototype.init.apply(viewModel, args);
		});
};