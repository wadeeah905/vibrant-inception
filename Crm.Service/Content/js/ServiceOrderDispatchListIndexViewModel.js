/// <reference path="../../../../Content/js/ViewModels/GenericListViewModel.js" />
/// <reference path="../../../../Content/js/ViewModels/GenericListViewModel.Map.js" />
/// <reference path="../../../../Content/js/ViewModels/GeolocationViewModel.js" />
/// <reference path="../../../../Content/js/helper/Helper.String.js" />
/// <reference path="../../../../Content/js/knockout.component.dashboardCalendarWidget.js" />
/// <reference path="../../../../Content/js/system/moment.js" />

namespace("Crm.Service.ViewModels").ServiceOrderDispatchListIndexViewModel = function (parentViewModel) {
	var viewModel = this;
	viewModel.parentViewModel = parentViewModel;
	viewModel.currentUser = window.ko.observable(null);
	viewModel.latitudeFilterColumn = "ServiceOrder.Latitude";
	viewModel.longitudeFilterColumn = "ServiceOrder.Longitude";
	window.Main.ViewModels.GeolocationViewModel.apply(viewModel, arguments);
	window.Main.ViewModels.GenericListViewModel.call(viewModel,
		"CrmService_ServiceOrderDispatch",
		["Date", "Time"],
		["DESC", "DESC"],
		[
			"ServiceOrder", "ServiceOrder.Installation", "ServiceOrder.Installation.Address",
			"ServiceOrder.Installation.Company", "ServiceOrder.Company", "ServiceOrder.ServiceObject",
			"DispatchedUser", "ServiceOrder.ServiceOrderTimes", "ServiceOrder.ServiceOrderTimes.Installation",
			"ServiceOrder.Station", "ServiceOrder.Initiator", "ServiceOrder.Initiator.Addresses", "ServiceOrder.InitiatorPerson",
			"ServiceOrder.InitiatorPerson.Emails", "ServiceOrder.InitiatorPerson.Phones", "ServiceOrder.ResponsibleUserUser"
		]);
	window.Main.ViewModels.GenericListMapViewModel.call(this);
	viewModel.lookups = {
		installationHeadStatuses: { $tableName: "CrmService_InstallationHeadStatus" },
		serviceOrderDispatchRejectReasons: { $tableName: "CrmService_ServiceOrderDispatchRejectReason" },
		serviceOrderDispatchStatuses: { $tableName: "CrmService_ServiceOrderDispatchStatus" },
		countries: { $tableName: "Main_Country" },
		regions: { $tableName: "Main_Region" },
		serviceOrderTypes: { $tableName: "CrmService_ServiceOrderType" },
		servicePriorities: { $tableName: "CrmService_ServicePriority" }
	};
	viewModel.timelineProperties.push({
		Start: "Date",
		End: "Date",
		Caption: window.Helper.String.getTranslatedString("Date")
	});
	var baseSetOrderBy = viewModel.setOrderBy;
	viewModel.setOrderBy = function(value) {
		if (value.indexOf("OrderHead.") === 0) {
			value = value.replace("OrderHead.", "ServiceOrder.");
		}
		baseSetOrderBy.apply(this, arguments);
	};
	if (window.AuthorizationManager.isAuthorizedForAction("Dispatch", "SeeAllUsersDispatches")) {
		viewModel.bookmarks.push({
			Category: window.Helper.String.getTranslatedString("Filter"),
			Name: window.Helper.String.getTranslatedString("All"),
			Key: "AllDispatches",
			Expression: function(query) {
				return query;
			}
		});
	}
	var bookmarkMy = {
		Category: window.Helper.String.getTranslatedString("Filter"),
		Name: window.Helper.String.getTranslatedString("MyDispatches"),
		Key: "MyDispatches",
		Expression: function(query) {
			return query.filter(function(it) { return it.Username === this.username; }, { username: viewModel.currentUser().Id });
		}
	};
	viewModel.bookmarks.push(bookmarkMy);
	viewModel.bookmark(bookmarkMy);
	viewModel.pageTitle = ko.observable("");
};
namespace("Crm.Service.ViewModels").ServiceOrderDispatchListIndexViewModel.prototype =
	Object.create(window.Main.ViewModels.GenericListViewModel.prototype);
