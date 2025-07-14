/// <reference path="../../../../../Content/js/ViewModels/ContactListViewModel.js" />
namespace("Crm.VisitReport.ViewModels").VisitListIndexViewModel = function() {
	var viewModel = this;
	viewModel.currentUserName = document.getElementById("meta.CurrentUser").content;
	window.Main.ViewModels.ContactListViewModel.call(viewModel, "CrmVisitReport_Visit", ["PlannedDate", "PlannedEndDate"], ["DESC", "DESC"], ["Parent", "ResponsibleUserUser", "Address"]);
	viewModel.getFilter("ResponsibleUser").extend({ filterOperator: "===" })(viewModel.currentUserName);
	viewModel.bookmarks.push({
		Category: window.Helper.String.getTranslatedString("Filter"),
		Name: window.Helper.String.getTranslatedString("AllVisits"),
		Key: "AllVisits",
		Expression: function (query) {
			return query;
		}
	});
	var plannedVisits = {
		Category: window.Helper.String.getTranslatedString("Filter"),
		Name: window.Helper.String.getTranslatedString("PlannedVisits"),
		Key: "PlannedVisits",
		Expression: function (query) {
			return query.filter(function (visit) {
				return visit.PlannedDate !== null;
			});
		}
	};
	viewModel.bookmarks.push(plannedVisits);
	viewModel.bookmark(plannedVisits);
	viewModel.bookmarks.push({
		Category: window.Helper.String.getTranslatedString("Filter"),
		Name: window.Helper.String.getTranslatedString("PreparedVisits"),
		Key: "PreparedVisits",
		Expression: function (query) {
			return query.filter(function (visit) {
				return visit.PlannedDate === null;
			});
		}
	});
	viewModel.timelineProperties.push(viewModel.getTimelineProperties());
	viewModel.lookups = {
		addressTypes: { $tableName: "Main_AddressType"},
		regions: { $tableName: "Main_Region"},
		countries: { $tableName: "Main_Country"},
		visitAim: { $tableName: "CrmVisitReport_VisitAim"},
		visitStatus: { $tableName: "CrmVisitReport_VisitStatus"}
	};
	var calendarViewMode = { Key: "Calendar", Value: window.Helper.String.getTranslatedString("Calendar") };
	viewModel.setViewMode(calendarViewMode);
	viewModel.setCalendarDefaultView("agendaWeek");
	window.Main.ViewModels.GenericListMapViewModel.call(this);
	viewModel.isCustomLocationSelectionEnabled(true);
	viewModel.latitudeFilterColumn = "Address.Latitude";
	viewModel.longitudeFilterColumn = "Address.Longitude";
};

namespace("Crm.VisitReport.ViewModels").VisitListIndexViewModel.prototype = Object.create(window.Main.ViewModels.ContactListViewModel.prototype);

namespace("Crm.VisitReport.ViewModels").VisitListIndexViewModel.prototype.init = function() {
	var viewModel = this;
	return window.Main.ViewModels.ContactListViewModel.prototype.init.apply(viewModel, arguments)
		.then(function () { return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups); });
};

namespace("Crm.VisitReport.ViewModels").VisitListIndexViewModel.prototype.refresh = function() {
	this.search(false);
};

namespace("Crm.VisitReport.ViewModels").VisitListIndexViewModel.prototype.downloadIcs = function () {
	var viewModel = this;
	window.location = viewModel.getIcsLink();
};
namespace("Crm.VisitReport.ViewModels").VisitListIndexViewModel.prototype.getIcsLinkAllowed = function() {
	return window.AuthorizationManager.isAuthorizedForAction("Visit", "Ics");
}
namespace("Crm.VisitReport.ViewModels").VisitListIndexViewModel.prototype.getTimelineProperties = function() {
	return {
		Start: "PlannedDate",
		End: "PlannedEndDate",
		Caption: window.Helper.String.getTranslatedString("PlannedDate"),
		AllDayProperty: "PlannedTime"
	};
};
namespace("Crm.VisitReport.ViewModels").VisitListIndexViewModel.prototype.getTimelineEvent = function(entity) {
	var viewModel = this;
	var timelineProperties = window.Crm.VisitReport.ViewModels.VisitListIndexViewModel.prototype.getTimelineProperties();
	return {
		entityType: window.Helper.getTranslatedString("Visit"),
		title: entity.Parent() ? entity.Parent().Name() : entity.Name(),
		start: entity[timelineProperties.Start](),
		end: entity[timelineProperties.End]() || entity[timelineProperties.Start](),
		allDay: !entity[timelineProperties.AllDayProperty](),
		url: "#/Crm.VisitReport/Visit/DetailsTemplate/" + entity.Id(),
		backgroundColor: window.Helper.Visit.getVisitAimColor(entity, viewModel.lookups.visitAim)
	};
};

