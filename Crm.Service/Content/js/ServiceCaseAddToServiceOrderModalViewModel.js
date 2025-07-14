namespace("Crm.Service.ViewModels").ServiceCaseAddToServiceOrderModalViewModel = function(parentViewModel) {
	var viewModel = this;
	viewModel.parentViewModel = parentViewModel;
	viewModel.loading = window.ko.observable(true);
	viewModel.arrayOrQueryable = window.ko.observable([]);
	viewModel.multipleServiceCasesSelected = window.ko.pureComputed(function() {
		return !Array.isArray(viewModel.arrayOrQueryable()) || viewModel.arrayOrQueryable().length > 1;
	});
	viewModel.jobPerServiceCase = window.ko.observable().extend({
		equal: {
			message: window.Helper.String.getTranslatedString("RuleViolation.Required")
				.replace("{0}", window.Helper.String.getTranslatedString("JobPerServiceCase")),
			onlyIf: function() {
				return viewModel.multipleServiceCasesSelected() && viewModel.multipleInstallationsSelected;
			},
			params: true
		}
	});
	viewModel.multipleServiceCasesSelected.subscribe(function(value) {
		viewModel.jobPerServiceCase(value);
	});
	viewModel.installationId = window.ko.observable(null);
	viewModel.serviceObjectId = window.ko.observable(null);
	viewModel.serviceOrderId = window.ko.observable(null).extend({
		required: {
			message: window.Helper.String.getTranslatedString("RuleViolation.Required")
				.replace("{0}", window.Helper.String.getTranslatedString("ServiceOrder")),
			params: true
		}
	});
	viewModel.serviceOrderTimeId = window.ko.observable(null);
	viewModel.showJobSelection = window.ko.pureComputed(function() {
		return !!viewModel.serviceOrderId() &&
			!viewModel.jobPerServiceCase() &&
			!viewModel.multipleInstallationsSelected;
	});
	viewModel.errors = window.ko.validation.group(viewModel);
};
namespace("Crm.Service.ViewModels").ServiceCaseAddToServiceOrderModalViewModel.prototype.init = function(id) {
	var viewModel = this;
	viewModel.jobPerServiceCase.subscribe(function() {
		viewModel.serviceOrderTimeId(null);
	});
	viewModel.serviceOrderId.subscribe(function() {
		viewModel.serviceOrderTimeId(null);
	});
	var init = (id ? window.database.CrmService_ServiceCase.find(id) : new $.Deferred().resolve(null).promise()).then(
		function(serviceCase) {
			if (serviceCase) {
				viewModel.arrayOrQueryable([serviceCase.asKoObservable()]);
				viewModel.installationId(serviceCase.AffectedInstallationKey);
				viewModel.multipleInstallationsSelected = false;
				viewModel.serviceObjectId(serviceCase.ServiceObjectId);
			} else {
				viewModel.arrayOrQueryable(viewModel.parentViewModel.allItemsSelected() === true
					? viewModel.parentViewModel.getFilterQuery(false, false)
					: viewModel.parentViewModel.selectedItems());
			}
		});
	if (id) {
		return init;
	}
	init = init.then(function() {
		return viewModel.parentViewModel.bulkSelectionHasMultipleSelectedValues("AffectedInstallationKey");
	}).then(function(multiple) {
		viewModel.multipleInstallationsSelected = multiple;
		if (window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode === "OrderPerInstallation" &&
			viewModel.multipleInstallationsSelected) {
			$(".modal:visible").modal("hide");
			window.swal(window.Helper.String.getTranslatedString("Error"),
				window.Helper.String.getTranslatedString(
					"CannotCreateServiceOrderForMultipleInstallationsInOrderPerInstallationMode"),
				"error");
		} else if (!multiple) {
			viewModel.installationId(viewModel.parentViewModel.selectedItems()[0].AffectedInstallationKey());
		}
		return viewModel.parentViewModel.bulkSelectionHasMultipleSelectedValues("ServiceObjectId");
	}).then(function(multiple) {
		if (!multiple) {
			viewModel.serviceObjectId(viewModel.parentViewModel.selectedItems()[0].ServiceObjectId());
		}
	});
	return init;
};
namespace("Crm.Service.ViewModels").ServiceCaseAddToServiceOrderModalViewModel.prototype.installationFilter =
	function (query, term) {
		var viewModel = this;
		if (term) {
			query = query.filter(function(it) {
					return it.InstallationNo.contains(this.term) === true ||
						it.Description.contains(this.term) === true;
				},
				{ term: term });
		}
		if (viewModel.serviceObjectId()) {
			query = query.filter(function(it) {
					return it.FolderId === this.serviceObjectId;
				},
				{ serviceObjectId: viewModel.serviceObjectId() });
		}
		return query;
	};
namespace("Crm.Service.ViewModels").ServiceCaseAddToServiceOrderModalViewModel.prototype.serviceObjectFilter =
	function(query, term) {
		if (term) {
			query = query.filter(function(it) {
					return it.ObjectNo.contains(this.term) === true || it.Name.contains(this.term) === true;
				},
				{ term: term });
		}
		return query;
	};
