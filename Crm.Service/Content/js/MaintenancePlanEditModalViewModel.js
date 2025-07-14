namespace("Crm.Service.ViewModels").MaintenancePlanEditModalViewModel = function() {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	viewModel.maintenancePlan = window.ko.observable(null);
	viewModel.errors = window.ko.validation.group(viewModel.maintenancePlan, { deep: true });
	viewModel.maintenancePlanTimeUnits = window.ko.observableArray(_.compact(window.Crm.Service.Settings.ServiceContract.MaintenancePlan.AvailableTimeUnits.split(',')));
};
namespace("Crm.Service.ViewModels").MaintenancePlanEditModalViewModel.prototype.init = function(id, params) {
	var viewModel = this;
	return new $.Deferred().resolve().promise().then(function() {
		if (id) {
			return window.database.CrmService_MaintenancePlan
				.find(id)
				.then(function(maintenancePlan) {
					window.database.attachOrGet(maintenancePlan);
					return maintenancePlan;
				});
		}
		var newMaintenancePlan = window.database.CrmService_MaintenancePlan.CrmService_MaintenancePlan.create();
		newMaintenancePlan.ServiceContractId = params.serviceContractId;
		window.database.add(newMaintenancePlan);
		return newMaintenancePlan;
	}).then(function(maintenancePlan) {
		viewModel.maintenancePlan(maintenancePlan.asKoObservable());
	});
};
namespace("Crm.Service.ViewModels").MaintenancePlanEditModalViewModel.prototype.dispose = function() {
	var viewModel = this;
	window.database.detach(viewModel.maintenancePlan().innerInstance);
};
namespace("Crm.Service.ViewModels").MaintenancePlanEditModalViewModel.prototype.save = function() {
	var viewModel = this;
	viewModel.loading(true);

	if (viewModel.errors().length > 0) {
		viewModel.loading(false);
		viewModel.errors.showAllMessages();
		return;
	}

	return window.database.saveChanges()
		.then(function() {
			viewModel.loading(false);
			$(".modal:visible").modal("hide");
		}).fail(function() {
			viewModel.loading(false);
			window.swal(window.Helper.String.getTranslatedString("UnknownError"),
				window.Helper.String.getTranslatedString("Error_InternalServerError"),
				"error");
		});
};
namespace("Crm.Service.ViewModels").MaintenancePlanEditModalViewModel.prototype.RhythmUnitFilter = function (query) {
	var viewModel = this;
	return window.Helper.Lookup.queryLookup(query.filter("it.Key === null || it.Key in this.maintenancePlanTimeUnits",
		{ maintenancePlanTimeUnits: viewModel.maintenancePlanTimeUnits() }));
};