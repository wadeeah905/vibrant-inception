/// <reference path="../../../../../Content/js/ViewModels/GenericListViewModel.js" />
namespace("Main.ViewModels").CompanyDetailsVisitsTabViewModel = function(parentViewModel) {
	var viewModel = this;
	var companyId = parentViewModel.company().Id();
	window.Main.ViewModels.GenericListViewModel.call(viewModel, "CrmVisitReport_Visit", ["PlannedDate", "PlannedEndDate"], ["DESC", "DESC"], ["Parent", "ResponsibleUserUser", "Address"]);
	viewModel.getFilter("ParentId").extend({ filterOperator: "===" })(companyId);
	viewModel.visits = viewModel.items;
	viewModel.lookups = {
		addressTypes: { $tableName: "Main_AddressType"},
		regions: { $tableName: "Main_Region" },
		countries: { $tableName: "Main_Country"},
		visitAim: { $tableName: "CrmVisitReport_VisitAim"},
		visitStatus: { $tableName: "CrmVisitReport_VisitStatus"}
	};
}

namespace("Main.ViewModels").CompanyDetailsVisitsTabViewModel.prototype = Object.create(window.Main.ViewModels.GenericListViewModel.prototype);

namespace("Main.ViewModels").CompanyDetailsVisitsTabViewModel.prototype.init = function() {
	var viewModel = this;
	viewModel.isTabViewModel(true);
	return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups)
		.then(function () { return window.Main.ViewModels.GenericListViewModel.prototype.init.apply(viewModel, arguments); });
}
namespace("Main.ViewModels").CompanyDetailsVisitsTabViewModel.prototype.initItems = function (items) {
	var viewModel = this;
	items.forEach(function (item) {
		var status = viewModel.lookups.visitStatus.$array.find(function (x) {
			return x.Key === item.StatusKey();
		});
		item.sortOrder = ko.observable(status.SortOrder);
	});
	items.sort(function (a, b) {
		return a.sortOrder() > b.sortOrder() ? 1 : -1;
	});
	return items;
};
namespace("Main.ViewModels").CompanyDetailsVisitsTabViewModel.prototype.getItemGroup = function (visit) {
	var viewModel = this;
	var visitStatus = viewModel.lookups.visitStatus.$array.find(function (x) {
		return x.Key === visit.StatusKey();
	});
	var itemGroup = { title: visitStatus.Key ? visitStatus.Value : null }
	return itemGroup;
}

namespace("Main.ViewModels").CompanyDetailsVisitsTabViewModel.prototype.setInProgress = function (item) {
	var viewModel = this;
	viewModel.loading(true);
	window.Helper.Visit.setStatus(item, "InProgress").then(function(){
		viewModel.loading(false);
		viewModel.showSnackbar(window.Helper.String.getTranslatedString("VisitInProgress"));
	});
};
namespace("Main.ViewModels").CompanyDetailsVisitsTabViewModel.prototype.complete = function (item) {
	var viewModel = this;
	viewModel.loading(true);
	window.Helper.Visit.setStatus(item, "Completed").then(function(){
		viewModel.loading(false);
		viewModel.showSnackbar(window.Helper.String.getTranslatedString("VisitCompleted"));
	}).fail(function () {
		viewModel.loading(false);
	});
};