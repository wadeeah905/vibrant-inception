/// <reference path="serviceorderdetailsmaterialstabviewmodel.js" />
/// <reference path="../../../Crm.Service/Content/js/DispatchDetailsViewModel.js" />
/// <reference path="offlinemodel.js" />

namespace("Crm.Service.ViewModels").DispatchDetailsMaterialsTabViewModel = function (parentViewModel) {
	window.Crm.Service.ViewModels.ServiceOrderDetailsMaterialsTabViewModel.apply(this, arguments);
	var viewModel = this;

	viewModel.dispatch = parentViewModel.dispatch;
	viewModel.validCostItemNosAfterCustomerSignature = window.ko.observableArray([]);
	viewModel.validMaterialItemNosAfterCustomerSignature = window.ko.observableArray([]);
	viewModel.canAddMaterial = window.ko.pureComputed(function () {
		return parentViewModel.dispatchIsEditable() ||
			(viewModel.dispatch().StatusKey() === "SignedByCustomer" &&
				viewModel.validMaterialItemNosAfterCustomerSignature().length > 0);
	});
	viewModel.canAddCost = window.ko.pureComputed(function () {
		return parentViewModel.dispatchIsEditable() ||
			(viewModel.dispatch().StatusKey() === "SignedByCustomer" &&
				viewModel.validCostItemNosAfterCustomerSignature().length > 0);
	});
	viewModel.currentJobItemGroup = ko.pureComputed(() => window.Helper.Dispatch.getCurrentJobItemGroup(viewModel));
};
namespace("Crm.Service.ViewModels").DispatchDetailsMaterialsTabViewModel.prototype =
	Object.create(window.Crm.Service.ViewModels.ServiceOrderDetailsMaterialsTabViewModel.prototype);


namespace("Crm.Service.ViewModels").DispatchDetailsMaterialsTabViewModel.prototype.applyFilters = function(query) {
	var viewModel = this;
	query =
		window.Crm.Service.ViewModels.ServiceOrderDetailsMaterialsTabViewModel.prototype.applyFilters.call(viewModel,
			query);
	var dispatchId = viewModel.dispatch().Id();
	query = query
		.filter(function(it) {
				return it.DispatchId === this.dispatchId ||
					(it.DispatchId === null && it.EstimatedQty > 0 && it.ActualQty === 0);
			},
			{ dispatchId: dispatchId });
	return query;
};
namespace("Crm.Service.ViewModels").DispatchDetailsMaterialsTabViewModel.prototype.applyOrderBy = function(query) {
	var viewModel = this;
	var id = null;
	if (viewModel.dispatch().CurrentServiceOrderTimeId()) {
		id = viewModel.dispatch().CurrentServiceOrderTimeId();
	}
	query = query.orderByDescending("orderByCurrentServiceOrderTime", { currentServiceOrderTimeId: id });
	return window.Crm.Service.ViewModels.ServiceOrderDetailsMaterialsTabViewModel.prototype.applyOrderBy.call(viewModel,
		query);
};
namespace("Crm.Service.ViewModels").DispatchDetailsMaterialsTabViewModel.prototype.getItemGroup = window.Crm.Service
	.ViewModels.DispatchDetailsViewModel.prototype.getServicOrderPositionItemGroup;
namespace("Crm.Service.ViewModels").DispatchDetailsMaterialsTabViewModel.prototype.init = function() {
	var viewModel = this;
	return window.Main.ViewModels.GenericListViewModel.prototype.init.apply(viewModel, arguments).then(() => {
		return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups).then(() => {
			return window.database.CrmArticle_Article.filter((it) => {
				return (it.ArticleTypeKey === "Material" || it.ArticleTypeKey === "Cost") && it.ExtensionValues.CanBeAddedAfterCustomerSignature && !it.ExtensionValues.IsHidden;
			}).toArray()
				.then((items) => {
					var result = items.reduce((r, o) => {
						r[o.ArticleTypeKey === "Material" ? 'materials' : 'costs'].push(o);
						return r;
					}, { materials: [], costs: [] });
					viewModel.validMaterialItemNosAfterCustomerSignature(result.materials);
					viewModel.validCostItemNosAfterCustomerSignature(result.costs);
				});
		});
	});
};
namespace("Crm.Service.ViewModels").DispatchDetailsMaterialsTabViewModel.prototype.canEditMaterial = function (material) {
	var viewModel = this;
	return viewModel.parentViewModel.dispatchIsEditable() ||
		(viewModel.dispatch().StatusKey() === "SignedByCustomer" &&
			(viewModel.validMaterialItemNosAfterCustomerSignature().indexOf(material.ItemNo()) !== -1 || viewModel.validCostItemNosAfterCustomerSignature().indexOf(material.ItemNo()) !== -1));
};