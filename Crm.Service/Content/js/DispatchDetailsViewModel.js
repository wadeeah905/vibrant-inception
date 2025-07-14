/// <reference path="../../../../content/js/viewmodels/viewmodelbase.js" />
namespace("Crm.Service.ViewModels").DispatchDetailsViewModel = function() {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	viewModel.currentTabId = window.ko.observable(null);
	viewModel.previousTabId = window.ko.observable(null);
	viewModel.currentUser = window.ko.observable(null);
	viewModel.currentUserDropboxAddress = window.ko.pureComputed(function() {
		return viewModel.currentUser() && viewModel.currentUser().DropboxToken && window.Main.Settings.DropboxDomain
			? "?BCC=" + viewModel.currentUser().DropboxToken + "@" + window.Main.Settings.DropboxDomain
			: "";
	});
	viewModel.dispatch = window.ko.observable(null);
	viewModel.serviceOrder = window.ko.pureComputed(function() {
		return viewModel.dispatch() ? viewModel.dispatch().ServiceOrder() : null;
	});
	viewModel.contact = window.ko.pureComputed(function () {
		return viewModel.serviceOrder() ? viewModel.serviceOrder() : null;
	});
	viewModel.contactId = window.ko.pureComputed(function() {
		return viewModel.serviceOrder() ? viewModel.serviceOrder().Id() : null;
	});
	viewModel.contactName = window.ko.pureComputed(function() {
		return viewModel.serviceOrder() ? viewModel.serviceOrder().OrderNo() : null;
	});
	viewModel.contactType = window.ko.pureComputed(function() {
		return "ServiceOrder";
	});
	viewModel.serviceObject = window.ko.pureComputed(function() {
		return viewModel.serviceOrder() ? viewModel.serviceOrder().ServiceObject() : null;
	});
	viewModel.serviceObjectAddress = window.ko.pureComputed(function() {
		return viewModel.serviceObject() ? viewModel.serviceObject().Addresses()[0] : null;
	});
	viewModel.customerContact = window.ko.pureComputed(function() {
		return viewModel.serviceOrder() ? viewModel.serviceOrder().Company() : null;
	});
	viewModel.customerContactAddress = window.ko.pureComputed(function() {
		return viewModel.customerContact() ? viewModel.customerContact().Addresses()[0] : null;
	});
	viewModel.initiator = window.ko.pureComputed(function() {
		return viewModel.serviceOrder() ? viewModel.serviceOrder().Initiator() : null;
	});
	viewModel.initiatorAddress = window.ko.pureComputed(function() {
		return viewModel.initiator() ? viewModel.initiator().Addresses()[0] : null;
	});
	viewModel.initiatorPerson = window.ko.pureComputed(function() {
		return viewModel.serviceOrder() ? viewModel.serviceOrder().InitiatorPerson() : null;
	});
	viewModel.statusAlert = window.ko.pureComputed(function() {
		if (!viewModel.dispatch()) {
			return null;
		}
		if (["Scheduled", "Released", "Read"].indexOf(viewModel.dispatch().StatusKey()) !== -1) {
			return "DispatchNotInProgressYetAlert";
		}
		if ("SignedByCustomer" === viewModel.dispatch().StatusKey()) {
			return "DispatchIsAlreadySignedByCustomerAlert";
		}
		if (["ClosedNotComplete", "ClosedComplete"].indexOf(viewModel.dispatch().StatusKey()) !== -1) {
			return "DispatchIsClosedAlert";
		}
		if ("Rejected" === viewModel.dispatch().StatusKey()) {
			return "DispatchIsRejectedAlert";
		}
		return null;
	});
	viewModel.canEditCustomerContact = window.ko.observable(false);
	viewModel.canEditInitiator = window.ko.observable(false);
	viewModel.serviceOrderIsEditable = window.ko.pureComputed(function() {
		var hasPermission = window.AuthorizationManager.isAuthorizedForAction("ServiceOrder", "Edit");
		return hasPermission || viewModel.serviceOrder().CreateUser() === viewModel.currentUser().Id;
	});
	viewModel.dispatchIsEditable = window.ko.pureComputed(function () {
		if (!viewModel.dispatch() || !viewModel.dispatch().StatusKey() || !window.AuthorizationManager.isAuthorizedForAction('Dispatch', 'Edit')) {
			return false;
		}
		return viewModel.dispatch().StatusKey() === "InProgress";
	});
	viewModel.dispatchIsCompletable = window.ko.pureComputed(function () {
		if (!viewModel.dispatch()) {
			return false;
		}
		return viewModel.dispatchIsEditable() || viewModel.dispatch().StatusKey() === "SignedByCustomer";
	});
	viewModel.lookups = {
		addressTypes: { $tableName: "Main_AddressType" },
		causeOfFailures: { $tableName: "CrmService_CauseOfFailure" },
		components: { $tableName: "CrmService_Component" },
		countries: { $tableName: "Main_Country" },
		emailTypes: { $tableName: "Main_EmailType" },
		errorCodes: { $tableName: "CrmService_ErrorCode" },
		faxTypes: { $tableName: "Main_FaxType" },
		invoicingTypes: { $tableName: "Main_InvoicingType" },
		phoneTypes: { $tableName: "Main_PhoneType" },
		regions: { $tableName: "Main_Region" },
		serviceObjectCategories: { $tableName: "CrmService_ServiceObjectCategory" },
		serviceOrderStatuses: { $tableName: "CrmService_ServiceOrderStatus" },
		serviceOrderTypes: { $tableName: "CrmService_ServiceOrderType" },
		servicePriorities: { $tableName: "CrmService_ServicePriority" },
		websiteTypes: { $tableName: "Main_WebsiteType" },
		noPreviousSerialNoReasons: { $tableName: "CrmService_NoPreviousSerialNoReason" }
	};
	viewModel.lookups = window.Helper.StatisticsKey.addLookupTables(viewModel.lookups);
	viewModel.hasErrorLookups = window.ko.pureComputed(function() {
		return viewModel.lookups.errorCodes.$array.length > 0
			|| viewModel.lookups.components.$array.length > 0
			|| viewModel.lookups.causeOfFailures.$array.length > 0;
	});
	viewModel.maintenanceOrderGenerationMode = window.ko.observable(window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode);
	viewModel.tabs = window.ko.observable({});
	viewModel.isEditable = window.ko.observable(true);
	viewModel.showInvoiceData = window.ko.pureComputed(() => false);
	viewModel.selectedLanguage = window.ko.observable(null);
	viewModel.customAddress = window.ko.observable(false);
	viewModel.customContactPerson = window.ko.observable(false);
	viewModel.selectedAddress = window.ko.observable(null);
	viewModel.selectedAddressObject = window.ko.observable(null);
	viewModel.selectedContactPerson = window.ko.observable(null);
	viewModel.selectedContactPersonObject = window.ko.observable(null);
	viewModel.contactWarning = ko.observable(false);
	viewModel.addressWarning = ko.observable(false);
	viewModel.installations = ko.computed(() => {
		if (!viewModel.dispatch() || ! viewModel.dispatch().ServiceOrder()) {
			return [];
		}
		if (window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode === "JobPerInstallation") {
			return viewModel.dispatch().ServiceOrder().ServiceOrderTimes();
		} else {
			let installationArray = [];
			if (viewModel.dispatch().ServiceOrder().Installation()) {
				installationArray.push(viewModel.dispatch().ServiceOrder().Installation().innerInstance);
			}
			return installationArray;
		}
	});
	window.Main.ViewModels.ViewModelBase.apply(this, arguments);
};
namespace("Crm.Service.ViewModels").DispatchDetailsViewModel.prototype = Object.create(window.Main.ViewModels.ViewModelBase.prototype);
namespace("Crm.Service.ViewModels").DispatchDetailsViewModel.prototype.init = function(id, params) {
	var viewModel = this;
	if (params && params.tab === "tab-report") {
		params.tab = "tab-details";
	}
	return window.database.CrmService_ServiceOrderDispatch
		.include("CurrentServiceOrderTime")
		.include("CurrentServiceOrderTime.Installation")
		.include("ServiceOrder")
		.include("ServiceOrder.Installation")
		.include("ServiceOrder.InitiatorPerson")
		.include("ServiceOrder.InitiatorPerson.Emails")
		.include("ServiceOrder.InitiatorPerson.Phones")
		.include("ServiceOrder.InvoiceRecipient")
		.include("ServiceOrder.Payer")
		.include("ServiceOrder.Station")
		.include("ServiceOrder.ServiceOrderTimes")
		.include("DispatchedUser")
		.find(id)
		.then(function(dispatch) {
			viewModel.dispatch(dispatch.asKoObservable());
		}).then(function () {
			var queries = [];
			queries.push({
				queryable: window.database.Main_Company
					.include2("Addresses.filter(function(x) { x.IsCompanyStandardAddress === true; })")
					.filter("it.Id === this.id", { id: viewModel.dispatch().ServiceOrder().CustomerContactId() }),
				method: "first",
				handler: viewModel.dispatch().ServiceOrder().Company
			});
			if (viewModel.dispatch().ServiceOrder().InitiatorId()) {
				queries.push({
					queryable: window.database.Main_Company
						.include2("Addresses.filter(function(x) { x.IsCompanyStandardAddress === true; })")
						.filter("it.Id === this.id", { id: viewModel.dispatch().ServiceOrder().InitiatorId() }),
					method: "first",
					handler: viewModel.dispatch().ServiceOrder().Initiator
				});
			}
			if (viewModel.dispatch().ServiceOrder().ServiceObjectId()) {
				queries.push({
					queryable: window.database.CrmService_ServiceObject
						.include2("Addresses.filter(function(x) { x.IsCompanyStandardAddress === true; })")
						.include("Addresses.Emails")
						.include("Addresses.Faxes")
						.include("Addresses.Phones")
						.include("Addresses.Websites")
						.filter("it.Id === this.id", { id: viewModel.dispatch().ServiceOrder().ServiceObjectId() }),
					method: "first",
					handler: viewModel.dispatch().ServiceOrder().ServiceObject
				});
			}
			return window.Helper.Batch.Execute(queries);
		}).then(function () {
			return window.Helper.User.getCurrentUser();
		}).then(function (user) {
			viewModel.currentUser(user);
		}).then(function () {
			return window.Helper.StatisticsKey.getAvailableLookups(viewModel.lookups, viewModel.serviceOrder());
		}).then(function () {
			return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups);
		}).then(function () {
			return window.Helper.ServiceOrder.isInStatusGroup(viewModel.dispatch().ServiceOrder().Id(), ["Scheduling", "InProgress"], viewModel.dispatch().ServiceOrder().StatusKey());
		}).then(function (serviceOrderStatusIsInSchedulingOrInProgress) {
			if (viewModel.dispatch().StatusKey() === "Released" && serviceOrderStatusIsInSchedulingOrInProgress && viewModel.dispatch().DispatchedUser().Id() === viewModel.currentUser().Id) {
				window.database.attachOrGet(viewModel.dispatch().innerInstance);
				viewModel.dispatch().StatusKey("Read");
				return window.database.saveChanges();
			}
			return null;
		}).then(function () {
			viewModel.setBreadcrumbs();
		});
};
namespace("Crm.Service.ViewModels").DispatchDetailsViewModel.prototype.getServicOrderPositionItemGroup =
	function(serviceOrderPosition) {
		var viewModel = this;
		var itemGroup = window.Helper.ServiceOrder.getServiceOrderPositionItemGroup(serviceOrderPosition);
		if (itemGroup && viewModel.dispatch && viewModel.dispatch() && viewModel.dispatch().CurrentServiceOrderTimeId() && serviceOrderPosition.ServiceOrderTime() && serviceOrderPosition.ServiceOrderTime().Id() === viewModel.dispatch().CurrentServiceOrderTimeId()) {
			itemGroup.css = "c-green";
			itemGroup.title += " (" + window.Helper.String.getTranslatedString("CurrentServiceOrderTime") + ")";
		}
		return itemGroup;
	};
