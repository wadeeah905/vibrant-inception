namespace("Crm.Service.ViewModels").ServiceObjectDetailsViewModel = function() {
	var viewModel = this;
	viewModel.tabs = window.ko.observable({});
	viewModel.loading = window.ko.observable(true);
	viewModel.serviceObject = window.ko.observable(null);
	viewModel.showAllAddresses = window.ko.observable(false);
	window.Main.ViewModels.ContactDetailsViewModel.apply(this, arguments);
	viewModel.contactType("ServiceObject");
	viewModel.lookups = {
		addressTypes: { $tableName: "Main_AddressType" },
		countries: { $tableName: "Main_Country" },
		emailTypes: { $tableName: "Main_EmailType" },
		faxTypes: { $tableName: "Main_FaxType" },
		phoneTypes: { $tableName: "Main_PhoneType" },
		regions: { $tableName: "Main_Region" },
		serviceObjectCategories: { $tableName: "CrmService_ServiceObjectCategory" },
		websiteTypes: { $tableName: "Main_WebsiteType" }
	};
	viewModel.addresses = window.ko.observableArray([]);
	viewModel.standardAddress = window.ko.pureComputed(function() {
		return ko.utils.arrayFirst(viewModel.addresses(),
			function(x) {
				return x.IsCompanyStandardAddress();
			}) || null;
	});
	viewModel.primaryPhone = window.ko.pureComputed(function() {
		var standardAddress = viewModel.standardAddress();
		if (standardAddress) {
			return window.Helper.Address.getPrimaryCommunication(standardAddress.Phones);
		}
		return null;
	});
	viewModel.primaryFax = window.ko.pureComputed(function() {
		var standardAddress = viewModel.standardAddress();
		if (standardAddress) {
			return window.Helper.Address.getPrimaryCommunication(standardAddress.Faxes);
		}
		return null;
	});
	viewModel.primaryEmail = window.ko.pureComputed(function() {
		var standardAddress = viewModel.standardAddress();
		if (standardAddress) {
			return window.Helper.Address.getPrimaryCommunication(standardAddress.Emails);
		}
		return null;
	});
	viewModel.primaryWebsite = window.ko.pureComputed(function() {
		var standardAddress = viewModel.standardAddress();
		if (standardAddress) {
			return window.Helper.Address.getPrimaryCommunication(standardAddress.Websites);
		}
		return null;
	});
	viewModel.dropboxName = window.ko.pureComputed(function () {
		return (viewModel.serviceObject().ObjectNo() !== null && viewModel.serviceObject().ObjectNo() !== '' ? viewModel.serviceObject().ObjectNo() + "-" :"") + viewModel.serviceObject().Name().substring(0, 25);
	});
};
namespace("Crm.Service.ViewModels").ServiceObjectDetailsViewModel.prototype =
	Object.create(window.Main.ViewModels.ContactDetailsViewModel.prototype);
namespace("Crm.Service.ViewModels").ServiceObjectDetailsViewModel.prototype.init = function(id) {
	var viewModel = this;
	viewModel.contactId(id);
	window.Helper.Address.registerEventHandlers(this);
	return window.Main.ViewModels.ContactDetailsViewModel.prototype.init.apply(this, arguments)
		.then(function() {
			return window.database.CrmService_ServiceObject
				.include2("Addresses.orderBy(function(x) { return x.CreateDate; })")
				.include("ResponsibleUserUser")
				.include2("Tags.orderBy(function(t) { return t.Name; })")
				.find(id);
		})
		.then(function(serviceObject) {
			viewModel.serviceObject(serviceObject.asKoObservable());
			viewModel.contact(viewModel.serviceObject());
			viewModel.contactName(window.Helper.ServiceObject.getDisplayName(viewModel.serviceObject()));
			viewModel.addresses(serviceObject.Addresses.map(function(x) { return x.asKoObservable(); }));
			viewModel.showAllAddresses.subscribe(function(value) {
				if (value) {
					viewModel.loading(true);
					window.Helper.Address.loadCommunicationData(viewModel.addresses(), viewModel.contactId())
						.then(function() {
							viewModel.loading(false);
						});
				}
			});
			return window.Helper.Address.loadCommunicationData(viewModel.standardAddress(), viewModel.contactId());
		})
		.then(function() { return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups); })
		.then(function() { return viewModel.setVisibilityAlertText(); })
		.then(() => viewModel.setBreadcrumbs(id));
};
namespace("Crm.Service.ViewModels").ServiceObjectDetailsViewModel.prototype.onSaveGeneral = function (context) {
	context.viewContext.serviceObject().ResponsibleUserUser(context.editContext().serviceObject().ResponsibleUserUser());
};

namespace("Crm.Service.ViewModels").ServiceObjectDetailsViewModel.prototype.onAddressInsert =
	window.Main.ViewModels.CompanyDetailsViewModel.prototype.onAddressInsert;
namespace("Crm.Service.ViewModels").ServiceObjectDetailsViewModel.prototype.onAddressUpdate =
	window.Main.ViewModels.CompanyDetailsViewModel.prototype.onAddressUpdate;
namespace("Crm.Service.ViewModels").ServiceObjectDetailsViewModel.prototype.onAddressDelete =
	window.Main.ViewModels.CompanyDetailsViewModel.prototype.onAddressDelete;
namespace("Crm.Service.ViewModels").ServiceObjectDetailsViewModel.prototype.checkRelevantAddress =
	window.Main.ViewModels.CompanyDetailsViewModel.prototype.checkRelevantAddress;
namespace("Crm.Service.ViewModels").ServiceObjectDetailsViewModel.prototype.getCommunicationCollectionFromAddress =
	window.Main.ViewModels.CompanyDetailsViewModel.prototype.getCommunicationCollectionFromAddress;
namespace("Crm.Service.ViewModels").ServiceObjectDetailsViewModel.prototype.onCommunicationInsert =
	window.Main.ViewModels.CompanyDetailsViewModel.prototype.onCommunicationInsert;
namespace("Crm.Service.ViewModels").ServiceObjectDetailsViewModel.prototype.onCommunicationUpdate =
	window.Main.ViewModels.CompanyDetailsViewModel.prototype.onCommunicationUpdate;
namespace("Crm.Service.ViewModels").ServiceObjectDetailsViewModel.prototype.onCommunicationDelete =
	window.Main.ViewModels.CompanyDetailsViewModel.prototype.onCommunicationDelete;
namespace("Crm.Service.ViewModels").ServiceObjectDetailsViewModel.prototype.getUniqueAddress =
	window.Main.ViewModels.CompanyDetailsViewModel.prototype.getUniqueAddress;
namespace("Crm.Service.ViewModels").ServiceObjectDetailsViewModel.prototype.checkRelevantCommunication =
	window.Main.ViewModels.CompanyDetailsViewModel.prototype.checkRelevantCommunication;
namespace("Crm.Service.ViewModels").ServiceObjectDetailsViewModel.prototype.makeStandardAddress =
	window.Main.ViewModels.CompanyDetailsViewModel.prototype.makeStandardAddress;

namespace("Crm.Service.ViewModels").ServiceObjectDetailsViewModel.prototype.setBreadcrumbs = function (id) {
	var viewModel = this;
	window.breadcrumbsViewModel.setBreadcrumbs([
		new Breadcrumb(Helper.String.getTranslatedString("ServiceObject"), "#/Crm.Service/ServiceObjectList/IndexTemplate"),
		new Breadcrumb(Helper.ServiceObject.getDisplayName(viewModel.serviceObject()), window.location.hash, null, id)
	]);
};
