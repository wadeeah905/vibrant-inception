(function () {
	var baseInitRemoveAddressChecks = window.Main.ViewModels.ContactDataViewModel.prototype.initRemoveAddressChecks;
	window.Main.ViewModels.ContactDataViewModel.prototype.initRemoveAddressChecks = function () {
		baseInitRemoveAddressChecks.apply(this);
		this.removeAddressChecks.push(this.isOrderDeliveryOrBillingAddress);
		this.removeAddressChecks.push(this.isOfferDeliveryOrBillingAddress);
	};
	window.Main.ViewModels.ContactDataViewModel.prototype.isOrderDeliveryOrBillingAddress = function () {
		var deferred = new $.Deferred();
		window.database.CrmOrder_Order
			.first("it.BillingAddressId === this.addressId || it.DeliveryAddressId === this.addressId",
				{ addressId: this.address.Id() },
				{
					success: function (order) { deferred.resolve(window.Helper.String.getTranslatedString("Order") + ": " + order.OrderNo); },
					error: deferred.resolve
				});
		return deferred.promise();
	};
	window.Main.ViewModels.ContactDataViewModel.prototype.isOfferDeliveryOrBillingAddress = function () {
		var deferred = new $.Deferred();
		window.database.CrmOrder_Offer
			.first("it.BillingAddressId === this.addressId || it.DeliveryAddressId === this.addressId",
				{ addressId: this.address.Id() },
				{
					success: function (offer) { deferred.resolve(window.Helper.String.getTranslatedString("Offer") + ": " + offer.OrderNo); },
					error: deferred.resolve
				}); 
		return deferred.promise();
	};
})();