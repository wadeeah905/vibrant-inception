namespace("Crm.Service.ViewModels").ServiceContractListIndexViewModel = function() {
	var viewModel = this;
	var joinTags = {
		Selector: "Tags",
		Operation: "orderBy(function(t) { return t.Name; })"
	};
	window.Main.ViewModels.ContactListViewModel.call(viewModel,
		"CrmService_ServiceContract",
		"ContractNo",
		"ASC",
		["ParentCompany", "ResponsibleUserUser", "ServiceObject", "Installations", "Installations.Child", joinTags]);
	viewModel.lookups = {
		serviceContractStatuses: { $tableName: "CrmService_ServiceContractStatus" },
		serviceContractTypes: { $tableName: "CrmService_ServiceContractType" }
	};
};
namespace("Crm.Service.ViewModels").ServiceContractListIndexViewModel.prototype =
	Object.create(window.Main.ViewModels.ContactListViewModel.prototype);
namespace("Crm.Service.ViewModels").ServiceContractListIndexViewModel.prototype.applyFilters = function(query) {
	var viewModel = this;
	var dateFilter = viewModel.filters["MaintenancePlans"];
	var date = window.ko.unwrap(dateFilter) || null;
	delete viewModel.filters["MaintenancePlans"];
	query = window.Main.ViewModels.ContactListViewModel.prototype.applyFilters.call(viewModel, query);
	return viewModel.filerByNextFireDate(query, date, dateFilter);
};
namespace("Crm.Service.ViewModels").ServiceContractListIndexViewModel.prototype.filerByNextFireDate = function(query, date, filter){
	var viewModel = this;
	if (date && date.Value) {
		query = query.filter("filerByNextFireDate", { date: date });
	}
	viewModel.filters["MaintenancePlans"] = filter;
 	return query;
};
namespace("Crm.Service.ViewModels").ServiceContractListIndexViewModel.prototype.getNextDate = function (serviceContractId) {
	if (!window.AuthorizationManager.currentUserHasPermission("Sync::MaintenancePlan")) {
		return new $.Deferred().resolve(null).promise();
	}
	return window.database.CrmService_MaintenancePlan
		.filter("it.ServiceContractId == this.contractId",
			{ contractId: ko.unwrap(serviceContractId) })
		.map(function (it) {
			return it.NextDate;
		})
		.toArray()
		.then(function (array) {
			if (array.length > 0) {
				return array[0];
			}
			return null;
		});
}
namespace("Crm.Service.ViewModels").ServiceContractListIndexViewModel.prototype.init = function() {
	var viewModel = this;
	var args = arguments;
	return window.Helper.User.getCurrentUser().then(function(user) {
		viewModel.currentUser(user);
	}).then(function() {
		return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups);
	}).then(function() {
		viewModel.bookmarks.push({
			Category: window.Helper.String.getTranslatedString("Show"),
			Name: window.Helper.String.getTranslatedString("All"),
			Key: "All",
			Expression: function(query) {
				return query;
			}
		});
		viewModel.lookups.serviceContractStatuses.$array
			.filter(function(serviceContractStatus) {
				return serviceContractStatus.Key !== null;
			}).forEach(function(serviceContractStatus) {
				var bookmark = {
					Category: window.Helper.String.getTranslatedString("Show"),
					Name: serviceContractStatus.Value,
					Key: serviceContractStatus.Key,
					Expression: function(query) {
						return query.filter(function(it) { return it.StatusKey === this.statusKey; },
							{ statusKey: serviceContractStatus.Key });
					}
				};
				viewModel.bookmarks.push(bookmark);
				if (!viewModel.bookmark()) {
					viewModel.bookmark(bookmark);
				}
			});
		return window.Main.ViewModels.ContactListViewModel.prototype.init.apply(viewModel, args);
	});
};
namespace("Crm.Service.ViewModels").ServiceContractListIndexViewModel.prototype.initItems = function (items) {
	const viewModel = this;
	const args = arguments;
	items.forEach(function (contract) {
		contract.NextDate = window.ko.observable(null);
		viewModel.getNextDate(contract.Id()).then(function (date) {
			contract.NextDate(date);
		});
	});
	return window.Main.ViewModels.ContactListViewModel.prototype.initItems.apply(viewModel, args);
};