namespace("Crm.Service.ViewModels").ServiceOrderDispatchListIndexViewModel.prototype.init = function(id, params) {
	var viewModel = this;
	if (params && params.status) {
		viewModel.status = params.status;
	}
	switch(viewModel.status){
		case "scheduled":
			viewModel.pageTitle(Helper.String.getTranslatedString("ScheduledDispatches"));
			break;
		case "closed":
			viewModel.pageTitle(Helper.String.getTranslatedString("ClosedDispatches"));
			break;
		default:
			viewModel.pageTitle(Helper.String.getTranslatedString("UpcomingDispatches"));
	}
	if (params && params.context) {
		viewModel.context = params.context;
	}
	var args = arguments;
	return window.Helper.User.getCurrentUser().then(function(user) {
		viewModel.currentUser(user);
		return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups);
	}).then(function() {
		return window.Main.ViewModels.GeolocationViewModel.prototype.init.apply(viewModel, args);
	}).then(function() {
		if (params && params.status === "closed") {
			viewModel.orderByDirection(["DESC", "DESC"]);
		}
		return window.Main.ViewModels.GenericListViewModel.prototype.init.apply(viewModel, args);
	});
};
namespace("Crm.Service.ViewModels").ServiceOrderDispatchListIndexViewModel.prototype.initItems = function (items) {
	items.forEach(function (dispatch) {
		dispatch.ServiceOrder().Installations = window.ko.observableArray(window.Helper.ServiceOrder.getRelatedInstallations(dispatch.ServiceOrder()));
	});
	return items;
};
namespace("Crm.Service.ViewModels").ServiceOrderDispatchListIndexViewModel.prototype.dispose = function() {
	return window.Main.ViewModels.GeolocationViewModel.prototype.dispose.apply(this, arguments);
};
namespace("Crm.Service.ViewModels").ServiceOrderDispatchListIndexViewModel.prototype.applyFilters = function(query) {
	var viewModel = this;
	if (viewModel.filters.StartTime && viewModel.filters.StartTime() instanceof Array) {
		viewModel.filters.StartTime().forEach(function(startTimeFilter) {
			startTimeFilter.Column = "Date";
		});
	}
	if (viewModel.filters["DispatchedUsername"]) {
		viewModel.filters["Username"] = viewModel.filters["DispatchedUsername"];
		delete viewModel.filters["DispatchedUsername"];
	}
	if (viewModel.filters["OrderHead.OrderNo"]) {
		viewModel.filters["ServiceOrder.OrderNo"] = viewModel.filters["OrderHead.OrderNo"];
		delete viewModel.filters["OrderHead.OrderNo"];
	}
	if (viewModel.filters["OrderHead.InstallationId"]) {
		viewModel.filters["ServiceOrder.InstallationId"] = viewModel.filters["OrderHead.InstallationId"];
		delete viewModel.filters["OrderHead.InstallationId"];
	}
	if (viewModel.filters["OrderHead.CustomerContactId"]) {
		viewModel.filters["ServiceOrder.CustomerContactId"] = viewModel.filters["OrderHead.CustomerContactId"];
		delete viewModel.filters["OrderHead.CustomerContactId"];
	}
	if (viewModel.filters["OrderHead.ServiceObjectId"]) {
		viewModel.filters["ServiceOrder.ServiceObjectId"] = viewModel.filters["OrderHead.ServiceObjectId"];
		delete viewModel.filters["OrderHead.ServiceObjectId"];
	}
	if (viewModel.filters["OrderHead.StationKey"]) {
		viewModel.filters["ServiceOrder.StationKey"] = viewModel.filters["OrderHead.StationKey"];
		delete viewModel.filters["OrderHead.StationKey"];
	}
	if (viewModel.filters["OrderHead.RegionKey"]) {
		viewModel.filters["ServiceOrder.RegionKey"] = viewModel.filters["OrderHead.RegionKey"];
		delete viewModel.filters["OrderHead.RegionKey"];
	}
	if (viewModel.filters["OrderHead.ZipCode"]) {
		viewModel.filters["ServiceOrder.ZipCode"] = viewModel.filters["OrderHead.ZipCode"];
		delete viewModel.filters["OrderHead.ZipCode"];
	}
	if (viewModel.filters["OrderHead.City"]) {
		viewModel.filters["ServiceOrder.City"] = viewModel.filters["OrderHead.City"];
		delete viewModel.filters["OrderHead.City"];
	}
	if (viewModel.filters["OrderHead.Street"]) {
		viewModel.filters["ServiceOrder.Street"] = viewModel.filters["OrderHead.Street"];
		delete viewModel.filters["OrderHead.Street"];
	}
	if (viewModel.filters["OrderHead.ZipCode"]) {
		viewModel.filters["ServiceOrder.ZipCode"] = viewModel.filters["OrderHead.ZipCode"];
		delete viewModel.filters["OrderHead.ZipCode"];
	}
	if (viewModel.filters["OrderHead.PurchaseOrderNo"]) {
		viewModel.filters["ServiceOrder.PurchaseOrderNo"] = viewModel.filters["OrderHead.PurchaseOrderNo"];
		delete viewModel.filters["OrderHead.PurchaseOrderNo"];
	}
	query = window.Main.ViewModels.GenericListViewModel.prototype.applyFilters.call(viewModel, query).filter("it.ServiceOrder.Id !== null");
	if (viewModel.filters["Username"]) {
		viewModel.filters["DispatchedUsername"] = viewModel.filters["Username"];
		delete viewModel.filters["Username"];
	}
	if (viewModel.filters["ServiceOrder.OrderNo"]) {
		viewModel.filters["OrderHead.OrderNo"] = viewModel.filters["ServiceOrder.OrderNo"];
		delete viewModel.filters["ServiceOrder.OrderNo"];
	}
	if (viewModel.filters["ServiceOrder.InstallationId"]) {
		viewModel.filters["OrderHead.InstallationId"] = viewModel.filters["ServiceOrder.InstallationId"];
		delete viewModel.filters["ServiceOrder.InstallationId"];
	}
	if (viewModel.filters["ServiceOrder.CustomerContactId"]) {
		viewModel.filters["OrderHead.CustomerContactId"] = viewModel.filters["ServiceOrder.CustomerContactId"];
		delete viewModel.filters["ServiceOrder.CustomerContactId"];
	}
	if (viewModel.filters["ServiceOrder.ServiceObjectId"]) {
		viewModel.filters["OrderHead.ServiceObjectId"] = viewModel.filters["ServiceOrder.ServiceObjectId"];
		delete viewModel.filters["ServiceOrder.ServiceObjectId"];
	}
	if (viewModel.filters["ServiceOrder.StationKey"]) {
		viewModel.filters["OrderHead.StationKey"] = viewModel.filters["ServiceOrder.StationKey"];
		delete viewModel.filters["ServiceOrder.StationKey"];
	}
	if (viewModel.filters["ServiceOrder.RegionKey"]) {
		viewModel.filters["OrderHead.RegionKey"] = viewModel.filters["ServiceOrder.RegionKey"];
		delete viewModel.filters["ServiceOrder.RegionKey"];
	}
	if (viewModel.filters["ServiceOrder.ZipCode"]) {
		viewModel.filters["OrderHead.ZipCode"] = viewModel.filters["ServiceOrder.ZipCode"];
		delete viewModel.filters["ServiceOrder.ZipCode"];
	}
	if (viewModel.filters["ServiceOrder.City"]) {
		viewModel.filters["OrderHead.City"] = viewModel.filters["ServiceOrder.City"];
		delete viewModel.filters["ServiceOrder.City"];
	}
	if (viewModel.filters["ServiceOrder.Street"]) {
		viewModel.filters["OrderHead.Street"] = viewModel.filters["ServiceOrder.Street"];
		delete viewModel.filters["ServiceOrder.Street"];
	}
	if (viewModel.filters["ServiceOrder.ZipCode"]) {
		viewModel.filters["OrderHead.ZipCode"] = viewModel.filters["ServiceOrder.ZipCode"];
		delete viewModel.filters["ServiceOrder.ZipCode"];
	}
	if (viewModel.filters["ServiceOrder.PurchaseOrderNo"]) {
		viewModel.filters["OrderHead.PurchaseOrderNo"] = viewModel.filters["ServiceOrder.PurchaseOrderNo"];
		delete viewModel.filters["ServiceOrder.PurchaseOrderNo"];
	}
	if (viewModel.status === "upcoming") {
		query = query.filter(function(it) { return it.StatusKey in this.statusKeys; },
			{ statusKeys: ["Released", "Read", "InProgress", "SignedByCustomer"] });
	} else if (viewModel.status === "scheduled") {
		query = query.filter(function(it) { return it.StatusKey in this.statusKeys; }, { statusKeys: ["Scheduled"] });
	} else if (viewModel.status === "closed") {
		query = query.filter(function(it) { return it.StatusKey in this.statusKeys; },
			{ statusKeys: ["ClosedNotComplete", "ClosedComplete", "Rejected"] });
	} else if (viewModel.context === "dashboard") {
		var todayStart = window.moment().startOf("day").toDate();
		var todayEnd = window.moment().endOf("day").toDate();
		query = query.filter(function(it) {
				return it.StatusKey in this.statusKeys && it.Time >= this.todayStart && it.Time <= this.todayEnd;
			},
			{
				statusKeys: ["Released", "Read", "InProgress", "SignedByCustomer"],
				todayStart: todayStart,
				todayEnd: todayEnd
			});
	}
	return query;
};
namespace("Crm.Service.ViewModels").ServiceOrderDispatchListIndexViewModel.prototype.confirm = function(dispatch) {
	var viewModel = this;
	window.database.attachOrGet(dispatch.innerInstance);
	viewModel.loading(true);
	dispatch.StatusKey("Released");
	return window.database.saveChanges().then(function() {
		viewModel.showSnackbar(window.Helper.String.getTranslatedString("DispatchConfirmed"), window.Helper.String.getTranslatedString("ViewDispatch"), function() {
			window.location.hash = "/Crm.Service/Dispatch/DetailsTemplate/" + dispatch.Id();
		});
	});
};
namespace("Crm.Service.ViewModels").ServiceOrderDispatchListIndexViewModel.prototype.getDirection = function(dispatch) {
	return window.Main.ViewModels.GeolocationViewModel.prototype.getDirection.call(this, dispatch.ServiceOrder());
};
namespace("Crm.Service.ViewModels").ServiceOrderDispatchListIndexViewModel.prototype.getDistance = function(dispatch) {
	return window.Main.ViewModels.GeolocationViewModel.prototype.getDistance.call(this, dispatch.ServiceOrder());
};
namespace("Crm.Service.ViewModels").ServiceOrderDispatchListIndexViewModel.prototype.getItemGroup = function(dispatch) {
	var viewModel = this;
	if (viewModel.context === "dashboard") {
		return null;
	}
	var mDispatchTime = window.moment(dispatch.Time());
	var mDispatchDate = window.moment(dispatch.Time()).startOf("day").hours(mDispatchTime.hours()).minutes(mDispatchTime.minutes());
	if (viewModel.status === "upcoming" || viewModel.status === "scheduled") {
		if (mDispatchDate.isBefore(window.moment())) {
			return { title: window.Helper.String.getTranslatedString("T_DueTasks"), css: "c-red" };
		}
		if (mDispatchDate.clone().startOf("day").isSame(window.moment().startOf("day"))) {
			return { title: window.Helper.String.getTranslatedString("Today"), css: "c-green" };
		}
		if (mDispatchDate.clone().startOf("day").isSame(window.moment().startOf("day").add(1, "day"))) {
			return { title: window.Helper.String.getTranslatedString("T_TomorrowTasks"), css: "c-blue" };
		}
		if (mDispatchDate.clone().startOf("month").isSame(window.moment().startOf("month"))) {
			return { title: window.Helper.String.getTranslatedString("ThisMonth") };
		}
		if (mDispatchDate.clone().startOf("month").isSame(window.moment().startOf("month").add(1, "month"))) {
			return { title: window.Helper.String.getTranslatedString("NextMonth") };
		}
		return { title: window.Helper.String.getTranslatedString("T_LaterTasks") };
	}
	if (viewModel.status === "closed") {
		if (mDispatchDate.isAfter(window.moment())) {
			return null;
		}
		if (mDispatchDate.clone().startOf("day").isSame(window.moment().startOf("day"))) {
			return { title: window.Helper.String.getTranslatedString("Today"), css: "c-green" };
		}
		if (mDispatchDate.clone().startOf("day").isSame(window.moment().startOf("day").add(-1, "day"))) {
			return { title: window.Helper.String.getTranslatedString("Yesterday"), css: "c-blue" };
		}
		if (mDispatchDate.clone().startOf("month").isSame(window.moment().startOf("month"))) {
			return { title: window.Helper.String.getTranslatedString("ThisMonth") };
		}
		if (mDispatchDate.clone().startOf("month").isSame(window.moment().startOf("month").add(-1, "month"))) {
			return { title: window.Helper.String.getTranslatedString("LastMonth") };
		}
		return { title: window.Helper.String.getTranslatedString("T_Earlier") };
	}
	return null;
};
namespace("Crm.Service.ViewModels").ServiceOrderDispatchListIndexViewModel.prototype.getLatitude = function(dispatch) {
	return dispatch.ServiceOrder().Latitude;
};
namespace("Crm.Service.ViewModels").ServiceOrderDispatchListIndexViewModel.prototype.getLongitude = function(dispatch) {
	return dispatch.ServiceOrder().Longitude;
};
namespace("Crm.Service.ViewModels").ServiceOrderDispatchListIndexViewModel.prototype.getTimelineEvent = function (dispatch) {
		var viewModel = this;
		var startTime = new Date(dispatch.Time());

