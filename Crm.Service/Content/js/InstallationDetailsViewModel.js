namespace("Crm.Service.ViewModels").InstallationDetailsViewModel = function() {
	var viewModel = this;
	viewModel.tabs = window.ko.observable({});
	viewModel.loading = window.ko.observable(true);
	viewModel.installation = window.ko.observable(null);
	viewModel.serviceContracts = window.ko.observableArray([]);
	window.Main.ViewModels.ContactDetailsViewModel.apply(this, arguments);
	viewModel.contactType("Installation");
	viewModel.lookups = {
		addressTypes: { $tableName: "Main_AddressType" },
		countries: { $tableName: "Main_Country" },
		emailTypes: { $tableName: "Main_EmailType" },
		faxTypes: { $tableName: "Main_FaxType" },
		installationHeadStatuses: { $tableName: "CrmService_InstallationHeadStatus" },
		installationTypes: { $tableName: "CrmService_InstallationType" },
		manufacturers: { $tableName: "CrmService_Manufacturer" },
		phoneTypes: { $tableName: "Main_PhoneType" },
		regions: { $tableName: "Main_Region" },
		serviceContractTypes: { $tableName: "CrmService_ServiceContractType" },
		websiteTypes: { $tableName: "Main_WebsiteType" }
	};
	viewModel.dropboxName = window.ko.pureComputed(function () {
		return viewModel.installation().InstallationNo() + "-" + viewModel.installation().Company().Name() + "-" + viewModel.installation().Description().substring(0,25);
	});
	viewModel.customAddress = window.ko.observable(false);
};
namespace("Crm.Service.ViewModels").InstallationDetailsViewModel.prototype = Object.create(window.Main.ViewModels.ContactDetailsViewModel.prototype);
namespace("Crm.Service.ViewModels").InstallationDetailsViewModel.prototype.init = function(id) {
	var viewModel = this;
	viewModel.contactId(id);
	return window.Main.ViewModels.ContactDetailsViewModel.prototype.init.apply(this, arguments)
		.then(function() {
			return window.database.CrmService_Installation
				.include("Address")
				.include("Company")
				.include("Person")
				.include("PreferredUserUser")
				.include("ResponsibleUserUser")
				.include("ServiceObject")
				.include("Station")
				.include2("Tags.orderBy(function(t) { return t.Name; })")
				.find(id);
		})
		.then(function(installation) {
			viewModel.installation(installation.asKoObservable());
			viewModel.contact(viewModel.installation());
			viewModel.contactName(window.Helper.Installation.getDisplayName(viewModel.installation()));
			viewModel.isEditable(window.Crm.Service.Settings.AllowEditInstallationWithLegacyId === true || installation.LegacyId === null);
			return installation;
		})
		.then(function() { return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups); })
		.then(function() { return window.Helper.Address.loadCommunicationData(viewModel.installation().Address()); })
		.then(function() { return viewModel.loadServiceContracts(); })
		.then(function() { return viewModel.setVisibilityAlertText(); })
		.then(() => viewModel.setBreadcrumbs(id));
};
namespace("Crm.Service.ViewModels").InstallationDetailsViewModel.prototype.contactPersonFilter =
	window.Crm.Service.ViewModels.InstallationCreateViewModel.prototype.contactPersonFilter;
namespace("Crm.Service.ViewModels").InstallationDetailsViewModel.prototype.loadServiceContracts = function() {
	var viewModel = this;
	if (!window.AuthorizationManager.currentUserHasPermission("WebAPI::ServiceContractInstallationRelationship"))
		return;
	return window.database.CrmService_ServiceContractInstallationRelationship
		.include("Parent")
		.include("Parent.ResponsibleUserUser")
		.filter(function(it) {
			return it.ChildId === this.installationId && it.Parent.StatusKey === "Active";
		}, { installationId: viewModel.installation().Id() })
		.map("it.Parent")
		.take(5)
		.toArray(viewModel.serviceContracts);
}
namespace("Crm.Service.ViewModels").InstallationDetailsViewModel.prototype.locationAddressFilter =
	window.Crm.Service.ViewModels.InstallationCreateViewModel.prototype.locationAddressFilter;
