/// <reference path="../../../../content/js/viewmodels/genericlistviewmodel.js" />
/// <reference path="dispatchdetailsviewmodel.js" />

namespace("Crm.Service.ViewModels").ServiceOrderDetailsMaterialsTabViewModel = function (parentViewModel) {
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
		["ServiceOrderTime.PosNo", "PosNo", "ItemNo"],
		["ASC", "ASC", "ASC"],
		["ServiceOrderTime", "ServiceOrderTime.Installation", "DocumentAttributes", "DocumentAttributes.FileResource", "ServiceOrderMaterialSerials", "Article"]);
	viewModel.infiniteScroll(true);
	viewModel.isEditable = !!ko.unwrap(viewModel.serviceOrder) ? (viewModel.serviceOrder().IsTemplate() ? parentViewModel.serviceOrderTemplateIsEditable : parentViewModel.serviceOrderIsEditable) : window.ko.observable(true);
	viewModel.isOrderClosed = window.ko.observable(false);
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsMaterialsTabViewModel.prototype =
	Object.create(window.Main.ViewModels.GenericListViewModel.prototype);
namespace("Crm.Service.ViewModels").ServiceOrderDetailsMaterialsTabViewModel.prototype.init = function() {
	var viewModel = this;
	return window.Main.ViewModels.GenericListViewModel.prototype.init.apply(viewModel, arguments).then(function() {
		return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups);
	}).then(function() {
		return window.Helper.ServiceOrder.isInStatusGroup(viewModel.serviceOrder().Id(), "Closed");
	}).then(function (result) {
		viewModel.isOrderClosed(result);
	});
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsMaterialsTabViewModel.prototype.deleteServiceOrderMaterial =
	function(serviceOrderMaterial) {
		var viewModel = this;
		window.Helper.Confirm.confirmDelete().done(function() {
			viewModel.loading(true);
			return window.database.CrmService_ServiceOrderMaterialSerial.filter(function(it) {
					return it.OrderMaterialId === this.serviceOrderMaterialId;
				},
				{ serviceOrderMaterialId: serviceOrderMaterial.Id() }).forEach(
				function(serviceOrderMaterialSerial) {
					window.database.remove(serviceOrderMaterialSerial);
					}).then(function () {
						if (!!serviceOrderMaterial.ReplenishmentOrderItemId()) {
							return window.database.CrmService_ReplenishmentOrderItem
								.find(serviceOrderMaterial.ReplenishmentOrderItemId())
								.then(function (replenishmentorderitem) {
									window.database.remove(replenishmentorderitem);
								})
						} else {
							return new $.Deferred().resolve().promise();
						}
					}).then(function () {
						var entity = window.Helper.Database.getDatabaseEntity(serviceOrderMaterial);
						entity.DocumentAttributes.forEach(function (documentAttribute) {
							window.database.remove(documentAttribute);
							window.database.remove(documentAttribute.FileResource);
							documentAttribute.FileResource = null;
						});
						window.database.remove(entity);
						return window.database.saveChanges();
					});
		});
	};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsMaterialsTabViewModel.prototype.applyFilter =
	function(query, filterValue, filterName) {
		if (filterName === "ItemDescription") {
			return query.filter("filterByArticleDescription",
				{ filter: filterValue.Value, language: this.currentUser().DefaultLanguageKey });
		}
		return window.Main.ViewModels.GenericListViewModel.prototype.applyFilter.apply(this, arguments);
	};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsMaterialsTabViewModel.prototype.applyFilters = function(query) {
	var viewModel = this;
	query = window.Main.ViewModels.GenericListViewModel.prototype.applyFilters.call(viewModel, query);
	query = query
		.filter(function(it) {
				return it.OrderId === this.orderId;
			},
			{ orderId: viewModel.serviceOrder().Id() });
	return query;
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsMaterialsTabViewModel.prototype.getItemGroup = function (serviceOrderPosition) {
	return window.Helper.ServiceOrder.getServiceOrderPositionItemGroup(serviceOrderPosition);
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsMaterialsTabViewModel.prototype.initItem = function(item) {
	item =  window.Main.ViewModels.GenericListViewModel.prototype.initItem.call(this, item);
	item.totalPrice = (item.Price() - (item.DiscountType() == Crm.Article.Model.Enums.DiscountType.Percentage ? item.Price() * item.Discount() / 100 : item.Discount())) * item.InvoiceQty();
	return item;
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsMaterialsTabViewModel.prototype.initItems = function(items) {
	var args = arguments;
	var viewModel = this;
	return Helper.Article.loadArticleDescriptionsMapFromItemNo(items, viewModel.currentUser().DefaultLanguageKey)
		.then(function() {
			return window.Main.ViewModels.GenericListViewModel.prototype.initItems.apply(viewModel, args);
		});
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsMaterialsTabViewModel.prototype.canEditMaterial = function () {
	const viewModel = this;
	return !viewModel.isOrderClosed() && viewModel.isEditable();
};