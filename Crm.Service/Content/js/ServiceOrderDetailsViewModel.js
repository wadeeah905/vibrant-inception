/// <reference path="../../../../Content/js/ViewModels/ContactDetailsViewModel.js" />
/// <reference path="../../../../Content/js/helper/Helper.Batch.js" />
/// <reference path="ServiceOrderCreateViewModel.js" />
/// <reference path="Helper/Helper.Service.js" />

namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel = function() {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	viewModel.currentTabId = window.ko.observable(null);
	viewModel.previousTabId = window.ko.observable(null);
	viewModel.currentUser = window.ko.observable(null);
	viewModel.dispatch = window.ko.observable(null);
	viewModel.serviceOrder = window.ko.observable(null);
	viewModel.serviceOrderIsEditable = window.ko.pureComputed(function() {
		var hasPermission = window.AuthorizationManager.isAuthorizedForAction("ServiceOrder", "Edit");
		hasPermission = hasPermission || viewModel.serviceOrder().CreateUser() === viewModel.currentUser().Id;
		if (hasPermission && viewModel.serviceOrder() && viewModel.lookups.serviceOrderStatuses) {
			var status = viewModel.lookups.serviceOrderStatuses[viewModel.serviceOrder().StatusKey()];
			if (status && status.Groups.split(",").indexOf("Closed") === -1) {
				return true;
			}
		}
		return false;
	});
	viewModel.dispatchIsEditable = viewModel.serviceOrderIsEditable;
	viewModel.serviceObject = window.ko.pureComputed(function() {
		return viewModel.serviceOrder() ? viewModel.serviceOrder().ServiceObject() : null;
	});
	viewModel.serviceContract = window.ko.pureComputed(function () {
		return viewModel.serviceOrder() ? viewModel.serviceOrder().ServiceContract() : null;
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
	viewModel.lookups = {
		addressTypes: { $tableName: "Main_AddressType" },
		countries: { $tableName: "Main_Country" },
		emailTypes: { $tableName: "Main_EmailType" },
		faxTypes: { $tableName: "Main_FaxType" },
		invoicingTypes: { $tableName: "Main_InvoicingType" },
		phoneTypes: { $tableName: "Main_PhoneType" },
		regions: { $tableName: "Main_Region" },
		serviceContractTypes: { $tableName: "CrmService_ServiceContractType" },
		serviceObjectCategories: { $tableName: "CrmService_ServiceObjectCategory" },
		serviceOrderNoInvoiceReasons: { $tableName: "CrmService_ServiceOrderNoInvoiceReason" },
		serviceOrderStatuses: { $tableName: "CrmService_ServiceOrderStatus" },
		serviceOrderTypes: { $tableName: "CrmService_ServiceOrderType" },
		servicePriorities: { $tableName: "CrmService_ServicePriority" },
		skills: { $tableName: "Main_Skill" },
		websiteTypes: { $tableName: "Main_WebsiteType" },
		currencies: { $tableName: "Main_Currency" },
	};
	viewModel.lookups = window.Helper.StatisticsKey.addLookupTables(viewModel.lookups);
	viewModel.settableStatuses = window.ko.pureComputed(function () {
		var currentStatus = viewModel.lookups.serviceOrderStatuses.$array.find(function (x) {
			return x.Key === viewModel.serviceOrder().StatusKey();
		});
		var settableStatusKeys = currentStatus
			? (currentStatus.SettableStatuses || "").split(",")
			: [];
		if (window.AuthorizationManager.isAuthorizedForAction("ServiceOrder", "SetAdditionalHeadStatuses")) {
			settableStatusKeys = window._.uniq(settableStatusKeys.concat(["ReadyForScheduling", "Closed"]));
		}
		return viewModel.lookups.serviceOrderStatuses.$array.filter(function (x) {
			return x === currentStatus || settableStatusKeys.indexOf(x.Key) !== -1;
		});
	});
	viewModel.canEditCustomerContact = window.ko.pureComputed(function() {
		return viewModel.serviceOrderIsEditable();
	});
	viewModel.canEditInitiator = window.ko.pureComputed(function() {
		return viewModel.serviceOrderIsEditable();
	});
	viewModel.canSetStatus = window.ko.pureComputed(function() {
		return viewModel.settableStatuses().length > 1 &&
			window.AuthorizationManager.isAuthorizedForAction("ServiceOrder", "SetHeadStatus");
	});
	viewModel.showInvoiceData = window.ko.pureComputed(() => {
		return Helper.ServiceOrder.isInStatusGroupSync(viewModel.serviceOrder().StatusKey(), viewModel.lookups.serviceOrderStatuses, ["PostProcessing", "Closed"]);
	});
	viewModel.tabs = window.ko.observable({});
	window.Main.ViewModels.ContactDetailsViewModel.apply(this, arguments);
	viewModel.contactType("ServiceOrder");
	viewModel.contactName = window.ko.pureComputed(function() {
		return viewModel.serviceOrder() ? viewModel.serviceOrder().OrderNo() : null;
	});
	viewModel.dropboxName = window.ko.pureComputed(function () {
		return viewModel.serviceOrder() && viewModel.serviceOrder().Company() ? viewModel.serviceOrder().OrderNo() + "-" + viewModel.serviceOrder().Company().Name().substring(0,25) : "";
	});
	viewModel.customAddress = window.ko.observable(false);
	viewModel.customContactPerson = window.ko.observable(false);
	viewModel.selectedAddress = window.ko.observable(null);
	viewModel.selectedAddressObject = window.ko.observable(null);
	viewModel.selectedContactPerson = window.ko.observable(null);
	viewModel.selectedContactPersonObject = window.ko.observable(null);
	viewModel.contactWarning = ko.observable(false);
	viewModel.addressWarning = ko.observable(false);
	viewModel.installations = ko.computed(() => {
		if (!viewModel.serviceOrder()) {
			return [];
		}
		if (window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode === "JobPerInstallation") {
			return viewModel.serviceOrder().ServiceOrderTimes();
		} else {
			let installationArray = [];
			if (viewModel.serviceOrder().Installation()) {
				installationArray.push(viewModel.serviceOrder().Installation().innerInstance);
			}
			return installationArray;
		}
	});
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype = Object.create(window.Main.ViewModels.ContactDetailsViewModel.prototype);
namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.customerContactFilter =
	namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.customerContactFilter;
namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.getSkillsFromKeys = function(keys) {
	var viewModel = this;
	return viewModel.lookups.skills.$array.filter(function(x) {
		return keys.indexOf(x.Key) !== -1;
	}).map(window.Helper.Lookup.mapLookupForSelect2Display);
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.init = function (id) {
	var viewModel = this;
	return window.Main.ViewModels.ContactDetailsViewModel.prototype.init.apply(this, arguments).then(function() {
			return viewModel.loadServiceOrder(id);
		}).then(function(serviceOrder) {
			window.Helper.Database.registerEventHandlers(viewModel, {
				"CrmService_ServiceOrderHead": {
					"afterUpdate": async function (sender, serviceOrder) {
						if (viewModel.serviceOrder().innerInstance !== serviceOrder){
							viewModel.loading(true);
							await viewModel.loadServiceOrder(viewModel.serviceOrder().Id());
							viewModel.loading(false);
						}
					}
				}
			});
		}).then(function () {
			var queries = [];
			queries.push({
				queryable: window.database.Main_Company
					.include2("Addresses.filter(function(x) { x.IsCompanyStandardAddress === true; })")
					.filter("it.Id === this.id", { id: viewModel.serviceOrder().CustomerContactId() }),
				method: "first",
				handler: viewModel.serviceOrder().Company
			});
			if (viewModel.serviceOrder().InitiatorId()) {
				queries.push({
					queryable: window.database.Main_Company
						.include2("Addresses.filter(function(x) { x.IsCompanyStandardAddress === true; })")
						.filter("it.Id === this.id", { id: viewModel.serviceOrder().InitiatorId() }),
					method: "first",
					handler: viewModel.serviceOrder().Initiator
				});
			}
			if (viewModel.serviceOrder().ServiceObjectId()) {
				queries.push({
					queryable: window.database.CrmService_ServiceObject
						.include2("Addresses.filter(function(x) { x.IsCompanyStandardAddress === true; })")
						.include("Addresses.Emails")
						.include("Addresses.Faxes")
						.include("Addresses.Phones")
						.include("Addresses.Websites")
						.filter("it.Id === this.id", { id: viewModel.serviceOrder().ServiceObjectId() }),
					method: "first",
					handler: viewModel.serviceOrder().ServiceObject
				});
			}
			return window.Helper.Batch.Execute(queries);
		}).then(function() {
			return window.Helper.User.getCurrentUser();
		}).then(function(user) {
			viewModel.currentUser(user);
			return window.Helper.StatisticsKey.getAvailableLookups(viewModel.lookups, viewModel.serviceOrder());
		}).then(function() {
			return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups);
		}).then(function() { 
			return viewModel.setVisibilityAlertText();
		}).then(()=>viewModel.setBreadcrumbs(id));
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.initiatorFilter =
	namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.initiatorFilter;
namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.initiatorPersonFilter =
	namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.initiatorPersonFilter;
namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.invoiceRecipientAddressFilter =
	function(query, term) {
		var serviceOrder = this.serviceOrder();
		query = window.Helper.Address.getAutocompleteFilter(query, term);
		return query.filter(function(it) {
				return it.CompanyId === this.companyId;
			},
			{ companyId: serviceOrder.InvoiceRecipientId() });
	};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.loadServiceOrder = function (id) {
	const viewModel = this;
	return window.database.CrmService_ServiceOrderHead
		.include("InitiatorPerson")
		.include("InitiatorPerson.Phones")
		.include("InitiatorPerson.Emails")
		.include("Installation")
		.include("InvoiceRecipient")
		.include("InvoiceRecipientAddress")
		.include("Payer")
		.include("PayerAddress")
		.include("PreferredTechnicianUser")
		.include("PreferredTechnicianUsergroupObject")
		.include("ResponsibleUserUser")
		.include("ServiceOrderTemplate")
		.include("UserGroup")
		.include("Station")
		.include("ServiceContract")
		.include("ServiceContract.ParentCompany")
		.include("ServiceOrderTimes")
		.include2("Tags.orderBy(function(t) { return t.Name; })")
		.find(id).then(function (serviceOrder) {
			viewModel.serviceOrder(serviceOrder.asKoObservable());
			viewModel.contact(viewModel.serviceOrder());
		});
}
namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.onInitiatorSelect =
	namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.onInitiatorSelect;
namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.onInvoiceRecipientSelect =
	function(invoiceRecipient) {
		var viewModel = this;
		if (invoiceRecipient) {
			viewModel.serviceOrder().InvoiceRecipient(invoiceRecipient.asKoObservable());
			viewModel.serviceOrder().InvoiceRecipientId(invoiceRecipient.Id);
			if (viewModel.serviceOrder().InvoiceRecipientAddress() &&
				viewModel.serviceOrder().InvoiceRecipientAddress().CompanyId() !== invoiceRecipient.Id) {
				viewModel.serviceOrder().InvoiceRecipientAddress(null);
				viewModel.serviceOrder().InvoiceRecipientAddressId(null);
			}
		} else {
			viewModel.serviceOrder().InvoiceRecipient(null);
			viewModel.serviceOrder().InvoiceRecipientId(null);
			viewModel.serviceOrder().InvoiceRecipientAddress(null);
			viewModel.serviceOrder().InvoiceRecipientAddressId(null);
		}
	};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.onPayerSelect = function(payer) {
	var viewModel = this;
	if (payer) {
		viewModel.serviceOrder().Payer(payer.asKoObservable());
		viewModel.serviceOrder().PayerId(payer.Id);
		if (viewModel.serviceOrder().PayerAddress() &&
			viewModel.serviceOrder().PayerAddress().CompanyId() !== payer.Id) {
			viewModel.serviceOrder().PayerAddress(null);
			viewModel.serviceOrder().PayerAddressId(null);
		}
	} else {
		viewModel.serviceOrder().Payer(null);
		viewModel.serviceOrder().PayerId(null);
		viewModel.serviceOrder().PayerAddress(null);
		viewModel.serviceOrder().PayerAddressId(null);
	}
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.onPreferredTechnicianUsergroupSelect = function (technicianUserGroup) {
	const viewModel = this;
	window.Log.debug("Selected 'PreferredTechnicianUsergroup' is '" + (technicianUserGroup ? technicianUserGroup.Name : "null") + "'");
	
	if (technicianUserGroup) {
		viewModel.serviceOrder().PreferredTechnicianUsergroup(technicianUserGroup.Name);
		viewModel.serviceOrder().PreferredTechnicianUsergroupKey(technicianUserGroup.Id);
		viewModel.serviceOrder().PreferredTechnicianUsergroupObject(technicianUserGroup.asKoObservable());
		
		if (viewModel.serviceOrder().PreferredTechnician() && !viewModel.serviceOrder().PreferredTechnicianUser().UsergroupIds().includes(technicianUserGroup.Id)) {
			window.Log.debug("Selected 'PreferredTechnician' (" + viewModel.serviceOrder().PreferredTechnician() + ") is not member of the selected 'PreferredTechnicianUsergroup' (" + technicianUserGroup.Name + ") and will be removed");
			viewModel.serviceOrder().PreferredTechnician(null);
			viewModel.serviceOrder().PreferredTechnicianUser(null);
		}
	}
}
namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.onUsergroupSelect = function (userGroup) {
	const viewModel = this;
	window.Log.debug("Selected 'Usergroup' is '" + (userGroup ? userGroup.Name : "null") + "'");

	if (userGroup) {
		viewModel.serviceOrder().UserGroup(userGroup.asKoObservable());
		viewModel.serviceOrder().UserGroupKey(userGroup.Id);

		if (viewModel.serviceOrder().ResponsibleUserUser() && !viewModel.serviceOrder().ResponsibleUserUser().UsergroupIds().includes(userGroup.Id)) {
			window.Log.debug("Selected 'ResponsibleUser' (" + viewModel.serviceOrder().ResponsibleUser() + ") is not member of the selected 'Usergroup' (" + userGroup.Name + ") and will be removed");
			viewModel.serviceOrder().ResponsibleUser(null);
			viewModel.serviceOrder().ResponsibleUserUser(null);
		}
	} else {
		viewModel.serviceOrder().UserGroup(null);
		viewModel.serviceOrder().UserGroupKey(null);
	}
}
namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.onSaveCustomerContact = function(viewModel) {
	viewModel.viewContext.serviceOrder().Company(viewModel.editContext().serviceOrder().Company());
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.onSaveInitiator = function (viewModel) {
	viewModel.viewContext.serviceOrder().Initiator(viewModel.editContext().serviceOrder().Initiator());
	viewModel.viewContext.serviceOrder().InitiatorPerson(viewModel.editContext().serviceOrder().InitiatorPerson());
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.onSaveInvoicing = function(viewModel) {
	viewModel.viewContext.serviceOrder().InvoiceRecipient(viewModel.editContext().serviceOrder().InvoiceRecipient());
	viewModel.viewContext.serviceOrder().InvoiceRecipientAddress(viewModel.editContext().serviceOrder().InvoiceRecipientAddress());
	viewModel.viewContext.serviceOrder().Payer(viewModel.editContext().serviceOrder().Payer());
	viewModel.viewContext.serviceOrder().PayerAddress(viewModel.editContext().serviceOrder().PayerAddress());
	return Helper.Service.resetInvoicingIfLumpSumSettingsChanged(viewModel.viewContext.serviceOrder());
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.onInitScheduling = function(viewModel) {
	var toggle = viewModel.toggle;
	viewModel.toggle = function() {
		toggle.apply(this, arguments);
		viewModel.editContext().serviceOrder().UserGroupKey.subscribe(function() {
			viewModel.editContext().serviceOrder().ResponsibleUserUser(null);
			viewModel.editContext().serviceOrder().ResponsibleUser(null);
		});
		viewModel.editContext().serviceOrder().PreferredTechnicianUsergroupKey.subscribe(function() {
			viewModel.editContext().serviceOrder().PreferredTechnicianUser(null);
			viewModel.editContext().serviceOrder().PreferredTechnician(null);
		});
	};
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.onSaveScheduling = function(viewModel) {
	viewModel.viewContext.serviceOrder()
		.ResponsibleUserUser(viewModel.editContext().serviceOrder().ResponsibleUserUser());
	viewModel.viewContext.serviceOrder()
		.PreferredTechnicianUsergroupObject(viewModel.editContext().serviceOrder().PreferredTechnicianUsergroupObject());
	viewModel.viewContext.serviceOrder().UserGroup(viewModel.editContext().serviceOrder().UserGroup());
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.payerAddressFilter =
	function(query, term) {
		var serviceOrder = this.serviceOrder();
		query = window.Helper.Address.getAutocompleteFilter(query, term);
		return query.filter(function(it) {
				return it.CompanyId === this.companyId;
			},
			{ companyId: serviceOrder.PayerId() });
	};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.preferredTechnicianFilter =
	namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.preferredTechnicianFilter;
namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.setStatus = function(status) {
	var viewModel = this;
	viewModel.loading(true);
	window.database.attachOrGet(viewModel.serviceOrder().innerInstance);
	window.Helper.ServiceOrder.setStatus(viewModel.serviceOrder(), status);
	window.database.saveChanges().then(function () {
		viewModel.loading(false);
	});
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.setBreadcrumbs = function (id) {
	var viewModel = this;
	window.breadcrumbsViewModel.setBreadcrumbs([
		new Breadcrumb(Helper.String.getTranslatedString("ServiceOrder"), "#/Crm.Service/ServiceOrderHeadList/IndexTemplate"),
		new Breadcrumb(viewModel.serviceOrder().OrderNo(), window.location.hash, null, id)
	]);
};

namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.onStationSelect =
	namespace("Crm.Service.ViewModels").DispatchDetailsViewModel.prototype.onStationSelect;

namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.toggleCustomContactPerson =
	namespace("Crm.Service.ViewModels").DispatchDetailsViewModel.prototype.toggleCustomContactPerson;

namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.toggleCustomAddress =
	namespace("Crm.Service.ViewModels").DispatchDetailsViewModel.prototype.toggleCustomAddress;

namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.selectedContactPersonOnSelect =
	namespace("Crm.Service.ViewModels").DispatchDetailsViewModel.prototype.selectedContactPersonOnSelect;

namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.selectedAddressOnSelect =
	namespace("Crm.Service.ViewModels").DispatchDetailsViewModel.prototype.selectedAddressOnSelect;

namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.contactPersonFilter =
	namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.contactPersonFilter;

namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.filterAddresses =
	namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.filterAddresses;

namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.formatAddress =
	namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.formatAddress;

namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.isInstallationAddress =
	namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.isInstallationAddress;

namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.isServiceObjectAddress =
	namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.isServiceObjectAddress;

namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.onLocationPmbCancel =
	namespace("Crm.Service.ViewModels").DispatchDetailsViewModel.prototype.onLocationPmbCancel;
