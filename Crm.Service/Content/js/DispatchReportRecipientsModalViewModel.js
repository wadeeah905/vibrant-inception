namespace("Crm.Service.ViewModels").DispatchReportRecipientsModalViewModel = function(parentViewModel) {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	viewModel.customRecipient = window.ko.observable(false);
	viewModel.email = window.ko.observable(null).extend({
		email: { params: true, message: window.Helper.String.getTranslatedString("RuleViolation.InvalidEmail") }
	});
	viewModel.customEmail = window.ko.observable(null).extend({
		email: { params: true, message: window.Helper.String.getTranslatedString("RuleViolation.InvalidEmail") }
	});
	viewModel.language = window.ko.observable(null);
	viewModel.locale = window.ko.observable(null);

	viewModel.dispatch = window.ko.observable(null);
	viewModel.company = window.ko.observable(null);
	viewModel.languages = window.ko.observableArray([]);
	viewModel.locales = window.ko.observableArray([]);
	viewModel.persons = window.ko.pureComputed(function() {
		return viewModel.company() ? viewModel.company().Staff() : [];
	});

	viewModel.selectableContacts = window.ko.pureComputed(function() {
		if (!viewModel.dispatch()) {
			return [];
		}
		var selectedEmails = viewModel.dispatch().ReportRecipients().reduce(function(map, item) { map[item.Email()] = true; return map; }, {});
		var personEmails = viewModel.getPersonsEmails();
		var companyEmails = viewModel.getCompanyEmails();
		var result = [];
		Object.keys(personEmails).sort().forEach(function(email) {
			if (selectedEmails[email]) {
				return;
			}
			result.push({
				Contact: personEmails[email].Contact,
				DisplayName: personEmails[email].DisplayName,
				Value: email
			});
		});
		Object.keys(companyEmails).sort().forEach(function(email) {
			if (selectedEmails[email]) {
				return;
			}
			result.push({
				Contact: companyEmails[email].Contact,
				DisplayName: companyEmails[email].DisplayName,
				Value: email
			});
		});
		var serviceLocationEmail = viewModel.dispatch().ServiceOrder().ServiceLocationEmail();
		if (serviceLocationEmail && !personEmails[serviceLocationEmail] && !companyEmails[serviceLocationEmail] && !selectedEmails[serviceLocationEmail]) {
			const serviceLocationResponsiblePerson = viewModel.dispatch().ServiceOrder().ServiceLocationResponsiblePerson();
			result.push({
				Contact: null,
				DisplayName: serviceLocationResponsiblePerson
					? `${serviceLocationResponsiblePerson} (${serviceLocationEmail})`
					: serviceLocationEmail,
				Value: serviceLocationEmail
			});
		}
		return result.sort((a,b) => (a.DisplayName > b.DisplayName) ? 1 : ((b.DisplayName > a.DisplayName) ? -1 : 0));
	});
	viewModel.selectableLocales = window.ko.observableArray([]);

	viewModel.errors = window.ko.validation.group(viewModel.dispatch, { deep: true });
	viewModel.refreshParentViewModel = function() {
		parentViewModel.init(viewModel.dispatch().Id());
	};
};
namespace("Crm.Service.ViewModels").DispatchReportRecipientsModalViewModel.prototype.init = function(id) {
	var viewModel = this;
	return window.database.CrmService_ServiceOrderDispatch
		.include("ReportRecipients")
		.include("ServiceOrder")
		.find(id)
		.then(function(dispatch) {
			dispatch.ReportRecipients.sort((a, b) => a.Email.localeCompare(b.Email));
			window.database.attachOrGet(dispatch);
			viewModel.dispatch(dispatch.asKoObservable());
		}).then(function() {
			return window.database.Main_Company
				.include2("Staff.filter(function(x) { return x.IsRetired === false })")
				.include("Staff.Emails")
				.include("Emails")
				.find(viewModel.dispatch().ServiceOrder().CustomerContactId())
				.then(function(company) {
					viewModel.company(company.asKoObservable());
				});
		}).then(function() {
			return window.Helper.Lookup.queryLookup("Main_Language", null, "it.IsSystemLanguage === true", {}).toArray();
		}).then(function(languages) {
			viewModel.languages(languages);
			return $.get(window.Helper.Url.resolveUrl("~/Resource/ListLocales?format=json"));
		}).then(function(locales) {
			viewModel.locales(locales);
			viewModel.email.subscribe(viewModel.onEmailSelect.bind(viewModel));
			viewModel.language.subscribe(viewModel.onLanguageSelect.bind(viewModel));
		});
};
namespace("Crm.Service.ViewModels").DispatchReportRecipientsModalViewModel.prototype.dispose = function() {
	var viewModel = this;
	window.database.detach(viewModel.dispatch().innerInstance);
	viewModel.dispatch().ReportRecipients().forEach(x => window.database.detach(x.innerInstance));
};
namespace("Crm.Service.ViewModels").DispatchReportRecipientsModalViewModel.prototype.addRecipient = function() {
	var viewModel = this;

