/// <reference path="../../../../Content/js/knockout.component.addressEditor.js" />

namespace("Crm.Service.ViewModels").ServiceObjectCreateViewModel = function () {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	viewModel.serviceObject = window.ko.observable(null);
	viewModel.visibilityViewModel = new window.VisibilityViewModel(viewModel.serviceObject, "ServiceObject");
	viewModel.errors = window.ko.validation.group(viewModel.serviceObject, { deep: true });
	viewModel.numberingSequenceName = "SMS.ServiceObject";
	viewModel.lookups = {
		phoneTypes: { $tableName: "Main_PhoneType" },
		faxTypes: { $tableName: "Main_FaxType" },
		emailTypes: { $tableName: "Main_EmailType" },
		websiteTypes: { $tableName: "Main_WebsiteType" },
		serviceObjectCategories: { $tableName: "CrmService_ServiceObjectCategory" }
	};
};

namespace("Crm.Service.ViewModels").ServiceObjectCreateViewModel.prototype.init = function () {
	var viewModel = this;
	return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups)
		.then(function () {
			var serviceObject = window.database.CrmService_ServiceObject.CrmService_ServiceObject.create();
			serviceObject.CategoryKey = window.Helper.Lookup.getDefaultLookupValueSingleSelect(viewModel.lookups.serviceObjectCategories, serviceObject.CategoryKey);
			var currentUserName = Helper.User.getCurrentUserName();
			serviceObject.ResponsibleUser = currentUserName;
			viewModel.serviceObject(serviceObject.asKoObservable());
			return viewModel.visibilityViewModel.init();
		}).then(function () {
			window.database.add(viewModel.serviceObject().innerInstance);
		});
};

namespace("Crm.Service.ViewModels").ServiceObjectCreateViewModel.prototype.cancel = function () {
	window.database.detach(this.serviceObject().innerInstance);
	window.history.back();
};
namespace("Crm.Service.ViewModels").ServiceObjectCreateViewModel.prototype.onLoadAddressEditor = function (addressEditor) {
	this.addressEditor = addressEditor;
	var setAddressDefaultValues = this.addressEditor.setAddressDefaultValues;
	this.addressEditor.setAddressDefaultValues = function (addressEntity) {
		addressEntity.IsCompanyStandardAddress = true;
		setAddressDefaultValues.apply(this, arguments);
	};
};
namespace("Crm.Service.ViewModels").ServiceObjectCreateViewModel.prototype.submit = function () {
	var viewModel = this;
	viewModel.loading(true);
	var deferred = viewModel.addressEditor.showValidationErrors();
	if (viewModel.errors().length > 0) {
		viewModel.loading(false);
		viewModel.errors.showAllMessages();
		viewModel.errors.scrollToError();
		return new $.Deferred().reject().promise();
	}
	return (deferred || new $.Deferred().resolve().promise())
		.then(function () {
			return window.NumberingService.createNewNumberBasedOnAppSettings(window.Crm.Service.Settings.ServiceObject.ObjectNoIsGenerated, window.Crm.Service.Settings.ServiceObject.ObjectNoIsCreateable, viewModel.serviceObject().ObjectNo(), viewModel.numberingSequenceName, window.database.CrmService_ServiceObject, "ObjectNo")
		})
		.then(function (objectNo) {
			if (objectNo !== undefined) {
				viewModel.serviceObject().ObjectNo(objectNo);
			}
			return window.database.saveChanges();
		}).then(function () {
			window.location.hash = "/Crm.Service/ServiceObject/DetailsTemplate/" + viewModel.serviceObject().Id();
		}).fail(function () {
			viewModel.loading(false);
		});
};