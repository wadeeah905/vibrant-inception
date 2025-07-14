;
(function(ko) {
	namespace("Crm.Service.ViewModels").DispatchReportViewModel = function() {
		var viewModel = this;
		viewModel.dispatch = ko.observable(null);
		viewModel.dispatchedUser = ko.observable(null);

		window.Crm.Service.ViewModels.ServiceOrderReportViewModel.apply(this, arguments);
	};
	namespace("Crm.Service.ViewModels").DispatchReportViewModel.prototype.init = function(id, params) {
		var viewModel = this;
		if (viewModel.dispatch() && viewModel.dispatch().ServiceOrder && viewModel.dispatch().ServiceOrder()) {
			viewModel.serviceOrder(viewModel.dispatch().ServiceOrder());
		}
		return window.Crm.Service.ViewModels.ServiceOrderReportViewModel.prototype.init.apply(this, arguments).then(function() {
			if (viewModel.dispatch() && viewModel.dispatch().ServiceOrderMaterial && viewModel.dispatch().ServiceOrderMaterial()) {
				viewModel.displayedMaterials(viewModel.dispatch().ServiceOrderMaterial()
					.filter(function(x) { return x.ActualQty() > 0; }));
				viewModel.displayedMaterialSerials(viewModel.displayedMaterials()
					.filter(function(x) { return x.IsSerial(); })
					.map(function(material) { return material.ServiceOrderMaterialSerials(); })
					.reduce(function(serials, act) { return serials.concat(act); }, []));
			}
			if (viewModel.dispatch() && viewModel.dispatch().ServiceOrderTimePostings && viewModel.dispatch().ServiceOrderTimePostings()) {
				viewModel.displayedTimePostings(viewModel.dispatch().ServiceOrderTimePostings());
			}
			if (viewModel.dispatch() && viewModel.dispatch().DispatchedUser && viewModel.dispatch().DispatchedUser()) {
				viewModel.dispatchedUser(viewModel.dispatch().DispatchedUser());
			}
		});
	};
})(ko);