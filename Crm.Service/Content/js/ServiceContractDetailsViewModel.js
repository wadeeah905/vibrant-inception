namespace("Crm.Service.ViewModels").ServiceContractDetailsViewModel = function () {
	var viewModel = this;
	viewModel.tabs = window.ko.observable({});
	viewModel.loading = window.ko.observable(true);
	viewModel.serviceContract = window.ko.observable(null);
	window.Main.ViewModels.ContactDetailsViewModel.apply(this, arguments);
	viewModel.contactType("ServiceContract");
	viewModel.lookups = {
		countries: { $tableName: "Main_Country" },
		currencies: { $tableName: "Main_Currency" },
		paymentConditions: { $tableName: "Main_PaymentCondition" },
		paymentIntervals: { $tableName: "Main_PaymentInterval" },
		paymentTypes: { $tableName: "Main_PaymentType" },
		regions: { $tableName: "Main_Region" },
		serviceContractStatuses: { $tableName: "CrmService_ServiceContractStatus" },
		serviceContractTypes: { $tableName: "CrmService_ServiceContractType" },
		sparePartsBudgetInvoiceTypes: { $tableName: "CrmService_SparePartsBudgetInvoiceType" },
		sparePartsBudgetTimeSpanUnits: { $tableName: "CrmService_SparePartsBudgetTimeSpanUnit" },
		timeUnits: { $tableName: "Main_TimeUnit" }
	};
	viewModel.settableStatuses = window.ko.pureComputed(function () {
		var currentStatus = viewModel.lookups.serviceContractStatuses.$array.find(function (x) {
			return x.Key === viewModel.serviceContract().StatusKey();
		});
		var settableStatusKeys = currentStatus
			? (currentStatus.SettableStatuses || "").split(",")
			: [];
		return viewModel.lookups.serviceContractStatuses.$array.filter(function (x) {
			return x === currentStatus || settableStatusKeys.indexOf(x.Key) !== -1;
		});
	});
	viewModel.canSetStatus = window.ko.pureComputed(function () {
		return viewModel.settableStatuses().length > 1 &&
			window.AuthorizationManager.isAuthorizedForAction("ServiceContract", "SetStatus");
	});
	viewModel.reactionTimeUnits = window.ko.observableArray(_.compact(window.Crm.Service.Settings.ServiceContract.ReactionTime.AvailableTimeUnits.split(',')));
	viewModel.dropboxName = window.ko.pureComputed(function () {
		return viewModel.serviceContract().ContractNo() + "-" + viewModel.serviceContract().ParentCompany().Name().substring(0,25);
	})
};
namespace("Crm.Service.ViewModels").ServiceContractDetailsViewModel.prototype = Object.create(window.Main.ViewModels.ContactDetailsViewModel.prototype);
namespace("Crm.Service.ViewModels").ServiceContractDetailsViewModel.prototype.init = function (id) {
	var viewModel = this;
	viewModel.contactId(id);
	return window.Main.ViewModels.ContactDetailsViewModel.prototype.init.apply(this, arguments)
		.then(function () {
			return window.database.CrmService_ServiceContract
				.include("InvoiceRecipient")
				.include("InvoiceAddress")
				.include("ParentCompany")
				.include("Payer")
				.include("PayerAddress")
				.include("ResponsibleUserUser")
				.include("ServiceObject")
				.include2("Tags.orderBy(function(t) { return t.Name; })")
				.find(id);
		})
		.then(function (serviceContract) {
			viewModel.serviceContract(serviceContract.asKoObservable());
			viewModel.contact(viewModel.serviceContract());
			viewModel.contactName(viewModel.serviceContract().Name());
			return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups);
		})
		.then(function() { return viewModel.setVisibilityAlertText(); })
		.then(()=>viewModel.setBreadcrumbs(id));
};
namespace("Crm.Service.ViewModels").ServiceContractDetailsViewModel.prototype.RhythmUnitFilter = function (query) {
	var viewModel = this;
	return window.Helper.Lookup.queryLookup(query.filter("it.Key === null || it.Key in this.reactionTimeUnits",
		{ reactionTimeUnits: viewModel.reactionTimeUnits() }));
};
namespace("Crm.Service.ViewModels").ServiceContractDetailsViewModel.prototype.invoiceAddressFilter =
	window.Crm.Service.ViewModels.ServiceContractCreateViewModel.prototype.invoiceAddressFilter;
namespace("Crm.Service.ViewModels").ServiceContractDetailsViewModel.prototype.onSelectInvoiceRecipient =
	window.Crm.Service.ViewModels.ServiceContractCreateViewModel.prototype.onSelectInvoiceRecipient;
namespace("Crm.Service.ViewModels").ServiceContractDetailsViewModel.prototype.onSelectPayer =
	window.Crm.Service.ViewModels.ServiceContractCreateViewModel.prototype.onSelectPayer;
namespace("Crm.Service.ViewModels").ServiceContractDetailsViewModel.prototype.payerAddressFilter =
	window.Crm.Service.ViewModels.ServiceContractCreateViewModel.prototype.payerAddressFilter;
namespace("Crm.Service.ViewModels").ServiceContractDetailsViewModel.prototype.setStatus = function (status) {
	var viewModel = this;
	viewModel.loading(true);
	window.database.attachOrGet(viewModel.serviceContract().innerInstance);
	viewModel.serviceContract().StatusKey(status.Key);
	window.database.saveChanges().then(function () {
		viewModel.loading(false);
	});
};

namespace("Crm.Service.ViewModels").ServiceContractDetailsViewModel.prototype.setBreadcrumbs = function (id) {
	var viewModel = this;
	window.breadcrumbsViewModel.setBreadcrumbs([
		new Breadcrumb(Helper.String.getTranslatedString("ServiceContract"), "#/Crm.Service/ServiceContractList/IndexTemplate"),
		new Breadcrumb(viewModel.serviceContract().ContractNo(), window.location.hash, null, id)
	]);
};
