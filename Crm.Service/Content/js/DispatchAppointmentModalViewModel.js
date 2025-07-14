namespace("Crm.Service.ViewModels").DispatchAppointmentModalViewModel = function() {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	viewModel.dispatch = window.ko.observable(null);
	viewModel.currentUser = window.ko.observable(null);
	viewModel.lookups = {
		countries: { $tableName: "Main_Country" }
	}
	viewModel.currentUserDropboxAddress = window.ko.pureComputed(function() {
		return viewModel.currentUser() && viewModel.currentUser().DropboxToken && window.Main.Settings.DropboxDomain
			? "?BCC=" + viewModel.currentUser().DropboxToken + "@" + window.Main.Settings.DropboxDomain + "&"
			: "?";
	});

	viewModel.contactPersons = window.ko.pureComputed(function() {
		var contactPersons = [];
		var serviceOrder = viewModel.dispatch().ServiceOrder();
		if (serviceOrder.ServiceLocationEmail() ||
			serviceOrder.ServiceLocationFax() ||
			serviceOrder.ServiceLocationMobile() ||
			serviceOrder.ServiceLocationPhone()) {
			contactPersons.push({
				Avatar: serviceOrder.ServiceLocationResponsiblePerson() ? window.Helper.Person.getInitials(serviceOrder.ServiceLocationResponsiblePerson()) : null,
				Name: serviceOrder.ServiceLocationResponsiblePerson(),
				Type: window.Helper.String.getTranslatedString("ServiceLocationResponsibleContact"),
				Email: serviceOrder.ServiceLocationEmail(),
				Fax: serviceOrder.ServiceLocationFax(),
				Mobile: serviceOrder.ServiceLocationMobile(),
				Phone: serviceOrder.ServiceLocationPhone()
			});
		}
		if (serviceOrder.InitiatorPerson()) {
			contactPersons.push({
				Avatar: window.Helper.Person.getInitials(serviceOrder.InitiatorPerson()),
				Name: window.Helper.Person.getDisplayName(serviceOrder.InitiatorPerson()),
				Type: window.Helper.String.getTranslatedString("Initiator"),
				Email: viewModel.getPrimaryEmail(serviceOrder.InitiatorPerson().Emails()),
				Mobile: null,
				Fax: viewModel.getPrimaryPhone(serviceOrder.InitiatorPerson().Faxes()),
				Phone: viewModel.getPrimaryPhone(serviceOrder.InitiatorPerson().Phones())
			});
		}
		if (serviceOrder.Installation() && serviceOrder.Installation().Person()) {
			contactPersons.push({
				Avatar: window.Helper.Person.getInitials(serviceOrder.Installation().Person()),
				Name: window.Helper.Person.getDisplayName(serviceOrder.Installation().Person()),
				Type: window.Helper.String.getTranslatedString("Installation"),
				Email: viewModel.getPrimaryEmail(serviceOrder.Installation().Person().Emails()),
				Fax: viewModel.getPrimaryPhone(serviceOrder.Installation().Person().Faxes()),
				Mobile: null,
				Phone: viewModel.getPrimaryPhone(serviceOrder.Installation().Person().Phones())
			});
		}
		return contactPersons;
	});
	viewModel.subject = window.ko.pureComputed(function() {
		if (viewModel.action === "request") {
			return window.Helper.String.getTranslatedString("AppointmentRequest");
		}
		if (viewModel.action === "confirm") {
			return window.Helper.String.getTranslatedString("AppointmentConfirmation");
		}
		return null;
	});
};
namespace("Crm.Service.ViewModels").DispatchAppointmentModalViewModel.prototype.getPrimaryEmail = function(emails) {
	if (emails.length === 0) {
		return null;
	}
	return window.Helper.Address.getPrimaryCommunication(emails).Data();
};
namespace("Crm.Service.ViewModels").DispatchAppointmentModalViewModel.prototype.getPrimaryPhone = function(phones) {
	var phone = window.Helper.Address.getPrimaryCommunication(phones);
	return window.Helper.Address.getPhoneNumberAsString(phone, true, this.lookups.countries);
};
namespace("Crm.Service.ViewModels").DispatchAppointmentModalViewModel.prototype.init = function(id, params) {
	var viewModel = this;
	viewModel.action = params.action;
	return Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups)
		.then(function() {
		return window.database.CrmService_ServiceOrderDispatch
			.include("ServiceOrder")
			.include("ServiceOrder.Installation.Person.Emails")
			.include("ServiceOrder.Installation.Person.Faxes")
			.include("ServiceOrder.Installation.Person.Phones")
			.include("ServiceOrder.InitiatorPerson.Emails")
			.include("ServiceOrder.InitiatorPerson.Faxes")
			.include("ServiceOrder.InitiatorPerson.Phones")
			.find(id);
	}).then(function(dispatch) {
		viewModel.dispatch(dispatch.asKoObservable());
		return window.Helper.User.getCurrentUser();
	}).then(function(currentUser) {
		viewModel.currentUser(currentUser);
	});
};