namespace("Crm.Service.ViewModels").DispatchDetailsViewModel.prototype.confirm = function() {
	var viewModel = this;
	window.database.attachOrGet(viewModel.dispatch().innerInstance);
	viewModel.loading(true);
	viewModel.dispatch().StatusKey("Released");
	return window.database.saveChanges().then(function() {
		return viewModel.init(viewModel.dispatch().Id());
	}).then(function () {
		viewModel.loading(false);
	});
};
namespace("Crm.Service.ViewModels").DispatchDetailsViewModel.prototype.workOnDispatch = function() {
	var viewModel = this;
	viewModel.loading(true);
	window.database.attachOrGet(viewModel.dispatch().innerInstance);
	window.database.attachOrGet(viewModel.serviceOrder().innerInstance);
	var readGeolocation = new $.Deferred();
	if (window.Crm.Service.Settings.ServiceOrderDispatch.ReadGeolocationOnDispatchStart) {
		// prefer gps locations to cell tower locations and don't allow cached locations
		var positionOptions = { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 };
		navigator.geolocation.getCurrentPosition(function (position) {
			var latitude = position.coords.latitude;
			var longitude = position.coords.longitude;
			window.database.Main_User.find(viewModel.currentUser().Id).then(function (user) {
				window.database.attachOrGet(user);
				user.Latitude = latitude;
				user.Longitude = longitude;
				user.LastStatusUpdate = new Date();
				viewModel.dispatch().LatitudeOnDispatchStart(latitude);
				viewModel.dispatch().LongitudeOnDispatchStart(longitude);
				readGeolocation.resolve();
			});
		}, function (error) {
			window.Log.warn("getting current position via geolocation api failed, error: " + error.message);
			readGeolocation.resolve();
		}, positionOptions);
	} else {
		readGeolocation.resolve();
	}
	return readGeolocation.promise().then(function() {
		return window.Helper.ServiceOrder.isInStatusGroup(viewModel.serviceOrder().Id(), "Scheduling");
	}).then(function (isServiceOrderInScheduling) {
		if (isServiceOrderInScheduling) {
			window.database.attachOrGet(viewModel.serviceOrder());
			viewModel.serviceOrder().StatusKey("InProgress");
		}
		viewModel.dispatch().StatusKey("InProgress");
		if (viewModel.serviceOrder().StatusKey() === "PartiallyReleased" || viewModel.serviceOrder().StatusKey() === "Released") {
			viewModel.serviceOrder().StatusKey("InProgress");
		}
		return window.database.saveChanges();
	}).then(function () {
		if (window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode !== "JobPerInstallation" && !window.Crm.Service.Settings.ServiceOrderDispatch.ToggleSingleJob) {
			return;
		}
		if (viewModel.dispatch().CurrentServiceOrderTimeId()) {
			return;
		}
		return window.database.CrmService_ServiceOrderTime
			.filter("it.OrderId === this.orderId", { orderId: viewModel.serviceOrder().Id() })
			.take(2)
			.toArray();
	}).then(function (jobs) {
		if (jobs && jobs.length === 1) {
			return Helper.Dispatch.toggleCurrentJob(viewModel.dispatch, jobs[0].Id)
		}
	}).then(function() {
		viewModel.loading(false);
	});
};
namespace("Crm.Service.ViewModels").DispatchDetailsViewModel.prototype.setBreadcrumbs = function () {
	var viewModel = this;
	if(!window.breadcrumbsViewModel) return;
	window.breadcrumbsViewModel.setBreadcrumbs([
		new Breadcrumb(Helper.String.getTranslatedString("Dispatch"), "#/Crm.Service/ServiceOrderDispatchList/IndexTemplate?status=upcoming"),
		new Breadcrumb(viewModel.dispatch().DispatchNo() !== null ? viewModel.dispatch().DispatchNo() : viewModel.serviceOrder().OrderNo(), window.location.hash)
	]);

};
namespace("Crm.Service.ViewModels").DispatchDetailsViewModel.prototype.onStationSelect =
	function (station) {
		var viewModel = this;
		if (station) {
			viewModel.serviceOrder().Station(station.asKoObservable());
			viewModel.serviceOrder().StationKey(station.Id);
		} else {
			viewModel.serviceOrder().Station(null);
			viewModel.serviceOrder().StationKey(null);
		}
	};

