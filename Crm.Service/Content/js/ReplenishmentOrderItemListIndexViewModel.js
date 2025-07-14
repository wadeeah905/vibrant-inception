namespace("Crm.Service.ViewModels").ReplenishmentOrderItemListIndexViewModel = function() {
	var viewModel = this;
	viewModel.currentUserName = document.getElementById("meta.CurrentUser").content;
	viewModel.pageTitle = window.ko.pureComputed(() => {
		let title = window.Helper.String.getTranslatedString("ReplenishmentOrder");
		if (viewModel.replenishmentOrder() && viewModel.replenishmentOrder().IsClosed()){
			title = window.Helper.String.getTranslatedString("ReplenishmentOrderDatedOf").replace("{0}", window.Globalize.formatDate(viewModel.replenishmentOrder().CloseDate(),{ date: "medium" }));
		}
		if (window.AuthorizationManager.isAuthorizedForAction("ReplenishmentOrder", "ReplenishmentsFromOtherUsersSelectable")){
			title += " " + window.Helper.String.getTranslatedString("For");
		}
		return title;
	});
	viewModel.replenishmentOrder = window.ko.observable(null);
	viewModel.responsibleUser = window.ko.observable(viewModel.currentUserName);
	viewModel.showSidebar = window.ko.pureComputed(function(){
		return window.AuthorizationManager.isAuthorizedForAction("ReplenishmentOrder", "ReplenishmentsFromOtherUsersSelectable") || window.AuthorizationManager.isAuthorizedForAction("ReplenishmentOrder", "SeeClosedReplenishmentOrders");
	});
	viewModel.lookups = {};
	window.Main.ViewModels.GenericListViewModel.call(viewModel,
		"CrmService_ReplenishmentOrderItem",
		"MaterialNo",
		"ASC",
		["ServiceOrderMaterials", "ServiceOrderMaterials.ServiceOrderHead"]);
	viewModel.lookups = {
		quantityUnits: { $tableName: "CrmArticle_QuantityUnit" }
	};
	viewModel.infiniteScroll(true);
	viewModel.showSummary = window.ko.observable(true);
	viewModel.replenishmentOrderListViewModel = new window.Main.ViewModels.GenericListViewModel("CrmService_ReplenishmentOrder", "CreateDate", "DESC", ["ResponsibleUserObject"]);
	viewModel.replenishmentOrderListViewModel.enableUrlUpdate(false);
	viewModel.replenishmentOrderListViewModel.pageSize(10);
	viewModel.replenishmentOrderListViewModel.getFilter("CloseDate").subscribe(viewModel.replenishmentOrderListViewModel.filter.bind(viewModel.replenishmentOrderListViewModel));
	viewModel.replenishmentOrderListViewModel.selectedUser = viewModel.responsibleUser;
	viewModel.replenishmentOrderListViewModel.selectedUser.subscribe(viewModel.replenishmentOrderListViewModel.filter.bind(viewModel.replenishmentOrderListViewModel));
	viewModel.replenishmentOrderListViewModel.applyFilters = function (query) {
		query = window.Main.ViewModels.GenericListViewModel.prototype.applyFilters.call(viewModel.replenishmentOrderListViewModel, query);
		if (!!viewModel.replenishmentOrderListViewModel.selectedUser()) {
			query = query.filter("it.ResponsibleUser == this.selectedUser",
				{ selectedUser: viewModel.replenishmentOrderListViewModel.selectedUser() });
		}
		return query.filter("it.IsClosed === true");
	};
};
namespace("Crm.Service.ViewModels").ReplenishmentOrderItemListIndexViewModel.prototype =
	Object.create(window.Main.ViewModels.GenericListViewModel.prototype);
namespace("Crm.Service.ViewModels").ReplenishmentOrderItemListIndexViewModel.prototype.init = function() {
	var viewModel = this;
	var args = arguments;
	return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups).then(function() {
		return viewModel.initReplenishmentOrder();
	}).then(function() {
		return window.Main.ViewModels.GenericListViewModel.prototype.init.apply(viewModel, args);
	}).then(function(){
		return window.AuthorizationManager.isAuthorizedForAction("ReplenishmentOrder", "SeeClosedReplenishmentOrders") ? viewModel.replenishmentOrderListViewModel.init() : null;
	}).then(function() {
		viewModel.replenishmentOrderListViewModel.loading(false);
	});
};
namespace("Crm.Service.ViewModels").ReplenishmentOrderItemListIndexViewModel.prototype.initReplenishmentOrder = function() {
	var viewModel = this;
	var args = arguments;
	return window.Helper.ReplenishmentOrder.getOrCreateCurrentReplenishmentOrder(viewModel.responsibleUser())
		.then(function(replenishmentOrder) {
		viewModel.replenishmentOrder(replenishmentOrder);
		viewModel.getFilter("ReplenishmentOrderId").extend({ filterOperator: "===" })(replenishmentOrder.Id());
		return window.database.saveChanges();
	});
};
namespace("Crm.Service.ViewModels").ReplenishmentOrderItemListIndexViewModel.prototype.deleteReplenishmentOrderItem =
	function(replenishmentOrderItem) {
		var viewModel = this;
		window.Helper.Confirm.confirmDelete().then(function() {
			viewModel.loading(true);
			if(replenishmentOrderItem.ServiceOrderMaterials()[0]){
				replenishmentOrderItem.ServiceOrderMaterials()[0].ReplenishmentOrderItemId(null);
			}
			window.database.remove(replenishmentOrderItem);
			return window.database.saveChanges();
		}).then(function() {
			return viewModel.filter();
		});
	};
