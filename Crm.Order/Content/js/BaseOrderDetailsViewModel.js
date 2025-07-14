namespace("Crm.Order.ViewModels").BaseOrderDetailsViewModel = function() {
	var viewModel = this;
	viewModel.tabs = window.ko.observable({});
	viewModel.loading = window.ko.observable(true);
	viewModel.alternativeSelectionFor = window.ko.observable(null);
	viewModel.alternativeSelectionArticleId = window.ko.pureComputed(function() {
		return viewModel.alternativeSelectionFor() != null ? viewModel.alternativeSelectionFor().ArticleId() : null;
	});
	viewModel.alertInfoText = window.ko.observable(null);
	viewModel.baseOrder = window.ko.observable(null);
	viewModel.currencies = window.ko.observableArray([]);
	viewModel.contactPerson = window.ko.observable();

	viewModel.showActiveArticles = window.ko.observable(true);
	viewModel.showExpiredArticles = window.ko.observable(false);
	viewModel.showUpcomingArticles = window.ko.observable(false);
	viewModel.showAllArticles = window.ko.pureComputed({
		read: function () {
			return viewModel.showActiveArticles() && viewModel.showExpiredArticles() && viewModel.showUpcomingArticles();
		},
		write: function (value) {
			viewModel.showActiveArticles(value);
			viewModel.showExpiredArticles(value);
			viewModel.showUpcomingArticles(value);
		},
		owner: viewModel
	});
	viewModel.deliveryDates = window.ko.observableArray([]);
	viewModel.orderCategory = window.ko.observable(null);
	viewModel.orderEntryTypes = window.ko.observableArray([]);
	viewModel.orderItems = window.ko.observableArray([]);
	viewModel.orderItems.distinct("DeliveryDate");
	viewModel.orderItems.distinct("ParentOrderItemId");
	viewModel.selectedItem = window.ko.observable(null);
	viewModel.isNewItem = window.ko.observable(false);
	viewModel.selectedItemDeliveryDate = window.ko.pureComputed({
		read: function () {
			if (!viewModel.selectedItem() || !viewModel.selectedItem().DeliveryDate()) {
				return null;
			}
			return window.ko.utils.arrayFirst(viewModel.deliveryDates(), function(x) { return x != null && x.getTime() === viewModel.selectedItem().DeliveryDate().getTime(); }) || null;
		},
		write: function (value) {
			if (!viewModel.selectedItem()) {
				return;
			}
			viewModel.selectedItem().DeliveryDate(value);
		},
		owner: this
	});
	viewModel.totalPurchasePrice = window.ko.computed(function () {
		var sum = viewModel.orderItems()
			.reduce(function (x, orderItem) {
				return x + orderItem.PurchasePrice() * orderItem.QuantityValue();
			},
				0);
		return sum;
	});
	viewModel.totalPrice = window.ko.computed(function() {
		var sum = viewModel.orderItems()
			.reduce(function(x, orderItem) {
					if (!orderItem.IsOption() && !orderItem.IsAlternative()) {
						return x + viewModel.getCalculatedPriceWithDiscount(orderItem)();
					}
					return x;
				},
				0);
		return sum;
	});
	viewModel.users = window.ko.observableArray([]);
	viewModel.usergroups = window.ko.observableArray([]);
	viewModel.entityWithVisibility = viewModel.baseOrder;
	viewModel.visibilityAlertText = window.ko.pureComputed(function() {
		var entityType = viewModel.baseOrder().IsOffer() ? "Offer" : "Order";
		return window.Helper.Visibility.getVisibilityInformationText(viewModel.baseOrder(), entityType, viewModel.users(), viewModel.usergroups());
	});
	viewModel.lookups = {
		vatLevel: {},
		quantityUnits: {$tableName: "CrmArticle_QuantityUnit"}
	};

}
namespace("Crm.Order.ViewModels").BaseOrderDetailsViewModel.prototype = Object.create(window.Main.ViewModels.ViewModelBase.prototype);
namespace("Crm.Order.ViewModels").BaseOrderDetailsViewModel.prototype.init = function(id, params) {
	var viewModel = this;
	return window.database.Main_Currency
		.orderByDescending(function(x) { return x.Favorite; })
		.orderBy(function(x) { return x.SortOrder; })
		.toArray(viewModel.currencies)
		.then(function () {
			return window.database.Main_User
				.orderBy(function(it) { return it.LastName; })
				.orderBy(function(it) { return it.FirstName; })
				.toArray(viewModel.users);
		})
		.then(function() {
			return window.database.Main_Usergroup
				.orderBy(function(it) { return it.Name; })
				.toArray(viewModel.usergroups);
		})
		.then(function () {
			if (viewModel.baseOrder().ContactPersonId()) {
				return window.database.Main_Person
					.include("Address")
					.include("Address.Emails")
					.find(viewModel.baseOrder().ContactPersonId());
			}
		})
		.then(function (person) {
			viewModel.contactPerson(person);
		})
		.pipe(function() {
			if (!!viewModel.baseOrder() && !!viewModel.baseOrder().OrderCategoryKey()) {
				return window.database.CrmOrder_OrderCategory
					.first(function (orderCategory) { return orderCategory.Key == this.orderCategoryKey; }, { orderCategoryKey: viewModel.baseOrder().OrderCategoryKey() })
					.then(function(result) {
						viewModel.orderCategory(result);
					});
			}
			return null;
		})
		.pipe(function() {
			if (!!id) {
				return window.database.CrmOrder_OrderItem
					.include2("Article.DocumentAttributes.filter(function(x){ return x.UseForThumbnail === true; })")
					.include("Article.DocumentAttributes.FileResource")
					.filter(function(orderItem) { return orderItem.OrderId === this.orderId; }, { orderId: viewModel.baseOrder().Id() })
					.orderBy("it.Position")
					.toArray(viewModel.orderItems);
			}
			return null;
		})
		.pipe(function() {
			function deliveryDateCompareFunction(a, b) {
				if (!a && !!b) {
					return -1;
				}
				if (!b && !!a) {
					return 1;
				}
				return a.getTime() - b.getTime();
			};

			viewModel.deliveryDates.subscribe(function () {
				viewModel.deliveryDates.sort(deliveryDateCompareFunction);
			}, null, "arrayChange");
			if (viewModel.baseOrder().OrderEntryType() === "MultiDelivery") {
				var orderItemDeliveryDates = viewModel.orderItems().map(function(orderItem) { return orderItem.DeliveryDate(); });
				var deliveryDates = window._.uniqBy(orderItemDeliveryDates,
					function(x) {
						return x != null ? x.toDateString() : x;
					});
				deliveryDates = deliveryDates.filter(function (it) { return it != null });
				if (deliveryDates.length > 0) {
					viewModel.deliveryDates(deliveryDates);
				}
				else {
					viewModel.deliveryDates([null]);
				}
			}
			return null;
		})
		.pipe(function() {
			viewModel.baseOrder()
				.Company.subscribe(function(company) {
					var companyId = !!company ? window.ko.unwrap(company.Id) : null;
					viewModel.baseOrder().ContactId(companyId);
				});
			return null;
		})
		.pipe(function() {
			if (!!params.companyId) {
				viewModel.baseOrder().ContactId(params.companyId);
				return window.database.Main_Company.find(viewModel.baseOrder().ContactId())
					.then(function(result) {
						viewModel.baseOrder().Company(result.asKoObservable());
					});
			} else {
				return null;
			}
		}).pipe(function() {
			return window.Helper.User.getCurrentUser();
		}).pipe(function(user) {
			if (!viewModel.baseOrder().ResponsibleUser()) {
				viewModel.baseOrder().ResponsibleUser(user.Id);
			}
			if (!viewModel.baseOrder().CurrencyKey() && viewModel.currencies().length > 0) {
				viewModel.baseOrder().CurrencyKey(viewModel.currencies()[0].Key());
			}
			return window.database.CrmOrder_OrderEntryType
				.filter(function(x) { return x.Language == this.languageKey; }, { languageKey: user.DefaultLanguageKey })
				.orderBy(function(x) { return x.SortOrder; })
				.orderBy(function(x) { return x.Value; })
				.toArray(function(results) {
					viewModel.orderEntryTypes(window.ko.utils.arrayMap(results, function(x) { return x.asKoObservable(); }));
				});
		}).pipe(function() {
			viewModel.errors = window.ko.validation.group(viewModel.selectedItem, { deep: true });
			if (!!params.orderEntryType) {
				viewModel.baseOrder().OrderEntryType(params.orderEntryType);
				return null;
			}
			if (!viewModel.baseOrder().OrderEntryType() && viewModel.orderEntryTypes().length === 1) {
				viewModel.baseOrder().OrderEntryType(viewModel.orderEntryTypes()[0].Key());
			}
			return window.database.Main_Site.GetCurrentSite().first().then(function (site) {
				return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups).then(function () {
					return window.Helper.Lookup.getLocalizedArrayMap("CrmArticle_VATLevel")
						.then(function (lookup) {
							viewModel.lookups.vatLevel = lookup;
						})
				});
			});
		}).pipe(function() {
			viewModel.totalPrice.subscribe(function (totalPrice) {
				viewModel.baseOrder().CalculatedPriceWithDiscount(totalPrice);
				if (viewModel.baseOrder().innerInstance.entityState === window.$data.EntityState.Added) {
					return;
				}
				window.database.attachOrGet(viewModel.baseOrder().innerInstance);
				viewModel.loading(true);
				window.database.saveChanges().then(function() {
					viewModel.loading(false);
				});
			});
		});
}
namespace("Crm.Order.ViewModels").BaseOrderDetailsViewModel.prototype.acceptAlternative = function(orderItem) {
	var viewModel = this;
	viewModel.alternativeSelectionFor(null);
	var parentOrderItem = window.ko.utils.arrayFirst(viewModel.orderItems(), function(x) { return x.Id() === orderItem.ParentOrderItemId(); }) || null;
	var allAlternatives = viewModel.orderItems.index.ParentOrderItemId()[orderItem.ParentOrderItemId()];
	parentOrderItem.ParentOrderItemId(orderItem.Id());
	parentOrderItem.IsAlternative(true);
	allAlternatives.forEach(function(x) {
		if (x.Id() !== orderItem.Id()) {
			x.ParentOrderItemId(orderItem.Id());
		}
	});
	orderItem.IsAlternative(false);
	orderItem.ParentOrderItemId(null);
}
namespace("Crm.Order.ViewModels").BaseOrderDetailsViewModel.prototype.addAlternative = function(orderItem) {
	var viewModel = this;
	$("#infoAlert:visible").trigger("close.bs.alert");
	viewModel.alternativeSelectionFor(orderItem);
	viewModel.alertInfoText(window.Helper.String.getTranslatedString("AlternativeSelectionInformation").replace("{0}", orderItem.ArticleNo()));
	window.scrollToSelector("#infoAlert");
	$("#infoAlert")
		.one("close.bs.alert",
			function() {
				viewModel.alternativeSelectionFor(null);
				viewModel.alertInfoText(null);
			});
}
namespace("Crm.Order.ViewModels").BaseOrderDetailsViewModel.prototype.setPosition = function(selectedItem) {
	var orderItems = this.orderItems();
	var position = null;
	if (orderItems.length) {
		var mainPos = (orderItems.sort(function (a, b) { return parseFloat(a.Position()) - parseFloat(b.Position()) })[orderItems.length - 1].Position() || "").split(".")[0];
		position = parseInt(mainPos) + 1;
	} 
	if (!position) {
		position = 1;
	}
	selectedItem.Position("" + position);
};
namespace("Crm.Order.ViewModels").BaseOrderDetailsViewModel.prototype.saveSelectedItem = function() {
	var viewModel = this;
	var selectedItem = viewModel.selectedItem();
	if (viewModel.errors().length > 0) {
		viewModel.errors.showAllMessages();
	} else {
		var isNewItem = viewModel.isNewItem();
		if (isNewItem) {
			viewModel.setPosition(selectedItem);
			selectedItem.OrderId(viewModel.baseOrder().Id());
			isNewItem = true;
		}
		viewModel.loading(true);
		window.database.saveChanges().then(function() {
			if (isNewItem) {
				viewModel.orderItems.push(selectedItem);
			} else {
				var itemId = selectedItem.Id();
				viewModel.orderItems.peek().some(function(element, index, array) {
					if (element.Id() === itemId) {
						array[index] = selectedItem;
						return true;
					}
					return false;
				});
				viewModel.orderItems.valueHasMutated();
			}
			viewModel.loading(false);
		});
		viewModel.selectedItem(null);
		Helper.Order.closeSidebar();
	}
}
namespace("Crm.Order.ViewModels").BaseOrderDetailsViewModel.prototype.asOption = function(orderItem) {
	var viewModel = this;
	viewModel.removeOrderItem(orderItem)
		.pipe(function() {
			var newOrderItem = window.database.CrmOrder_OrderItem.CrmOrder_OrderItem.create(orderItem.innerInstance).asKoObservable();
			newOrderItem.Id(null);
			newOrderItem.Id(window.$data.createGuid().toString().toLowerCase());
			newOrderItem.IsAlternative(false);
			newOrderItem.IsOption(true);
			newOrderItem.ParentOrderItemId(null);
			viewModel.loading(true);
			window.database.add(newOrderItem.innerInstance);
			window.database.saveChanges().then(function() {
				viewModel.orderItems.push(newOrderItem);
				viewModel.loading(false);
			});
		});
}
namespace("Crm.Order.ViewModels").BaseOrderDetailsViewModel.prototype.getAlternatives = function(orderItem) {
	var viewModel = this;
	var alternatives = viewModel.orderItems.index.ParentOrderItemId()[orderItem.Id()] || [];
	return alternatives.filter(function(x) {
			return x.IsAlternative() === true;
		})
		.sort(function(a, b) {
			return a.Price() - b.Price();
		});
}
namespace("Crm.Order.ViewModels").BaseOrderDetailsViewModel.prototype.getCalculatedPriceWithDiscount = function(orderItem) {
	orderItem.calculatedPriceWithDiscount = orderItem.calculatedPriceWithDiscount ||
		window.ko.pureComputed(function() {
			var price = orderItem.Price() * orderItem.QuantityValue();
			if (orderItem.DiscountType() === window.Crm.Article.Model.Enums.DiscountType.Percentage) {
				price *= 1 - (orderItem.Discount() / 100);
			} else {
				price -= orderItem.Discount() * orderItem.QuantityValue();
			}
			return price;
		});
	return orderItem.calculatedPriceWithDiscount;
}
namespace("Crm.Order.ViewModels").BaseOrderDetailsViewModel.prototype.getSubPositions = function(orderItem) {
	var viewModel = this;
	var subPositions = viewModel.orderItems.index.ParentOrderItemId()[orderItem.Id()] || [];
	return subPositions.filter(function(x) {
			return x.IsAlternative() === false;
		})
		.sort(function(a, b) {
			return a.ArticleNo().localeCompare(b.ArticleNo());
		});
}
namespace("Crm.Order.ViewModels").BaseOrderDetailsViewModel.prototype.negativeQuantitiesAllowed = function () {
	var viewModel = this;
	return viewModel.orderCategory() == null || window.ko.unwrap(viewModel.orderCategory().AllowNegativeQuantities);
}
namespace("Crm.Order.ViewModels").BaseOrderDetailsViewModel.prototype.newItem = function(article) {
	var viewModel = this;
	var orderItem = window.database.CrmOrder_OrderItem.CrmOrder_OrderItem.create().asKoObservable();
	orderItem.QuantityValue(viewModel.positiveQuantitiesAllowed() ? 1 : -1);
	orderItem.articleAutocomplete = window.ko.observable(null);
	orderItem.getArticleSelect2Filter = function (query, term) {
		let language = document.getElementById("meta.CurrentLanguage").content;
		query = query.filter(function (it) {
			return it.ArticleTypeKey === 'Material' || it.ArticleTypeKey === 'Cost';
		});
		return window.Helper.Article.getArticleAutocompleteFilter(query, term, language);
	};
	$("#right-nav").one("sidebar.closed", function (e) {
		var item = viewModel.selectedItem();
		if (item) {
			window.database.CrmOrder_OrderItem.detach(viewModel.selectedItem().innerInstance);
		}
		viewModel.isNewItem(false);
		viewModel.selectedItem(null);
	});

