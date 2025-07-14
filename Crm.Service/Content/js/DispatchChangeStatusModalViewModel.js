namespace("Crm.Service.ViewModels").DispatchChangeStatusModalViewModel = function(parentViewModel) {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	viewModel.dispatch = window.ko.observable(null);
	viewModel.dispatchValidators = window.ko.observableArray([]);
	viewModel.dispatchValidatorErrors = window.ko.observableArray([]);
	viewModel.previousDispatchStatusKey = window.ko.observable(null);
	viewModel.checkForEmptyTimesOrMaterials = window.ko.observable(false);
	viewModel.emptyTimesOrMaterialsMessage = window.ko.observable(null);

	viewModel.lookups = {
		installationHeadStatuses: {},
		serviceOrderDispatchStatuses: {}
	};
	viewModel.dispatchIsEditable = window.ko.pureComputed(function () {
		if (!viewModel.dispatch() || !viewModel.dispatch().StatusKey() || !window.AuthorizationManager.isAuthorizedForAction('Dispatch', 'Edit')) {
			return false;
		}
		return viewModel.dispatch().StatusKey() === "InProgress";
	});
	viewModel.displayRequiredOperationsInput = window.ko.pureComputed(function() {
		return viewModel.dispatch() !== null && viewModel.dispatch().StatusKey() === "ClosedNotComplete";
	});
	viewModel.formDisabled = window.ko.pureComputed(function() {
		return viewModel.dispatchValidatorErrors().length > 0;
	});
	viewModel.errors = window.ko.validation.group(viewModel.dispatch, { deep: true });
	viewModel.parentViewModel = parentViewModel;
	viewModel.refreshParentViewModel = function() {
		parentViewModel.init(viewModel.dispatch().Id());
	};
	viewModel.emptyMaterials = window.ko.pureComputed(function () {
		return viewModel.dispatch().ServiceOrderMaterial().length === 0;
	});
	viewModel.emptyTimes = window.ko.pureComputed(function () {
		return viewModel.dispatch().ServiceOrderTimePostings().length === 0;
	});
	viewModel.emptyTimesOrMaterialsWarning = window.Crm.Service.Settings?.Service.Dispatch.Show.EmptyTimesOrMaterialsWarning;
	viewModel.showError = ko.observable(false);
};
namespace("Crm.Service.ViewModels").DispatchChangeStatusModalViewModel.prototype.init = function(id) {
	var viewModel = this;
	return window.database.CrmService_ServiceOrderDispatch
		.include("ServiceOrder")
		.include("ServiceOrder.Installation")
		.include("ServiceOrderMaterial")
		.include("ServiceOrderTimePostings")
		.find(id)
		.then(function (dispatch) {
			viewModel.previousDispatchStatusKey(dispatch.StatusKey);
			dispatch.StatusKey = null;
			window.database.attachOrGet(dispatch);
			viewModel.dispatch(dispatch.asKoObservable());
			viewModel.dispatch().FollowUpServiceOrder.subscribe(function() {
				viewModel.dispatch().FollowUpServiceOrderRemark(null);
			});
			viewModel.dispatch().StatusKey.subscribe(function(statusKey) {
				var serviceOrderStatusKey = statusKey === "ClosedNotComplete" ? "PartiallyCompleted" : "Completed";
				viewModel.dispatch().ServiceOrder().StatusKey(serviceOrderStatusKey);
				viewModel.dispatch().RequiredOperations(null);
			});
		}).then(function() {
			return window.Helper.Lookup.getLocalizedArrayMap("CrmService_InstallationHeadStatus").then(
				function(lookups) {
					viewModel.lookups.installationHeadStatuses = lookups;
				});
		}).then(function() {
			return window.Helper.Lookup
				.getLocalizedArrayMap("CrmService_ServiceOrderDispatchStatus",
					null,
					"it.SortOrder > 5 && it.SortOrder < 8;").then(function(lookups) {
					viewModel.lookups.serviceOrderDispatchStatuses = lookups;
				});
		}).then(function () {
			var dispatchValidatorErrors = [];
			window.async.eachSeries(viewModel.dispatchValidators(), function (validator, cb) {
				validator.call(viewModel).then(function (error) {
					if (error) {
						dispatchValidatorErrors.push(error);
					}
					cb();
				});
			}, function () {
				viewModel.dispatchValidatorErrors(dispatchValidatorErrors);
				viewModel.dispatchValidatorErrors.valueHasMutated();
			});
		});
};
namespace("Crm.Service.ViewModels").DispatchChangeStatusModalViewModel.prototype.dispose = function() {
	var viewModel = this;
	window.database.detach(viewModel.dispatch().innerInstance);
};
namespace("Crm.Service.ViewModels").DispatchChangeStatusModalViewModel.prototype.save = function() {
	var viewModel = this;
	viewModel.loading(true);
	var dispatchValidatorErrors = [];
	window.async.eachSeries(viewModel.dispatchValidators(), function(validator, cb) {
		validator.call(viewModel).then(function (error) {
			if (error) {
				dispatchValidatorErrors.push(error);
			}
			cb();
		});
	}, function () {
		viewModel.dispatchValidatorErrors(dispatchValidatorErrors);
		if (viewModel.errors().length > 0 || viewModel.dispatchValidatorErrors().length > 0) {
			viewModel.errors.showAllMessages();
			viewModel.loading(false);
			return;
		}

		let addMessages = function () {
			if (viewModel.emptyMaterials() && viewModel.emptyTimes()) {
				viewModel.emptyTimesOrMaterialsMessage(Helper.String.getTranslatedString("EmptyTimesAndMaterials"));
			} else {
				if (viewModel.emptyMaterials()) {
					viewModel.emptyTimesOrMaterialsMessage(Helper.String.getTranslatedString("EmptyMaterials"));
				} else if (viewModel.emptyTimes()) {
					viewModel.emptyTimesOrMaterialsMessage(Helper.String.getTranslatedString("EmptyTimes"));
				}
			}
			viewModel.checkForEmptyTimesOrMaterials(true);
		}

		if((viewModel.emptyTimesOrMaterialsWarning === "WARN" && !viewModel.checkForEmptyTimesOrMaterials() && (viewModel.emptyMaterials() || viewModel.emptyTimes()))){
			viewModel.loading(false);
			viewModel.showError(false);
			addMessages();
			return;
		}
		if (viewModel.emptyTimesOrMaterialsWarning === "ERROR") {
			if (!viewModel.checkForEmptyTimesOrMaterials()) {
				if ((viewModel.emptyMaterials() && viewModel.emptyTimes())) {
					viewModel.loading(false);
					viewModel.showError(true);
					addMessages();
					return;
				} else if (!(!viewModel.emptyMaterials() && !viewModel.emptyTimes()) && !viewModel.checkForEmptyTimesOrMaterials()) {
					viewModel.loading(false);
					viewModel.showError(false);
					addMessages();
					return;
				}
			}
		}
		window.database.saveChanges().then(function () {
			viewModel.loading(false);
			viewModel.refreshParentViewModel();
			$(".modal:visible").modal("hide");
		}).fail(function () {
			viewModel.loading(false);
			window.swal(window.Helper.String.getTranslatedString("UnknownError"),
				window.Helper.String.getTranslatedString("Error_InternalServerError"),
				"error");
		});
	});
};