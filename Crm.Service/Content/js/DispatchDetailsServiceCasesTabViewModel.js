/// <reference path="dispatchdetailsviewmodel.js" />
/// <reference path="serviceorderdetailsservicecasestabviewmodel.js" />
namespace("Crm.Service.ViewModels").DispatchDetailsServiceCasesTabViewModel = function(parentViewModel) {
	window.Crm.Service.ViewModels.ServiceOrderDetailsServiceCasesTabViewModel.apply(this, arguments);
	var viewModel = this;
	viewModel.dispatch = parentViewModel.dispatch;
};
namespace("Crm.Service.ViewModels").DispatchDetailsServiceCasesTabViewModel.prototype =
	Object.create(window.Crm.Service.ViewModels.ServiceOrderDetailsServiceCasesTabViewModel.prototype);
namespace("Crm.Service.ViewModels").DispatchDetailsServiceCasesTabViewModel.prototype.applyOrderBy = function (query) {
	var viewModel = this;
	query = query.orderByDescending("orderByCurrentServiceOrderTime", { currentServiceOrderTimeId: viewModel.dispatch().CurrentServiceOrderTimeId() });
	return window.Main.ViewModels.GenericListViewModel.prototype.applyOrderBy.call(viewModel, query);
};
namespace("Crm.Service.ViewModels").DispatchDetailsServiceCasesTabViewModel.prototype.complete = function(serviceCase) {
	var viewModel = this;
	viewModel.loading(true);
	var completedServiceCaseStatus = viewModel.lookups.serviceCaseStatuses.$array.find(function(x) {
		return x.Key === viewModel.completedStatus;
	});
	return window.Crm.Service.ViewModels.ServiceCaseDetailsViewModel.prototype.setStatus.bind({
		loading: viewModel.loading,
		serviceCase: window.ko.observable(serviceCase)
	})(completedServiceCaseStatus)
	.then(function() {
		viewModel.loading(false);
	});
};
namespace("Crm.Service.ViewModels").DispatchDetailsServiceCasesTabViewModel.prototype.completedStatus = 6;
namespace("Crm.Service.ViewModels").DispatchDetailsServiceCasesTabViewModel.prototype.getItemGroup =
	window.Crm.Service.ViewModels.DispatchDetailsViewModel.prototype.getServicOrderPositionItemGroup;