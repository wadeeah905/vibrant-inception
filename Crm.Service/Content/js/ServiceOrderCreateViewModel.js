/// <reference path="../../../../Content/js/VisibilityViewModel.js" />
/// <reference path="Helper/Helper.Service.js" />
/// <reference path="Helper/Helper.ServiceOrder.js" />
/// <reference path="Helper/Helper.ServiceOrder.createServiceOrderData.js" />

namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel = function () {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	viewModel.installationIds = window.ko.observableArray([]);
	viewModel.installationIds.subscribe(function () {
		if (viewModel.installationIds().length > viewModel.installations().length) {
			viewModel.getInstallation(viewModel.installationIds()[viewModel.installationIds().length - 1]);
		}
		else {
			var installationArray = viewModel.installations().filter(function (it) {
				return it.Id in this.installationids;
			},
				{ installationids: viewModel.installationIds() });
			viewModel.installations(installationArray);
		}
	});
	viewModel.installations = window.ko.observableArray([]);
	viewModel.installations.subscribe(function (list) {
		viewModel.onInstallationSelect(list[list.length - 1]);
	});
	viewModel.currentUser = window.ko.observable(null);
	viewModel.customAddress = window.ko.observable(false);
	viewModel.customContactPerson = window.ko.observable(false);
	viewModel.selectedAddress = window.ko.observable(null);
	viewModel.selectedContactPerson = window.ko.observable(null);
	viewModel.selectedInstallation = window.ko.observable(null);
	viewModel.selectedInstallationStatusKey = window.ko.pureComputed(function () {
		return viewModel.selectedInstallation() ? viewModel.selectedInstallation().StatusKey : null;
	});
	viewModel.selectedServiceOrderType = window.ko.observable(null);
	viewModel.serviceOrder = window.ko.observable(null);
	viewModel.visibilityViewModel = new window.VisibilityViewModel(viewModel.serviceOrder, "ServiceOrderHead");
	viewModel.errors = window.ko.validation.group([viewModel.serviceOrder]);
	viewModel.lookups = {
		serviceOrderTypes: { $tableName: "CrmService_ServiceOrderType" },
		servicePriorities: { $tableName: "CrmService_ServicePriority" },
		skills: { $tableName: "Main_Skill" },
		installationTypes: { $tableName: "CrmService_InstallationType" },
		installationHeadStatuses: { $tableName: "CrmService_InstallationHeadStatus" },
		countries: { $tableName: "Main_Country" }
	};
};
namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.cancel = function () {
	window.database.detach(this.serviceOrder().innerInstance);
	window.history.back();
};
namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.customerContactFilter =
	function (query, term) {
		if (term) {
			query = query.filter(function (it) {
				return it.LegacyId.contains(this.term) || it.Name.contains(this.term);
			},
				{ term: term });
		}
		return query.filter("it.IsEnabled === true");
	};
namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.filterAddresses = function (query, term) {
	var viewModel = this;
	if (term) {
		query = query.filter(function (it) {
			return it.Name1.contains(this.term) === true ||
				it.Name2.contains(this.term) === true ||
				it.Name3.contains(this.term) === true ||
				it.ZipCode.contains(this.term) === true ||
				it.City.contains(this.term) === true ||
				it.Street.contains(this.term) === true;
		},
			{ term: term });
	}
	var addressIds = window._.uniq(window._.compact(viewModel.installations().map(function (x) { return x.LocationAddressKey; })));
	var addressCompanyIds = window._.uniq(window._.compact([viewModel.serviceOrder().CustomerContactId(), viewModel.serviceOrder().ServiceObjectId()]));
	query = query.filter(function (it) {
		return it.Id in this.ids || it.CompanyId in this.companyIds;
	},
		{ ids: addressIds, companyIds: addressCompanyIds });
	query = query.orderByDescending("it.IsCompanyStandardAddress");
	return query;
};
namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.formatAddress = function (data) {
	var viewModel = this;
	if (data.item) {
		var result;
		if (viewModel.isServiceObjectAddress(data.item)) {
			result = window.Helper.String.getTranslatedString("ServiceObject");
		} else if (viewModel.isInstallationAddress(data.item)) {
			result = window.Helper.String.getTranslatedString("Installation");
		} else {
			result = window.Helper.String.getTranslatedString("Company");
		}
		result += ": " + window.Helper.Address.getAddressLine(data.item);
		if (data.item.IsCompanyStandardAddress) {
			return $('<span style="font-weight: bold;"></span>').text(result);
		}
		return result;
	}
	return data.text;
};
namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.getInstallationsByIds = function (query, ids) {
	return query.filter(function (it) {
		return it.Id in this.ids;
	},
		{ ids: ids });
};
namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.init = function (id, params) {
	var viewModel = this;
	return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups).then(function () {
		return window.Helper.User.getCurrentUser();
	}).then(function (currentUser) {
		viewModel.currentUser(currentUser);
		var serviceOrder = window.database.CrmService_ServiceOrderHead.CrmService_ServiceOrderHead.create();
		serviceOrder.PriorityKey = window.Helper.Lookup.getDefaultLookupValueSingleSelect(viewModel.lookups.servicePriorities, serviceOrder.PriorityKey);
		serviceOrder.Reported = new Date();
		serviceOrder.StationKey = currentUser.StationIds.length === 1 ? currentUser.StationIds[0] : null;
		serviceOrder.StatusKey = "New";
		serviceOrder.ResponsibleUser = currentUser.Id;
		serviceOrder.TypeKey = window.Helper.Lookup.getDefaultLookupValueSingleSelect(viewModel.lookups.serviceOrderTypes, serviceOrder.TypeKey);
		if (params && params.customerContactId) {
			serviceOrder.CustomerContactId = params.customerContactId;
		}
		if (params && params.installationId) {
			if (window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode === "JobPerInstallation") {
				viewModel.installationIds.push(params.installationId);
			} else {
				serviceOrder.InstallationId = params.installationId;
			}
		}
		viewModel.serviceOrder(serviceOrder.asKoObservable());
		viewModel.serviceOrder().UserGroupKey.subscribe(function () {
			if (viewModel.serviceOrder().UserGroupKey() === null)
				viewModel.serviceOrder().ResponsibleUser(viewModel.currentUser().Id)
			else
				viewModel.serviceOrder().ResponsibleUser(null);
		});
		viewModel.serviceOrder().PreferredTechnicianUsergroupKey.subscribe(function () {
			viewModel.serviceOrder().PreferredTechnician(null);
		});
	}).then(function () {
		return database.Main_Currency.filter(x => x.Favorite === true).take(1).toArray()
	}).then(function (currency) {
		viewModel.serviceOrder().CurrencyKey(currency[0] ? currency[0].Key : null);
	}).then(function () {
		var favoriteTypes = viewModel.lookups.serviceOrderTypes.$array.filter(function (type) {
			return type.Favorite;
		}).sort(function (a, b) {
			return a.SortOrder - b.SortOrder;
		});
		if (!!favoriteTypes[0])
			viewModel.serviceOrder().TypeKey(favoriteTypes[0].Key);
		return viewModel.visibilityViewModel.init().then(function () {
			window.database.add(viewModel.serviceOrder().innerInstance);
		});
	});
};
namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.initiatorFilter = function (query, term) {
	if (term) {
		query = query.filter(function (it) {
			return it.LegacyId.contains(this.term) || it.Name.contains(this.term);
		},
			{ term: term });
	}
	return query.filter("it.IsEnabled === true");
};
namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.initiatorPersonFilter =
	function (query, term) {
		var serviceOrder = this.serviceOrder();
		if (term) {
			query = query.filter(function (it) {
				return it.Firstname.contains(this.term) === true || it.Surname.contains(this.term) === true;
			},
				{ term: term });
		}
		if (serviceOrder.InitiatorId()) {
			query = query.filter(function (it) {
				return it.ParentId === this.initiatorId;
			},
				{ initiatorId: serviceOrder.InitiatorId() });
		}
		return query.filter("it.IsRetired === false");
	};
namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.installationFilter = function (query, term) {
	var viewModel = this;
	query = query
		.include("Address")
		.include("Company")
		.include("ServiceObject");

	if (term) {
		query = query.filter(function (it) {
			return it.LegacyId.contains(this.term) ||
				it.InstallationNo.contains(this.term) ||
					it.Address.Street.contains(this.term) ||
					it.Address.City.contains(this.term) ||
					it.Address.ZipCode.contains(this.term) ||
					it.ExternalReference.contains(this.term) ||
					it.Room.contains(this.term) ||
					it.ExactPlace.contains(this.term) ||
				it.Description.contains(this.term);
		},
			{ term: term });
	}

	if (viewModel.serviceOrder().ServiceObjectId()) {
		query = query.filter(
			"it.FolderId === this.serviceObjectId",
			{
				serviceObjectId: viewModel.serviceOrder().ServiceObjectId()
			});
	} else {
		query = query.filter(
			"(this.customerContactId === null || it.LocationContactId === this.customerContactId) && (this.serviceObjectId === null || it.FolderId === this.serviceObjectId)",
			{
				customerContactId: viewModel.serviceOrder().CustomerContactId() || null,
				serviceObjectId: viewModel.serviceOrder().ServiceObjectId() || null
			});
	}
	return query;
};
namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.isInstallationAddress = function (address) {
	var viewModel = this;
	if (viewModel.serviceOrder().Installation()) {
		return viewModel.serviceOrder().Installation().LocationAddressKey() === address.Id;
	}
	return viewModel.installations().some(function (x) {
		return x.LocationAddressKey === address.Id;
	});
};
namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.isServiceObjectAddress = function (address) {
	var viewModel = this;
	return viewModel.serviceOrder().ServiceObjectId() === address.CompanyId;
};
namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.onCustomerContactSelect =
	function (customerContact) {
		var viewModel = this;
		if (customerContact) {
			viewModel.serviceOrder().Company(customerContact.asKoObservable());
			viewModel.serviceOrder().CustomerContactId(customerContact.Id);
			if (viewModel.serviceOrder().Installation() &&
				viewModel.serviceOrder().Installation().LocationContactId() !== customerContact.Id) {
				viewModel.onInstallationSelect(null);
			}
			var removed = viewModel.installations.remove(function (x) {
				return x.LocationContactId !== customerContact.Id;
			});
			viewModel.installationIds.removeAll(removed.map(function (x) {
				return x.Id;
			}));
		} else {
			viewModel.serviceOrder().Company(null);
			viewModel.serviceOrder().CustomerContactId(null);
		}
		viewModel.selectedAddress(null);
	};
namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.onInitiatorSelect = function (initiator) {
	var viewModel = this;
	if (initiator) {
		viewModel.serviceOrder().Initiator(initiator.asKoObservable());
		viewModel.serviceOrder().InitiatorId(initiator.Id);
		if (viewModel.serviceOrder().InitiatorPerson() && viewModel.serviceOrder().InitiatorPerson().ParentId() !== initiator.Id) {
			viewModel.serviceOrder().InitiatorPerson(null);
			viewModel.serviceOrder().InitiatorPersonId(null);
		}
	} else {
		viewModel.serviceOrder().Initiator(null);
		viewModel.serviceOrder().InitiatorId(null);
		viewModel.serviceOrder().InitiatorPerson(null);
		viewModel.serviceOrder().InitiatorPersonId(null);
	}
};
namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.onInstallationSelect =
	function (installation) {
		var viewModel = this;
		if (viewModel.selectedInstallation()) {
			window.database.detach(viewModel.selectedInstallation().innerInstance);
			viewModel.selectedInstallation(null);
		}
		if (installation) {
			window.database.attachOrGet(installation);
			viewModel.selectedInstallation(installation.asKoObservable());
			if (window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode === "OrderPerInstallation") {
				viewModel.serviceOrder().Installation(installation.asKoObservable());
				viewModel.serviceOrder().InstallationId(installation.Id);
			}
			if (!!viewModel.serviceOrder().InitiatorId() === false) {
				viewModel.serviceOrder().InitiatorId(installation.LocationContactId);
			}
			if (installation.Company) {
				viewModel.onCustomerContactSelect(installation.Company);
			}
			if (installation.ServiceObject) {
				viewModel.onServiceObjectSelect(installation.ServiceObject);
			}
		} else {
			viewModel.serviceOrder().Installation(null);
			viewModel.serviceOrder().InstallationId(null);
		}
	};
namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.onServiceObjectSelect =
	function (serviceObject) {
		var viewModel = this;
		if (serviceObject) {
			viewModel.serviceOrder().ServiceObject(serviceObject.asKoObservable());
			viewModel.serviceOrder().ServiceObjectId(serviceObject.Id);
			if (viewModel.serviceOrder().Installation() &&
				viewModel.serviceOrder().Installation().FolderId() !== serviceObject.Id) {
				viewModel.onInstallationSelect(null);
			}
			var removed = viewModel.installations.remove(function (x) {
				return x.FolderId !== serviceObject.Id;
			});
			viewModel.installationIds.removeAll(removed.map(function (x) {
				return x.Id;
			}));
		} else {
			viewModel.serviceOrder().ServiceObject(null);
			viewModel.serviceOrder().ServiceObjectId(null);
		}
	};
namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.onServiceOrderTemplateSelect =
	function (serviceOrderTemplate) {
		var viewModel = this;
		if (serviceOrderTemplate) {
			viewModel.loading(true);
			if (!viewModel.serviceOrder().ServiceOrderTemplate()) {
				viewModel.serviceOrderClone = JSON.parse(window.ko.wrap.toJSON(viewModel.serviceOrder)).innerInstance;
			}
			viewModel.serviceOrder().ServiceOrderTemplate(serviceOrderTemplate.asKoObservable());
			viewModel.serviceOrder().ServiceOrderTemplateId(serviceOrderTemplate.Id);
			window.Helper.ServiceOrder.transferTemplateData(serviceOrderTemplate, viewModel.serviceOrder(), false).then(function () {
				viewModel.loading(false);
			});
		} else {
			viewModel.loading(true);
			window.Helper.ServiceOrder.transferTemplateData(viewModel.serviceOrderClone, viewModel.serviceOrder(), true).then(function () {
				viewModel.loading(false);
			});
		}
	};
namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.preferredTechnicianFilter = function (query, term) {
	var serviceOrder = this.serviceOrder();
	if (query.specialFunctions.filterByPermissions[database.storageProvider.name]) {
		query = query.filter("filterByPermissions", "Dispatch::Edit");
	}
	return Helper.User.filterUserQuery(query, term, serviceOrder.PreferredTechnicianUsergroupKey());
};
namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.serviceObjectFilter = function (query, term) {
	if (term) {
		query = query.filter(function (it) {
			return it.LegacyId.contains(this.term) ||
				it.ObjectNo.contains(this.term) ||
				it.Name.contains(this.term);
		},
			{ term: term });
	}
	return query;
};
namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.submit = function () {
	var viewModel = this;
	viewModel.loading(true);

	if (viewModel.errors().length > 0) {
		viewModel.loading(false);
		viewModel.errors.showAllMessages();
		viewModel.errors.scrollToError();
		return;
	}
	return window.NumberingService.createNewNumberBasedOnAppSettings(window.Crm.Service.Settings.ServiceOrder.OrderNoIsGenerated, window.Crm.Service.Settings.ServiceOrder.OrderNoIsCreateable, viewModel.serviceOrder().OrderNo(), viewModel.selectedServiceOrderType().NumberingSequence, window.database.CrmService_ServiceOrderHead, "OrderNo")
	.then(function (serviceOrderNo) {
		if (serviceOrderNo !== undefined) {
			viewModel.serviceOrder().OrderNo(serviceOrderNo);
		}
		return new window.Helper.ServiceOrder.CreateServiceOrderData(viewModel.serviceOrder(),
			viewModel.serviceOrder().ServiceOrderTemplate(),
			viewModel.installationIds()).create();
	}).then(function () {
		return window.database.saveChanges();
	}).then(function () {
		window.location.hash = "/Crm.Service/ServiceOrder/DetailsTemplate/" + viewModel.serviceOrder().Id();
	});
};
namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.toggleCustomAddress = function () {
	var viewModel = this;
	viewModel.customAddress(!viewModel.customAddress());
	if (viewModel.customAddress()) {
		viewModel.selectedAddress(null);
	} else {
		viewModel.serviceOrder().Name1(null);
		viewModel.serviceOrder().Name2(null);
		viewModel.serviceOrder().Name3(null);
		viewModel.serviceOrder().Street(null);
		viewModel.serviceOrder().ZipCode(null);
		viewModel.serviceOrder().City(null);
		viewModel.serviceOrder().CountryKey(null);
		viewModel.serviceOrder().RegionKey(null);
	}
};
namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.selectedAddressOnSelect = function (selectedAddress) {
	var viewModel = this;
	if (selectedAddress) {
		viewModel.serviceOrder().Name1(selectedAddress.Name1);
		viewModel.serviceOrder().Name2(selectedAddress.Name2);
		viewModel.serviceOrder().Name3(selectedAddress.Name3);
		viewModel.serviceOrder().Street(selectedAddress.Street);
		viewModel.serviceOrder().ZipCode(selectedAddress.ZipCode);
		viewModel.serviceOrder().City(selectedAddress.City);
		viewModel.serviceOrder().CountryKey(selectedAddress.CountryKey);
		viewModel.serviceOrder().RegionKey(selectedAddress.RegionKey);
	} else {
		viewModel.serviceOrder().Name1(null);
		viewModel.serviceOrder().Name2(null);
		viewModel.serviceOrder().Name3(null);
		viewModel.serviceOrder().Street(null);
		viewModel.serviceOrder().ZipCode(null);
		viewModel.serviceOrder().City(null);
		viewModel.serviceOrder().CountryKey(null);
		viewModel.serviceOrder().RegionKey(null);
	}
};
namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.getInstallation = function (id) {
	var viewModel = this;
	return window.database.CrmService_Installation
		.include("Address")
		.include("Company")
		.include("ServiceObject")
		.filter(function (it) {
			return it.Id === this.id;
		}, { id: id })
		.first()
		.then(function (installation) {
			var installationArray = viewModel.installations();
			installationArray.push(installation);
			viewModel.installations(installationArray);
		});
};
namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.toggleCustomContactPerson = function () {
	var viewModel = this;
	viewModel.customContactPerson(!viewModel.customContactPerson());
	if (viewModel.customContactPerson()) {
		viewModel.selectedContactPerson(null);
	} else {
		viewModel.serviceOrder().ServiceLocationResponsiblePerson(null);
		viewModel.serviceOrder().ServiceLocationPhone(null);
		viewModel.serviceOrder().ServiceLocationEmail(null);
	}
};
namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.selectedContactPersonOnSelect = function (selectedContact) {
	var viewModel = this;
	if (selectedContact) {
		viewModel.serviceOrder().ServiceLocationResponsiblePerson(Helper.Person.getDisplayName(selectedContact));
		if (selectedContact.Phones.length > 0)
			viewModel.serviceOrder().ServiceLocationPhone(window.Helper.Address.getPhoneNumberAsString(Helper.Address.getPrimaryCommunication(selectedContact.Phones), true, viewModel.lookups.countries));
		if (selectedContact.Emails.length > 0)
			viewModel.serviceOrder().ServiceLocationEmail(Helper.Address.getPrimaryCommunication(selectedContact.Emails).Data);
	} else {
		viewModel.serviceOrder().ServiceLocationResponsiblePerson(null);
		viewModel.serviceOrder().ServiceLocationPhone(null);
		viewModel.serviceOrder().ServiceLocationEmail(null);
	}
};
namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.contactPersonFilter =
	function (query, term) {
		var viewModel = this;
		if (term) {
			query = query.filter(function (it) {
				return it.Firstname.contains(this.term) === true || it.Surname.contains(this.term) === true;
			},
				{ term: term });
		}
		var installationContactIds = [];
		if (window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode === "OrderPerInstallation") {
			if (viewModel.serviceOrder().Installation())
				installationContactIds = [viewModel.serviceOrder().Installation().LocationContactId()];
		} else {
			installationContactIds = window._.uniq(window._.compact(viewModel.installations().map(function (it) { return it.LocationContactId; })));
		}
		query = query.filter(function (it) {
			return it.ParentId === this.customerId || it.ParentId === this.objectContactId || it.ParentId in this.installationContactIds;
		},
			{
				customerId: viewModel.serviceOrder().CustomerContactId() || null,
				objectContactId: viewModel.serviceOrder().ServiceObjectId() || null,
				installationContactIds: installationContactIds
			});
		return query.filter("it.IsRetired === false");
	};