		var timeLineEvent = {
			title: window.Helper.String.getTranslatedString("Dispatch"),
			start: startTime,
			end: window.moment(startTime).add(window.moment.duration(dispatch.Duration())).toDate(),
			allDay: false,
			url: "#/Crm.Service/Dispatch/DetailsTemplate/" + window.ko.unwrap(dispatch.Id)
		};
		if (dispatch.StatusKey() === "Scheduled") {
			timeLineEvent.hatched = true;
		}
		if (dispatch.ServiceOrder()) {
			timeLineEvent.title = dispatch.ServiceOrder().OrderNo();
			timeLineEvent.entityType = window.Helper.String.getTranslatedString("Dispatch");
			var address =
			[
				dispatch.ServiceOrder().Name1(),
				dispatch.ServiceOrder().Name2(),
				dispatch.ServiceOrder().Name3(),
				dispatch.ServiceOrder().Street(),
				((dispatch.ServiceOrder().ZipCode() || "") + " " + (dispatch.ServiceOrder().City() || "")).trim(),
				dispatch.ServiceOrder().RegionKey() ? window.Helper.Lookup.getLookupValue(viewModel.lookups.regions, dispatch.ServiceOrder().RegionKey()) : null,
				dispatch.ServiceOrder().CountryKey() ? window.Helper.Lookup.getLookupValue(viewModel.lookups.countries, dispatch.ServiceOrder().CountryKey()) : null
			].filter(Boolean).join("\r\n");
			if (address) {
				timeLineEvent.description = address;
			}
			timeLineEvent.backgroundColor = dispatch.StatusKey() === "ClosedNotComplete" || dispatch.StatusKey() === "ClosedComplete"
				? "#aaaaaa"
				: window.Helper.Lookup.getLookupColor(viewModel.lookups.serviceOrderTypes, dispatch.ServiceOrder().TypeKey());
		}
		if(["ClosedComplete", "ClosedNotComplete"].indexOf(dispatch.StatusKey()) === -1){
			timeLineEvent.secondaryColor = Helper.Lookup.getLookupColor(viewModel.lookups.serviceOrderDispatchStatuses, dispatch.StatusKey);
		}
		return timeLineEvent;
	};
