namespace("Crm.Service.ViewModels").ServiceOrderHeadListIndexViewModel = function (parentViewModel) {
	var viewModel = this;
	viewModel.currentUser = window.ko.observable(null);
	viewModel.parentViewModel = parentViewModel;
	viewModel.currentUserUsergroupIds = window.ko.pureComputed(function () {
		return viewModel.currentUser()
			? viewModel.currentUser().UsergroupIds
			: [];
	});

	var joinTags = {
		Selector: "Tags",
		Operation: "orderBy(function(t) { return t.Name; })"
	};
	window.Main.ViewModels.GeolocationViewModel.apply(viewModel, arguments);
	window.Main.ViewModels.ContactListViewModel.call(viewModel,
		"CrmService_ServiceOrderHead",
		["Planned", "PlannedTime", "OrderNo"],
		["DESC", "DESC", "DESC"],
		["Installation", "Installation.Address", "Installation.Company", "Company", "ServiceObject", "ServiceOrderTemplate", "ServiceOrderTimes", "ServiceOrderTimes.Installation", "Station", joinTags]);
	viewModel.contactType = "ServiceOrder";
	viewModel.lookups = {
		countries: { $tableName: "Main_Country" },
		installationHeadStatuses: { $tableName: "CrmService_InstallationHeadStatus" },
		regions: { $tableName: "Main_Region" },
		serviceOrderNoInvoiceReasons: { $tableName: "CrmService_ServiceOrderNoInvoiceReason" },
		serviceOrderTypes: { $tableName: "CrmService_ServiceOrderType" },
		servicePriorities: { $tableName: "CrmService_ServicePriority" },
		serviceOrderStatuses: { $tableName: "CrmService_ServiceOrderStatus" }
	};
	window.Main.ViewModels.GenericListMapViewModel.call(this);
	let statusKeyFilter = this.getFilter("StatusKey").extend({ filterOperator: { operator: "in", 
			additionalProperties: {
				caption: "Status",
				getDisplayedValue: (keys) => this.getDisplayedValueFromLookups("CrmService_ServiceOrderStatus", keys) 
			} 
		} 
	});
	const activeBookmark = {
		Category: window.Helper.String.getTranslatedString("Filter"),
		Name: window.Helper.String.getTranslatedString("All"),
		Key: "All",
		ApplyFilters: () => {
			statusKeyFilter(null);
		}
	};
	viewModel.bookmarks.push(activeBookmark);
	viewModel.bookmark(activeBookmark);
	viewModel.bookmarks.push({
		Category: window.Helper.String.getTranslatedString("Filter"),
		Name: window.Helper.String.getTranslatedString("ReadyForScheduling"),
		Key: "ReadyForScheduling",
		ApplyFilters: () => {
			statusKeyFilter(["ReadyForScheduling", "PartiallyCompleted"]);
		}
	});
	viewModel.bookmarks.push({
		Category: window.Helper.String.getTranslatedString("Filter"),
		Name: window.Helper.String.getTranslatedString("OpenOrders"),
		Key: "OpenOrders",
		ApplyFilters: () => {
			statusKeyFilter(["New", "ReadyForScheduling", "Scheduled", "PartiallyReleased", "Released", "InProgress", "PartiallyCompleted", "Completed", "PostProcessing", "ReadyForInvoice", "Invoiced"]);
		}
	});
	viewModel.bookmarks.push({
		Category: window.Helper.String.getTranslatedString("Filter"),
		Name: window.Helper.String.getTranslatedString("ClosedServiceOrders"),
		Key: "ClosedServiceOrders",
		ApplyFilters: () => {
			statusKeyFilter(["Closed"]);
		}
	});
	this.bookmarks.push({
		Category: window.Helper.String.getTranslatedString("Filter"),
		Name: window.Helper.String.getTranslatedString("PostProcessing"),
		Key: "PostProcessing",
		ApplyFilters: () => {
			statusKeyFilter(["Completed", "PostProcessing","ReadyForInvoice"]);
		}
	});
	this.replicationHintInfo = { SettingName : "ClosedServiceOrderHistory", HintTranslationKey : "IncompleteServiceOrderHistoryHint" };
};
namespace("Crm.Service.ViewModels").ServiceOrderHeadListIndexViewModel.prototype =
	Object.create(window.Main.ViewModels.ContactListViewModel.prototype);
