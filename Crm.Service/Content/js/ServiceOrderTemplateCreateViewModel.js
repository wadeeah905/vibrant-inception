namespace("Crm.Service.ViewModels").ServiceOrderTemplateCreateViewModel = function() {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	viewModel.currentUser = window.ko.observable(null);
	viewModel.numberingSequenceName = "SMS.ServiceOrderTemplate";
	viewModel.serviceOrderTemplate = window.ko.observable(null);
	viewModel.errors = window.ko.validation.group([viewModel.serviceOrderTemplate]);
	viewModel.lookups = {
		serviceOrderTypes: { $tableName: "CrmService_ServiceOrderType" }
	}
};
namespace("Crm.Service.ViewModels").ServiceOrderTemplateCreateViewModel.prototype.cancel = function() {
	window.history.back();
};
namespace("Crm.Service.ViewModels").ServiceOrderTemplateCreateViewModel.prototype.init = function() {
	var viewModel = this;
	return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups).then(function() {
		return window.Helper.User.getCurrentUser();
	}).then(function(currentUser) {
		viewModel.currentUser(currentUser);
		var serviceOrderTemplate = window.database.CrmService_ServiceOrderHead.CrmService_ServiceOrderHead.create();
		serviceOrderTemplate.IsTemplate = true;
		serviceOrderTemplate.StationKey = currentUser.StationIds.length === 1 ? currentUser.StationIds[0] : null;
		serviceOrderTemplate.ResponsibleUser = currentUser.Id;
		serviceOrderTemplate.StatusKey = "New";
		serviceOrderTemplate.TypeKey = window.Helper.Lookup.getDefaultLookupValueSingleSelect(viewModel.lookups.serviceOrderTypes, serviceOrderTemplate.TypeKey);
		window.database.add(serviceOrderTemplate);
		viewModel.serviceOrderTemplate(serviceOrderTemplate.asKoObservable());
		viewModel.serviceOrderTemplate().UserGroupKey.subscribe(function () {
			if (viewModel.serviceOrderTemplate().UserGroupKey() === null)
				viewModel.serviceOrderTemplate().ResponsibleUser(viewModel.currentUser().Id)
			else
				viewModel.serviceOrderTemplate().ResponsibleUser(null);
		});
	});
};
namespace("Crm.Service.ViewModels").ServiceOrderTemplateCreateViewModel.prototype.submit = function() {
	var viewModel = this;
	viewModel.loading(true);

	if (viewModel.errors().length > 0) {
		viewModel.loading(false);
		viewModel.errors.showAllMessages();
		viewModel.errors.scrollToError();
		return;
	}
	var updateOrderNo = new $.Deferred().resolve().promise();
	if (!viewModel.serviceOrderTemplate().OrderNo()) {
		updateOrderNo = window.NumberingService.getNextFormattedNumber(viewModel.numberingSequenceName)
			.then(function(orderNo) {
				viewModel.serviceOrderTemplate().OrderNo(orderNo);
			});
	}
	updateOrderNo.then(function () {
		return window.database.saveChanges();
	}).then(function() {
		window.location.hash = "/Crm.Service/ServiceOrderTemplate/Details/" + viewModel.serviceOrderTemplate().Id();
	});
};