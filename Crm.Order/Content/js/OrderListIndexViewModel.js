/// <reference path="..\..\..\..\Content\js\ViewModels\GenericListViewModel.js" />
namespace("Crm.Order.ViewModels").OrderListIndexViewModel = function() {
	var viewModel = this;
	viewModel.lookups = {
		currencies: { $tableName: "Main_Currency" },
		entryTypes: { $tableName: "CrmOrder_OrderEntryType" },
		statuses: { $tableName: "CrmOrder_OrderStatus" }
	};
	window.Main.ViewModels.GenericListViewModel.call(this, "CrmOrder_Order", "CreateDate", "DESC", ["Company", "Person", "ResponsibleUserUser"]);

	const allOrdersBookmark = {
		Category: window.Helper.String.getTranslatedString("Filter"),
		Name: "All orders",
		Key: "AllOrders",
		Expression: function (query) {
			return query;
		}
	};
	const openOrdersBookmark = {
		Category: window.Helper.String.getTranslatedString("Filter"),
		Name: window.Helper.String.getTranslatedString("OpenOrders"),
		Key: "OpenOrders",
		Expression: function (query) {
			return query.filter(function (x) {
				return x.StatusKey === "Open";
			});
		}
	};
	const closedOrdersBookmark = {
		Category: window.Helper.String.getTranslatedString("Filter"),
		Name: window.Helper.String.getTranslatedString("ClosedOrders"),
		Key: "ClosedOrders",
		Expression: function (query) {
			return query.filter(function (x) {
				return x.StatusKey === "Closed";
			});
	viewModel.timelineProperties.push({ Start: "OrderDate", End: "OrderDate", Caption: window.Helper.String.getTranslatedString("OrderDate") });
		}
	};
	viewModel.bookmarks.push(allOrdersBookmark);
	viewModel.bookmarks.push(openOrdersBookmark);
	viewModel.bookmarks.push(closedOrdersBookmark);
	viewModel.bookmark(openOrdersBookmark);
}
namespace("Crm.Order.ViewModels").OrderListIndexViewModel.prototype = Object.create(window.Main.ViewModels.GenericListViewModel.prototype);
namespace("Crm.Order.ViewModels").OrderListIndexViewModel.prototype.downloadIcs = window.Crm.Order.ViewModels.OfferListIndexViewModel.prototype.downloadIcs;
namespace("Crm.Order.ViewModels").OrderListIndexViewModel.prototype.getIcsLinkAllowed = function() {
	return window.AuthorizationManager.isAuthorizedForAction("Order", "Ics");
};
namespace("Crm.Order.ViewModels").OrderListIndexViewModel.prototype.getTimelineEvent = function (order, timelineProperty) {
	let timeLineEvent = window.Main.ViewModels.GenericListViewModel.prototype.getTimelineEvent.call(this, order, timelineProperty);
	timeLineEvent.entityType = window.Helper.getTranslatedString("Order");
	timeLineEvent.title = order.OrderNo() + " - " + window.Helper.Company.getDisplayName(order.Company());
	timeLineEvent.url = "#/Crm.Order/Order/DetailsTemplate/" + order.Id();
	return timeLineEvent;
}
namespace("Crm.Order.ViewModels").OrderListIndexViewModel.prototype.init = function () {
	var viewModel = this;
	var args = arguments;
	return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups)
		.pipe(function () {
			return window.Main.ViewModels.GenericListViewModel.prototype.init.apply(viewModel, args)
		});
};
namespace("Crm.Order.ViewModels").OrderListIndexViewModel.prototype.applyFilters = function (query) {
	let viewModel = this;

	query = window.Main.ViewModels.GenericListViewModel.prototype.applyFilters.call(viewModel, query);
	if (!window.AuthorizationManager.isAuthorizedForAction("Order", "SeeAllUsersOrders")) {
		query = query.filter(function (order) {
			return (order.CreateUser === this.username || order.ResponsibleUser === this.username)
		}, { username: viewModel.currentUser().Id });
	}

	return query;
};

;(function() {
	var dashboardCalendarWidgetViewModel = window.Main.ViewModels.DashboardCalendarWidgetViewModel;
	window.Main.ViewModels.DashboardCalendarWidgetViewModel = function() {
		var viewModel = this;
		dashboardCalendarWidgetViewModel.apply(this, arguments);
		if (window.database.CrmOrder_Order) {
			viewModel.orderFilterOption = {
				Value: window.database.CrmOrder_Order.collectionName,
				Caption: window.Helper.String.getTranslatedString("Orders")
			};
			viewModel.filterOptions.push(viewModel.orderFilterOption);
			viewModel.selectedFilters.subscribe(function (changes) {
				if (changes.some(function (change) { return change.status === viewModel.changeStatus.added && change.moved === undefined && change.value.Value === viewModel.orderFilterOption.Value })) {
					viewModel.loading(true);
					viewModel.getOrderTimelineEvents().then(function (results) {
						viewModel.timelineEvents(viewModel.timelineEvents().filter(function (event) { return event.innerInstance.constructor.name != viewModel.orderFilterOption.Value }));
						viewModel.timelineEvents(viewModel.timelineEvents().concat(results));
						viewModel.loading(false);
					});
				}
				if (changes.some(function (change) { return change.status === viewModel.changeStatus.deleted && change.moved === undefined && change.value.Value === viewModel.orderFilterOption.Value })) {
					viewModel.timelineEvents(viewModel.timelineEvents().filter(function (event) { return event.innerInstance.constructor.name != viewModel.orderFilterOption.Value }));
				}
			}, null, "arrayChange");
		}
	};
	window.Main.ViewModels.DashboardCalendarWidgetViewModel.prototype = dashboardCalendarWidgetViewModel.prototype;
	var getTimelineEvent = window.Main.ViewModels.DashboardCalendarWidgetViewModel.prototype.getTimelineEvent;
	window.Main.ViewModels.DashboardCalendarWidgetViewModel.prototype.getTimelineEvent = function(it) {
		if (window.database.CrmOrder_Order &&
			it.innerInstance instanceof
			window.database.CrmOrder_Order.CrmOrder_Order) {
			return window.Crm.Order.ViewModels.OrderListIndexViewModel.prototype.getTimelineEvent.call(this, it, "OrderDate");
		}
		return getTimelineEvent.apply(this, arguments);
	};
	window.Main.ViewModels.DashboardCalendarWidgetViewModel.prototype.getOrderTimelineEvents = function() {
		var viewModel = this;
		if (window.database.CrmOrder_Order && viewModel.currentUser()) {
			return window.database.CrmOrder_Order
				.include("Company")
				.filter(function (it) {
						return it.ResponsibleUser === this.currentUser &&
							it.OrderDate >= this.start &&
							it.OrderDate <= this.end;
					},
					{
						currentUser: viewModel.currentUser(),
						start: viewModel.timelineStart(),
						end: viewModel.timelineEnd()
					})
				.take(viewModel.maxResults())
				.toArray()
				.then(function (results) {
					return results.map(function (x) { return x.asKoObservable(); });
				});
		} else {
			return new $.Deferred().resolve([]).promise();
		}
	};
})();