namespace("Crm.Service.ViewModels").ServiceOrderDispatchListIndexViewModel.prototype.getIcsLink = function() {
	var viewModel = this;
	var link = window.Main.ViewModels.GenericListViewModel.prototype.getIcsLink.apply(this, arguments);
	var containsQueryParameters = link.indexOf("?") !== -1;
	link += containsQueryParameters ? "&" : "?";
	link += "DF_DispatchedUsername=" + encodeURIComponent(viewModel.currentUser().Id);
	if (viewModel.status === "upcoming" || viewModel.context === "context") {
		link += "&bookmark=Status%2fDispatchesTitle";
	} else if (viewModel.status === "scheduled") {
		link += "&bookmark=Status%2fScheduledDispatches";
	} else if (viewModel.status === "closed") {
		link += "&bookmark=Status%2fClosedDispatches";
	}
	return link;
};
namespace("Crm.Service.ViewModels").ServiceOrderDispatchListIndexViewModel.prototype.getIcsLinkAllowed = function() {
	return window.AuthorizationManager.isAuthorizedForAction("ServiceOrderDispatch", "Ics");
};
namespace("Crm.Service.ViewModels").ServiceOrderDispatchListIndexViewModel.prototype.downloadIcs = function () {
	var viewModel = this;
	var cal = window.ics();
	viewModel.items().forEach(function (x) {
			var location = "";
			var zipCode = Helper.String.trim(x.ServiceOrder().ZipCode());
			var city = Helper.String.trim(x.ServiceOrder().City());
			var street = Helper.String.trim(x.ServiceOrder().Street());
			var location = zipCode + " " + city;
			if (street) {
				location = location + ", " + street;
			}
			var startDate = x.StartTime();
			var endDate = window.moment(startDate).add(window.moment.duration(x.Duration())).toDate();
			var title = Helper.Company.getDisplayName(x.ServiceOrder().Company()) + " - " + x.ServiceOrder().OrderNo();
			var description = window.Helper.Dispatch.getCalendarBodyText(x);
			cal.addEvent(title, description, location, startDate, endDate);
	});