namespace("Crm.Service.ViewModels").ServiceOrderHeadListIndexViewModel.prototype.init = function() {
	var viewModel = this;
	var args = arguments;
	return window.Helper.User.getCurrentUser().then(function (user) {
		viewModel.currentUser(user);
	}).then(function () {
		return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups);
	}).then(function () {
		return window.Main.ViewModels.ContactListViewModel.prototype.init.apply(viewModel, args);
	}).then(function () {
		return window.Main.ViewModels.GeolocationViewModel.prototype.init.apply(viewModel, args);
	});
};
namespace("Crm.Service.ViewModels").ServiceOrderHeadListIndexViewModel.prototype.dispose = function() {
	return window.Main.ViewModels.GeolocationViewModel.prototype.dispose.apply(this, arguments);
};
namespace("Crm.Service.ViewModels").ServiceOrderHeadListIndexViewModel.prototype.getDirection =
	function(serviceOrder) {
		return window.Main.ViewModels.GeolocationViewModel.prototype.getDirection.call(this, serviceOrder);
	};
namespace("Crm.Service.ViewModels").ServiceOrderHeadListIndexViewModel.prototype.getDistance =
	function(serviceOrder) {
		return window.Main.ViewModels.GeolocationViewModel.prototype.getDistance.call(this, serviceOrder);
	};
namespace("Crm.Service.ViewModels").ServiceOrderHeadListIndexViewModel.prototype.getItemGroup = function(serviceOrder) {
	var viewModel = this;
	var priorityKey = serviceOrder.PriorityKey();
	if (viewModel.fastLanePriorityKeys && viewModel.fastLanePriorityKeys.hasOwnProperty(priorityKey)) {
		return { title: window.Helper.String.getTranslatedString("FastLane"), css: "c-red" };
	}
	return null;
};
namespace("Crm.Service.ViewModels").ServiceOrderHeadListIndexViewModel.prototype.applyOrderBy = function(query) {
	var viewModel = this;
	viewModel.fastLanePriorityKeys = viewModel.lookups.servicePriorities.$array.reduce(function(map, x) {
		if (x.IsFastLane === true) {
			map[x.Key] = true;
		}
		return map;
	}, {});
	var keys = Object.keys(viewModel.fastLanePriorityKeys);
	if (keys.length > 0) {
		query = query.orderByDescending("orderByFastLanePriority", { keys: keys });
	}
	return window.Main.ViewModels.ContactListViewModel.prototype.applyOrderBy.call(viewModel, query);
};
namespace("Crm.Service.ViewModels").ServiceOrderHeadListIndexViewModel.prototype.applyFilters = function(query) {
	var viewModel = this;
	if (viewModel.filters["ServiceCase.ServiceCaseNo"]) {
		viewModel.filters["ServiceCaseNo"] = viewModel.filters["ServiceCase.ServiceCaseNo"];
		delete viewModel.filters["ServiceCase.ServiceCaseNo"];
	}
	if (ko.unwrap(viewModel.filters["ResponsibleUser-Usergroup"])) {
		var responsibleUserGroup = viewModel.filters["ResponsibleUser-Usergroup"]();
		delete viewModel.filters["ResponsibleUser-Usergroup"];
		if (!ko.unwrap(viewModel.filters["ResponsibleUser"])) {
			query = query.filter(function (it) {
				return it.UserGroupKey === this.usergroup;
			}, { usergroup: responsibleUserGroup.Value });
		}
	}
	query = window.Main.ViewModels.ContactListViewModel.prototype.applyFilters.call(viewModel, query);
	if (!window.AuthorizationManager.isAuthorizedForAction("ServiceOrder", "SeeAllUsersServiceOrders")) {
		query = query.filter(function(serviceOrder) {
			return (serviceOrder.CreateUser === this.username ||
				serviceOrder.PreferredTechnician === this.username ||
				(serviceOrder.PreferredTechnician === null && serviceOrder.PreferredTechnicianUsergroupKey in this.usergroups));
			},
			{
				username: viewModel.currentUser().Id,
				usergroups: viewModel.currentUserUsergroupIds()
			});
	}
	query = query.filter(function (serviceOrder) { return serviceOrder.IsTemplate === false; });
	return query;
};
namespace("Crm.Service.ViewModels").ServiceOrderHeadListIndexViewModel.prototype.getPopupInformation = function(item) {
	return window.ko.unwrap(item.OrderNo);
};
namespace("Crm.Service.ViewModels").ServiceOrderHeadListIndexViewModel.prototype.getIconName = function(item) {
	return "marker_repair";
};
namespace("Crm.Service.ViewModels").ServiceOrderHeadListIndexViewModel.prototype.initItems = function (items) {
	const viewModel = this;
	const args = arguments;
	items.forEach(function (order) {
		order.Installations = window.ko.observableArray(window.Helper.ServiceOrder.getRelatedInstallations(order));
	});
	return window.Main.ViewModels.ContactListViewModel.prototype.initItems.apply(viewModel, args);
};