namespace("Main.ViewModels").CompanyDetailsOrdersTabViewModel = function (parentViewModel) {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	window.Crm.Order.ViewModels.OrderListIndexViewModel.call(viewModel, "CrmOrder_Order", "CreateDate", "DESC");
	viewModel.isTabViewModel(true);
	var companyId = parentViewModel.company().Id();
	viewModel.companyId = window.ko.observable(companyId);
	viewModel.getFilter("ContactId").extend({ filterOperator: "===" })(companyId);
}
namespace("Main.ViewModels").CompanyDetailsOrdersTabViewModel.prototype = Object.create(window.Crm.Order.ViewModels.OrderListIndexViewModel.prototype);
namespace("Main.ViewModels").CompanyDetailsOrdersTabViewModel.prototype.applyOrderBy = function (query) {
	var viewModel = this;
	var keys = viewModel.lookups.statuses.$array.filter(x => x.Key !== null).map(x => x.Key);
	if (keys.length > 0) {
		query = query.orderByDescending("orderByArray", {property: "StatusKey", values: keys});
	}
	return window.Crm.Order.ViewModels.OrderListIndexViewModel.prototype.applyOrderBy.call(viewModel, query);
};
namespace("Main.ViewModels").CompanyDetailsOrdersTabViewModel.prototype.getItemGroup = function (order) {
	return {
		title: window.Helper.Lookup.getLookupValue(this.lookups.statuses, order.StatusKey())
	};
};