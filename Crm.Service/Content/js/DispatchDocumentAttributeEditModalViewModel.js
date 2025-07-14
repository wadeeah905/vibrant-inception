namespace("Crm.Service.ViewModels").DispatchDocumentAttributeEditModalViewModel = function(parentViewModel) {
	window.Main.ViewModels.BaseDocumentAttributeEditModalViewModel.apply(this, arguments);
	var viewModel = this;
	viewModel.dispatch = parentViewModel.dispatch;
	viewModel.serviceOrder = parentViewModel.serviceOrder;
};
namespace("Crm.Service.ViewModels").DispatchDocumentAttributeEditModalViewModel.prototype =
	Object.create(window.Main.ViewModels.BaseDocumentAttributeEditModalViewModel.prototype);
namespace("Crm.Service.ViewModels").DispatchDocumentAttributeEditModalViewModel.prototype.init = function(id, params) {
	var viewModel = this;
	return window.Main.ViewModels.BaseDocumentAttributeEditModalViewModel.prototype.init.apply(this, arguments).then(
		function() {
			if (!id) {
				viewModel.documentAttribute().ExtensionValues().DispatchId(ko.unwrap(viewModel.dispatch) ? viewModel.dispatch().Id() : null);
				viewModel.documentAttribute().ReferenceKey(viewModel.serviceOrder().Id());
				viewModel.documentAttribute().ExtensionValues().ServiceOrderTimeId(params.serviceOrderTimeId ||
					(ko.unwrap(viewModel.dispatch) ? viewModel.dispatch().CurrentServiceOrderTimeId() : null) ||
					null);
				viewModel.documentAttribute()
					.ReferenceType(viewModel.documentAttribute().ExtensionValues().ServiceOrderTimeId() ? 5 : 1);
			}
			viewModel.documentAttribute().ExtensionValues().ServiceOrderTimeId.subscribe(function(serviceOrderTimeId) {
				viewModel.documentAttribute().ReferenceType(serviceOrderTimeId ? 5 : 1);
			});
			viewModel.documentAttribute().innerInstance.resetChanges();
		});
};
namespace("Crm.Service.ViewModels").DispatchDocumentAttributeEditModalViewModel.prototype
	.getServiceOrderTimeAutocompleteDisplay = function(serviceOrderTime) {
		var viewModel = this;
		if (viewModel.dispatch && viewModel.dispatch()) {
			return window.Helper.ServiceOrderTime.getAutocompleteDisplay(serviceOrderTime, viewModel.dispatch().CurrentServiceOrderTimeId());
		}
		return window.Helper.ServiceOrderTime.getAutocompleteDisplay(serviceOrderTime, null);
	};
namespace("Crm.Service.ViewModels").DispatchDocumentAttributeEditModalViewModel.prototype
	.getServiceOrderTimeAutocompleteFilter = function(query,term) {
		var viewModel = this;
		query = query.filter(function(it) {
				return it.OrderId === this.orderId;
			},
			{ orderId: viewModel.serviceOrder().Id() });
		if (term) {
			query = query.filter('it.Description.toLowerCase().contains(this.term)||it.ItemNo.toLowerCase().contains(this.term) ||it.PosNo.toLowerCase().contains(this.term)', { term: term });
		}
		return query;
	};