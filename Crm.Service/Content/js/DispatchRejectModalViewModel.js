namespace("Crm.Service.ViewModels").DispatchRejectModalViewModel = function(parentViewModel) {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	viewModel.dispatch = window.ko.observable(null);
	viewModel.lookups = {
		serviceOrderDispatchRejectReasons: {}
	};
	viewModel.errors = window.ko.validation.group(viewModel.dispatch, { deep: true });
	viewModel.serviceOrder = parentViewModel.serviceOrder;
	viewModel.refreshParentViewModel = function() {
		if (parentViewModel instanceof window.Crm.Service.ViewModels.DispatchDetailsViewModel) {
			parentViewModel.init(viewModel.dispatch().Id(), parentViewModel.status);
		}
	};
};
namespace("Crm.Service.ViewModels").DispatchRejectModalViewModel.prototype.init = function(id) {
	var viewModel = this;
	return window.database.CrmService_ServiceOrderDispatch
		.include("ServiceOrder")
		.find(id)
		.then(function(dispatch) {
			viewModel.dispatch(dispatch.asKoObservable());
			viewModel.dispatch().StatusKey("Rejected");
			viewModel.dispatch().RejectReasonKey.extend({
				required: {
					params: true,
					message: window.Helper.String.getTranslatedString("RuleViolation.Required")
						.replace("{0}", window.Helper.String.getTranslatedString("RejectReason"))
				}
			});
			viewModel.dispatch().RejectReasonKey.subscribe(function(rejectReasonKey) {
				var serviceOrderStatusKey = viewModel.lookups.serviceOrderDispatchRejectReasons[rejectReasonKey].ServiceOrderStatusKey;
				viewModel.dispatch().ServiceOrder().StatusKey(serviceOrderStatusKey);
			});
			window.database.attachOrGet(dispatch);
		}).then(function() {
			return window.Helper.Lookup.getLocalizedArrayMap("CrmService_ServiceOrderDispatchRejectReason").then(
				function(lookups) {
					lookups.$array = lookups.$array.filter(x => x.Key !== null);
					viewModel.lookups.serviceOrderDispatchRejectReasons = lookups;
				});
		});
};
namespace("Crm.Service.ViewModels").DispatchRejectModalViewModel.prototype.dispose = function() {
	var viewModel = this;
	window.database.detach(viewModel.dispatch().innerInstance);
};
namespace("Crm.Service.ViewModels").DispatchRejectModalViewModel.prototype.save = function() {
	var viewModel = this;
	viewModel.loading(true);

	if (viewModel.errors().length > 0) {
		viewModel.loading(false);
		viewModel.errors.showAllMessages();
		return;
	}

	window.database.saveChanges().then(function() {
		viewModel.loading(false);
		if (viewModel.serviceOrder)
			viewModel.serviceOrder().StatusKey(window.ko.unwrap(viewModel.dispatch().ServiceOrder().StatusKey));
		viewModel.refreshParentViewModel();
		$(".modal:visible").modal("hide");
	}).fail(function() {
		viewModel.loading(false);
		window.swal(window.Helper.String.getTranslatedString("UnknownError"),
			window.Helper.String.getTranslatedString("Error_InternalServerError"),
			"error");
	});
};