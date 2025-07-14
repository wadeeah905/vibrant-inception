namespace("Crm.Service.ViewModels").ReplenishmentOrderItemEditModalViewModel = function(parentViewModel) {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);

	viewModel.articleAutocomplete = window.ko.observable("");
	viewModel.currentUser = window.ko.observable(null);
	viewModel.lookups = parentViewModel.lookups || {};
	viewModel.replenishmentOrder = window.ko.observable(null);
	viewModel.replenishmentOrderItem = window.ko.observable(null);

	viewModel.quantityUnit = window.ko.pureComputed(function() {
		return viewModel.lookups.quantityUnits.$array.find(function(x) {
			return x.Key === viewModel.replenishmentOrderItem().QuantityUnitKey();
		});
	});

	viewModel.errors = window.ko.validation.group(viewModel.replenishmentOrderItem, { deep: true });
};
namespace("Crm.Service.ViewModels").ReplenishmentOrderItemEditModalViewModel.prototype.init = function(id, params) {
	var viewModel = this;
	var replenishmentOrderId = params.replenishmentOrderId;
	return window.Helper.User.getCurrentUser().then(function(user) {
		viewModel.currentUser(user);
		return window.database.CrmService_ReplenishmentOrder
			.include("ResponsibleUserObject")
			.find(replenishmentOrderId);
	}).then(function(replenishmentOrder) {
		viewModel.replenishmentOrder(replenishmentOrder.asKoObservable());
		if (id) {
			return window.database.CrmService_ReplenishmentOrderItem
				.include("Article")
				.include("ServiceOrderMaterials")
				.find(id)
				.then(function(replenishmentOrderItem) {
					window.database.attachOrGet(replenishmentOrderItem);
					return replenishmentOrderItem;
				});
		}
		var newReplenishmentOrderItem =
			window.database.CrmService_ReplenishmentOrderItem.CrmService_ReplenishmentOrderItem.create();
		newReplenishmentOrderItem.ActualQty = 1;
		newReplenishmentOrderItem.ReplenishmentOrderId = viewModel.replenishmentOrder().Id();
		window.database.add(newReplenishmentOrderItem);
		return newReplenishmentOrderItem;
	}).then(function(replenishmentOrderItem) {
		viewModel.replenishmentOrderItem(replenishmentOrderItem.asKoObservable());
		return viewModel.lookups.quantityUnits ||
			window.Helper.Lookup.getLocalizedArrayMap("CrmArticle_QuantityUnit")
			.then(function(lookup) { viewModel.lookups.quantityUnits = lookup; });
	});
};
namespace("Crm.Service.ViewModels").ReplenishmentOrderItemEditModalViewModel.prototype.dispose = function() {
	var viewModel = this;
	window.database.detach(viewModel.replenishmentOrder().innerInstance);
	window.database.detach(viewModel.replenishmentOrderItem().innerInstance);
};
namespace("Crm.Service.ViewModels").ReplenishmentOrderItemEditModalViewModel.prototype.save = function() {
	var viewModel = this;
	viewModel.loading(true);

	if (viewModel.errors().length > 0) {
		viewModel.loading(false);
		viewModel.errors.showAllMessages();
		return;
	}

	return window.database.saveChanges()
		.then(function() {
			viewModel.loading(false);
			$(".modal:visible").modal("hide");
		}).fail(function() {
			viewModel.loading(false);
			window.swal(window.Helper.String.getTranslatedString("UnknownError"),
				window.Helper.String.getTranslatedString("Error_InternalServerError"),
				"error");
		});
};
namespace("Crm.Service.ViewModels").ReplenishmentOrderItemEditModalViewModel.prototype.getArticleSelect2Filter =
	function (query, term) {
		var viewModel = this;
		query = query.filter("it.ArticleTypeKey === 'Material' && it.IsWarehouseManaged === true");
		return window.Helper.Article.getArticleAutocompleteFilter(query, term, viewModel.currentUser().DefaultLanguageKey);
	};
namespace("Crm.Service.ViewModels").ReplenishmentOrderItemEditModalViewModel.prototype.onArticleSelect =
	function(article) {
		var viewModel = this;
		
		if (article) {
			viewModel.replenishmentOrderItem().Article(article.asKoObservable());
			viewModel.replenishmentOrderItem().Description(window.Helper.Article.getArticleDescription(article));
			viewModel.replenishmentOrderItem().MaterialNo(article.ItemNo);
			viewModel.replenishmentOrderItem().QuantityUnitKey(article.QuantityUnitKey);
		} else {
			viewModel.replenishmentOrderItem().Article(null);
			viewModel.replenishmentOrderItem().Description(null);
			viewModel.replenishmentOrderItem().MaterialNo(null);
			viewModel.replenishmentOrderItem().QuantityUnitKey(null);
		}
	};