namespace("Crm.Service.ViewModels").ServiceContractDetailsMaintenancePlansTabViewModel = function(parentViewModel) {
	var viewModel = this;
	var joinServiceOrders = {
		Selector: "ServiceOrders",
		Operation: "filter(function(it2) { return it2.StatusKey in ['New', 'ReadyForScheduling', 'Scheduled', 'PartiallyReleased', 'Released', 'InProgress', 'PartiallyCompleted', 'Completed']; })"
	};
	window.Main.ViewModels.GenericListViewModel.call(viewModel,
		"CrmService_MaintenancePlan",
		["Name", "NextDate"],
		["ASC", "ASC"],
		[joinServiceOrders]);
	viewModel.getFilter("ServiceContractId").extend({ filterOperator: "===" })(parentViewModel.serviceContract().Id());
	viewModel.lookups = {
		timeUnits: { $tableName: "Main_TimeUnit" }
	};
};
namespace("Crm.Service.ViewModels").ServiceContractDetailsMaintenancePlansTabViewModel.prototype =
	Object.create(window.Main.ViewModels.GenericListViewModel.prototype);
namespace("Crm.Service.ViewModels").ServiceContractDetailsMaintenancePlansTabViewModel.prototype.initItems = function (items) {
	var queries = [];
	items.forEach(function(item) {
		if (item.ServiceOrderTemplateId()) {
			queries.push({
				queryable: window.database.CrmService_ServiceOrderHead
					.filter("it.Id == this.id", { id: item.ServiceOrderTemplateId() }),
				method: "toArray",
				handler:
					function(serviceOrder) {
						item.ServiceOrderTemplate(serviceOrder[0].asKoObservable());
					}
			});
		}
	});

	var deferred = queries.length > 0 ? Helper.Batch.Execute(queries) : new $.Deferred().resolve().promise();

	return deferred
		.then(function () {
			return items;
		});
};
namespace("Crm.Service.ViewModels").ServiceContractDetailsMaintenancePlansTabViewModel.prototype.canGenerateServiceOrderForMaintenancePlan = function (maintenancePlan) {
	var viewModel = this;
	return maintenancePlan.AllowPrematureMaintenance() &&
		window.AuthorizationManager.isAuthorizedForAction("ServiceContract", "Edit") &&
		viewModel.parentViewModel.serviceContract().StatusKey() === "Active";
};
namespace("Crm.Service.ViewModels").ServiceContractDetailsMaintenancePlansTabViewModel.prototype.generateServiceOrderForMaintenancePlan = function (maintenancePlan) {
	var viewModel = this;
	viewModel.loading(true);
	$.get(window.Helper.resolveUrl("~/Crm.Service/ServiceContract/GenerateOrderFromMaintenancePlan?maintenancePlanId=" +
		maintenancePlan.Id())).then(function() {
		viewModel.filter();
	}).fail(function() {
		viewModel.loading(false);
		window.swal(window.Helper.String.getTranslatedString("UnknownError"),
			window.Helper.String.getTranslatedString("Error_InternalServerError"),
			"error");
	});
};
namespace("Crm.Service.ViewModels").ServiceContractDetailsMaintenancePlansTabViewModel.prototype.init = function() {
	var args = arguments;
	var viewModel = this;
	return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups)
		.then(function() {
			return window.Main.ViewModels.GenericListViewModel.prototype.init.apply(viewModel, args);
		});
};
namespace("Crm.Service.ViewModels").ServiceContractDetailsMaintenancePlansTabViewModel.prototype.remove =
	function(maintenancePlan) {
		var viewModel = this;
		window.Helper.Confirm.confirmDelete().then(function() {
			viewModel.loading(true);
			window.database.remove(maintenancePlan.innerInstance);
			return window.database.saveChanges();
		});
	};
namespace("Crm.Service.ViewModels").ServiceContractDetailsMaintenancePlansTabViewModel.prototype.getNextGenerationDates = function (maintenancePlan) {
	window.swal("", Helper.ServiceContract.getNextXGenerationDates(maintenancePlan, 5).join("\n"), "info");
};