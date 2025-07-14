namespace("Crm.Service.ViewModels").ServiceOrderDetailsServiceCasesTabViewModel = function(parentViewModel) {
	window.Main.ViewModels.ViewModelBase.call(this, arguments);
	var viewModel = this;
	viewModel.currentUser = window.ko.observable(null);
	viewModel.lookups = parentViewModel.lookups || {};
	viewModel.lookups.serviceCaseCategories = { $tableName: "CrmService_ServiceCaseCategory" };
	viewModel.lookups.serviceCaseStatuses = { $tableName: "CrmService_ServiceCaseStatus" };
	viewModel.lookups.servicePriorities = { $tableName: "CrmService_ServicePriority" };
	viewModel.serviceOrder = parentViewModel.serviceOrder;
	window.Main.ViewModels.GenericListViewModel.call(viewModel,
		"CrmService_ServiceCase",
		["ServiceOrderTime.PosNo", "ServiceCaseNo", "ErrorMessage"],
		["ASC", "ASC", "ASC"],
		["ServiceOrderTime", "ServiceOrderTime.Installation"]);

	viewModel.infiniteScroll(true);
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsServiceCasesTabViewModel.prototype =
	Object.create(window.Main.ViewModels.GenericListViewModel.prototype);
namespace("Crm.Service.ViewModels").ServiceOrderDetailsServiceCasesTabViewModel.prototype.init = function() {
	var viewModel = this;
	return window.Helper.User.getCurrentUser().then(function (user) {
		viewModel.currentUser(user);
		return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups);
	}).then(function() {
		return window.Main.ViewModels.GenericListViewModel.prototype.init.apply(viewModel, arguments);
	});
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsServiceCasesTabViewModel.prototype.applyFilters = function (query) {
	var viewModel = this;
	query = window.Main.ViewModels.GenericListViewModel.prototype.applyFilters.call(viewModel, query);
	return query.filter("it.ServiceOrderTime.OrderId === this.serviceOrderId || it.OriginatingServiceOrderId === this.serviceOrderId",
		{ serviceOrderId: viewModel.serviceOrder().Id() });
};
$(function() {

	namespace("Crm.Service.ViewModels").ServiceOrderDetailsServiceCasesTabViewModel.prototype.getItemGroup =
		window.Crm.Service.ViewModels.DispatchDetailsViewModel.prototype.getServicOrderPositionItemGroup;
});
namespace("Crm.Service.ViewModels").ServiceOrderDetailsServiceCasesTabViewModel.prototype.initItems = function (items) {
	var queries = [];
	items.forEach(function(serviceCase) {
		queries.push({
			queryable: window.database.Main_User.filter(function(it) {
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
		return items;
	});
};