namespace("Crm.Service.ViewModels").DispatchDetailsViewModel.prototype.toggleCustomContactPerson = function (serviceOrder) {
	let viewModel = this;
	if (!viewModel.customContactPerson() && !viewModel.selectedContactPersonObject()) {
		let obj = {};
		obj.name = serviceOrder.ServiceLocationResponsiblePerson();
		obj.email = serviceOrder.ServiceLocationEmail();
		obj.phone = serviceOrder.ServiceLocationPhone();
		viewModel.selectedContactPersonObject(obj);
	}
	if (viewModel.customContactPerson()) {
		let changed = false;
		if (!(viewModel.selectedContactPersonObject() instanceof window.database.Main_Person.Main_Person)) {
			if (viewModel.selectedContactPersonObject().name !== serviceOrder.ServiceLocationResponsiblePerson() ||
				viewModel.selectedContactPersonObject().email !== serviceOrder.ServiceLocationEmail() ||
				viewModel.selectedContactPersonObject().phone !== serviceOrder.ServiceLocationPhone()) {
				changed = true;
			}
		} else {
			if (Helper.Person.getDisplayName(viewModel.selectedContactPersonObject()) !== serviceOrder.ServiceLocationResponsiblePerson() ||
				window.Helper.Address.getPhoneNumberAsString(Helper.Address.getPrimaryCommunication(viewModel.selectedContactPersonObject().Phones), true, viewModel.lookups.countries) !== serviceOrder.ServiceLocationPhone() ||
				Helper.Address.getPrimaryCommunication(viewModel.selectedContactPersonObject().Emails).Data !== serviceOrder.ServiceLocationEmail()) {
				changed = true;
			}
		}
		if (changed) {
			viewModel.contactWarning(!viewModel.contactWarning());
		}
	}
	if (viewModel.contactWarning()) {
		return;
	}
	viewModel.customContactPerson(!viewModel.customContactPerson());
	if (!viewModel.customContactPerson() && viewModel.selectedContactPersonObject() instanceof window.database.Main_Person.Main_Person) {
		viewModel.selectedContactPersonOnSelect(serviceOrder, viewModel.selectedContactPersonObject());
	}
	if (!viewModel.customContactPerson() && !(viewModel.selectedContactPersonObject() instanceof window.database.Main_Person.Main_Person)) {
		serviceOrder.ServiceLocationResponsiblePerson(viewModel.selectedContactPersonObject().name);
		serviceOrder.ServiceLocationEmail(viewModel.selectedContactPersonObject().email);
		serviceOrder.ServiceLocationPhone(viewModel.selectedContactPersonObject().phone);
	}
};

