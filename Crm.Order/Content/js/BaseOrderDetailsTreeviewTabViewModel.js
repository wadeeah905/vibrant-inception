namespace("Crm.Order.ViewModels").BaseOrderDetailsTreeviewTabViewModel = function(parentViewModel) {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	viewModel.articleAutocomplete = window.ko.observable(null);
	viewModel.articleGroups = window.ko.observableArray([]);
	viewModel.deliveryDates = parentViewModel.deliveryDates;
	viewModel.articleAutocomplete.subscribe(async function (articleId) {
		if (articleId != null) {
			const article = await window.database.CrmArticle_Article.find(articleId);
			var articleGroupViewModels = viewModel.articleGroups();
			var selectedArticleGroupViewModel = null;
			for (var i = 1; i <= 5; i++) {
				var articleGroupKey = window.ko.unwrap(article["ArticleGroup0" + i + "Key"]);
				if (articleGroupKey == null) {
					continue;
				}
				selectedArticleGroupViewModel = window.ko.utils.arrayFirst(articleGroupViewModels, function (x) { return x.articleGroup.Key === articleGroupKey; });
				if (!selectedArticleGroupViewModel) {
					continue;
				}
				articleGroupViewModels = selectedArticleGroupViewModel.childArticleGroups;
				if (selectedArticleGroupViewModel.visible()) {
					$(".highlighted-item.animated.flash").removeClass("highlighted-item animated flash");
					window.scrollToSelector("#article-" + viewModel.articleAutocomplete());
					$("#article-" + viewModel.articleAutocomplete()).addClass("highlighted-item animated flash");
				}
				else {
					selectedArticleGroupViewModel.visible(true);
					selectedArticleGroupViewModel.items.subscribe(function () {
						window.scrollToSelector("#article-" + viewModel.articleAutocomplete());
						$("#article-" + viewModel.articleAutocomplete()).addClass("highlighted-item animated flash");
					});
					$("#collapse-" + selectedArticleGroupViewModel.id).on('shown.bs.collapse', function () {
						window.scrollToSelector("#article-" + viewModel.articleAutocomplete());
						$("#article-" + viewModel.articleAutocomplete()).addClass("highlighted-item animated flash");
					});
				}
				$("#collapse-" + selectedArticleGroupViewModel.id).collapse("show");
			}
			while (selectedArticleGroupViewModel != null) {
				var parent = selectedArticleGroupViewModel.parent;
				if (parent != null) {
					(parent.childArticleGroups || parent).forEach(function (articleGroupViewModel) {
						if (articleGroupViewModel !== selectedArticleGroupViewModel) {
							$("#collapse-" + articleGroupViewModel.id).collapse("hide");
							articleGroupViewModel.visible(false);
						}
					});
				}
				selectedArticleGroupViewModel = parent;
			}
		}
		else {
			viewModel.articleGroups().forEach(function (articleGroupViewModel) {
				$("#collapse-" + articleGroupViewModel.id).collapse("hide");
				$(".highlighted-item.animated.flash").removeClass("highlighted-item animated flash");
				articleGroupViewModel.visible(false);
			});
		}
	});
}
namespace("Crm.Order.ViewModels").BaseOrderDetailsTreeviewTabViewModel.prototype = Object.create(window.Main.ViewModels.ViewModelBase.prototype);
namespace("Crm.Order.ViewModels").BaseOrderDetailsTreeviewTabViewModel.prototype.init = function (parentViewModel) {
	var viewModel = this;
	return $.get(window.Helper.Url.resolveUrl("~/Crm.Order/OrderRest/ArticleGroupsWithChildren")).pipe(function(articleGroupsWithChildren) {
			var id = 1;
			function addArticleGroup(parent, articleGroup) {
				var articleGroupViewModel = {};
				articleGroupViewModel.articleGroup = {
					Key: articleGroup.Key,
					Value: articleGroup.Value,
					Base64Image: articleGroup.Base64Image,
				};
				articleGroupViewModel.childArticleGroups = [];
				articleGroupViewModel.id = id++;
				articleGroupViewModel.parent = parent;
				articleGroupViewModel.visible = window.ko.observable(false);
				(parent.childArticleGroups || parent).push(articleGroupViewModel);
				articleGroup.Subgroups.forEach(function(subgroup) {
					addArticleGroup(articleGroupViewModel, subgroup);
				});

				var articleListViewModel = new window.Crm.Article.ViewModels.ArticleListIndexViewModel();
				var params = [articleGroupViewModel.articleGroup.Key];
				var currentParent = articleGroupViewModel.parent;
				while (!!currentParent.articleGroup) {
					params.unshift(currentParent.articleGroup.Key);
					currentParent = currentParent.parent;
				}
				articleListViewModel.infiniteScroll(true);
				var baseApplyFilters = articleListViewModel.applyFilters
				articleListViewModel.applyFilters = function (query) {
					let filterStrings = [];
					const level = params.length;
					[1,2,3,4,5].forEach(x => {
						if(x <= level)
							filterStrings.push("(it.ArticleGroup0" + x + "Key === " + (params[x -1] === null ? "null" : ("'" + params[x -1] + "'")) + ")");
						else
							filterStrings.push("(it.ArticleGroup0" + x + "Key === null || it.ArticleGroup0" + x + "Key === '')");
					})
					if(articleGroup.IsEmpty && parent !== viewModel.articleGroups())
						filterStrings.push("false");
					const filterString = filterStrings.join(" && ")
					query = baseApplyFilters.call(this, query);
					query = query.filter(filterString);
					return query;
				}
				//articleGroupViewModel.visible.subscribe(function (visible) {
				//	if (visible) {
				//		if (viewModel.articleAutocomplete()) {
				//			articleListViewModel.getFilter("Id").extend({ filterOperator: "===" })(viewModel.articleAutocomplete());
				//		}
				//		articleListViewModel.init().then(function () {
				//			articleListViewModel.loading(false);
				//		});
				//	} else {
				//		delete articleListViewModel.filters["Id"];
				//		articleGroupViewModel.items([]);
				//	}
				//});
				var waitUntilVisible = articleGroupViewModel.visible.subscribe(function (visible) {
					if (visible) {
						waitUntilVisible.dispose();
						articleListViewModel.init().then(function () {
							articleListViewModel.loading(false);
						});
					}
				});
				//articleGroupViewModel.visible.subscribe(function (visible) {
				//	if (visible) {
				//		window.scrollToSelector("#article-" + viewModel.articleAutocomplete());
				//	}
				//});
				articleGroupViewModel.items = articleListViewModel.items;
				articleGroupViewModel.totalItemCount = articleListViewModel.totalItemCount;
			}
			articleGroupsWithChildren.forEach(function(articleGroupWithChildren) {
				addArticleGroup(viewModel.articleGroups(), articleGroupWithChildren);
			});
		});
}
namespace("Crm.Order.ViewModels").BaseOrderDetailsTreeviewTabViewModel.prototype.getDeliveryDateViewModel = function (deliveryDate, article) {
	var viewModel = this;
	viewModel.deliveryDateViewModels = viewModel.deliveryDateViewModels || [];
	var result = viewModel.deliveryDateViewModels.find(function(x) {
		return (x.deliveryDate === deliveryDate || window.moment(x.deliveryDate).isSame(deliveryDate)) && x.article === article;
	});
	if (result) {
		return result;
	}
	result = { };
	result.article = article;
	result.deliveryDate = deliveryDate;
	var findOrderItem = function() {
		return window.ko.utils.arrayFirst(viewModel.parentViewModel.orderItems(),
			function(orderItem) {
				return ko.unwrap(orderItem.ArticleId) === ko.unwrap(article.Id) && (orderItem.DeliveryDate() === deliveryDate || window.moment(orderItem.DeliveryDate()).isSame(window.moment(deliveryDate)));
			}) || null;
	};
	result.orderItem = findOrderItem();
	result.quantity = window.ko.observable(result.orderItem != null ? result.orderItem.QuantityValue() : 0);
	if (!viewModel.parentViewModel.negativeQuantitiesAllowed()) {
		window.ko.validation.addRule(result.quantity, {
			rule: "min",
			message: window.Helper.String.getTranslatedString("RuleViolation.Greater").replace("{0}", window.Helper.String.getTranslatedString("Quantity")).replace("{1}", "0"),
			params: 0
		});
	}
	if (!viewModel.parentViewModel.positiveQuantitiesAllowed()) {
		window.ko.validation.addRule(result.quantity, {
			rule: "max",
			message: window.Helper.String.getTranslatedString("RuleViolation.Less").replace("{0}", window.Helper.String.getTranslatedString("Quantity")).replace("{1}", "0"),
			params: 0
		});
	}
	result.save = function() {
		if (!result.quantity.isValid()) {
			return;
		}
		result.orderItem = findOrderItem();
		var value = parseFloat(result.quantity());
		value = isNaN(value) ? 0 : value;
		if (result.orderItem == null && value !== 0) {
			viewModel.parentViewModel.newItem(article);
			viewModel.parentViewModel.selectedItem().DeliveryDate(deliveryDate);
			viewModel.parentViewModel.selectedItem().QuantityValue(value);
			viewModel.parentViewModel.saveSelectedItem();
			result.orderItem = viewModel.parentViewModel.selectedItem();
		} else {
			if (value === 0) {
				viewModel.parentViewModel.removeOrderItem(result.orderItem, true).then(function() {
					result.orderItem = null;
				});
			} else {
				if (result.orderItem.QuantityValue() !== value) {
					viewModel.parentViewModel.selectedItem(result.orderItem);
					window.database.attachOrGet(result.orderItem);
					viewModel.parentViewModel.selectedItem().QuantityValue(value);
					viewModel.parentViewModel.saveSelectedItem();
				}
			}
		}
	};
	viewModel.deliveryDateViewModels.push(result);
	return result;
}
namespace("Crm.Order.ViewModels").BaseOrderDetailsTreeviewTabViewModel.prototype.toggleSelectedArticleGroup = function (toggledArticleGroupViewModel) {
	if ($(".collapsing:visible").length > 0) {
		return;
	}
	function hide(articleGroupViewModel) {
		if (articleGroupViewModel.visible() === true) {
			$("#collapse-" + articleGroupViewModel.id).collapse("hide");
			articleGroupViewModel.visible(false);
			(articleGroupViewModel.childArticleGroups || []).forEach(function(childArticleGroup) {
				hide(childArticleGroup);
			});
		}
	};
	(toggledArticleGroupViewModel.parent.childArticleGroups ||
		toggledArticleGroupViewModel.parent ||
		toggledArticleGroupViewModel).forEach(function(articleGroupViewModel) {
		if (articleGroupViewModel !== toggledArticleGroupViewModel) {
			hide(articleGroupViewModel);
		}
	});
	if (!window.ko.isWritableObservable(toggledArticleGroupViewModel.visible)) {
		return;
	}
	if (toggledArticleGroupViewModel.visible() === true) {
		hide(toggledArticleGroupViewModel);
	} else {
		$("#collapse-" + toggledArticleGroupViewModel.id).collapse("show");
		toggledArticleGroupViewModel.visible(true);
	}
};
namespace("Crm.Order.ViewModels").BaseOrderDetailsTreeviewTabViewModel.prototype.getArticleSelect2Filter =
	function (query, filter) {
		var language = document.getElementById("meta.CurrentLanguage").content;
		query = query.filter(function (it) { return !(it.ArticleGroup01Key == null && it.ArticleGroup02Key == null && it.ArticleGroup03Key == null && it.ArticleGroup04Key == null && it.ArticleGroup05Key == null); });
		return window.Helper.Article.getArticleAutocompleteFilter(query, filter, language);
	};