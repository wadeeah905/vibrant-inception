namespace("Crm.Service.ViewModels").ServiceOrderCloseModalViewModel = function() {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	viewModel.serviceOrder = window.ko.observable(null);
	viewModel.errors = window.ko.validation.group(viewModel.serviceOrder, { deep: true });
};
namespace("Crm.Service.ViewModels").ServiceOrderCloseModalViewModel.prototype.init = function(id, params) {
	var viewModel = this;
	viewModel.returnUrl = params.returnUrl;
	return window.database.CrmService_ServiceOrderHead.find(id)
		.then(function(serviceOrder) {
			window.database.attachOrGet(serviceOrder);
			viewModel.serviceOrder(serviceOrder.asKoObservable());
			viewModel.serviceOrder().CloseReason.extend({
				required: {
					params: true,
					message: window.Helper.String.getTranslatedString("RuleViolation.Required")
						.replace("{0}", window.Helper.String.getTranslatedString("Reason"))
				}
			});
		});
};
namespace("Crm.Service.ViewModels").ServiceOrderCloseModalViewModel.prototype.dispose = function() {
	var viewModel = this;
	window.database.detach(viewModel.serviceOrder().innerInstance);
};
namespace("Crm.Service.ViewModels").ServiceOrderCloseModalViewModel.prototype.save = function() {
	var viewModel = this;
	viewModel.loading(true);

	if (viewModel.errors().length > 0) {
		viewModel.loading(false);
		viewModel.errors.showAllMessages();
		return;
	}
	viewModel.serviceOrder().StatusKey("Closed");
	window.database.saveChanges().then(function() {
		viewModel.loading(false);
		$(".modal:visible").modal("hide");
		if (viewModel.returnUrl) {
			window.location.hash = viewModel.returnUrl;
		} else {
			$.sammy("#content").refresh();
		}
	}).fail(function() {
		viewModel.loading(false);
		window.swal(window.Helper.String.getTranslatedString("UnknownError"),
			window.Helper.String.getTranslatedString("Error_InternalServerError"),
			"error");
	});
};