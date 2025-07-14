namespace("Crm.Service.ViewModels").ServiceCaseCreateViewModel = function () {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	viewModel.affectedInstallation = window.ko.observable(null);
	viewModel.affectedInstallationStatusKey = window.ko.pureComputed(function () {
		return viewModel.affectedInstallation() ? viewModel.affectedInstallation().StatusKey : null;
	});
	viewModel.contactPerson = window.ko.observable(null);
	viewModel.numberingSequenceName = "SMS.ServiceCase";
	viewModel.serviceCase = window.ko.observable(null);
	viewModel.serviceCaseTemplate = window.ko.observable(null);
	viewModel.currentUser = window.ko.observable(null);
	viewModel.visibilityViewModel = new window.VisibilityViewModel(viewModel.serviceCase, "ServiceCase");
	viewModel.errors =
		window.ko.validation.group([viewModel.affectedInstallation, viewModel.serviceCase], { deep: true });
	viewModel.lookups = {
		serviceCaseCategories: { $tableName: "CrmService_ServiceCaseCategory" },
		serviceCaseStatuses: { $tableName: "CrmService_ServiceCaseStatus" },
		servicePriorities: { $tableName: "CrmService_ServicePriority" },
		skills: { $tableName: "Main_Skill" },
		serviceErrorMessages: { $tableName: "CrmService_ErrorCode" }
	}
	viewModel.customErrorMessage = window.ko.observable(false);
};
namespace("Crm.Service.ViewModels").ServiceCaseCreateViewModel.prototype.init = async function (id, params) {
	var viewModel = this;
	var serviceCase = window.database.CrmService_ServiceCase.CrmService_ServiceCase.create();
	var currentUserName = document.getElementById("meta.CurrentUser").content;
	viewModel.currentUser(await window.Helper.User.getCurrentUser());
	await window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups);
	serviceCase.ServiceCaseCreateUser = currentUserName;
	serviceCase.ServiceCaseCreateDate = new Date();
	serviceCase.CategoryKey = window.Helper.Lookup.getDefaultLookupValueSingleSelect(viewModel.lookups.serviceCaseCategories, serviceCase.CategoryKey);
	serviceCase.PriorityKey = window.Helper.Lookup.getDefaultLookupValueSingleSelect(viewModel.lookups.servicePriorities, serviceCase.PriorityKey);
	serviceCase.Reported = new Date();
	serviceCase.ResponsibleUser = currentUserName;
	serviceCase.StationKey = viewModel.currentUser().StationIds.length === 1 ? viewModel.currentUser().StationIds[0] : null;
	serviceCase.StatusKey = window.Helper.Lookup.getDefaultLookupValueSingleSelect(viewModel.lookups.serviceCaseStatuses, serviceCase.StatusKey);
	viewModel.serviceCase(serviceCase.asKoObservable());
	viewModel.serviceCase().AffectedCompanyKey.subscribe(function (affectedCompanyKey) {
		viewModel.serviceCase().ContactPersonId(null);
		if (affectedCompanyKey &&
			viewModel.affectedInstallation() &&
			viewModel.affectedInstallation().LocationContactId() !== affectedCompanyKey) {
			viewModel.serviceCase().AffectedInstallationKey(null);
			viewModel.onSelectAffectedInstallation(null);
		}
	});
	viewModel.serviceCase().ErrorMessage.subscribe(function (errorMessage) {
		viewModel.serviceCase().Name(errorMessage);
	});
	viewModel.serviceCase().ErrorCodeKey.subscribe(function (errorCodeKey) {
		const selectedErrorMessageValue = Helper.Lookup.getLookupValue(viewModel.lookups.serviceErrorMessages, errorCodeKey);
		viewModel.serviceCase().ErrorMessage(selectedErrorMessageValue);
	});
	if (viewModel.lookups.serviceErrorMessages.$array.length === 0) {
		viewModel.customErrorMessage(true);
	}
	viewModel.affectedInstallation.subscribe(function (installation) {
		if (installation &&
			installation.LocationContactId() &&
			installation.LocationContactId() !== viewModel.serviceCase().AffectedCompanyKey()) {
			viewModel.serviceCase().AffectedCompanyKey(installation.LocationContactId());
		}
		if (installation &&
			installation.FolderId() &&
			installation.FolderId() !== viewModel.serviceCase().ServiceObjectId()) {
			viewModel.serviceCase().ServiceObjectId(installation.FolderId());
		}
	});
	viewModel.serviceCaseTemplate.subscribe(function (serviceCaseTemplate) {
		if (serviceCaseTemplate) {
			viewModel.serviceCase().CategoryKey(serviceCaseTemplate.CategoryKey);
			viewModel.serviceCase().PriorityKey(serviceCaseTemplate.PriorityKey);
			viewModel.serviceCase().ResponsibleUser(serviceCaseTemplate.ResponsibleUser || currentUserName);
			viewModel.serviceCase().RequiredSkillKeys(serviceCaseTemplate.RequiredSkillKeys);
		} else {
			viewModel.serviceCase().CategoryKey(null);
			viewModel.serviceCase().PriorityKey(null);
			viewModel.serviceCase().ResponsibleUser(currentUserName);
			viewModel.serviceCase().RequiredSkillKeys([]);
		}
	});
	if (params && params.affectedCompanyKey) {
		viewModel.serviceCase().AffectedCompanyKey(params.affectedCompanyKey);
	}
	if (params && params.affectedInstallationKey) {
		viewModel.serviceCase().AffectedInstallationKey(params.affectedInstallationKey);
	}
		viewModel.serviceCase().ErrorCodeKey.extend({
			required: {
				message: window.Helper.String.getTranslatedString("RuleViolation.Required")
					.replace("{0}", window.Helper.String.getTranslatedString("ErrorMessage")),
				onlyIf: function() {
					return !viewModel.customErrorMessage() && !viewModel.serviceCase().ErrorMessage();
				}
			},
			params: true
		});
	await viewModel.visibilityViewModel.init();
	window.database.add(viewModel.serviceCase().innerInstance);
};
namespace("Crm.Service.ViewModels").ServiceCaseCreateViewModel.prototype.cancel = function () {
	window.database.detach(this.serviceCase().innerInstance);
	window.history.back();
};
namespace("Crm.Service.ViewModels").ServiceCaseCreateViewModel.prototype.contactPersonFilter = function (query, term) {
	var serviceCase = window.ko.unwrap(this);
	if (term) {
		query = query.filter(function (it) {
			return it.Firstname.contains(this.term) === true || it.Surname.contains(this.term) === true;
		},
			{ term: term });
	}
	if (serviceCase.AffectedCompanyKey()) {
		query = query.filter(function (it) {
			return it.ParentId === this.affectedCompanyKey;
		},
			{ affectedCompanyKey: serviceCase.AffectedCompanyKey() });
	}
	return query.filter("it.IsRetired === false");
};
namespace("Crm.Service.ViewModels").ServiceCaseCreateViewModel.prototype.getServiceCaseTemplateAutocompleteFilter =
	function (query, term) {
		if (!term) {
			return query;
		}
		return query.filter(function (it) {
			return it.Name.contains(this.term) === true;
		},
			{ term: term });
	};