	cal.download("ServiceOrderDispatches");
};
namespace("Crm.Service.ViewModels").ServiceOrderDispatchListIndexViewModel.prototype.getLatitude = function(item) {
	var order = window.ko.unwrap(item.ServiceOrder);
	return order ? window.ko.unwrap(order.Latitude) : null;
};
namespace("Crm.Service.ViewModels").ServiceOrderDispatchListIndexViewModel.prototype.getLongitude = function(item) {
	var order = window.ko.unwrap(item.ServiceOrder);
	return order ? window.ko.unwrap(order.Longitude) : null;
};
namespace("Crm.Service.ViewModels").ServiceOrderDispatchListIndexViewModel.prototype.getPopupInformation = function(item) {
	var order = window.ko.unwrap(item.ServiceOrder);
	return order ? window.ko.unwrap(order.OrderNo) : null;
};
namespace("Crm.Service.ViewModels").ServiceOrderDispatchListIndexViewModel.prototype.getIconName = function(item) {
	return "marker_repair";
};
namespace("Crm.Service.ViewModels").ServiceOrderDispatchListIndexViewModel.prototype.CrmService_ServiceOrderDispatchStatusCustomFilter = function (lookupName, key, filterExpression, filterParameters) {
	let viewModel = this;
	if (viewModel.status === "upcoming") {
		return Helper.Lookup.queryLookup(lookupName, key, "it.Key in this.keys", {keys: ["Released", "Read", "InProgress", "SignedByCustomer"]})
	}
	if (viewModel.status === "scheduled") {
		return Helper.Lookup.queryLookup(lookupName, key, "it.Key in this.keys", {keys: ["Scheduled"]})
	}
	if (viewModel.status === "closed") {
		return Helper.Lookup.queryLookup(lookupName, key, "it.Key in this.keys", {keys: ["ClosedNotComplete", "ClosedComplete", "Rejected"]})
	}
	return Helper.Lookup.queryLookup(lookupName, key, filterExpression, filterParameters);
};