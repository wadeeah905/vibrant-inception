namespace("Crm.Service.ViewModels").ServiceOrderDetailsChecklistsTabViewModel = function(parentViewModel) {
	window.Crm.Service.ViewModels.DispatchDetailsChecklistsTabViewModel.apply(this, arguments);
	this.parentViewModel = parentViewModel;
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsChecklistsTabViewModel.prototype =
	Object.create(window.Crm.Service.ViewModels.DispatchDetailsChecklistsTabViewModel.prototype);
namespace("Crm.Service.ViewModels").ServiceOrderDetailsChecklistsTabViewModel.prototype.checklistIsDeletable =
	function(serviceOrderChecklist) {
		return this.parentViewModel.serviceOrderIsEditable() && !serviceOrderChecklist.Completed();
	};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsChecklistsTabViewModel.prototype.checklistIsEditable =
	function (serviceOrderChecklist) {
		return this.parentViewModel.serviceOrderIsEditable() && !serviceOrderChecklist.Completed();
	};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsChecklistsTabViewModel.prototype.applyFilters = function (query) {
	var viewModel = this;
	query = window.Main.ViewModels.GenericListViewModel.prototype.applyFilters.call(viewModel, query);
	query = query
		.filter("it.ReferenceKey === this.orderId", { orderId: viewModel.serviceOrder().Id() });
	if (!ko.unwrap(viewModel.getFilter("DynamicFormTitle"))) {
		query = viewModel.applyFilter(query, "", "DynamicFormTitle");
	}
	return query;
};