namespace("Crm.VisitReport.ViewModels").VisitListIndexViewModel.prototype.getEventClick = function(event) {
	if (!!event.url) {
		window.location.hash = event.url;
	}
	return false;
};
namespace("Crm.VisitReport.ViewModels").VisitListIndexViewModel.prototype.getLatitude = function(item) {
	var address = window.ko.unwrap(item.Address);
	return window.ko.unwrap(address.Latitude);
};
namespace("Crm.VisitReport.ViewModels").VisitListIndexViewModel.prototype.getLongitude = function(item) {
	var address = window.ko.unwrap(item.Address);
	return window.ko.unwrap(address.Longitude);
};
namespace("Crm.VisitReport.ViewModels").VisitListIndexViewModel.prototype.getPopupInformation = function (item) {
	return item.Parent().Name();
};
namespace("Crm.VisitReport.ViewModels").VisitListIndexViewModel.prototype.setInProgress = function (item) {
	var viewModel = this;
	viewModel.loading(true);
	window.Helper.Visit.setStatus(item, "InProgress").then(function(){
		viewModel.loading(false);
		viewModel.showSnackbar(window.Helper.String.getTranslatedString("VisitInProgress"));
	});
};
namespace("Crm.VisitReport.ViewModels").VisitListIndexViewModel.prototype.complete = function (item) {
	var viewModel = this;
	viewModel.loading(true);
	window.Helper.Visit.setStatus(item, "Completed").then(function(){
		viewModel.loading(false);
		viewModel.showSnackbar(window.Helper.String.getTranslatedString("VisitCompleted"));
	}).fail(function () {
		viewModel.loading(false);
	});
};

(function() {
	var dashboardCalendarWidgetViewModel = window.Main.ViewModels.DashboardCalendarWidgetViewModel;
	window.Main.ViewModels.DashboardCalendarWidgetViewModel = function() {
		var viewModel = this;
		dashboardCalendarWidgetViewModel.apply(this, arguments);
		if (window.database.CrmVisitReport_VisitAim) {
			viewModel.lookups.visitAim = { $tableName: "CrmVisitReport_VisitAim" };
		}
		if (window.database.CrmVisitReport_Visit) {
			viewModel.visitFilterOption = {
				Value: window.database.CrmVisitReport_Visit.collectionName,
				Caption: window.Helper.String.getTranslatedString("Visits")
			};
			viewModel.filterOptions.push(viewModel.visitFilterOption);
			viewModel.selectedFilters.subscribe(function (changes) {
				if (changes.some(function (change) { return change.status === viewModel.changeStatus.added && change.moved === undefined && change.value.Value === viewModel.visitFilterOption.Value })) {
					viewModel.loading(true);
					viewModel.getVisitTimelineEvents().then(function (results) {
						viewModel.timelineEvents(viewModel.timelineEvents().filter(function (event) { return event.innerInstance.constructor.name != viewModel.visitFilterOption.Value }));
						viewModel.timelineEvents(viewModel.timelineEvents().concat(results));
						viewModel.loading(false);
					});
				}
				if (changes.some(function (change) { return change.status === viewModel.changeStatus.deleted && change.moved === undefined && change.value.Value === viewModel.visitFilterOption.Value })) {
					viewModel.timelineEvents(viewModel.timelineEvents().filter(function (event) { return event.innerInstance.constructor.name != viewModel.visitFilterOption.Value }));
				}
			}, null, "arrayChange");
		}
	};
	window.Main.ViewModels.DashboardCalendarWidgetViewModel.prototype = dashboardCalendarWidgetViewModel.prototype;
	var getTimelineEvent = window.Main.ViewModels.DashboardCalendarWidgetViewModel.prototype.getTimelineEvent;
	window.Main.ViewModels.DashboardCalendarWidgetViewModel.prototype.getTimelineEvent = function(it) {
		if (window.database.CrmVisitReport_Visit &&
			it.innerInstance instanceof
			window.database.CrmVisitReport_Visit.CrmVisitReport_Visit) {
			return window.Crm.VisitReport.ViewModels.VisitListIndexViewModel.prototype.getTimelineEvent.call(this, it);
		}
		return getTimelineEvent.apply(this, arguments);
	};
	window.Main.ViewModels.DashboardCalendarWidgetViewModel.prototype.getVisitTimelineEvents = function() {
		var viewModel = this;
		if (window.database.CrmVisitReport_Visit && viewModel.currentUser()) {
			return window.database.CrmVisitReport_Visit
				.include("Parent")
				.filter(function (it) {
					return it.ResponsibleUser === this.currentUser &&
						it.PlannedDate >= this.start &&
						it.PlannedDate <= this.end;
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