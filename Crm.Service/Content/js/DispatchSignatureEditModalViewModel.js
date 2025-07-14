namespace("Crm.Service.ViewModels").DispatchSignatureEditModalViewModel = function(parentViewModel) {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	viewModel.dispatch = window.ko.observable(null);
	viewModel.dispatchValidators = window.ko.observableArray([]);
	viewModel.dispatchValidatorErrors = window.ko.observableArray([]);
	viewModel.site = window.ko.observable(null);
	viewModel.lookups = { salutations: { $tableName: "Main_Salutation" } };

	viewModel.checkForEmptyTimesOrMaterials = window.ko.observable(false);
	viewModel.emptyTimesOrMaterialsMessage = window.ko.observable(null);
	viewModel.customerPersons = window.ko.observableArray([]);
	viewModel.originatorPersons = window.ko.observableArray([]);
	viewModel.selectableCustomerPersons = window.ko.pureComputed(function () {
		var selectablePersons = viewModel.customerPersons().map(function (person) {
			var displayName = window.Helper.Person.getDisplayNameWithSalutation(person, viewModel.lookups["salutations"], window.Crm.Service.Settings.ServiceOrderDispatch.CustomerSignatureIncludesLegacyId);
			return { DisplayName: displayName, Value: displayName };
		});
		if (selectablePersons.length > 0) {
			selectablePersons.push({ DisplayName: window.Helper.String.getTranslatedString("EnterCustomName"), Value: "" });
			selectablePersons.unshift({ DisplayName: window.Helper.String.getTranslatedString("PleaseSelectContact"), Value: null });
		}
		return selectablePersons;
	});
	viewModel.selectableOriginatorPersons = window.ko.pureComputed(function() {
		var selectablePersons = viewModel.originatorPersons().map(function (person) {
			var displayName = window.Helper.Person.getDisplayNameWithSalutation(person, viewModel.lookups["salutations"]);
			return { DisplayName: displayName, Value: displayName };
		});
		if (selectablePersons.length > 0) {
			selectablePersons.push({ DisplayName: window.Helper.String.getTranslatedString("EnterCustomName"), Value: "" });
			selectablePersons.unshift({ DisplayName: window.Helper.String.getTranslatedString("PleaseSelectContact"), Value: null });
		}
		return selectablePersons;
	});
	viewModel.displayCustomCustomerNameInput = window.ko.pureComputed(function() {
		if (!viewModel.dispatch()) {
			return false;
		}
		return viewModel.dispatch().SignatureContactName() === "" || viewModel.selectableCustomerPersons().length === 0 || (viewModel.dispatch().SignatureContactName() && !viewModel.selectableCustomerPersons().find(function (x) { return x.Value === viewModel.dispatch().SignatureContactName(); }));
	});
	viewModel.displayCustomOriginatorNameInput = window.ko.pureComputed(function() {
		if (!viewModel.dispatch()) {
			return false;
		}
		return viewModel.dispatch().SignatureOriginatorName() === "" || viewModel.selectableOriginatorPersons().length === 0 || (viewModel.dispatch().SignatureOriginatorName() && !viewModel.selectableOriginatorPersons().find(function (x) { return x.Value === viewModel.dispatch().SignatureOriginatorName(); }));
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
namespace("Crm.Service.ViewModels").DispatchSignatureEditModalViewModel.prototype.init = function (id) {
	var viewModel = this;
	return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups).then(function () {
		return window.database.CrmService_ServiceOrderDispatch
			.include("ServiceOrder")
		.include("ServiceOrderTimePostings")
		.include("ServiceOrderMaterial")
			.find(id)
			.then(function (dispatch) {
				window.database.attachOrGet(dispatch);
				viewModel.dispatch(dispatch.asKoObservable());
				viewModel.dispatch().selectedLanguage = viewModel.parentViewModel.selectedLanguage;
				viewModel.dispatch().SignatureJson.subscribe(function (value) {
					if (!value) {
						viewModel.dispatch().SignatureContactName(null);
						viewModel.dispatch().SignPrivacyPolicyAccepted(false);
						viewModel.dispatch().StatusKey("InProgress");
					}
				});
				viewModel.dispatch().SignatureOriginatorJson.subscribe(function (value) {
					if (!value) {
						viewModel.dispatch().SignatureOriginatorName(null);
					}
				});
			}).then(function () {
				if (!viewModel.dispatch().ServiceOrder().CustomerContactId())
					return $.Deferred().resolve().promise();
				return window.database.Main_Company
					.include2("Staff.filter(function(x) { return x.IsRetired === false })")
					.find(viewModel.dispatch().ServiceOrder().CustomerContactId())
					.then(function (company) {
						viewModel.customerPersons(company.Staff);
					});
			}).then(function () {
				if (!viewModel.dispatch().ServiceOrder().InitiatorId())
					return $.Deferred().resolve().promise();
				return window.database.Main_Company
					.include2("Staff.filter(function(x) { return x.IsRetired === false })")
					.find(viewModel.dispatch().ServiceOrder().InitiatorId())
					.then(function (company) {
						viewModel.originatorPersons(company.Staff);
					});
			}).then(function() {
				return window.database.Main_Site.GetCurrentSite().first();
			}).then(function(site) {
				viewModel.site(site);
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
					if (viewModel.errors().length > 0 || viewModel.dispatchValidatorErrors().length > 0) {
						viewModel.errors.showAllMessages();
						viewModel.loading(false);
						viewModel.errors.switchToError();
						return;
					}
				});
			});
	});
};
namespace("Crm.Service.ViewModels").DispatchSignatureEditModalViewModel.prototype.dispose = function() {
	var viewModel = this;
	window.database.detach(viewModel.dispatch().innerInstance);
};
namespace("Crm.Service.ViewModels").DispatchSignatureEditModalViewModel.prototype.save = function() {
	var viewModel = this;
	viewModel.loading(true);

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
		if (viewModel.errors().length > 0 || viewModel.dispatchValidatorErrors().length > 0) {
			viewModel.errors.showAllMessages();
			viewModel.loading(false);
			viewModel.errors.switchToError();
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

		if (viewModel.dispatch().StatusKey() === "InProgress" && (viewModel.dispatch().SignatureJson() || '').length > 0) {
			if ((viewModel.emptyTimesOrMaterialsWarning === "WARN" && !viewModel.checkForEmptyTimesOrMaterials() && (viewModel.emptyMaterials() || viewModel.emptyTimes()))) {
				viewModel.loading(false);
				viewModel.showError(false);
				addMessages();
				return;
			}
			if (viewModel.emptyTimesOrMaterialsWarning === "ERROR") {
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

		if (viewModel.dispatch().SignatureJson()) {
			viewModel.dispatch().StatusKey("SignedByCustomer");
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
namespace("Crm.Service.ViewModels").DispatchSignatureEditModalViewModel.prototype.toggleCustomerContactSelector = function () {
	var viewModel = this;
	viewModel.dispatch().SignatureContactName(null);
}
namespace("Crm.Service.ViewModels").DispatchSignatureEditModalViewModel.prototype.toggleOriginatorContactSelector = function () {
	var viewModel = this;
	viewModel.dispatch().SignatureOriginatorName(null);
}