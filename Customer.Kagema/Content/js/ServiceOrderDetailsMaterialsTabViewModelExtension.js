(function () {
    
var baseViewModel =	window.Crm.Service.ViewModels.ServiceOrderDetailsMaterialsTabViewModel;


	window.Crm.Service.ViewModels.ServiceOrderDetailsMaterialsTabViewModel = function (parentViewModel) {
	var viewModel = this;
	viewModel.lookups = parentViewModel.lookups || {};
	viewModel.lookups.commissioningStatuses =
		viewModel.lookups.commissioningStatuses || { $tableName: "CrmService_CommissioningStatus" };
	viewModel.lookups.currencies = viewModel.lookups.currencies || { $tableName: "Main_Currency" };
	viewModel.lookups.noPreviousSerialNoReasons = viewModel.lookups.noPreviousSerialNoReason ||
		{ $tableName: "CrmService_NoPreviousSerialNoReason" };
	viewModel.lookups.quantityUnits = viewModel.lookups.quantityUnits || { $tableName: "CrmArticle_QuantityUnit" };
	viewModel.serviceOrder = parentViewModel.serviceOrder;
	window.Main.ViewModels.GenericListViewModel.call(viewModel,
		"CrmService_ServiceOrderMaterial",
		["ServiceOrderTime.PosNo", "ExtensionValues.iPosNo", "ItemNo"],
		["ASC", "ASC", "ASC"],
		["ServiceOrderTime", "ServiceOrderTime.Installation", "DocumentAttributes", "DocumentAttributes.FileResource", "ServiceOrderMaterialSerials", "Article"]);
	viewModel.infiniteScroll(true);
	viewModel.isEditable = !!ko.unwrap(viewModel.serviceOrder) ? (viewModel.serviceOrder().IsTemplate() ? parentViewModel.serviceOrderTemplateIsEditable : parentViewModel.serviceOrderIsEditable) : window.ko.observable(true);
	viewModel.canEditMaterial = window.ko.observable(true);
		viewModel.showInvoiceQty = window.ko.observable(false);
		viewModel.isOrderClosed = window.ko.observable(false);
};
window.Crm.Service.ViewModels.ServiceOrderDetailsMaterialsTabViewModel.prototype = baseViewModel.prototype;
	  
})();