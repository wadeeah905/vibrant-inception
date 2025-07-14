namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistEditModalViewModel = function (parentViewModel) {
	var viewModel = this;
	window.Crm.DynamicForms.ViewModels.DynamicFormDetailsViewModel.apply(viewModel, arguments);
	viewModel.dispatch = parentViewModel !== null ? parentViewModel.dispatch : ko.observable();
	viewModel.serviceCases = window.ko.observableArray([]);
	viewModel.serviceCaseForms = window.ko.observableArray([]);
	viewModel.lookups = {
		serviceCaseCategories: { $tableName: "CrmService_ServiceCaseCategory" },
		servicePriorities: { $tableName: "CrmService_ServicePriority" }
	};
	viewModel.applyChanges = function() {
		return window.database.saveChanges();
	};
	var baseHasPendingChanges = viewModel.hasPendingChanges;
	viewModel.hasPendingChanges = window.ko.pureComputed(function() {
		return baseHasPendingChanges() || viewModel.serviceCases().some(x => x.entityState === window.$data.EntityState.Added);
	});
};
namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistEditModalViewModel.prototype =
	Object.create(window.Crm.DynamicForms.ViewModels.DynamicFormDetailsViewModel.prototype);
namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistEditModalViewModel.prototype.createServiceCase =
	function(dynamicFormElement) {
		var viewModel = this;
		if (!viewModel.dispatch()) {
			viewModel.showNotification("CannotCreateServiceCase");
			return;
		}
		viewModel.showSubPage(true);
		viewModel.subPageDynamicFormElement(dynamicFormElement);
		viewModel.subPageTitle(window.Helper.String.getTranslatedString("CreateServiceCase"));
		$.get(window.Helper.resolveUrl("~/Sms.Checklists/ServiceCase/CreateTemplateForm")).then(function(result) {
			viewModel.initServiceCaseCreateViewModel(dynamicFormElement).then(function(serviceCaseCreateViewModel) {
				viewModel.subPageCancel = function() {
					window.database.detach(serviceCaseCreateViewModel.serviceCase().innerInstance);
					if (serviceCaseCreateViewModel.completionDynamicForm()) {
						window.database.detach(serviceCaseCreateViewModel.completionDynamicForm());
					}
					serviceCaseCreateViewModel.creationDynamicForms().forEach(function (creationDynamicForm) {
						creationDynamicForm.formReference().Responses().forEach(function(response) {
							window.database.detach(response.innerInstance);
						});
						creationDynamicForm.dispose();
					});
					viewModel.toggleSubPage();
				};
				viewModel.subPageSave = function () {
					viewModel.loading(true);
					serviceCaseCreateViewModel.setServiceCaseNo().then(function () {
						if (serviceCaseCreateViewModel.creationDynamicForm()) {
							return serviceCaseCreateViewModel.creationDynamicForm().complete().then(function () {
								serviceCaseCreateViewModel.creationDynamicForm().formReference().Responses([]);
								viewModel.serviceCaseForms.push(serviceCaseCreateViewModel.creationDynamicForm());
							});
						}
						return null;
					}).then(function () {
						viewModel.serviceCases.push(serviceCaseCreateViewModel.serviceCase().innerInstance);
						viewModel.toggleSubPage();
						viewModel.showNotification("ServiceCaseDraftCreatedNotification");
						viewModel.loading(false);
					}).fail(function () {
						viewModel.loading(false);
						serviceCaseCreateViewModel.errors.showAllMessages();
						serviceCaseCreateViewModel.errors.scrollToError();
					});
				};
				var $result = $(result);
				window.ko.applyBindings(serviceCaseCreateViewModel, $result[0]);
				$("#modal-sub-page").html("").append($result[0]);
			});
		});
	};
namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistEditModalViewModel.prototype.dispose = function () {
	var viewModel = this;
	viewModel.serviceCases().forEach(function(serviceCase) {
		window.database.detach(serviceCase);
	});
	viewModel.serviceCaseForms().forEach(function (serviceCaseForm) {
		serviceCaseForm.dispose();
	});
	window.Crm.DynamicForms.ViewModels.DynamicFormDetailsViewModel.prototype.dispose.apply(this, arguments);
};
namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistEditModalViewModel.prototype.showNotification = function (message) {
	$.growl({
		message: window.Helper.String.getTranslatedString(message)
	},
		{
			type: "inverse",
			allow_dismiss: true,
			placement: {
				from: "top",
				align: "center"
			},
			z_index: 9999,
			delay: 2500,
			animate: {
				enter: "animated fadeInDown",
				exit: "animated fadeOut"
			}
		});
};
namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistEditModalViewModel.prototype.closeModal = function () {
	var viewModel = this;
	if (Helper.ServiceOrderChecklist.hasPendingServiceCase() && !Helper.ServiceOrderChecklist.hasPendingFormResponse()) {
		Helper.DOM.hideModal();
		swal({
			type: "warning",
			title: "",
			text: window.Helper.String.getTranslatedString("ConfirmDiscardServiceCase"),
			showCancelButton: true,
			cancelButtonText: window.Helper.String.getTranslatedString("Cancel"),
			confirmButtonText: window.Helper.String.getTranslatedString("Discard")
		},
			function (isConfirmed) {
				if (isConfirmed) {
					Helper.Database.clearTrackedEntities();
					Helper.DOM.dismissModal();
				} else {
					Helper.DOM.showModal();
				}
			});
	} else {
		Helper.DOM.dismissModal();
	}
};
namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistEditModalViewModel.prototype.getServiceCases =
	function(dynamicFormElement) {
		var viewModel = this;
		return viewModel.serviceCases().filter(function(serviceCase) {
			return serviceCase.ExtensionValues.AffectedDynamicFormElementId === dynamicFormElement.Id();
		});
	};
namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistEditModalViewModel.prototype.getPopOverText = function(serviceCase) {
	var viewModel = this;
	var text = "";
	if (serviceCase.ErrorMessage) {
		text += window.Helper.String.getTranslatedString("ErrorMessage") + ": " + "<i>" + serviceCase.ErrorMessage + "</i>" +"<br/>";
	}
	if (serviceCase.PriorityKey) {
		var priority = viewModel.lookups.servicePriorities.$array.find(function (x) {
			return x.Key === serviceCase.PriorityKey;
		});
		text += window.Helper.String.getTranslatedString("Priority") + ": " + "<i>" + priority.Value + "</i>" + "<br/>";
	}
	if (serviceCase.CategoryKey) {
		var category = viewModel.lookups.serviceCaseCategories.$array.find(function (x) {
			return x.Key === serviceCase.CategoryKey;
		});
		text += window.Helper.String.getTranslatedString("Category") + ": " + "<i>" + category.Value + "</i>" + "<br/>";
	}
	return text;
};
namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistEditModalViewModel.prototype.init = function(id, params) {
	var viewModel = this;
	let checklist = null;
	return window.database.SmsChecklists_ServiceOrderChecklist
		.includeDynamicFormElements()
		.include("DynamicForm.Languages")
		.include("ServiceOrderTime")
		.find(id)
		.then(function (serviceOrderChecklist) {
			checklist = serviceOrderChecklist;
			return window.database.CrmDynamicForms_DynamicFormResponse
				.filter("it.DynamicFormReferenceKey === this.id", { id: id })
				.orderByDescending("it.ModifyDate")
				.toArray();
		}).then(function (responses) {
			checklist.Responses = responses;
			return window.Crm.DynamicForms.ViewModels.DynamicFormDetailsViewModel.prototype.init.call(viewModel, 
				{ formReference: checklist.asKoObservable() });
		})
		.then(function () {
			if (!!params.dispatchId)
				return window.database.CrmService_ServiceOrderDispatch.find(params.dispatchId).then(function (dispatch) {
					viewModel.dispatch(dispatch.asKoObservable());
				});
		})
		.then(function () {
			return window.database.CrmService_ServiceCase.filter(function(it) {
						return it.ExtensionValues.AffectedDynamicFormReferenceId === this.id;
					},
					{ id: id })
				.toArray();
		}).then(function(serviceCases) {
			viewModel.serviceCases(serviceCases);
			viewModel.addValidationRules();
			viewModel.addRequiredValidationRules();
			return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups);
		});
};
namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistEditModalViewModel.prototype
	.initServiceCaseCreateViewModel = function(dynamicFormElement) {
		var viewModel = this;
		var serviceCaseCreateViewModel = new window.Crm.Service.ViewModels.ServiceCaseCreateViewModel();
		return serviceCaseCreateViewModel.init().then(function() {
			serviceCaseCreateViewModel.serviceCase()
				.ServiceObjectId(viewModel.dispatch().ServiceOrder().ServiceObjectId());
			serviceCaseCreateViewModel.serviceCase()
				.AffectedCompanyKey(viewModel.dispatch().ServiceOrder().CustomerContactId());
			if (window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode === "JobPerInstallation") {
				serviceCaseCreateViewModel.serviceCase().AffectedInstallationKey(
					viewModel.formReference().ServiceOrderTime()
					? viewModel.formReference().ServiceOrderTime().InstallationId()
					: null);
			} else {
				serviceCaseCreateViewModel.serviceCase()
					.AffectedInstallationKey(viewModel.dispatch().ServiceOrder().InstallationId());
			}
			serviceCaseCreateViewModel.serviceCase()
				.OriginatingServiceOrderId(viewModel.formReference().ReferenceKey());
			serviceCaseCreateViewModel.serviceCase()
				.OriginatingServiceOrderTimeId(viewModel.formReference().ServiceOrderTimeKey());
			serviceCaseCreateViewModel.serviceCase().StatusKey(0);
			serviceCaseCreateViewModel.serviceCase().ExtensionValues()
				.AffectedDynamicFormReferenceId(viewModel.formReference().Id());
			var checklist = viewModel.formReference().innerInstance;
			checklist.DynamicForm.Localizations = viewModel.localizations();
			serviceCaseCreateViewModel.onSelectChecklist(checklist);
			serviceCaseCreateViewModel.serviceCase().ExtensionValues()
				.AffectedDynamicFormElementId(dynamicFormElement.Id());
			return serviceCaseCreateViewModel;
		});
	};
namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistEditModalViewModel.prototype.save = function() {
	var viewModel = this;
	viewModel.loading(true);
	if (!viewModel.formReference().DispatchId() && !!ko.unwrap(viewModel.dispatch)) {
		viewModel.formReference().DispatchId(viewModel.dispatch().Id());
	}
	if (viewModel.formReference().Completed() === true) {
		viewModel.addRequiredValidationRules();
	} else {
		viewModel.removeRequiredValidationRules();
	}
	var errors = window.ko.validation.group(viewModel);
	if (errors().length > 0) {
			viewModel.loading(false);
			errors.showAllMessages();
			viewModel.formReference().Completed(false);
		return;
		}
	window.Crm.DynamicForms.ViewModels.DynamicFormDetailsViewModel.prototype.save.apply(viewModel).then(function() {
		viewModel.loading(false);
		if (viewModel.formReference().Completed() === true || viewModel.page() === viewModel.pages()) {
			$(".modal:visible").modal("hide");
		}
	}).fail(function(e) {
		viewModel.loading(false);
		window.swal(window.Helper.String.getTranslatedString("UnknownError"),
			window.Helper.String.getTranslatedString("Error_InternalServerError"),
			"error");
	});
};