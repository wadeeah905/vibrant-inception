namespace("Crm.Service.ViewModels").ServiceOrderDetailsTimePostingsTabViewModel = function(parentViewModel) {
	window.Main.ViewModels.ViewModelBase.call(this, arguments);
	var viewModel = this;
	viewModel.lookups = parentViewModel.lookups;
	viewModel.serviceOrder = parentViewModel.serviceOrder;
	window.Main.ViewModels.GenericListViewModel.call(viewModel,
		"CrmService_ServiceOrderTimePosting",
		["ServiceOrderTime.PosNo", "Date", "From"],
		["ASC", "ASC", "ASC"],
		["ServiceOrderTime", "ServiceOrderTime.Installation", "User"]);
	viewModel.infiniteScroll(true);
	viewModel.canEditEstimatedQuantities = window.ko.pureComputed(function() {
		return Helper.ServiceOrder.canEditEstimatedQuantitiesSync(viewModel.serviceOrder().StatusKey(), viewModel.lookups.serviceOrderStatuses);
	});
	viewModel.timePostingsCanBeAdded = window.ko.pureComputed(function () {
		return parentViewModel.serviceOrderIsEditable() && (viewModel.canEditEstimatedQuantities() || viewModel.serviceOrder().StatusKey() === "PostProcessing");
	});
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsTimePostingsTabViewModel.prototype =
	Object.create(window.Main.ViewModels.GenericListViewModel.prototype);
namespace("Crm.Service.ViewModels").ServiceOrderDetailsTimePostingsTabViewModel.prototype.applyFilter =
	function(query, filterValue, filterName) {
		if (filterName === "ItemDescription") {
			return query.filter("filterByArticleDescription",
				{ filter: filterValue.Value, language: this.currentUser().DefaultLanguageKey });
		}
		return window.Main.ViewModels.GenericListViewModel.prototype.applyFilter.apply(this, arguments);
	};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsTimePostingsTabViewModel.prototype.applyFilters = function (query) {
	var viewModel = this;
	query = window.Main.ViewModels.GenericListViewModel.prototype.applyFilters.call(viewModel, query);
	return query.filter("it.OrderId === this.orderId", { orderId: window.ko.unwrap(viewModel.serviceOrder().Id) });
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsTimePostingsTabViewModel.prototype.deleteServiceOrderTimePosting = function(serviceOrderTimePosting) {
	var viewModel = this;
	window.Helper.Confirm.confirmDelete().then(function() {
		viewModel.loading(true);
		if (serviceOrderTimePosting.WasPrePlanned()) {
			window.database.attach(serviceOrderTimePosting);
			serviceOrderTimePosting.Date(moment(new Date(1970, 0, 1)).utc(true).startOf("day").toDate());
			serviceOrderTimePosting.Duration(null);
			serviceOrderTimePosting.From(null);
			serviceOrderTimePosting.Kilometers(null);
			serviceOrderTimePosting.To(null);
			serviceOrderTimePosting.Username(null);
			serviceOrderTimePosting.DispatchId(null);
			serviceOrderTimePosting.ServiceOrderTimeId(null);
			serviceOrderTimePosting.PerDiemReportId(null);
		} else {
			window.database.remove(serviceOrderTimePosting);
		}
		return window.database.saveChanges();
	}).then(function() {
		return viewModel.filter();
	});
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsTimePostingsTabViewModel.prototype.getItemGroup = function (serviceOrderPosition) {
	return window.Helper.ServiceOrder.getServiceOrderPositionItemGroup(serviceOrderPosition);
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsTimePostingsTabViewModel.prototype.timePostingCanBeEdited =
	function(serviceOrderTimePosting) {
		const editable =  this.parentViewModel.serviceOrderIsEditable();
		if (editable && serviceOrderTimePosting.IsPrePlanned()) {
			return window.AuthorizationManager.currentUserHasPermission("ServiceOrder::TimePostingPrePlannedEdit");
		}
		return editable && !serviceOrderTimePosting.IsClosed();
	};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsTimePostingsTabViewModel.prototype.timePostingCanBeDeleted =
	function(serviceOrderTimePosting) {
		const editable = this.parentViewModel.serviceOrderIsEditable();
		if (editable && (serviceOrderTimePosting.IsPrePlanned() || serviceOrderTimePosting.WasPrePlanned())) {
			return window.AuthorizationManager.currentUserHasPermission("ServiceOrder::TimePostingPrePlannedRemove");
		}
		return editable && !serviceOrderTimePosting.IsClosed();
	};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsTimePostingsTabViewModel.prototype.initItems = function(items) {
	var args = arguments;
	var viewModel = this;
	return Helper.Article.loadArticleDescriptionsMapFromItemNo(items, viewModel.currentUser().DefaultLanguageKey)
		.then(function() {
			return window.Main.ViewModels.GenericListViewModel.prototype.initItems.apply(viewModel, args);
		});
};