namespace("Crm.Service.ViewModels").ReplenishmentOrderItemListIndexViewModel.prototype.closeReplenishmentOrder =
	function() {
		var viewModel = this;
		window.Helper.Confirm.genericConfirm({
			confirmButtonText: window.Helper.String.getTranslatedString("Complete"),
			text: window.Helper.String.getTranslatedString("ConfirmCloseReplenishmentOrder"),
			title: window.Helper.String.getTranslatedString("Complete")
		}).done(function() {
			viewModel.loading(true);
			window.database.attachOrGet(viewModel.replenishmentOrder().innerInstance);
			viewModel.replenishmentOrder().CloseDate(new Date());
			viewModel.replenishmentOrder().ClosedBy(viewModel.currentUserName);
			viewModel.replenishmentOrder().IsClosed(true);
			return window.database.saveChanges();
		}).then(function() {
			return window.Helper.ReplenishmentOrder.getOrCreateCurrentReplenishmentOrder(viewModel.responsibleUser(), viewModel.replenishmentOrder().Id());
		}).then(function(replenishmentOrder) {
			viewModel.replenishmentOrder(replenishmentOrder);
			viewModel.getFilter("ReplenishmentOrderId").extend({ filterOperator: "===" })(replenishmentOrder.Id());
			viewModel.defaultFilters["ReplenishmentOrderId"].Value = replenishmentOrder.Id();
			return window.database.saveChanges();
		}).then(function() {
			return viewModel.filter();
		});
	};
namespace("Crm.Service.ViewModels").ReplenishmentOrderItemListIndexViewModel.prototype.onResponsibleUserSelect = function(responsibleUser){
	var viewModel = this;
	if (!responsibleUser){
		viewModel.loading(true);
		viewModel.replenishmentOrder(window.database.CrmService_ReplenishmentOrder.defaultType.create().asKoObservable());
		viewModel.getFilter("ReplenishmentOrderId").extend({ filterOperator: "===" })(window.Helper.String.emptyGuid());
		viewModel.defaultFilters["ReplenishmentOrderId"].Value = window.Helper.String.emptyGuid();
		return viewModel.filter();
	}
	if (this.replenishmentOrder().ResponsibleUser() === responsibleUser.Id){
		return;
	}
	viewModel.loading(true);
	return viewModel.initReplenishmentOrder().then(function(){
		viewModel.defaultFilters["ReplenishmentOrderId"].Value = viewModel.replenishmentOrder().Id();
		return viewModel.filter();
	})
}
namespace("Crm.Service.ViewModels").ReplenishmentOrderItemListIndexViewModel.prototype.showReplenishmentOrder = function(replenishmentOrder){
	var viewModel = this;
	viewModel.loading(true);
	viewModel.replenishmentOrder(replenishmentOrder);
	viewModel.getFilter("ReplenishmentOrderId").extend({ filterOperator: "===" })(replenishmentOrder.Id());
	viewModel.defaultFilters["ReplenishmentOrderId"].Value = replenishmentOrder.Id();
	return viewModel.filter();
}
namespace("Crm.Service.ViewModels").ReplenishmentOrderItemListIndexViewModel.prototype.getItemGroup = function (item) {
	var viewModel = this;
	if (!viewModel.showSummary()) {
		return null;
	}
	var itemGroup = {title: "", css: "hidden"};
	switch (viewModel.orderBy()) {
		case "Description":
			itemGroup.title = item.Description();
			break;
		case "Quantity":
			return null;
			break;
		default:
			itemGroup.title = item.MaterialNo();
	}
	return itemGroup;
}
namespace("Crm.Service.ViewModels").ReplenishmentOrderItemListIndexViewModel.prototype.getQuantitySummary = function (itemGroup) {
	var viewModel = this;
	var sum = 0;
	viewModel.items().forEach(function (item) {
		if (item.itemGroup.title == itemGroup.title)
			sum += item.Quantity();
	});
	return sum;
}