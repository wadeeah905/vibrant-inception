namespace("Crm.Service.ViewModels").InstallationDetailsServiceCasesTabViewModel = function(parentViewModel) {
	window.Main.ViewModels.ViewModelBase.call(this, arguments);
	var viewModel = this;
	viewModel.currentUser = window.ko.observable(null);
	viewModel.lookups = parentViewModel.lookups || {};
	viewModel.lookups.serviceCaseCategories = { $tableName: "CrmService_ServiceCaseCategory" };
	viewModel.lookups.serviceCaseStatuses = { $tableName: "CrmService_ServiceCaseStatus" };
	viewModel.lookups.servicePriorities = { $tableName: "CrmService_ServicePriority" };
	viewModel.installation = parentViewModel.installation;
	window.Main.ViewModels.GenericListViewModel.call(viewModel,
		"CrmService_ServiceCase",
		["StatusKey", "CreateDate"],
		["ASC", "DESC"],
		["ResponsibleUserUser"]);
	viewModel.getFilter("AffectedInstallationKey").extend({ filterOperator: "===" })(viewModel.installation().Id());
	viewModel.infiniteScroll(true);
};
namespace("Crm.Service.ViewModels").InstallationDetailsServiceCasesTabViewModel.prototype =
	Object.create(window.Main.ViewModels.GenericListViewModel.prototype);
namespace("Crm.Service.ViewModels").InstallationDetailsServiceCasesTabViewModel.prototype.init = function() {
	var viewModel = this;
	return window.Helper.User.getCurrentUser().then(function(user) {
		viewModel.currentUser(user);
		return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups);
	}).then(function() {
		return window.Main.ViewModels.GenericListViewModel.prototype.init.apply(viewModel, arguments);
	});
};
namespace("Crm.Service.ViewModels").InstallationDetailsServiceCasesTabViewModel.prototype.getItemGroup =
	function(serviceCase) {
		var viewModel = this;
		return {
			title: window.Helper.Lookup.getLookupValue(viewModel.lookups.serviceCaseStatuses, serviceCase.StatusKey)
		};
	};
namespace("Crm.Service.ViewModels").InstallationDetailsServiceCasesTabViewModel.prototype.initItems = function (items) {
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
		return items;
	});
};