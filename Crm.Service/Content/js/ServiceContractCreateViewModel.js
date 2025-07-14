namespace("Crm.Service.ViewModels").ServiceContractCreateViewModel = function() {
	var viewModel = this;
	viewModel.numberingSequenceName = "SMS.ServiceContract";
	viewModel.loading = window.ko.observable(true);
	viewModel.serviceContract = window.ko.observable(null);
	viewModel.visibilityViewModel = new window.VisibilityViewModel(viewModel.serviceContract, "ServiceContract");
	viewModel.errors = window.ko.validation.group(viewModel.serviceContract, { deep: true });
	viewModel.lookups = {
		currencies: { $tableName: "Main_Currency" },
		paymentConditions: { $tableName: "Main_PaymentCondition" },
		paymentIntervals: { $tableName: "Main_PaymentInterval" },
		paymentTypes: { $tableName: "Main_PaymentType" },
		serviceContractStatuses: { $tableName: "CrmService_ServiceContractStatus" },
		serviceContractTypes: { $tableName: "CrmService_ServiceContractType" }
	}
};
namespace("Crm.Service.ViewModels").ServiceContractCreateViewModel.prototype.init = function (id, params) {
	var viewModel = this;
	return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups).then(function () {
		var serviceContract = window.database.CrmService_ServiceContract.CrmService_ServiceContract.create();
		serviceContract.ContractTypeKey = window.Helper.Lookup.getDefaultLookupValueSingleSelect(viewModel.lookups.serviceContractTypes, serviceContract.ContractTypeKey);
		serviceContract.CurrencyKey = window.Helper.Lookup.getDefaultLookupValueSingleSelect(viewModel.lookups.currencies, serviceContract.CurrencyKey);
		serviceContract.PaymentConditionKey = window.Helper.Lookup.getDefaultLookupValueSingleSelect(viewModel.lookups.paymentConditions, serviceContract.PaymentConditionKey);
		serviceContract.PaymentIntervalKey = window.Helper.Lookup.getDefaultLookupValueSingleSelect(viewModel.lookups.paymentIntervals, serviceContract.PaymentIntervalKey);
		serviceContract.PaymentTypeKey = window.Helper.Lookup.getDefaultLookupValueSingleSelect(viewModel.lookups.paymentTypes, serviceContract.PaymentTypeKey);
		var currentUserName = document.getElementById("meta.CurrentUser").content;
		serviceContract.ResponsibleUser = currentUserName;
		serviceContract.StatusKey = window.Helper.Lookup.getDefaultLookupValueSingleSelect(viewModel.lookups.serviceContractStatuses, serviceContract.StatusKey);
		if (params && params.parentId) {
			serviceContract.ParentId = params.parentId;
		}
		viewModel.serviceContract(serviceContract.asKoObservable());
		return viewModel.visibilityViewModel.init();
	}).then(function () {
		window.database.add(viewModel.serviceContract().innerInstance);
	});
};
namespace("Crm.Service.ViewModels").ServiceContractCreateViewModel.prototype.cancel = function() {
	window.database.detach(this.serviceContract().innerInstance);
	window.history.back();
};
namespace("Crm.Service.ViewModels").ServiceContractCreateViewModel.prototype.invoiceAddressFilter = function(query) {
	var serviceContract = this;
	return query.filter(function(it) {
			return this.invoiceRecipientId !== null && it.CompanyId === this.invoiceRecipientId;
		},
		{ invoiceRecipientId: serviceContract.InvoiceRecipientId });
};
namespace("Crm.Service.ViewModels").ServiceContractCreateViewModel.prototype.onSelectInvoiceRecipient = function(value) {
	var serviceContract = this;
	if (value) {
		serviceContract.InvoiceRecipient(value.asKoObservable());
		if (serviceContract.InvoiceAddress() && serviceContract.InvoiceAddress().CompanyId() !== value.Id) {
			serviceContract.InvoiceAddress(null);
			serviceContract.InvoiceAddressKey(null);
		}
	} else {
		serviceContract.InvoiceRecipient(null);
		serviceContract.InvoiceAddress(null);
		serviceContract.InvoiceAddressKey(null);
	}
};
namespace("Crm.Service.ViewModels").ServiceContractCreateViewModel.prototype.onSelectPayer = function(value) {
	var serviceContract = this;
	if (value) {
		serviceContract.Payer(value.asKoObservable());
		if (serviceContract.PayerAddress() && serviceContract.PayerAddress().CompanyId() !== value.Id) {
			serviceContract.PayerAddress(null);
			serviceContract.PayerAddressId(null);
		}
	} else {
		serviceContract.Payer(null);
		serviceContract.PayerAddress(null);
		serviceContract.PayerAddressId(null);
	}
};
namespace("Crm.Service.ViewModels").ServiceContractCreateViewModel.prototype.payerAddressFilter = function(query) {
	var serviceContract = this;
	return query.filter(function(it) {
			return this.payerId !== null && it.CompanyId === this.payerId;
		},
		{ payerId: serviceContract.PayerId });
};
namespace("Crm.Service.ViewModels").ServiceContractCreateViewModel.prototype.submit = function() {
	var viewModel = this;
	viewModel.loading(true);

	return window.NumberingService.createNewNumberBasedOnAppSettings(window.Crm.Service.Settings.ServiceContract.ServiceContractNoIsGenerated, window.Crm.Service.Settings.ServiceContract.ServiceContractNoIsCreateable, viewModel.serviceContract().Name(), viewModel.numberingSequenceName, window.database.CrmService_ServiceContract, "ContractNo")
	.then(function (contractNo) {
		if (contractNo !== undefined) {
			viewModel.serviceContract().ContractNo(contractNo);
			viewModel.serviceContract().Name(contractNo);
		} else {
			viewModel.serviceContract().ContractNo(viewModel.serviceContract().Name())
		}
		if (viewModel.errors().length > 0) {
			viewModel.loading(false);
			viewModel.errors.showAllMessages();
			viewModel.errors.scrollToError();
			return;
		}
		return window.database.saveChanges().then(function() {
			window.location.hash = "/Crm.Service/ServiceContract/DetailsTemplate/" + viewModel.serviceContract().Id();
		});
	});
};