namespace("Crm.Service.ViewModels").DispatchDetailsViewModel.prototype.toggleCustomAddress = function (serviceOrder) {
	let viewModel = this;
	let properties = ["Name1", "Name2", "Name3", "Street", "ZipCode", "City", "CountryKey", "RegionKey"];
	if (!viewModel.customAddress() && !viewModel.selectedAddressObject()) {
		let obj = {};
		for (const prop of properties) {
			obj[prop] = serviceOrder[prop]();
		}
		viewModel.selectedAddressObject(obj);
	}
	if (viewModel.customAddress()) {
		let changed = false;
		for (const prop of properties) {
			if (viewModel.selectedAddressObject()[prop] !== serviceOrder[prop]()) {
				changed = true;
				break;
			}
		}
		if (changed) {
			viewModel.addressWarning(!viewModel.addressWarning());
		}
	}
	if (viewModel.addressWarning()) {
		return;
	}
	viewModel.customAddress(!viewModel.customAddress());
	if (!viewModel.customAddress() && viewModel.selectedAddressObject()) {
		viewModel.selectedAddressOnSelect(serviceOrder, viewModel.selectedAddressObject());
	}
};

namespace("Crm.Service.ViewModels").DispatchDetailsViewModel.prototype.selectedContactPersonOnSelect = function (serviceOrder, selectedContact) {
	let viewModel = this;
	viewModel.selectedContactPersonObject(selectedContact);
	let properties = ["ServiceLocationResponsiblePerson", "ServiceLocationPhone", "ServiceLocationEmail"];
	if (selectedContact) {
		serviceOrder.ServiceLocationResponsiblePerson(Helper.Person.getDisplayName(selectedContact));
		if (selectedContact.Phones.length > 0)
			serviceOrder.ServiceLocationPhone(window.Helper.Address.getPhoneNumberAsString(Helper.Address.getPrimaryCommunication(selectedContact.Phones), true, viewModel.lookups.countries));
		if (selectedContact.Emails.length > 0)
			serviceOrder.ServiceLocationEmail(Helper.Address.getPrimaryCommunication(selectedContact.Emails).Data);
	} else {
		serviceOrder.ServiceLocationResponsiblePerson(null);
		serviceOrder.ServiceLocationPhone(null);
		serviceOrder.ServiceLocationEmail(null);
	}
};