	if (viewModel.baseOrder().OrderEntryType() === "MultiDelivery") {
		orderItem.DeliveryDate.extend({
			required: {
				message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("DeliveryDate")),
				params: true
			}
		});
	}

	var initOrderItem = function(value) {
		orderItem.Article(value == null ? null : value.asKoObservable());
		orderItem.ArticleId(value == null ? null : value.Id);
		orderItem.ArticleNo(value == null ? null : value.ItemNo);
		orderItem.ArticleDescription(value == null ? null : window.Helper.Article.getArticleDescription(value));
		orderItem.ArticleHasAccessory(value == null ? false : value.HasAccessory);
		orderItem.DiscountType(window.Crm.Article.Model.Enums.DiscountType.Absolute);
		orderItem.Price((value == null ? null : value.Price) || 0);
		orderItem.PurchasePrice(value == null ? null : value.PurchasePrice);
		orderItem.QuantityUnitKey(value == null ? null : value.QuantityUnitKey);
		orderItem.QuantityStep((value == null ? null : value.QuantityStep) || 1);
	};
	orderItem.onArticleSelect = initOrderItem;
	initOrderItem(Helper.Database.getDatabaseEntity(article));
	window.database.add(orderItem);
	viewModel.selectedItem(orderItem);
	if (article === null) {
		viewModel.isNewItem(true);
	} else {
		viewModel.setPosition(viewModel.selectedItem());
		viewModel.selectedItem().OrderId(viewModel.baseOrder().Id());
		viewModel.orderItems.push(viewModel.selectedItem());
	}
}
namespace("Crm.Order.ViewModels").BaseOrderDetailsViewModel.prototype.positiveQuantitiesAllowed = function () {
	var viewModel = this;
	return viewModel.orderCategory() == null || window.ko.unwrap(viewModel.orderCategory().AllowPositiveQuantities);
}
namespace("Crm.Order.ViewModels").BaseOrderDetailsViewModel.prototype.removeOrderItem = function(orderItem, silent) {
	var viewModel = this;
	if (viewModel.selectedItem() === orderItem) {
		viewModel.selectedItem(null);
	}
	var indexOf = viewModel.orderItems().indexOf(orderItem);
	var deferred = null;
	if (indexOf !== -1) {
		viewModel.orderItems.splice(indexOf, 1);
		window.database.remove(orderItem.innerInstance);
		viewModel.loading(true);
		deferred = window.database.saveChanges().then(function() {
			viewModel.loading(false);
			if (silent === true) {
				return;
			}
			viewModel.showSnackbar(window.Helper.String.getTranslatedString("OrderItemRemoved"),
				window.Helper.String.getTranslatedString("Undo"),
				function() {
					viewModel.loading(true);
					var newOrderItem = window.database.CrmOrder_OrderItem.CrmOrder_OrderItem.create(orderItem.innerInstance).asKoObservable();
					newOrderItem.Id(window.$data.createGuid().toString().toLowerCase());
					window.database.add(newOrderItem.innerInstance);
					window.database.saveChanges().then(function() {
						viewModel.orderItems.splice(indexOf, 0, newOrderItem);
						viewModel.loading(false);
					});
				});
		});
	}
	return deferred || new $.Deferred().resolve().promise();
}
namespace("Crm.Order.ViewModels").BaseOrderDetailsViewModel.prototype.selectItem = function(orderItem) {
	var viewModel = this;
	viewModel.loading(true);
	window.database.CrmOrder_OrderItem
		.include2("Article.DocumentAttributes.filter(function(x){ return x.UseForThumbnail === true; })")
		.include("Article.DocumentAttributes.FileResource")
		.find(orderItem.Id())
		.then(function(oi) {
			viewModel.selectedItem(oi.asKoObservable());
			window.database.attachOrGet(oi);
			viewModel.loading(false);
			var closingEventHandler = function(e, deferred) {
				var entity = window.Helper.Database.getDatabaseEntity(viewModel.selectedItem);
				if (entity && entity.entityState === window.$data.EntityState.Modified) {
					e.preventDefault();
					window.Helper.Confirm.confirmContinue().then(deferred.resolve, deferred.reject);
				}
			};
			$("#right-nav").on("sidebar.closing", closingEventHandler);
			$("#right-nav").one("sidebar.closed", function(e) {
				var item = viewModel.selectedItem();
				if (item) {
					window.database.CrmOrder_OrderItem.detach(viewModel.selectedItem().innerInstance);
				}
				viewModel.isNewItem(false);
				viewModel.selectedItem(null);
				$("#right-nav").off("sidebar.closing", closingEventHandler);
			});
		});
}
namespace("Crm.Order.ViewModels").BaseOrderDetailsViewModel.prototype.sendConfirmation = function() {
	var viewModel = this;
	if (!this.hasCustomerEmail()) {
		window.swal(window.Helper.String.getTranslatedString("NoContactEmailPresent"), window.Helper.String.getTranslatedString("Warning_NoContactEmailPresent"), "warning");
		return;
	}
	window.database.attachOrGet(viewModel.baseOrder().innerInstance);
	viewModel.baseOrder().SendConfirmation(true);
	viewModel.baseOrder().ConfirmationSent(false);
	viewModel.baseOrder().IsLocked && viewModel.baseOrder().IsLocked(true);
	return window.database.saveChanges().then(function () {
		viewModel.showSnackbar(window.Helper.String.getTranslatedString("OrderWillBeSent").replace("{0}", viewModel.baseOrder().OrderNo()));
		viewModel.loading(false);
	});
}
namespace("Crm.Order.ViewModels").BaseOrderDetailsViewModel.prototype.hasCustomerEmail = function () {
	var viewModel = this;
	return viewModel.baseOrder().CustomEmail() || (viewModel.baseOrder().ContactPersonId() && viewModel.contactPerson().Address.Emails.length !== 0);
}