namespace("Crm.Service.ViewModels").ServiceCaseCreateViewModel.prototype.installationFilter = function (query, term) {
	var serviceCase = this.serviceCase();
	if (term) {
		query = query.filter(function (it) {
			return it.InstallationNo.contains(this.term) || it.Description.contains(this.term);
		},
			{ term: term });
	}
	if (serviceCase.AffectedCompanyKey()) {
		query = query.filter(function (it) {
			return it.LocationContactId === this.affectedCompanyKey;
		},
			{ affectedCompanyKey: serviceCase.AffectedCompanyKey() });
	}
	if (serviceCase.ServiceObjectId()) {
		query = query.filter(function (it) {
			return it.FolderId === this.serviceObjectId;
		},
			{ serviceObjectId: serviceCase.ServiceObjectId() });
	}
	return query;
};
namespace("Crm.Service.ViewModels").ServiceCaseCreateViewModel.prototype.onSelectAffectedInstallation =
	function (installation) {
		var viewModel = this;
		if (viewModel.affectedInstallation()) {
			window.database.detach(viewModel.affectedInstallation().innerInstance);
			viewModel.affectedInstallation(null);
		}
		if (installation) {
			window.database.attachOrGet(installation);
			viewModel.affectedInstallation(installation.asKoObservable());
		}
	};
