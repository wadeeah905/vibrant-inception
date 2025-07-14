/// <reference path="Helper/Helper.Service.js" />
/// <reference path="Helper/Helper.ServiceOrder.js" />

namespace("Crm.Service.ViewModels").ServiceOrderTimeEditModalViewModel = function(parentViewModel) {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	viewModel.serviceOrder = parentViewModel.serviceOrder;
	viewModel.serviceObject = parentViewModel.serviceObject;
	viewModel.serviceOrderTime = window.ko.observable(null);
	viewModel.templateJob = window.ko.pureComputed(function() {
		return viewModel.serviceOrder().IsTemplate();
	});
	viewModel.isInvoicingTypeEditAllowed = window.ko.pureComputed(() => {
		return !this.serviceOrder().InvoicingTypeKey() && AuthorizationManager.currentUserHasPermission("ServiceOrder::SetInvoicingType")
	});
	viewModel.canEditEstimatedDuration = window.ko.observable(false);
	viewModel.canEditInvoiceDuration = window.ko.observable(false);
	viewModel.errors = window.ko.validation.group(viewModel.serviceOrderTime, { deep: true });
	viewModel.lookups = {
		currencies: { $tableName: "Main_Currency" },
	}
};
namespace("Crm.Service.ViewModels").ServiceOrderTimeEditModalViewModel.prototype.init = function(id) {
	var viewModel = this;
	return new $.Deferred().resolve().promise().then(function () {
		if (id) {
			return window.database.CrmService_ServiceOrderTime.find(id)
				.then(window.database.attachOrGet.bind(window.database));
		}
		var newServiceOrderTime = window.database.CrmService_ServiceOrderTime.CrmService_ServiceOrderTime.create();
		newServiceOrderTime.OrderId = viewModel.serviceOrder().Id();
		newServiceOrderTime.InvoicingTypeKey = viewModel.serviceOrder().InvoicingTypeKey();
		window.database.add(newServiceOrderTime);
		return newServiceOrderTime;
	}).then(function(serviceOrderTime) {
		viewModel.serviceOrderTime(serviceOrderTime.asKoObservable());
		return window.Helper.ServiceOrder.canEditEstimatedQuantities(viewModel.serviceOrderTime().OrderId());
	}).then(function(result) {
		viewModel.canEditEstimatedDuration(result);
		return window.Helper.ServiceOrder.canEditInvoiceQuantities(viewModel.serviceOrderTime().OrderId());
	}).then(function(result) {
		viewModel.canEditInvoiceDuration(result);
		return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups);
	});
};
namespace("Crm.Service.ViewModels").ServiceOrderTimeEditModalViewModel.prototype.getArticleSelect2Filter =
	function (query, filter) {
		var language = document.getElementById("meta.CurrentLanguage").content;
		query = query.filter(function (it) { return it.ArticleTypeKey === "Service"; });
		return window.Helper.Article.getArticleAutocompleteFilter(query, filter, language);
	};
namespace("Crm.Service.ViewModels").ServiceOrderTimeEditModalViewModel.prototype.dispose = function() {
	var viewModel = this;
	window.database.detach(viewModel.serviceOrderTime().innerInstance);
};
namespace("Crm.Service.ViewModels").ServiceOrderTimeEditModalViewModel.prototype.save = function() {
	var viewModel = this;
	viewModel.loading(true);

	if (viewModel.errors().length > 0) {
		viewModel.loading(false);
		viewModel.errors.showAllMessages();
		return;
	}
	return Helper.Service.resetInvoicingIfLumpSumSettingsChanged(viewModel.serviceOrderTime()).then(function() {
		if (window.Crm.Service.Settings.PosNoGenerationMethod == "MixedMaterialAndTimes") {
			return window.Helper.ServiceOrder.updatePosNo(viewModel.serviceOrderTime());
		} else {
			return window.Helper.ServiceOrder.updateJobPosNo(viewModel.serviceOrderTime());
		}
	}).then(function () {
		return window.database.saveChanges().then(function () {
			viewModel.loading(false);
			$(".modal:visible").modal("hide");
		}).fail(function () {
			viewModel.loading(false);
			window.swal(window.Helper.String.getTranslatedString("UnknownError"),
				window.Helper.String.getTranslatedString("Error_InternalServerError"),
				"error");
		});
	});
};
namespace("Crm.Service.ViewModels").ServiceOrderTimeEditModalViewModel.prototype.installationFilter = function (query, term) {
	var viewModel = this;

	if (term) {
		query = query.filter(function (it) {
			return it.LegacyId.contains(this.term) ||
				it.InstallationNo.contains(this.term) ||
				it.Description.contains(this.term);
		},
		{ term: term });
	}
	if (viewModel.serviceOrder().ServiceObjectId()) {
		query = query.filter(
			"(it.LocationContactId === this.customerContactId) || (it.FolderId === this.serviceObjectId)",
			{
				customerContactId: viewModel.serviceOrder().CustomerContactId(),
				serviceObjectId: viewModel.serviceOrder().ServiceObjectId()
			});
	} else {
		query = query.filter(
			"(it.LocationContactId === this.customerContactId)",
			{
				customerContactId: viewModel.serviceOrder().CustomerContactId()
			});
	}
	return query;
};
namespace("Crm.Service.ViewModels").ServiceOrderTimeEditModalViewModel.prototype.onArticleSelect = function (article) {
	var viewModel = this;
	if (article === null) {
		viewModel.serviceOrderTime().ItemNo(null);
		viewModel.serviceOrderTime().Description(null);
	} else {
		viewModel.serviceOrderTime().ItemNo(article.ItemNo);
		viewModel.serviceOrderTime().Description(window.Helper.Article.getArticleDescription(article));
	}
}
namespace("Crm.Service.ViewModels").ServiceOrderTimeEditModalViewModel.prototype.toggleDiscountType = function() {
	var viewModel = this;
	if (viewModel.serviceOrderTime().DiscountType() === window.Crm.Article.Model.Enums.DiscountType.Percentage) {
		viewModel.serviceOrderTime().DiscountType(window.Crm.Article.Model.Enums.DiscountType.Absolute);
	} else {
		viewModel.serviceOrderTime().DiscountType(window.Crm.Article.Model.Enums.DiscountType.Percentage);
	}
};