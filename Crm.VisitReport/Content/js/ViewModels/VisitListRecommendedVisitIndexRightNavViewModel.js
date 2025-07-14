/// <reference path="../../../../../Content/js/ViewModels/GenericListViewModel.js" />
namespace("Crm.VisitReport.ViewModels").VisitListRecommendedVisitIndexRightNavViewModel = function() {
	var viewModel = this;
	var joinAddresses = {
		Selector: "Addresses",
		Operation: "filter(function(a) { return a.IsCompanyStandardAddress === true; })"
	};
	window.Main.ViewModels.GenericListViewModel.call(viewModel, "Main_Company", "ExtensionValues.VisitFrequencyValuePerYear", "DESC", [joinAddresses, "ResponsibleUserUser"]);
	viewModel.currentOrderBy = window.ko.observable("VisitsNeeded");
	viewModel.enableUrlUpdate(false);
	viewModel.lookups = {
		companyTypes: {},
		countries: {},
		regions: {},
		timeUnit: {}
	};
	viewModel.setOrderBy = function (value) {
		if (value === viewModel.currentOrderBy()) {
			return;
		}
		if (value === "VisitsNeeded") {
			viewModel.orderBy("ExtensionValues.VisitFrequencyValuePerYear");
			viewModel.orderByDirection("DESC");
		}
		viewModel.page(1);
		viewModel.currentOrderBy(value);
		viewModel.currentSearch = viewModel.search();
	};
};
namespace("Crm.VisitReport.ViewModels").VisitListRecommendedVisitIndexRightNavViewModel.prototype = Object.create(window.Main.ViewModels.GenericListViewModel.prototype);
namespace("Crm.VisitReport.ViewModels").VisitListRecommendedVisitIndexRightNavViewModel.prototype.init = function() {
	var viewModel = this;
	return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups)
		.then(function () {
			return window.Main.ViewModels.GenericListViewModel.prototype.init.apply(viewModel, arguments);
		});
};
namespace("Crm.VisitReport.ViewModels").VisitListRecommendedVisitIndexRightNavViewModel.prototype.applyFilters = function (query) {
	var viewModel = this;
	query = window.Main.ViewModels.GenericListViewModel.prototype.applyFilters.call(viewModel, query);
	query = query.filter(function (company) {
		return company.ExtensionValues.VisitFrequencyValuePerYear > 0;
	});
	return query;
};
namespace("Crm.VisitReport.ViewModels").VisitListRecommendedVisitIndexRightNavViewModel.prototype.initItems = function (items) {
	items.forEach(async function (item) {
		item.visitReports = window.ko.observableArray([]);
		item.lastVisitReport = window.ko.observable(null);

		await window.database.CrmVisitReport_VisitReport
			.include("Company")
			.filter("it.Company.Id == this.CompanyId", { CompanyId: item.Id })
			.toArray()
			.then(function (visitReports) {
				visitReports.forEach(function (visitReport) {
					item.visitReports.push(visitReport.asKoObservable());
					if (item.lastVisitReport() === null)
						item.lastVisitReport(new Date(1900, 0, 1));
					if (window.moment(visitReport.CreateDate).isAfter(item.lastVisitReport())) {
						item.lastVisitReport(visitReport.CreateDate);
					}
				});
			});
	});
	return items;
};