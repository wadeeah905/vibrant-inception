namespace("Crm.Order.ViewModels").OfferCreateOrderModalViewModel = function(parentViewModel) {
	var viewModel = this;
	viewModel.errors = window.ko.validation.group(viewModel, { deep: true });
	viewModel.loading = window.ko.observable(false);
	viewModel.showQuantities = window.ko.observable(parentViewModel.offer().OrderEntryType() === "SingleDelivery" || parentViewModel.offer().OrderEntryType() === "MultiDelivery");
	viewModel.getCurrencyValue = namespace("Crm.Order.ViewModels").BaseOrderDetailsViewModel.prototype.getCurrencyValue;
	viewModel.currencies = window.ko.observableArray([]);
	viewModel.offer = parentViewModel.offer;
	viewModel.offerItems = parentViewModel.orderItems;
	viewModel.offer = parentViewModel.offer;
	viewModel.order = window.ko.observable(null);
	viewModel.orderItems = window.ko.observableArray([]);
	viewModel.orderItems.distinct("DeliveryDate");
	viewModel.dataProtectionInfoVisibility = window.ko.observable(false);	
	viewModel.signatureAcceptanceRequired = window.Crm.Order.Settings.Order.Show.PrivacyPolicy;
	viewModel.site = window.ko.observable(null);
	viewModel.alternatives = window.ko.pureComputed(function() {
		return window.ko.utils.arrayFilter(viewModel.offerItems(),
			function(item) {
				return item.IsAlternative();
			});
	});
	viewModel.alternatives.distinct("ParentOrderItemId");
	viewModel.alternativeGroups = window.ko.pureComputed(function() {
		return window.ko.utils.arrayMap(viewModel.alternatives.indexKeys.ParentOrderItemId(), function(parentOrderItemId) {
			var parentOrderItem = window.ko.utils.arrayFirst(viewModel.offerItems(), function(offerItem) { return offerItem.Id().toString() === parentOrderItemId.toString(); }) || null;
			return {
				alternatives: viewModel.alternatives.index.ParentOrderItemId()[parentOrderItemId],
				parentOrderItem: parentOrderItem,
				parentOrderItemId: parentOrderItemId,
				selectedAlternative: window.ko.observable(parentOrderItem)
			};
		});
	});
	viewModel.optionalItems = window.ko.pureComputed(function() {
		return window.ko.utils.arrayFilter(viewModel.offerItems(),
			function(item) {
				return item.IsOption();
			});
	});
	viewModel.selectedOptionalItems = window.ko.observableArray([]);
}
namespace("Crm.Order.ViewModels").OfferCreateOrderModalViewModel.prototype.init = function() {
	var viewModel = this;
	viewModel.loading(true);
	var newOrder = window.database.CrmOrder_Order.CrmOrder_Order.create();
	newOrder.Id = window.$data.createGuid().toString().toLowerCase();
	newOrder.BillingAddressId = viewModel.offer().BillingAddressId();
	newOrder.CalculatedPrice = viewModel.offer().CalculatedPrice();
	newOrder.CalculatedPriceWithDiscount = viewModel.offer().CalculatedPriceWithDiscount();
	newOrder.CommunicationType = viewModel.offer().CommunicationType();
	newOrder.ContactId = viewModel.offer().ContactId();
	newOrder.ContactAddressId = viewModel.offer().ContactAddressId();
	newOrder.ContactPersonId = viewModel.offer().ContactPersonId();
	newOrder.CurrencyKey = viewModel.offer().CurrencyKey();
	newOrder.CustomEmail = viewModel.offer().CustomEmail();
	newOrder.CustomFax = viewModel.offer().CustomFax();
	newOrder.DeliveryAddressId = viewModel.offer().DeliveryAddressId();
	newOrder.DeliveryDate = viewModel.offer().DeliveryDate();
	newOrder.Discount = viewModel.offer().Discount();
	newOrder.DiscountText = window.Helper.Article.getDiscountText(viewModel.offer().DiscountType());
	newOrder.DiscountType = viewModel.offer().DiscountType();
	newOrder.OfferId = viewModel.offer().Id();
	newOrder.OrderCategoryKey = viewModel.offer().OrderCategoryKey();
	newOrder.OrderDate = new Date();
	newOrder.OrderEntryType = viewModel.offer().OrderEntryType();
	newOrder.Price = viewModel.offer().Price();
	newOrder.PrivateDescription = viewModel.offer().PrivateDescription();
	newOrder.PublicDescription = viewModel.offer().PublicDescription();
	newOrder.RealizedDiscount = viewModel.offer().RealizedDiscount();
	newOrder.ResponsibleUser = viewModel.offer().ResponsibleUser();
	if (viewModel.offer().Company() && viewModel.offer().Company().SalesRepresentative()) {
		newOrder.SalesRepresentative = viewModel.offer().Company().SalesRepresentative();
	} else {
		newOrder.SalesRepresentative = "";
	}
	// TODO: newOrder.StatusKey = ???
	newOrder.Visibility = viewModel.offer().Visibility();
	newOrder.VisibleToUsergroupIds = viewModel.offer().VisibleToUsergroupIds();
	newOrder.VisibleToUserIds = viewModel.offer().VisibleToUserIds();