namespace("Crm.Service.ViewModels").ServiceCaseAddToServiceOrderModalViewModel.prototype.serviceOrderFilter =
	function(query, term) {
		var viewModel = this;
		if (term) {
			query = query.filter(function(it) {
					return it.OrderNo.contains(this.term) || it.ErrorMessage.contains(this.term);
				},
				{ term: term });
		}
		query = query.filter(function(it) {
				return it.StatusKey in this.statusKeys;
			},
			{ statusKeys: viewModel.serviceOrderStatusKeys });
		if (window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode === "OrderPerInstallation") {
			query = query.filter(function(it) {
					return it.InstallationId === this.installationId;
				},
				{ installationId: viewModel.installationId() });
		} else if (viewModel.installationId()) {
			if (window.database.storageProvider.name === "webSql") {
				query = query.filter(function (it) {
					return it.ServiceOrderTimes.InstallationId === this.installationId;
				},
				{ installationId: viewModel.installationId() });
			} else {
				query = query.filter(function(it) {
					return it.ServiceOrderTimes.some(function(it2) {
						return it2.InstallationId === this.installationId;
					});
				},
				{ installationId: viewModel.installationId() });
			}
		}
		if (viewModel.serviceObjectId()) {
			query = query.filter(function(it) {
					return it.ServiceObjectId === this.serviceObjectId;
				},
				{ serviceObjectId: viewModel.serviceObjectId() });
		}
		return query;
	};
namespace("Crm.Service.ViewModels").ServiceCaseAddToServiceOrderModalViewModel.prototype.serviceOrderStatusKeys = [
	"New", "ReadyForScheduling", "Scheduled", "PartiallyReleased", "Released", "InProgress", "PartiallyCompleted"
];
namespace("Crm.Service.ViewModels").ServiceCaseAddToServiceOrderModalViewModel.prototype.serviceOrderTimeFilter =
	function(query, term) {
		var viewModel = this;
		if (term) {
			query = query.filter(function(it) {
					return it.PosNo.contains(this.term) ||
						it.ItemNo.contains(this.term) ||
						it.Description.contains(this.term);
				},
				{ term: term });
		}
		if (viewModel.installationId() &&
			window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode === "JobPerInstallation") {
			query = query.filter(function(it) {
					return it.InstallationId === this.installationId;
				},
				{ installationId: viewModel.installationId() });
		}
		query = query.filter(function(it) {
				return it.OrderId === this.serviceOrderId;
			},
			{ serviceOrderId: viewModel.serviceOrderId() });
		return query;
	};
namespace("Crm.Service.ViewModels").ServiceCaseAddToServiceOrderModalViewModel.prototype.submit = function() {
	var viewModel = this;
	if (viewModel.errors().length > 0) {
		viewModel.errors.showAllMessages();
		return;
	}
	viewModel.errors.showAllMessages(false);
	viewModel.loading(true);
	var serviceOrderTimeId = viewModel.serviceOrderTimeId();
	return new $.Deferred().resolve().promise().then(function() {
		if (viewModel.jobPerServiceCase() === false && !viewModel.serviceOrderTimeId()) {
			var newServiceOrderTime = window.database.CrmService_ServiceOrderTime.CrmService_ServiceOrderTime.create();
			if (!viewModel.multipleInstallationsSelected &&
				window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode === "JobPerInstallation") {
				newServiceOrderTime.InstallationId = viewModel.installationId();
			}
			newServiceOrderTime.OrderId = viewModel.serviceOrderId();
			return window.Helper.ServiceOrder.updatePosNo(newServiceOrderTime).then(function() {
				window.database.add(newServiceOrderTime);
				serviceOrderTimeId = newServiceOrderTime.Id;
			});
		} else {
			return window.Helper.ServiceOrder.getMaxPosNo(viewModel.serviceOrderId());
		}
	}).then(function(maxPosNo) {
		if (Array.isArray(viewModel.arrayOrQueryable())) {
			return window.Helper.ServiceCase.addServiceCasesToServiceOrder(viewModel.arrayOrQueryable(),
				viewModel.serviceOrderId(),
				serviceOrderTimeId,
				maxPosNo);
		} else if (viewModel.arrayOrQueryable() instanceof window.$data.Queryable) {
			var pageSize = 25;
			var page = 0;
			var d = new $.Deferred();
			var processNextPage = function() {
				viewModel.arrayOrQueryable()
					.orderBy(function(x) { return x.Id; })
					.skip(page * pageSize)
					.take(pageSize)
					.toArray()
					.then(function(serviceCases) {
						window.Helper.ServiceCase.addServiceCasesToServiceOrder(serviceCases,
							viewModel.serviceOrderId(),
							serviceOrderTimeId,
							maxPosNo
						).then(function(results) {
							if (serviceCases.length === pageSize) {
								page++;
								maxPosNo = results.map(function(x) {
									return x.PosNo;
								}).sort().pop();
								processNextPage();
							} else {
								d.resolve();
							}
						}).fail(d.reject);
					});
			};
			processNextPage();
			return d.promise();
		} else {
			throw "arrayOrQueryable is neither array nor queryable";
		}
	}).then(function() {
		$(".modal:visible").modal("hide");
		window.location.hash = "/Crm.Service/ServiceOrder/DetailsTemplate/" + viewModel.serviceOrderId();
	});
};