namespace("Crm.Service.ViewModels").ServiceCaseListIndexViewModel = function() {
	var viewModel = this;
	viewModel.currentUser = window.ko.observable(null);
	var joinTags = {
		Selector: "Tags",
		Operation: "orderBy(function(t) { return t.Name; })"
	};
	window.Main.ViewModels.ContactListViewModel.call(viewModel,
		"CrmService_ServiceCase",
		"ServiceCaseCreateDate",
		"DESC",
		["AffectedCompany", "AffectedInstallation", "ResponsibleUserUser", "ServiceObject", joinTags]);
	viewModel.bookmarks.push({
		Category: window.Helper.String.getTranslatedString("View"),
		Name: window.Helper.String.getTranslatedString("All"),
		Key: "All",
		Expression: function(query) {
			return query;
		}
	});
	viewModel.bookmarks.push({
		Category: window.Helper.String.getTranslatedString("View"),
		Name: window.Helper.String.getTranslatedString("OpenServiceCases"),
		Key: "OpenServiceCases",
		Expression: function(query) {
			return query.filter(function(x) { return x.StatusKey in this.statusKeys; },
				{ statusKeys: viewModel.openStatuses() });
		}
	});
	viewModel.bookmarks.push({
		Category: window.Helper.String.getTranslatedString("View"),
		Name: window.Helper.String.getTranslatedString("ClosedServiceCases"),
		Key: "ClosedServiceCases",
		Expression: function(query) {
			return query.filter(function(x) { return x.StatusKey in this.statusKeys; },
				{ statusKeys: viewModel.closedStatuses() });
		}
	});
	viewModel.bookmark(viewModel.bookmarks()[1]);
	viewModel.lookups = {
		serviceCaseCategories: { $tableName: "CrmService_ServiceCaseCategory" },
		serviceCaseStatuses: { $tableName: "CrmService_ServiceCaseStatus" },
		servicePriorities: { $tableName: "CrmService_ServicePriority" }
	};

	var createServiceOrderBulkAction = {
		Name: "CreateServiceOrder",
		Modal: {
			Target: "#modal",
			Route: "Crm.Service/ServiceCase/CreateServiceOrderTemplate"
		}
	};
	viewModel.bulkActions.push(createServiceOrderBulkAction);
	var addToServiceOrderBulkAction = {
		Name: "AddToServiceOrder",
		Modal: {
			Target: "#modal",
			Route: "Crm.Service/ServiceCase/AddToServiceOrder"
		}
	};
	viewModel.bulkActions.push(addToServiceOrderBulkAction);
	if (window.AuthorizationManager.isAuthorizedForAction("ServiceCase", "SetStatusMultiple")) {
		var setStatusBulkAction = {
			Name: "SetStatus",
			Modal: {
				Target: "#smModal",
				Route: "Crm.Service/ServiceCase/SetStatusTemplate"
			}
		};
		viewModel.bulkActions.push(setStatusBulkAction);
	}
};
namespace("Crm.Service.ViewModels").ServiceCaseListIndexViewModel.prototype =
	Object.create(window.Main.ViewModels.ContactListViewModel.prototype);
namespace("Crm.Service.ViewModels").ServiceCaseListIndexViewModel.prototype.applyOrderBy = function (query) {
	var viewModel = this;
	if (viewModel.orderBy() === "Priority" && viewModel.orderByDirection() === "ASC") {
		return query.orderBy("it.PriorityKey");
	}
	if (viewModel.orderBy() === "Priority") {
		return query.orderByDescending("it.PriorityKey");
	}
	if (viewModel.orderBy() === "Status" && viewModel.orderByDirection() === "DESC") {
		return query.orderByDescending("it.StatusKey");
	}
	if (viewModel.orderBy() === "Status") {
		return query.orderBy("it.StatusKey");
	}
	return window.Main.ViewModels.ContactListViewModel.prototype.applyOrderBy.apply(viewModel, arguments);
};
namespace("Crm.Service.ViewModels").ServiceCaseListIndexViewModel.prototype.init = function(id, params) {
	var viewModel = this;
	var args = arguments;
	return window.Helper.User.getCurrentUser().then(function(user) {
		viewModel.currentUser(user);
		return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups);
	}).then(function() {
		return window.Main.ViewModels.ContactListViewModel.prototype.init.apply(viewModel, args);
	});
};
namespace("Crm.Service.ViewModels").ServiceCaseListIndexViewModel.prototype.closedStatuses = function () {
	var viewModel = this;
	return viewModel.lookups
		.serviceCaseStatuses.$array.filter(function (x) { return x.Groups === "Closed" }).map(function (x) { return x.Key });
}
namespace("Crm.Service.ViewModels").ServiceCaseListIndexViewModel.prototype.openStatuses = function () {
	var viewModel = this;
	return viewModel.lookups
		.serviceCaseStatuses.$array.filter(function (x) { return x.Key !== null && x.Groups !== "Closed" }).map(function (x) { return x.Key });
}
namespace("Crm.Service.ViewModels").ServiceCaseListIndexViewModel.prototype.initItems = function (items) {
	const viewModel = this;
	const args = arguments;
	var queries = [];
	items.forEach(function (serviceCase) {
		queries.push({
			queryable: window.database.Main_User.filter(function (it) {
					return it.Id === this.createUser;
				},
				{ createUser: serviceCase.ServiceCaseCreateUser }),
			method: "toArray",
			handler: function (users) {
				serviceCase.CreateUserUser = ko.observable(null);
				if (users.length > 0) {
					serviceCase.CreateUserUser(users[0]);
				}
				return items;
			}
		});
	});
	return Helper.Batch.Execute(queries).then(function () {
		return window.Main.ViewModels.ContactListViewModel.prototype.initItems.apply(viewModel, args);
	});
};