	viewModel.order(newOrder.asKoObservable());
	viewModel.offerItems().forEach(function(offerItem) {
		var hasAlternative = viewModel.alternatives.indexKeys.ParentOrderItemId().indexOf(offerItem.Id().toString()) !== -1;
		if (offerItem.QuantityValue() !== 0 && !offerItem.IsAlternative() && !offerItem.IsOption() && !hasAlternative) {
			var orderItem = window.database.CrmOrder_OrderItem.CrmOrder_OrderItem.create(offerItem.innerInstance);
			orderItem.Id = window.$data.createGuid().toString().toLowerCase();
			orderItem.OrderId = newOrder.Id;
			viewModel.orderItems().push(orderItem.asKoObservable());
		}
	});
	viewModel.orderItems.valueHasMutated();
	viewModel.order().SignPrivacyPolicyAccepted.extend({
		validation: {
			validator: function (val, showPrivacyPolicy) {
				return !showPrivacyPolicy || !viewModel.order().Signature() || !!viewModel.order().Signature() && val;
			},
			message: window.Helper.String.getTranslatedString("PleaseAcceptDataPrivacyPolicy"),
			params: viewModel.signatureAcceptanceRequired
		}
	});
	return new $.Deferred().resolve().promise()
		.pipe(function() {
			return window.database.Main_Currency
				.orderByDescending(function(x) { return x.Favorite; })
				.orderBy(function(x) { return x.SortOrder; })
				.toArray(viewModel.currencies);
		}).pipe(function() {
			return window.database.Main_Site.GetCurrentSite().first();
		}).then(function(site) {
			viewModel.site(site);
			viewModel.loading(false);;
		});
}
namespace("Crm.Order.ViewModels").OfferCreateOrderModalViewModel.prototype.submit = function() {
	var viewModel = this;

	if (viewModel.errors().length > 0) {
		viewModel.errors.showAllMessages();
		return false;
	}

	viewModel.loading(true);
	
	database.attach(viewModel.offer())
	viewModel.offer().StatusKey('OrderCreated');
	viewModel.offer().IsLocked(true);
	
	viewModel.alternativeGroups()
		.forEach(function(alternativeGroup) {
			var orderItem = window.database.CrmOrder_OrderItem.CrmOrder_OrderItem.create(alternativeGroup.selectedAlternative().innerInstance);
			orderItem.Id = window.$data.createGuid().toString().toLowerCase();
			orderItem.IsAlternative = false;
			orderItem.OrderId = viewModel.order().Id();
			orderItem.ParentOrderItemId = null;
			viewModel.orderItems().push(orderItem.asKoObservable());
		});
	viewModel.selectedOptionalItems()
		.forEach(function(offerItem) {
			var orderItem = window.database.CrmOrder_OrderItem.CrmOrder_OrderItem.create(offerItem.innerInstance);
			orderItem.Id = window.$data.createGuid().toString().toLowerCase();
			orderItem.IsOption = false;
			orderItem.OrderId = viewModel.order().Id();
			viewModel.orderItems().push(orderItem.asKoObservable());
		});
	window.database.add(viewModel.order().innerInstance);
	viewModel.orderItems()
		.forEach(function(orderItem) {
			window.database.add(orderItem.innerInstance);
		});

	return window.NumberingService.createNewNumberBasedOnAppSettings(window.Crm.Order.Settings.Order.OrderNoIsGenerated, window.Crm.Order.Settings.Order.OrderNoIsCreateable, viewModel.order().OrderNo(), window.Crm.Order.ViewModels.OrderCreateViewModel.prototype.numberingSequence, window.database.CrmOrder_Order, "OrderNo")
		.pipe(function (orderNo) {
			if (orderNo !== undefined) {
				viewModel.order().OrderNo(orderNo);
			}
			return window.database.saveChanges();
		}).pipe(function() {
			viewModel.loading(false);
			window.location.hash = "/Crm.Order/Order/DetailsTemplate/" + viewModel.order().Id();
		});
};
namespace("Crm.Order.ViewModels").OfferCreateOrderModalViewModel.prototype.toogleDataProtectionInfo = function () {
	var viewModel = this;
	viewModel.dataProtectionInfoVisibility(!viewModel.dataProtectionInfoVisibility());
};