namespace("Crm.Service.ViewModels").InstallationDetailsViewModel.prototype.onBeforeSaveGeneral = function(viewModel) {
	viewModel.editContext().installation().Name(viewModel.editContext().installation().Description());
};
namespace("Crm.Service.ViewModels").InstallationDetailsViewModel.prototype.onLocationContactSelect = function(installation, contact) {
	let viewModel = this;
	if (contact) {
		installation.Company(contact);
		if(viewModel.customAddress() && viewModel.addressEditor && viewModel.addressEditor.contactId !== contact.Id){
			viewModel.addressEditor.address().CompanyId(contact.Id);
			viewModel.addressEditor.address().Name1(contact.Name);
		}
		if (installation.Address() && installation.Address().CompanyId() !== contact.Id) {
			installation.Address(null);
			installation.LocationAddressKey(null);
		}
		if (installation.Person() && installation.Person().ParentId() !== contact.Id) {
			installation.LocationPersonId(null);
			installation.Person(null);
		}
	} else {
		installation.Company(null);
		installation.Address(null);
		installation.LocationAddressKey(null);
		installation.LocationPersonId(null);
		installation.Person(null);
	}
};
namespace("Crm.Service.ViewModels").InstallationDetailsViewModel.prototype.onLocationAddressSelect = function(address) {
	var installation = this;
	if (address) {
		installation.Address(address);
	} else {
		installation.Address(null);
	}
};
namespace("Crm.Service.ViewModels").InstallationDetailsViewModel.prototype.onLocationPersonSelect = function(person) {
	var installation = this;
	if (person) {
		installation.Person(person);
	} else {
		installation.Person(null);
	}
};

namespace("Crm.Service.ViewModels").InstallationDetailsViewModel.prototype.setBreadcrumbs = function (id) {
	var viewModel = this;
	window.breadcrumbsViewModel.setBreadcrumbs([
		new Breadcrumb(Helper.String.getTranslatedString("Installation"), "#/Crm.Service/InstallationList/IndexTemplate"),
		new Breadcrumb(Helper.Installation.getDisplayName(viewModel.installation()), window.location.hash, null, id)
	]);
};
namespace("Crm.Service.ViewModels").InstallationDetailsViewModel.prototype.onLoadAddressEditor = function (installation, addressEditor) {
	this.addressEditor = addressEditor;
	addressEditor.name = installation.Company()?.Name();
};
namespace("Crm.Service.ViewModels").InstallationDetailsViewModel.prototype.toggleCustomAddress = function () {
	let viewModel = this;
	if (viewModel.customAddress()) {
		viewModel.addressEditor.dispose();
	}
	viewModel.customAddress(!viewModel.customAddress());
};
namespace("Crm.Service.ViewModels").InstallationDetailsViewModel.prototype.onBeforeSaveContactInfo = function (viewModel) {
	if (this.customAddress() && this.addressEditor) {
		if (this.addressEditor.addressErrors() && this.addressEditor.addressErrors().length > 0) {
			this.addressEditor.showValidationErrors();
			throw new Error('');
		} else {
			if (viewModel.editContext().installation().LocationAddressKey() === null) {
				viewModel.editContext().installation().LocationAddressKey(this.addressEditor.address().Id());
			}
		}
	}
};
namespace("Crm.Service.ViewModels").InstallationDetailsViewModel.prototype.onSaveContactInfo = function () {
	if (this.customAddress() && this.addressEditor) {
		this.installation().LocationAddressKey(this.addressEditor.address().Id())
		this.onLocationAddressSelect.bind(this.installation())(this.addressEditor.address());
	}
};
namespace("Crm.Service.ViewModels").InstallationDetailsViewModel.prototype.onAfterSaveContactInfo = function () {
	if (this.customAddress()) {
		this.customAddress(false);
	}
};
namespace("Crm.Service.ViewModels").InstallationDetailsViewModel.prototype.onCancelContactInfo = function () {
	if (this.customAddress()) {
		this.customAddress(false);
		if (this.addressEditor) {
			this.addressEditor.dispose();
		}
	}
};