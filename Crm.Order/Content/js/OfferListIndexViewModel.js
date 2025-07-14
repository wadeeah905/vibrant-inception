/// <reference path="..\..\..\..\Content\js\ViewModels\GenericListViewModel.js" />
namespace("Crm.Order.ViewModels").OfferListIndexViewModel = function () {
	var viewModel = this;
	viewModel.lookups = {
		currencies: {$tableName: "Main_Currency"},
		entryTypes: {$tableName: "CrmOrder_OrderEntryType"},
		statuses: {$tableName: "CrmOrder_OrderStatus"},
		cancelReasonCategories: { $tableName: "CrmOrder_OrderCancelReasonCategory" }
	};
	viewModel.projectStatuses = window.ko.observableArray([]);
	window.Main.ViewModels.GenericListViewModel.call(this, "CrmOrder_Offer", "CreateDate", "DESC", ["Company", "Person", "ResponsibleUserUser"]);
	viewModel.timelineProperties.push({ Start: "OrderDate", End: "OrderDate", Caption: window.Helper.String.getTranslatedString("OfferDate") });
}
namespace("Crm.Order.ViewModels").OfferListIndexViewModel.prototype = Object.create(window.Main.ViewModels.GenericListViewModel.prototype);
namespace("Crm.Order.ViewModels").OfferListIndexViewModel.prototype.downloadIcs = function () {
	var viewModel = this;
	var cal = window.ics();
	viewModel.query().toArray(function (result) {
		result.forEach(function (x) {
			var title = x.OrderNo;
			var description = window.Helper.Company.getDisplayName(x.Company);
			cal.addEvent(title, description, "", x.OrderDate, x.OrderDate);
		});
	}).then(function () {
		cal.download(viewModel.entityType);
	});
}
namespace("Crm.Order.ViewModels").OfferListIndexViewModel.prototype.getIcsLinkAllowed = function() {
	return window.AuthorizationManager.isAuthorizedForAction("Offer", "Ics");
};
namespace("Crm.Order.ViewModels").OfferListIndexViewModel.prototype.getTimelineEvent = function (offer, timelineProperty) {
	let timeLineEvent = window.Main.ViewModels.GenericListViewModel.prototype.getTimelineEvent.call(this, offer, timelineProperty);
	timeLineEvent.entityType = window.Helper.getTranslatedString("Offer");
	timeLineEvent.title = offer.OrderNo() + " - " + window.Helper.Company.getDisplayName(offer.Company());
	timeLineEvent.url = "#/Crm.Order/Offer/Details/" + offer.Id();
	return timeLineEvent;
}
namespace("Crm.Order.ViewModels").OfferListIndexViewModel.prototype.init = function () {
	var viewModel = this;
	var args = arguments;
	return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups)
		.then(function () {
			return window.Main.ViewModels.GenericListViewModel.prototype.init.apply(viewModel, args);
		});
};
namespace("Crm.Order.ViewModels").OfferListIndexViewModel.prototype.applyFilters = function (query) {
	let viewModel = this;

	query = window.Main.ViewModels.GenericListViewModel.prototype.applyFilters.call(viewModel, query);
	if (!window.AuthorizationManager.isAuthorizedForAction("Offer", "SeeAllUsersOffers")) {
		query = query.filter(function (offer) {
			return (offer.CreateUser === this.username || offer.ResponsibleUser === this.username)
		}, { username: viewModel.currentUser().Id });
	}

	return query;
};

;(function() {
	var dashboardCalendarWidgetViewModel = window.Main.ViewModels.DashboardCalendarWidgetViewModel;
	window.Main.ViewModels.DashboardCalendarWidgetViewModel = function() {
		var viewModel = this;
		dashboardCalendarWidgetViewModel.apply(this, arguments);
		if (window.database.CrmOrder_Offer) {
			viewModel.offerFilterOption = {
				Value: window.database.CrmOrder_Offer.collectionName,
				Caption: window.Helper.String.getTranslatedString("Offers")
			};
			viewModel.filterOptions.push(viewModel.offerFilterOption);
			viewModel.selectedFilters.subscribe(function (changes) {
				if (changes.some(function (change) { return change.status === viewModel.changeStatus.added && change.moved === undefined && change.value.Value === viewModel.offerFilterOption.Value })) {
					viewModel.loading(true);
					viewModel.getOfferTimelineEvents().then(function (results) {
						viewModel.timelineEvents(viewModel.timelineEvents().filter(function (event) { return event.innerInstance.constructor.name != viewModel.offerFilterOption.Value }));
						viewModel.timelineEvents(viewModel.timelineEvents().concat(results));
						viewModel.loading(false);
					});
				}
				if (changes.some(function (change) { return change.status === viewModel.changeStatus.deleted && change.moved === undefined && change.value.Value === viewModel.offerFilterOption.Value })) {
					viewModel.timelineEvents(viewModel.timelineEvents().filter(function (event) { return event.innerInstance.constructor.name != viewModel.offerFilterOption.Value }));
				}
			}, null, "arrayChange");
		}
	};
	window.Main.ViewModels.DashboardCalendarWidgetViewModel.prototype = dashboardCalendarWidgetViewModel.prototype;
	var getTimelineEvent = window.Main.ViewModels.DashboardCalendarWidgetViewModel.prototype.getTimelineEvent;
	window.Main.ViewModels.DashboardCalendarWidgetViewModel.prototype.getTimelineEvent = function(it) {
		if (window.database.CrmOrder_Offer &&
			it.innerInstance instanceof
			window.database.CrmOrder_Offer.CrmOrder_Offer) {
			return window.Crm.Order.ViewModels.OfferListIndexViewModel.prototype.getTimelineEvent.call(this, it, "OrderDate");
		}
		return getTimelineEvent.apply(this, arguments);
	};
	window.Main.ViewModels.DashboardCalendarWidgetViewModel.prototype.getOfferTimelineEvents = function() {
		var viewModel = this;
		if (window.database.CrmOrder_Offer && viewModel.currentUser()) {
			return window.database.CrmOrder_Offer
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