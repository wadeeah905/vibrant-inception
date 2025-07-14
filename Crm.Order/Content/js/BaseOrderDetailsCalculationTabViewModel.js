namespace("Crm.Order.ViewModels").BaseOrderDetailsCalculationTabViewModel = function(parentViewModel) {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	viewModel.basePrice = window.ko.observable(0);
	viewModel.baseSalesPrice = window.ko.observable(0);
	viewModel.calculatedPurchasePrice = window.ko.observable(0);
	viewModel.calculatedSalesPrice = window.ko.observable(0);
	viewModel.calculationParameters = window.ko.observableArray([]);
	viewModel.calculationParameters.push({
	  Amount: window.ko.observable(null),
	  AmountSales: window.ko.observable(null),
	  Name: window.Helper.String.getTranslatedString("Sum"),
	  Calculation: function (purchasePrice, salesPrice) {
	    return {
	      Amount: purchasePrice,
	      AmountSales: salesPrice
	    };
	  },
	  Details: window.ko.observableArray([]),
	  ShowDiff: false
	});
	viewModel.calculationPositions = window.ko.observableArray([]);
	viewModel.calculationPositionTypes = window.ko.observableArray([]);
	viewModel.nonDefaultCalculationPositionTypes = window.ko.pureComputed(function() {
		return window.ko.utils.arrayFilter(viewModel.calculationPositionTypes(), function(calculationPositionType) {
			return calculationPositionType.IsDefault() === false;
		});
	});
	viewModel.selectedCalculationPositionType = window.ko.observable(null).extend({
		required: {
			message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("CalculationPositionType")),
			params: true
		}
	});
	viewModel.salesPrice = window.ko.validatedObservable(parentViewModel.baseOrder().Price());
	viewModel.salesPrice.extend({
		required: {
			message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("SalesPrice")),
			params: true
		},
		validation: [
			{
				rule: "min",
				message: window.Helper.String.getTranslatedString("RuleViolation.NotNegative")
					.replace("{0}", Helper.String.getTranslatedString("SalesPrice")),
				params: 0
			}
		]
	});
	viewModel.marginAbsolute = window.ko.pureComputed(function () {
		if (viewModel.salesPrice.isValid()) {
			return viewModel.salesPrice() - viewModel.calculatedPurchasePrice();
		}
	});
	viewModel.marginRelative = window.ko.pureComputed(function() {
		if (viewModel.calculatedPurchasePrice() === 0) {
			return 0;
		}
		return ((viewModel.marginAbsolute() / viewModel.calculatedPurchasePrice()) * 100) || 0;
	});
	viewModel.marginSalesAbsolute = window.ko.pureComputed(function () {
		if (viewModel.salesPrice.isValid()) {
			return viewModel.salesPrice() - viewModel.calculatedSalesPrice();
		}
	});
	viewModel.marginSalesRelative = window.ko.pureComputed(function() {
		if (viewModel.calculatedSalesPrice() === 0) {
			return 0;
		}
		return ((viewModel.marginSalesAbsolute() / viewModel.calculatedSalesPrice()) * 100) || 0;
	});
	viewModel.calculationPositions.subscribe(function() {
		viewModel.calculate();
	});
	parentViewModel.orderItems.subscribe(function() {
		viewModel.calculate();
	});
	parentViewModel.isEditable.subscribe(function () {
		if (parentViewModel.isEditable() === false && !viewModel.salesPrice.isValid()) {
				viewModel.salesPrice(parentViewModel.baseOrder().Price());
		}
	});
	viewModel.salesPrice.subscribe(function () {
		if (viewModel.salesPrice.isValid()) {
			viewModel.calculate();
		}
	});
}
namespace("Crm.Order.ViewModels").BaseOrderDetailsCalculationTabViewModel.prototype = Object.create(window.Main.ViewModels.ViewModelBase.prototype);
namespace("Crm.Order.ViewModels").BaseOrderDetailsCalculationTabViewModel.prototype.init = function (parentViewModel) {
	var viewModel = this;
	if (parentViewModel.baseOrder().OrderEntryType() === "SingleDelivery" || parentViewModel.baseOrder().OrderEntryType() === "MultiDelivery") {
		viewModel.basePrice(parentViewModel.totalPurchasePrice() || 0);
		viewModel.baseSalesPrice(parentViewModel.totalPrice() || 0);
		parentViewModel.totalPrice.subscribe(function(value) {
			viewModel.baseSalesPrice(value || 0);
		});
	}
	return window.Helper.User.getCurrentUser()
		.pipe(function (user) {
			return window.database.CrmOrder_CalculationPositionType
				.filter(function(x) { return x.Language == this.languageKey; }, { languageKey: user.DefaultLanguageKey })
				.orderBy(function(x) { return x.SortOrder; })
				.orderBy(function(x) { return x.Value; })
				.toArray(function(results) {
					viewModel.calculationPositionTypes(window.ko.utils.arrayMap(results, function(x) { return x.asKoObservable(); }));
				});
		}).pipe(function () {
			return window.database.CrmOrder_CalculationPosition
				.filter(function (x) { return x.BaseOrderId == this.baseOrderId; }, { baseOrderId: viewModel.parentViewModel.baseOrder().Id() }).toArray(function (results) {
					viewModel.calculationPositions(window.ko.utils.arrayMap(results, function(x) {
						var result = window.database.attachOrGet(x).asKoObservable();
						var calculationPositionType = window.ko.utils.arrayFirst(viewModel.calculationPositionTypes(), function(x) {
							return x.Key() === result.CalculationPositionTypeKey();
						}) || null;
						result.CalculationPositionType = calculationPositionType;
						return result;
					}));
				});
		}).pipe(viewModel.initDefaultCalculationPositions.bind(viewModel))
		.pipe(viewModel.calculate.bind(viewModel));
}
namespace("Crm.Order.ViewModels").BaseOrderDetailsCalculationTabViewModel.prototype.addCalculationPosition = function () {
	var viewModel = this;
	if (!viewModel.selectedCalculationPositionType.isValid()) {
		window.ko.validation.group(viewModel.selectedCalculationPositionType).showAllMessages();
		return;
	}
	var selectedCalculationPositionTypeKey = viewModel.selectedCalculationPositionType();
	var calculationPositionType = window.ko.utils.arrayFirst(viewModel.calculationPositionTypes(), function(x) {
		return x.Key() === selectedCalculationPositionTypeKey;
	});
	var newCalculationPosition = window.database.CrmOrder_CalculationPosition.CrmOrder_CalculationPosition.create().asKoObservable();
	window.database.add(newCalculationPosition.innerInstance);
	newCalculationPosition.BaseOrderId(viewModel.parentViewModel.baseOrder().Id());
	newCalculationPosition.CalculationPositionType = calculationPositionType;
	newCalculationPosition.CalculationPositionTypeKey(calculationPositionType.Key());
	viewModel.calculationPositions.unshift(newCalculationPosition);
}
namespace("Crm.Order.ViewModels").BaseOrderDetailsCalculationTabViewModel.prototype.calculate = function () {
	var viewModel = this;
	viewModel.loading(true);
	var purchasePrice = viewModel.basePrice();
	var salesPrice = viewModel.baseSalesPrice();
	viewModel.calculationParameters().forEach(function(calculationParameter) {
		var newPrices = calculationParameter.Calculation(purchasePrice, salesPrice);
		var newPurchasePrice = newPrices.Amount;
		var newSalesPrice = newPrices.AmountSales;
		calculationParameter.Amount(calculationParameter.ShowDiff ? (newPurchasePrice - purchasePrice) : newPurchasePrice);
		calculationParameter.AmountSales(calculationParameter.ShowDiff ? (newSalesPrice - salesPrice) : newSalesPrice);
		purchasePrice = newPurchasePrice;
		salesPrice = newSalesPrice;
	});
	viewModel.calculationPositions().forEach(function(calculationPosition) {
		var calculationPositionType = window.ko.utils.arrayFirst(viewModel.calculationPositionTypes(), function (x) {
			return x.Key() === calculationPosition.CalculationPositionTypeKey();
		});
		var purchaseAmount = calculationPositionType.IsAbsolute() ? calculationPosition.PurchasePrice() : (calculationPosition.PurchasePrice() / 100 * purchasePrice);
		var salesAmount = calculationPositionType.IsAbsolute() ? calculationPosition.SalesPrice() : (calculationPosition.SalesPrice() / 100 * salesPrice);
		if (calculationPositionType.IsDiscount() === true) {
			if(calculationPosition.IsPercentage()){
				purchasePrice = purchasePrice*(100-purchaseAmount)/100 || 0;
				salesPrice = salesPrice*(100-salesAmount)/100 || 0;
			} else {
				purchasePrice = purchasePrice - purchaseAmount || 0;
				salesPrice = salesPrice - salesAmount || 0;
			}
		} else {
			purchasePrice = purchasePrice + purchaseAmount || 0;
			salesPrice = salesPrice + salesAmount || 0;
		}
	});
	viewModel.calculatedPurchasePrice(purchasePrice);
	if (!viewModel.salesPrice() || viewModel.salesPrice() === viewModel.calculatedSalesPrice()) {
		viewModel.salesPrice(salesPrice);
	}
	if (viewModel.calculatedSalesPrice() !== salesPrice) {
		viewModel.calculatedSalesPrice(salesPrice);
	}
	viewModel.parentViewModel.baseOrder().Price(viewModel.salesPrice() || viewModel.parentViewModel.totalPrice() || 0);
	if (viewModel.parentViewModel.baseOrder().innerInstance.entityState === $data.EntityState.Added) {
		return new $.Deferred().resolve().then(function() {
			viewModel.loading(false);
		});
	}
	return window.database.saveChanges().then(function () {
		viewModel.calculationPositions().forEach(function (calculationPosition) {
			window.database.attachOrGet(calculationPosition.innerInstance);
		});
		window.database.attachOrGet(viewModel.parentViewModel.baseOrder().innerInstance);
		viewModel.loading(false);
	});
}
namespace("Crm.Order.ViewModels").BaseOrderDetailsCalculationTabViewModel.prototype.initDefaultCalculationPositions = function () {
	var viewModel = this;
	viewModel.calculationPositionTypes().forEach(function(calculationPositionType) {
		var isMissingFromCalculation = calculationPositionType.IsDefault() === true && window.ko.utils.arrayFirst(viewModel.calculationPositions(), function(calculationPosition) { return calculationPosition.CalculationPositionTypeKey() === calculationPositionType.Key() }) === null;
		if (isMissingFromCalculation) {
			var newCalculationPosition = window.database.CrmOrder_CalculationPosition.CrmOrder_CalculationPosition.create().asKoObservable();
			window.database.add(newCalculationPosition.innerInstance);
			newCalculationPosition.BaseOrderId(viewModel.parentViewModel.baseOrder().Id());
			newCalculationPosition.CalculationPositionType = calculationPositionType;
			newCalculationPosition.CalculationPositionTypeKey(calculationPositionType.Key());
			viewModel.calculationPositions.push(newCalculationPosition);
		}
	});
}
namespace("Crm.Order.ViewModels").BaseOrderDetailsCalculationTabViewModel.prototype.removeCalculationPosition = function (calculationPosition) {
	var viewModel = this;
	window.database.remove(calculationPosition.innerInstance);
	var index = viewModel.calculationPositions.indexOf(calculationPosition);
	viewModel.calculationPositions.remove(calculationPosition);
	viewModel.showSnackbar(window.Helper.String.getTranslatedString("CalculationPositionRemoved"), window.Helper.String.getTranslatedString("Undo"), function() {
		var newCalculationPosition = window.database.CrmOrder_CalculationPosition.CrmOrder_CalculationPosition.create().asKoObservable();
		window.database.add(newCalculationPosition.innerInstance);
		newCalculationPosition.BaseOrderId(calculationPosition.BaseOrderId());
		newCalculationPosition.CalculationPositionType = calculationPosition.CalculationPositionType;
		newCalculationPosition.CalculationPositionTypeKey(calculationPosition.CalculationPositionTypeKey());
		newCalculationPosition.PurchasePrice(calculationPosition.PurchasePrice());
		newCalculationPosition.SalesPrice(calculationPosition.SalesPrice());
		newCalculationPosition.Remark(calculationPosition.Remark());
		viewModel.calculationPositions.splice(index, 0, newCalculationPosition);
	});
}
namespace("Crm.Order.ViewModels").BaseOrderDetailsCalculationTabViewModel.prototype.togglePercentage = function(calculationPosition) {
	var viewModel = this;	
	if (calculationPosition.IsPercentage()) {
		calculationPosition.IsPercentage(false);
	} else {
		calculationPosition.IsPercentage(true);
	}
	viewModel.calculate();
}