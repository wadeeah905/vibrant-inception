/// <reference path="serviceordercreateviewmodel.js" />
namespace("Crm.Service.ViewModels").DispatchAdHocViewModel = function () {
	window.Crm.Service.ViewModels.ServiceOrderCreateViewModel.apply(this, arguments);
	var viewModel = this;
	viewModel.dispatch = window.ko.observable(null);
	viewModel.errors = window.ko.validation.group([viewModel.dispatch, viewModel.serviceOrder], { deep: true });
	viewModel.lookups = {
		...viewModel.lookups,
		causeOfFailures: { $tableName: "CrmService_CauseOfFailure" },
		components: { $tableName: "CrmService_Component" },
		errorCodes: { $tableName: "CrmService_ErrorCode" },
	};
};
namespace("Crm.Service.ViewModels").DispatchAdHocViewModel.prototype =
	Object.create(window.Crm.Service.ViewModels.ServiceOrderCreateViewModel.prototype);
namespace("Crm.Service.ViewModels").DispatchAdHocViewModel.prototype.init = function () {
	var viewModel = this;
	var args = arguments;
	return window.Crm.Service.ViewModels.ServiceOrderCreateViewModel.prototype.init.apply(viewModel, args)
		.then(function () {
			var dispatch = window.database.CrmService_ServiceOrderDispatch.CrmService_ServiceOrderDispatch.create();
			dispatch.CauseOfFailureKey = window.Helper.Lookup.getDefaultLookupValueSingleSelect(viewModel.lookups.causeOfFailures, dispatch.CauseOfFailureKey);
			dispatch.ComponentKey = window.Helper.Lookup.getDefaultLookupValueSingleSelect(viewModel.lookups.components, dispatch.ComponentKey);
			dispatch.Date = window.moment().startOf('day').utc(true).toDate();
			dispatch.Duration = window.moment.duration(window.Crm.Service.Settings.ServiceOrder.DefaultDuration).toISOString();
			dispatch.ErrorCodeKey = window.Helper.Lookup.getDefaultLookupValueSingleSelect(viewModel.lookups.errorCodes, dispatch.ErrorCodeKey);
			dispatch.StatusKey = "Released";
			dispatch.Time = window.moment().startOf('minute');
			dispatch.Time.setUTCMinutes(Math.ceil(dispatch.Time.getUTCMinutes() / 5) * 5);
			dispatch.OrderId = viewModel.serviceOrder().Id();
			dispatch.Username = viewModel.currentUser().Id;
			window.database.add(dispatch);
			viewModel.dispatch(dispatch.asKoObservable());
		});
};
namespace("Crm.Service.ViewModels").DispatchAdHocViewModel.prototype.showExtendedInformation = function () {
	var viewModel = this;
	return viewModel.lookups.errorCodes.$array.length > 0 ||
		viewModel.lookups.components.$array.length > 0 ||
		viewModel.lookups.causeOfFailures.$array.length > 0;
};
namespace("Crm.Service.ViewModels").DispatchAdHocViewModel.prototype.submit = function () {
	var viewModel = this;
	viewModel.loading(true);

	if (viewModel.errors().length > 0) {
		viewModel.loading(false);
		viewModel.errors.showAllMessages();
		viewModel.errors.scrollToError();
		return;
	}

	return window.NumberingService.createNewNumberBasedOnAppSettings(window.Crm.Service.Settings.Dispatch.DispatchNoIsGenerated, window.Crm.Service.Settings.Dispatch.DispatchNoIsCreateable, viewModel.dispatch().DispatchNo(), "SMS.ServiceOrderDispatch", window.database.CrmService_ServiceOrderDispatch, "DispatchNo")
	.then(function (dispatchNo) {
		if (dispatchNo !== undefined) {
			viewModel.dispatch().DispatchNo(dispatchNo)
		}

		var dateTime = new Date(viewModel.dispatch().Date().getUTCFullYear(),
			viewModel.dispatch().Date().getUTCMonth(),
			viewModel.dispatch().Date().getUTCDate(),
			viewModel.dispatch().Time().getHours(),
			viewModel.dispatch().Time().getMinutes());
		viewModel.dispatch().Time(dateTime);
		viewModel.dispatch().StartTime(dateTime);

		viewModel.serviceOrder().StatusKey("Released");
		var updateOrderNo = new $.Deferred().resolve().promise();
		if (!viewModel.serviceOrder().OrderNo()) {
			viewModel.dispatch().OrderId(viewModel.serviceOrder().Id());
			var adHocSequenceName = window.Crm.Service.Settings.AdHoc.AdHocNumberingSequenceName;
			updateOrderNo = window.NumberingService.getNextFormattedNumber(adHocSequenceName).then(
				function (serviceOrderNo) {
					viewModel.serviceOrder().OrderNo(serviceOrderNo);
				});
		}
		return updateOrderNo
	})
		.then(function () {
			return new window.Helper.ServiceOrder.CreateServiceOrderData(viewModel.serviceOrder(),
				viewModel.serviceOrder().ServiceOrderTemplate(),
				viewModel.installationIds()).create();
		}).then(function () {
			return window.database.saveChanges();
		}).then(function () {
			window.location.hash = "/Crm.Service/Dispatch/DetailsTemplate/" + viewModel.dispatch().Id();
		});
};