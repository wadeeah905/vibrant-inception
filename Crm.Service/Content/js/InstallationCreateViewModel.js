namespace("Crm.Service.ViewModels").InstallationCreateViewModel = function () {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	viewModel.installation = window.ko.observable(null);
	viewModel.currentUser = window.ko.observable(null);
	viewModel.errors = window.ko.validation.group(viewModel.installation, { deep: true });
	viewModel.visibilityViewModel = new window.VisibilityViewModel(viewModel.installation, "Installation");
	viewModel.addAddress = window.ko.observable(false);
	viewModel.lookups = {
		installationHeadStatuses: { $tableName: "CrmService_InstallationHeadStatus" },
		installationTypes: { $tableName: "CrmService_InstallationType" },
		phoneTypes: { $tableName: "Main_PhoneType" },
		faxTypes: { $tableName: "Main_FaxType" },
		emailTypes: { $tableName: "Main_EmailType" },
		websiteTypes: { $tableName: "Main_WebsiteType" }
	};
};
namespace("Crm.Service.ViewModels").InstallationCreateViewModel.prototype.init = async function (id, params) {
	var viewModel = this;
	var installation = window.database.CrmService_Installation.CrmService_Installation.create();
	var currentUserName = document.getElementById("meta.CurrentUser").content;
	await window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups);
	installation.ResponsibleUser = currentUserName;
	installation.InstallationTypeKey =
		window.Helper.Lookup.getDefaultLookupValueSingleSelect(viewModel.lookups.installationTypes,
			installation.InstallationTypeKey);
	installation.StatusKey =
		window.Helper.Lookup.getDefaultLookupValueSingleSelect(viewModel.lookups.installationHeadStatuses,
			installation.StatusKey);
	viewModel.installation(installation.asKoObservable());
	viewModel.installation().Description.subscribe(function (description) {
		viewModel.installation().Name(description);
	});
	viewModel.installation().LocationContactId.subscribe(function () {
		viewModel.installation().LocationAddressKey(null);
		viewModel.installation().LocationPersonId(null);
	});
	if (params && params.locationContactId) {
		viewModel.installation().LocationContactId(params.locationContactId);
	}
	viewModel.currentUser(await window.Helper.User.getCurrentUser());
	viewModel.installation().StationKey(viewModel.currentUser().StationIds.length === 1 ? viewModel.currentUser().StationIds[0] : null);
	await viewModel.visibilityViewModel.init();
	window.database.add(viewModel.installation().innerInstance);
};
namespace("Crm.Service.ViewModels").InstallationCreateViewModel.prototype.cancel = function () {
	window.database.detach(this.installation().innerInstance);
	window.history.back();
};
namespace("Crm.Service.ViewModels").InstallationCreateViewModel.prototype.contactPersonFilter = function (query, term) {
	var installation = this;
	if (term) {
		query = query.filter(function (it) {
			return it.Firstname.contains(this.term) === true || it.Surname.contains(this.term) === true;
		},
			{ term: term });
	}
	return query.filter(function (it) {
		return this.locationContactId !== null && it.ParentId === this.locationContactId && it.IsRetired === false;
	},
		{ locationContactId: installation.LocationContactId() });
};
namespace("Crm.Service.ViewModels").InstallationCreateViewModel.prototype.locationAddressFilter =
	function (query, term) {
		var installation = this;
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
		return query.filter(function (it) {
			return this.locationContactId !== null && it.CompanyId === this.locationContactId;
		},
			{ locationContactId: installation.LocationContactId() });
	};
namespace("Crm.Service.ViewModels").InstallationCreateViewModel.prototype.submit = function () {
	var viewModel = this;
	viewModel.loading(true);
	var deferred = new $.Deferred().resolve().promise();
	if (window.ko.unwrap(viewModel.addAddress)) {
		deferred = viewModel.addressEditor.showValidationErrors();
		viewModel.installation().LocationAddressKey(viewModel.addressEditor.address().Id());
	}

	if (viewModel.errors().length == 1 && !viewModel.installation().InstallationNo() && !window.Crm.Service.Settings.InstallationNoIsGenerated) {
		viewModel.loading(false);
		viewModel.errors.showAllMessages();
		viewModel.errors.scrollToError();
		return new $.Deferred().reject().promise();
	}

	return deferred
		.then(function () {
			return window.NumberingService.createNewNumberBasedOnAppSettings(window.Crm.Service.Settings.InstallationNoIsGenerated, window.Crm.Service.Settings.InstallationNoIsCreateable, viewModel.installation().InstallationNo(), "SMS.Installation", window.database.CrmService_Installation, "InstallationNo")
		}).then(function (installationNo) {
			if (installationNo !== undefined) {
				viewModel.installation().InstallationNo(installationNo);
			}
			if (viewModel.errors().length > 0) {
				viewModel.loading(false);
				viewModel.errors.showAllMessages();
				viewModel.errors.scrollToError();
				return new $.Deferred().reject().promise();
			}
			//necessary to change order of inserts, as we should guarantee that address is saved sooner than installation
			if (window.ko.unwrap(viewModel.addAddress)) {
				window.database.detach(viewModel.installation());
				window.database.add(viewModel.installation());
			}
		}).then(function () {
			return window.database.saveChanges();
		}).then(function () {
			window.location.hash = "/Crm.Service/Installation/DetailsTemplate/" + viewModel.installation().Id();
		}).fail(function () {
			viewModel.loading(false);
		});
};
namespace("Crm.Service.ViewModels").InstallationCreateViewModel.prototype.toggleAddAddress = function () {
	var viewModel = this;
	viewModel.addAddress(!viewModel.addAddress());
	viewModel.installation().LocationAddressKey(null);
};
namespace("Crm.Service.ViewModels").InstallationCreateViewModel.prototype.onLocationContactSelect = function (contact) {
	var viewModel = this;
	var installation = viewModel.installation();
	viewModel.addAddress(false);
	installation.Company(contact);
};
namespace("Crm.Service.ViewModels").InstallationCreateViewModel.prototype.onLoadAddressEditor = function (addressEditor) {
	this.addressEditor = addressEditor;
	addressEditor.name = this.installation().Company().Name();
};