namespace("Crm.Service.ViewModels").DispatchDetailsViewModel.prototype.selectedAddressOnSelect = function (serviceOrder, selectedAddress) {
	let viewModel = this;
	viewModel.selectedAddressObject(selectedAddress);
	if (selectedAddress) {
		serviceOrder.Name1(selectedAddress.Name1);
		serviceOrder.Name2(selectedAddress.Name2);
		serviceOrder.Name3(selectedAddress.Name3);
		serviceOrder.Street(selectedAddress.Street);
		serviceOrder.ZipCode(selectedAddress.ZipCode);
		serviceOrder.City(selectedAddress.City);
		serviceOrder.CountryKey(selectedAddress.CountryKey);
		serviceOrder.RegionKey(selectedAddress.RegionKey);
	} else {
		serviceOrder.Name1(null);
		serviceOrder.Name2(null);
		serviceOrder.Name3(null);
		serviceOrder.Street(null);
		serviceOrder.ZipCode(null);
		serviceOrder.City(null);
		serviceOrder.CountryKey(null);
		serviceOrder.RegionKey(null);
	}
};

namespace("Crm.Service.ViewModels").DispatchDetailsViewModel.prototype.onLocationPmbCancel = function () {
	let viewModel = this;
	viewModel.customContactPerson(false);
	viewModel.customAddress(false);
	viewModel.selectedContactPerson(null);
	viewModel.selectedContactPersonObject(null);
	viewModel.selectedAddress(null);
	viewModel.selectedAddressObject(null);
}

namespace("Crm.Service.ViewModels").DispatchDetailsViewModel.prototype.contactPersonFilter =
	namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.contactPersonFilter;

namespace("Crm.Service.ViewModels").DispatchDetailsViewModel.prototype.filterAddresses =
	namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.filterAddresses;

namespace("Crm.Service.ViewModels").DispatchDetailsViewModel.prototype.formatAddress =
	namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.formatAddress;

namespace("Crm.Service.ViewModels").DispatchDetailsViewModel.prototype.isInstallationAddress =
	namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.isInstallationAddress;

namespace("Crm.Service.ViewModels").DispatchDetailsViewModel.prototype.isServiceObjectAddress =
	namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.isServiceObjectAddress;