namespace("Crm.Order.ViewModels").BaseOrderDetailsViewModel.prototype.toggleDiscountType = function(orderItem) {
	if (orderItem.DiscountType() === window.Crm.Article.Model.Enums.DiscountType.Percentage) {
		orderItem.DiscountType(window.Crm.Article.Model.Enums.DiscountType.Absolute);
	} else {
		orderItem.DiscountType(window.Crm.Article.Model.Enums.DiscountType.Percentage);
	}
}
namespace("Crm.Order.ViewModels").BaseOrderDetailsViewModel.prototype.refresh = function(order) {
	return new $.Deferred().resolve().promise();
};
namespace("Crm.Order.ViewModels").BaseOrderDetailsViewModel.prototype.getCurrencyValue = function (currencyKey) {
	var viewModel = this;
	var currency = window.ko.utils.arrayFirst(viewModel.currencies(), function (currency) {
		return currency.Key() === currencyKey;
	});
	return !!currency ? currency.Value() : "";
}
namespace("Crm.Order.ViewModels").BaseOrderDetailsViewModel.prototype.getDiscountPercentageValue = function (orderItem) {
	var value = (orderItem.Discount() / orderItem.Price())*100;
	return parseFloat(value.toFixed(2));
}
namespace("Crm.Order.ViewModels").BaseOrderDetailsViewModel.prototype.getDiscountExactValue = function (orderItem) {
	var value = (orderItem.Discount()*(orderItem.Price()*orderItem.QuantityValue()))/100;
	return parseFloat(value.toFixed(2));
}