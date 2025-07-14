namespace("Customer.Kagema.ViewModels").ServiceOrderMaterialReportPlannedModalViewModel = function (parentViewModel) {
	var viewModel = this;
	viewModel.dispatch = parentViewModel.dispatch;

	viewModel.lookups = parentViewModel.lookups || {};
	viewModel.refreshParentViewModel = function () {
		parentViewModel.init();
	};

	viewModel.ServiceOrderMaterials = window.ko.observableArray();
	viewModel.loading = window.ko.observable(true);
	viewModel.currentUser = parentViewModel.currentUser

};
namespace("Customer.Kagema.ViewModels").ServiceOrderMaterialReportPlannedModalViewModel.prototype.init = function (id, params) {
	var viewModel = this;
	return window.database.CrmService_ServiceOrderMaterial
		.filter(function (it) { return (it.OrderId === this.id && it.DispatchId == null) || it.DispatchId == this.DispatchId && it.EstimatedQty > 0 }, { id: params.serviceOrderId, DispatchId: params.dispatchId })
		.toArray()
		.then(function (ServiceOrderMaterials) {
			viewModel.ServiceOrderMaterials(window.ko.utils.arrayMap(ServiceOrderMaterials, function (x) {
				return window.database.attachOrGet(x).asKoObservable();
			}))
		})
};

namespace("Customer.Kagema.ViewModels").ServiceOrderMaterialReportPlannedModalViewModel.prototype.save = async function () {
	var viewModel = this;
	viewModel.loading(true);

	viewModel.ServiceOrderMaterials().forEach(function (item) {
		if (item.EstimatedQty() > 0) {
			item.ActualQty(item.EstimatedQty());
			item.DispatchId(viewModel.dispatch().Id())
		}
	});

	try {
		await window.database.saveChanges();
		viewModel.loading(false);
		viewModel.refreshParentViewModel();
		$(".modal:visible").modal("hide");
	} catch (error) {
		viewModel.loading(false);
		window.swal(window.Helper.String.getTranslatedString("UnknownError"),
			window.Helper.String.getTranslatedString("Error_InternalServerError"),
			"error");
	}
};