namespace("Crm.Service.ViewModels").ServiceCaseCreateViewModel.prototype.onSelectOriginatingServiceOrder = function (serviceOrder) {
	var viewModel = this;
	if (serviceOrder) {
		viewModel.serviceCase().OriginatingServiceOrder(serviceOrder.asKoObservable());
		viewModel.serviceCase().OriginatingServiceOrderId(serviceOrder.Id);
		if (viewModel.serviceCase().OriginatingServiceOrderTime() && viewModel.serviceCase().OriginatingServiceOrderTime().OrderId() !== serviceOrder.Id) {
			viewModel.serviceCase().OriginatingServiceOrderTime(null);
			viewModel.serviceCase().OriginatingServiceOrderTimeId(null);
		}
	} else {
		viewModel.serviceCase().OriginatingServiceOrder(null);
		viewModel.serviceCase().OriginatingServiceOrderId(null);
		viewModel.serviceCase().OriginatingServiceOrderTime(null);
		viewModel.serviceCase().OriginatingServiceOrderTimeId(null);
	}
};
namespace("Crm.Service.ViewModels").ServiceCaseCreateViewModel.prototype.serviceOrderFilter = function (query, term) {
	var viewModel = this;
	if (!!viewModel.serviceCase().AffectedCompanyKey()) {
		query = query.filter(function (it) {
			return it.CustomerContactId === this.contactId
		},
			{ contactId: viewModel.serviceCase().AffectedCompanyKey() });
	}
	if (!term) {
		return query;
	}
	return query.filter(function (it) {
		return it.OrderNo.contains(this.term) === true || it.ErrorMessage.contains(this.term) === true;
	},
		{ term: term });
};
namespace("Crm.Service.ViewModels").ServiceCaseCreateViewModel.prototype.serviceOrderTimeFilter =
	function (query, term) {
		var viewModel = this;
		if (viewModel.serviceCase().OriginatingServiceOrderId()) {
			query = query.filter(function (it) {
				return it.OrderId === this.serviceOrderId;
			},
				{ serviceOrderId: viewModel.serviceCase().OriginatingServiceOrderId() });
		}
		if (!term) {
			return query;
		}
		return query.filter(function (it) {
			return it.PosNo.contains(this.term) === true || it.Description.contains(this.term) === true;
		},
			{ term: term });
	};
namespace("Crm.Service.ViewModels").ServiceCaseCreateViewModel.prototype.setServiceCaseNo = function () {
	var viewModel = this;
	if (viewModel.errors().length === 1 && !viewModel.serviceCase().ServiceCaseNo.isValid()) {
		return window.NumberingService.createNewNumberBasedOnAppSettings(window.Crm.Service.Settings.ServiceCase.ServiceCaseNoIsGenerated, window.Crm.Service.Settings.ServiceCase.ServiceCaseNoIsCreateable, viewModel.serviceCase().ServiceCaseNo(), viewModel.numberingSequenceName, window.database.CrmService_ServiceCase, "ServiceCaseNo")
			.then(function (serviceCaseNo) {
				viewModel.serviceCase().ServiceCaseNo(serviceCaseNo);
			});
	}
	if (viewModel.errors().length > 0) {
		viewModel.loading(false);
		viewModel.errors.showAllMessages();
		viewModel.errors.scrollToError();
		return new $.Deferred().reject().promise();
	}
	return new $.Deferred().resolve().promise();
};
namespace("Crm.Service.ViewModels").ServiceCaseCreateViewModel.prototype.submit = function () {
	var viewModel = this;
	viewModel.loading(true);
	return viewModel.setServiceCaseNo().then(function () {
		return window.database.saveChanges().then(function () {
			window.location.hash = "/Crm.Service/ServiceCase/DetailsTemplate/" + viewModel.serviceCase().Id();
		});
	}).fail(function () {
		viewModel.loading(false);
		viewModel.errors.showAllMessages();
		viewModel.errors.scrollToError();
		return;
	});
};
namespace("Crm.Service.ViewModels").ServiceCaseCreateViewModel.prototype.toggleCustomErrorMessage = function() {
	const viewModel = this;
	viewModel.customErrorMessage(!viewModel.customErrorMessage());
	if (viewModel.customErrorMessage()) {
		viewModel.serviceCase().ErrorCodeKey(null);
	} else {
		viewModel.serviceCase().ErrorMessage(null);
	}
};
