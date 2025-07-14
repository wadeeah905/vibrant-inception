namespace("Crm.Order.ViewModels").BaseOrderAccessoryListModalViewModel = function (parentViewModel) {
	var viewModel = this;
	viewModel.baseOrder = parentViewModel.baseOrder;
	viewModel.currencies = parentViewModel.currencies;
	viewModel.getCurrencyValue = parentViewModel.getCurrencyValue;
	viewModel.loading = parentViewModel.loading;
	viewModel.orderItems = parentViewModel.orderItems;
	
	viewModel.articles = window.ko.observableArray([]);
	viewModel.articleFilter = window.ko.observable("");
	viewModel.articlePager = window.ko.custom.paging();
	viewModel.parentOrderItem = window.ko.observable(null);
	viewModel.selectedArticleIds = window.ko.observableArray([]);
}
namespace("Crm.Order.ViewModels").BaseOrderAccessoryListModalViewModel.prototype.init = function (id) {
    var viewModel = this;
    viewModel.parentOrderItem(window.ko.utils.arrayFirst(viewModel.orderItems(), function(orderItem) {
        return orderItem.Id() === id;
    }) || null);
    var query = window.database.CrmArticle_ArticleRelationship
        .include("Child")
        .filter(function(x) {
            return x.ParentId == this.parentId && (this.filter == "" || x.Child.ItemNo.contains(this.filter) || x.Child.Description.contains(this.filter));
        }, { parentId: viewModel.parentOrderItem().ArticleId(), filter: viewModel.articleFilter });
    query
         .count(function (count) {
             viewModel.articlePager.totalItemCount(count);
         });
    return query
        .orderBy(function(x) { return x.Child.ItemNo; })
        .orderBy(function(x) { return x.Child.Description; })
        .map(function(x) { return x.Child; })
        .skip(viewModel.articlePager.skip)
        .take(viewModel.articlePager.pageSize())
        .toArray(viewModel.articles)
        .pipe(function() {
            var selectedOrderItems = window.ko.utils.arrayFilter(viewModel.orderItems(), function (orderItem) {
                return orderItem.ParentOrderItemId() === id;
            });
            var selectedArticleIds = window.ko.utils.arrayMap(selectedOrderItems, function(orderItem) {
                return orderItem.ArticleId();
            });
            viewModel.selectedArticleIds(selectedArticleIds);
        });
}
namespace("Crm.Order.ViewModels").BaseOrderAccessoryListModalViewModel.prototype.addArticle = function (article) {
    var viewModel = this;
    var orderItem = window.ko.utils.arrayFirst(viewModel.orderItems(), function (x) { return x.ArticleId() === article.Id(); });
    if (!orderItem) {
        orderItem = window.database.CrmOrder_OrderItem.CrmOrder_OrderItem.create().asKoObservable();
        window.database.add(orderItem);
        orderItem.Id(window.$data.createGuid().toString().toLowerCase());
        orderItem.ArticleId(article.Id());
        orderItem.ArticleNo(article.ItemNo());
        orderItem.ArticleDescription(article.Description());
        orderItem.ArticleHasAccessory(article.HasAccessory());
        orderItem.OrderId(viewModel.baseOrder().Id());
        orderItem.Price(article.Price());
        orderItem.PurchasePrice(article.PurchasePrice());
        orderItem.QuantityUnitKey(article.QuantityUnitKey());
        orderItem.QuantityValue(1);
        viewModel.orderItems().push(orderItem);
    }
    orderItem.IsOption(false);
    orderItem.IsAccessory(true);
    orderItem.IsAlternative(false);
    orderItem.ParentOrderItemId(viewModel.parentOrderItem().Id());
}
namespace("Crm.Order.ViewModels").BaseOrderAccessoryListModalViewModel.prototype.applyArticles = function () {
    var viewModel = this;
    viewModel.loading(true);
	window.database.CrmArticle_Article.filter(function(x) {
			return x.Id in this.selectedArticleIds;
		}, { selectedArticleIds: viewModel.selectedArticleIds })
		.forEach(function(article) {
			viewModel.addArticle(article.asKoObservable());
		})
		.pipe(function() {
			var deselectedOrderItems = window.ko.utils.arrayFilter(viewModel.orderItems(),
				function(x) {
        return x.ParentOrderItemId() === viewModel.parentOrderItem().Id() && viewModel.selectedArticleIds().indexOf(x.ArticleId()) === -1;
    });
    viewModel.orderItems.removeAll(deselectedOrderItems);
    
    viewModel.orderItems.valueHasMutated();
    viewModel.loading(false);
    $(".modal:visible").modal("hide");
		});
}