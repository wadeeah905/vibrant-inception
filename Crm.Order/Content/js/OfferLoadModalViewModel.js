namespace("Crm.Order.ViewModels").OfferLoadModalViewModel = function(parentViewModel) {
	var viewModel = this;
	window.Crm.Order.ViewModels.OfferListIndexViewModel.call(viewModel, "CrmOrder_Offer", "Id", "ASC", ["Company"]);
	viewModel.currentOfferId = window.ko.observable(parentViewModel.baseOrder().Id());
}
namespace("Crm.Order.ViewModels").OfferLoadModalViewModel.prototype = Object.create(window.Crm.Order.ViewModels.OfferListIndexViewModel.prototype);
namespace("Crm.Order.ViewModels").OfferLoadModalViewModel.prototype.discard = function (configuration) {
	var viewModel = this;
	var $modal = $(".modal:visible");
	$modal.hide();
	window.swal({
		title: window.Helper.String.getTranslatedString("DiscardOffer"),
		text: window.Helper.String.getTranslatedString("DiscardOfferConfirmationMessage"),
		type: "warning",
		showCancelButton: true,
		confirmButtonText: window.Helper.String.getTranslatedString("Discard"),
		cancelButtonText: window.Helper.String.getTranslatedString("Cancel"),
		closeOnConfirm: false
	}, function(isConfirm) {
		if (isConfirm) {
			window.database.remove(configuration.innerInstance);
			window.database.saveChanges().then(function() {
				window.swal({
					title: window.Helper.String.getTranslatedString("Discarded"),
					text: window.Helper.String.getTranslatedString("DiscardOfferSuccessMessage"),
					type: "success",
					confirmButtonText: window.Helper.String.getTranslatedString("Close")
				}, function() {
					viewModel.filter();
					$modal.show();
				});
			});
		} else {
			$modal.show();
		}
	});
}