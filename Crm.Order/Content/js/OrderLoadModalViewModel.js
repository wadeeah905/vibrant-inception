namespace("Crm.Order.ViewModels").OrderLoadModalViewModel = function(parentViewModel) {
	var viewModel = this;
	window.Crm.Order.ViewModels.OrderListIndexViewModel.call(viewModel, "CrmOrder_Order", "Id", "ASC", ["Company"]);
	viewModel.currentOrderId = window.ko.observable(parentViewModel.baseOrder().Id());
}
namespace("Crm.Order.ViewModels").OrderLoadModalViewModel.prototype = Object.create(window.Crm.Order.ViewModels.OrderListIndexViewModel.prototype);
namespace("Crm.Order.ViewModels").OrderLoadModalViewModel.prototype.discard = function (configuration) {
	var viewModel = this;
	var $modal = $(".modal:visible");
	$modal.hide();
	window.swal({
		title: window.Helper.String.getTranslatedString("DiscardOrder"),
		text: window.Helper.String.getTranslatedString("DiscardOrderConfirmationMessage"),
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
					text: window.Helper.String.getTranslatedString("DiscardOrderSuccessMessage"),
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