	let recipientEmail = null;
	if (viewModel.email() && viewModel.email.isValid()) {
		recipientEmail = viewModel.email();
	}
	else if (viewModel.customEmail() && viewModel.customEmail.isValid()) {
		recipientEmail = viewModel.customEmail();
	}
	else {
		return;
	}

	var index = viewModel.dispatch().ReportRecipients
		.indexOf(window.ko.utils.arrayFirst(viewModel.dispatch().ReportRecipients(),
			function (item) { return item.Email() === recipientEmail && item.Language() === viewModel.language() && item.Locale() === viewModel.locale(); }));
	if (recipientEmail && index === -1) {
		var recipient = window.database.CrmService_ServiceOrderDispatchReportRecipient.CrmService_ServiceOrderDispatchReportRecipient.create();
		recipient.DispatchId = viewModel.dispatch().Id();
		recipient.Email = recipientEmail;
		recipient.Language = viewModel.language();
		recipient.Locale = viewModel.locale();
		window.database.add(recipient);
		viewModel.dispatch().ReportRecipients.push(recipient.asKoObservable());
		viewModel.dispatch().ReportRecipients.sort((a, b) => a.Email().localeCompare(b.Email()));
		viewModel.email(null);
		viewModel.customEmail(null);
		viewModel.language(null);
		viewModel.locale(null);
	}
};
namespace("Crm.Service.ViewModels").DispatchReportRecipientsModalViewModel.prototype.onEmailSelect = function(email) {
	var viewModel = this;
	viewModel.language(null);
	viewModel.locale(null);
	if (!email) {
		return;
	}
	var contact = viewModel.selectableContacts().find(x => x.Value === email);
	if (!contact || !contact.Contact) {
		return;
	}
	viewModel.language(contact.Contact.LanguageKey());
};
namespace("Crm.Service.ViewModels").DispatchReportRecipientsModalViewModel.prototype.onLanguageSelect = function(languageKey) {
	var viewModel = this;
	viewModel.locale(null);
	if (!languageKey) {
		viewModel.selectableLocales([]);
		return;
	}
	viewModel.selectableLocales(viewModel.locales().filter(x => x.startsWith(languageKey)));
	var language = viewModel.languages() && viewModel.languages().find(x => x.Key === languageKey);
	if (language) {
		if (language.DefaultLocale) {
			viewModel.locale(language.DefaultLocale);
		} else if (viewModel.selectableLocales().length > 0) {
			viewModel.locale(viewModel.selectableLocales()[0]);
		}
	}
};
namespace("Crm.Service.ViewModels").DispatchReportRecipientsModalViewModel.prototype.removeRecipient =
	function(recipient) {
		var viewModel = this;
		var index = viewModel.dispatch().ReportRecipients
			.indexOf(window.ko.utils.arrayFirst(viewModel.dispatch().ReportRecipients(),
				function(item) { return item === recipient; }));
		viewModel.dispatch().ReportRecipients.splice(index, 1);
		window.database.remove(recipient.innerInstance);
	};
namespace("Crm.Service.ViewModels").DispatchReportRecipientsModalViewModel.prototype.save = function() {
	var viewModel = this;
	viewModel.loading(true);

	if (viewModel.errors().length > 0) {
		viewModel.loading(false);
		viewModel.errors.showAllMessages();
		return;
	}

	window.database.saveChanges().then(function() {
		viewModel.loading(false);
		viewModel.refreshParentViewModel();
		$(".modal:visible").modal("hide");
	}).fail(function() {
		viewModel.loading(false);
		window.swal(window.Helper.String.getTranslatedString("UnknownError"),
			window.Helper.String.getTranslatedString("Error_InternalServerError"),
			"error");
	});
};
namespace("Crm.Service.ViewModels").DispatchReportRecipientsModalViewModel.prototype.getPersonsEmails = function() {
	return this.persons().reduce(function(emails, person) {
		var email = window.ko.unwrap((Helper.Address.getPrimaryCommunication(person.Emails) || {}).Data);
		if (email) {
			var name = window.Helper.Person.getDisplayName(person) + " (" + email + ")";
			if (!emails[email]) {
				emails[email] = { Contact: person, DisplayName: name };
			}
		}
		return emails;
	}, {});
};
namespace("Crm.Service.ViewModels").DispatchReportRecipientsModalViewModel.prototype.getCompanyEmails = function() {
	var company = this.company() || {};
	var emails = {};
	(window.ko.unwrap(company.Emails) || []).forEach(function(item) {
		var email = item.Data();
		var name = window.Helper.Company.getDisplayName(company) + " (" + email + ")";
		if (!emails[email]) {
			emails[email] = { Contact: company, DisplayName: name };
		}
	});
	return emails;
};
namespace("Crm.Service.ViewModels").DispatchReportRecipientsModalViewModel.prototype.toggleCustomRecipient = function () {
	var viewModel = this;
	viewModel.customRecipient(!viewModel.customRecipient());
	viewModel.email(null);
	viewModel.customEmail(null);
};