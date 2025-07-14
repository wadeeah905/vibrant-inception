namespace("Crm.Service.ViewModels").ServiceOrderDetailsJobsTabViewModel = function(parentViewModel) {
	window.Main.ViewModels.ViewModelBase.apply(this, arguments);
	var viewModel = this;
	viewModel.lookups = parentViewModel.lookups;
	viewModel.lookups.serviceCaseStatuses = viewModel.lookups.serviceCaseStatuses ||
		{ $tableName: "CrmService_ServiceCaseStatus" };
	viewModel.lookups.serviceOrderTimeStatuses = viewModel.lookups.serviceOrderTimeStatuses ||
		{ $tableName: "CrmService_ServiceOrderTimeStatus" };
	viewModel.lookups.currencies = viewModel.lookups.currencies || { $tableName: "Main_Currency" };
	viewModel.serviceOrder = parentViewModel.serviceOrder;
	viewModel.timesCanBeAdded = window.ko.pureComputed(function() {
		return parentViewModel.serviceOrderIsEditable() &&
			window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode === "JobPerInstallation";
	});
	window.Main.ViewModels.GenericListViewModel.call(viewModel, "CrmService_ServiceOrderTime", ["PosNo"], ["ASC"], ["Installation", "Article"]);
	viewModel.infiniteScroll(true);
	viewModel.accumulatedTotalPrice = window.ko.pureComputed(() => {
		return viewModel.items().reduce((partialSum, item) => partialSum + item.totalPrice, 0);
	})
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsJobsTabViewModel.prototype =
	Object.create(window.Main.ViewModels.GenericListViewModel.prototype);
namespace("Crm.Service.ViewModels").ServiceOrderDetailsJobsTabViewModel.prototype.canDeleteServiceOrderTime =
	function(serviceOrderTime) {
		var viewModel = this;
		var hasPermission = window.AuthorizationManager.isAuthorizedForAction("ServiceOrder", window.ko.unwrap(serviceOrderTime.CreateUser) === window.Helper.User.getCurrentUserName() ? "TimeDeleteSelfCreated" : "TimeDelete");
		return hasPermission && viewModel.parentViewModel.serviceOrderIsEditable();
	};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsJobsTabViewModel.prototype.canEditServiceOrderTime =
	function(serviceOrderTime) {
		var viewModel = this;
		return viewModel.parentViewModel.serviceOrderIsEditable();
	};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsJobsTabViewModel.prototype.init = function() {
	var viewModel = this;
	var args = arguments;
	return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups).then(function() {
		return window.Main.ViewModels.GenericListViewModel.prototype.init.apply(viewModel, args);
	});
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsJobsTabViewModel.prototype.initItem = function(item) {
	item.itemGroup = this.getItemGroup(item);
	let duration = window.moment.duration(item.InvoiceDuration);
	item.totalPrice = (item.Price - (item.DiscountType == Crm.Article.Model.Enums.DiscountType.Percentage ? item.Price * item.Discount / 100 : item.Discount)) * duration.asHours()
	return item;
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsJobsTabViewModel.prototype.initItems = function(items) {
	var viewModel = this;
	var queries = [];
	var closedServiceCaseStatusKeys = viewModel.lookups.serviceCaseStatuses.$array.filter(function(serviceCaseStatus) {
		return window.Helper.ServiceCase.belongsToClosed(serviceCaseStatus);
	}).map(function(serviceCaseStatus) {
		return serviceCaseStatus.Key;
	});
	items.forEach(function(jobSummary) {
		queries.push({
			queryable: window.database.CrmService_ServiceCase.filter(function(it) {
					return it.ServiceOrderTimeId === this.serviceOrderTimeId && it.StatusKey in this.statusKeys;
				},
				{ serviceOrderTimeId: jobSummary.Id, statusKeys: closedServiceCaseStatusKeys }),
			method: "count",
			handler: function(count) {
				jobSummary.closedServiceCasesCount = count;
				return items;
			}
		});
		queries.push({
			queryable: window.database.CrmService_ServiceCase.filter(function(it) {
					return it.ServiceOrderTimeId === this.serviceOrderTimeId;
				},
				{ serviceOrderTimeId: jobSummary.Id }),
			method: "count",
			handler: function(count) {
				jobSummary.serviceCasesCount = count;
				return items;
			}
		});
		queries.push({
			queryable: window.database.CrmService_ServiceOrderMaterial.filter(function (it) {
				return it.ServiceOrderTimeId === this.serviceOrderTimeId;
			},
				{ serviceOrderTimeId: jobSummary.Id}),
			method: "count",
			handler: function (count) {
				jobSummary.serviceOrderMaterialsCount = count;
				return items;
			}
		});
		queries.push({
			queryable: window.database.CrmService_ServiceOrderTimePosting.filter(function (it) {
				return it.ServiceOrderTimeId === this.serviceOrderTimeId;
			},
				{ serviceOrderTimeId: jobSummary.Id}),
			method: "count",
			handler: function (count) {
				jobSummary.postingsCount = count;
				return items;
			}
		});
	});
	return Helper.Batch.Execute(queries).then(function() {
		return items;
	});
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsJobsTabViewModel.prototype.applyFilters = function (query) {
	var viewModel = this;
	query = window.Main.ViewModels.GenericListViewModel.prototype.applyFilters.call(viewModel, query);
	query = query
		.filter(function (it) {
			return it.OrderId === this.orderId;
		},
			{ orderId: viewModel.serviceOrder().Id() });
	return query;
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsJobsTabViewModel.prototype.confirmDeleteServiceOrderTime =
	function(serviceOrderTime) {
		var viewModel = this;
		window.Helper.Confirm.confirmDelete().then(function() {
			viewModel.loading(true);
			return viewModel.deleteServiceOrderTime(serviceOrderTime);
		}).then(function() {
			return viewModel.filter();
		});
	};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsJobsTabViewModel.prototype.deleteServiceOrderTime =
	function (serviceOrderTime) {
		var serviceOrderTimeId = window.ko.unwrap(serviceOrderTime.Id);
		return window.database.CrmService_ServiceOrderMaterial.filter(
				function(it) { return it.ServiceOrderTimeId === this.serviceOrderTimeId; },
				{ serviceOrderTimeId: serviceOrderTimeId })
			.forEach(function(serviceOrderMaterial) {
				if (serviceOrderMaterial.EstimatedQty > 0) {
					window.database.attachOrGet(serviceOrderMaterial);
					serviceOrderMaterial.ActualQty = 0;
					serviceOrderMaterial.ServiceOrderTimeId = null;
				} else {
					window.database.remove(serviceOrderMaterial);
				}
			}).then(function() {
				return window.database.CrmService_ServiceOrderTimePosting.filter(
						function(it) { return it.ServiceOrderTimeId === this.serviceOrderTimeId; },
						{ serviceOrderTimeId: serviceOrderTimeId })
					.forEach(function(serviceOrderTimePosting) {
						window.database.remove(serviceOrderTimePosting);
					});
			}).then(function() {
				return window.database.Main_DocumentAttribute.filter(
						function(it) { return it.ExtensionValues.ServiceOrderTimeId === this.serviceOrderTimeId; },
						{ serviceOrderTimeId: serviceOrderTimeId })
					.forEach(function(documentAttribute) {
						window.database.remove(documentAttribute);
					});
			}).then(function() {
				window.database.remove(serviceOrderTime);
				return window.database.saveChanges();
			});
	};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsJobsTabViewModel.prototype.getAvatarColor =
	function(serviceOrderTime) {
		var viewModel = this;
		return window.Helper.Lookup.getLookupColor(viewModel.lookups.serviceOrderTimeStatuses,
			serviceOrderTime.StatusKey);
	};