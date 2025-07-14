namespace("Crm.Order.ViewModels").BaseOrderPdfModalViewModel = function(parentViewModel) {
	var viewModel = this;
	viewModel.parentViewModel = parentViewModel;
	viewModel.address = window.ko.observable(null);
	viewModel.loading = window.ko.observable(false);
	viewModel.order = parentViewModel ? parentViewModel.baseOrder : window.ko.observable(null);
	viewModel.items = parentViewModel ? parentViewModel.orderItems : window.ko.observableArray(null);
	viewModel.deliveryDates = ko.pureComputed(function () {
		return window._.uniqBy(viewModel.items().map(function (item) { return item.DeliveryDate(); }), function (date) { return date != null ? date.toDateString() : date; });
	});
	viewModel.responsibleUser = window.ko.observable(null);
	viewModel.footerHeight = window.ko.observable(null);
	viewModel.headerHeight = window.ko.observable(null);
	viewModel.site = window.ko.observable(null);
	viewModel.calculationPositions = window.ko.observableArray([]);
	viewModel.lookups = {
		currencies: { $tableName: "Main_Currency" },
		calculationPositionType: { $tableName: "CrmOrder_CalculationPositionType" },
		quantityUnits: {$tableName: "CrmArticle_QuantityUnit"},
		vatLevel: {},
	};
	viewModel.company = window.ko.pureComputed(function() {
		return !!viewModel.order() && !!viewModel.order().Company() ? viewModel.order().Company() : null;
	});
	viewModel.date = window.ko.pureComputed(function() {
		return !!viewModel.order() && !!viewModel.order().OrderDate() ? viewModel.order().OrderDate() : new Date();
	});
	viewModel.usedVATTypes = window.ko.pureComputed(function () {
		var types = [];
		viewModel.items().filter(function (it) { return it.VATLevelKey() }).forEach(function(it) { 
			if(!types.some(function(type) { return type === it.VATLevelKey() })) {
				types.push(it.VATLevelKey());
			}
		});
		return types.sort();
	});
}
namespace("Crm.Order.ViewModels").BaseOrderPdfModalViewModel.prototype.init = function() {
	var viewModel = this;
	var responsibleUser = viewModel.order().ResponsibleUser() || document.getElementById("meta.CurrentUser").content;

	return window.database.Main_User
		.find(responsibleUser)
		.then(function (result) {
			viewModel.responsibleUser(result.asKoObservable());
		})
		.then(function () {
			return window.database.CrmOrder_CalculationPosition
				.filter(function (x) { return x.BaseOrderId == this.baseOrderId; }, { baseOrderId: viewModel.order().Id() }).toArray(function (results) {
					viewModel.calculationPositions(results);
				});
		})
		.then(function() {
			if (!!viewModel.order().ContactId()) {
				return window.database.Main_Address.filter(function(address) {
						return address.CompanyId == this.companyId && address.IsCompanyStandardAddress == true;
					}, { companyId: viewModel.order().ContactId() })
					.take(1)
					.toArray(function(results) {
						if (results.length > 0) {
							viewModel.address(results[0].asKoObservable());
						}
					});
			}
		})
		.then(function () {
			return window.database.Main_Site.GetCurrentSite().first();
		})
		.then(function (site) {
			viewModel.site(site);
			if (window.Main &&
				window.Main.Settings &&
				window.Main.Settings.Report) {
				var headerHeight = +window.Main.Settings.Report.HeaderHeight +
					+window.Main.Settings.Report.HeaderSpacing;
				viewModel.headerHeight(headerHeight);
				var footerHeight = +window.Main.Settings.Report.FooterHeight +
					+window.Main.Settings.Report.FooterSpacing;
				viewModel.footerHeight(footerHeight);
			}

			viewModel.items().forEach(function (it) {
				it.CurrencyKey = viewModel.order().CurrencyKey;

				if (!it.VATLevelKey() && it.Article()) {
					it.VATLevelKey(it.Article().VATLevelKey());
				}
			});

			return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups).then(function () {
				return window.Helper.Lookup.getLocalizedArrayMap("CrmArticle_VATLevel")
					.then(function (lookup) { viewModel.lookups.vatLevel = lookup; })
			});
		});
}
namespace("Crm.Order.ViewModels").BaseOrderPdfModalViewModel.prototype.getAlternatives  = function(orderItem) {
	var viewModel = this;
	var alternatives = viewModel.items().filter(function(item) { return item.ParentOrderItemId() === orderItem.Id()}) || [];
	return alternatives.filter(function(x) {
			return x.IsAlternative() === true;
		})
		.sort(function(a, b) {
			return a.Price() - b.Price();
		});
}
namespace("Crm.Order.ViewModels").BaseOrderPdfModalViewModel.prototype.getVATCategoryTotalPrice = function(VAT) {
	var viewModel = this;
	var orderItems = viewModel.items().filter(function(it) { return VAT === it.VATLevelKey() });
	if(!orderItems) {
		return null;
	}
	var totalPrice = 0;
	var totalPriceWithVAT = 0;
	orderItems.forEach(function(it) {
		totalPrice += viewModel.getCalculatedPriceWithDiscount(it)();
		totalPriceWithVAT += viewModel.getCalculatedPriceWithVAT(it)();
	});
	return { TotalPrice: totalPrice, TotalPriceWithVAT: totalPriceWithVAT, OnlyVAT: totalPriceWithVAT - totalPrice };
}
namespace("Crm.Order.ViewModels").BaseOrderPdfModalViewModel.prototype.getTotalPriceWithVAT = function () {
	var viewModel = this;
	var total = 0;
	viewModel.items().forEach(function (it) { total += viewModel.getCalculatedPriceWithVAT(it)(); });
	return total;
}
namespace("Crm.Order.ViewModels").BaseOrderPdfModalViewModel.prototype.getCalculatedPriceWithVAT = function (orderItem) {
	var viewModel = this;
	orderItem.calculatedPriceWithVAT = orderItem.calculatedPriceWithVAT ||
		window.ko.pureComputed(function () {
			var VATlevel = viewModel.lookups.vatLevel.$array.filter(function (v) { return v.Key === orderItem.VATLevelKey() })[0];
			var price = viewModel.getCalculatedPriceWithDiscount(orderItem)();
			price *= 1 + (VATlevel.PercentageValue / 100);
			return price;
		});
	return orderItem.calculatedPriceWithVAT;
}
namespace("Crm.Order.ViewModels").BaseOrderPdfModalViewModel.prototype.getCalculatedPriceWithDiscount = function (orderItem) {
	var viewModel = this;
	return window.Crm.Order.ViewModels.BaseOrderDetailsViewModel.prototype.getCalculatedPriceWithDiscount.call(viewModel, orderItem);
};
namespace("Crm.Order.ViewModels").BaseOrderPdfModalViewModel.prototype.getDiscountPercentageValue = function (orderItem) {
	var viewModel = this;
	return window.Crm.Order.ViewModels.BaseOrderDetailsViewModel.prototype.getDiscountPercentageValue.call(viewModel, orderItem);
};
namespace("Crm.Order.ViewModels").BaseOrderPdfModalViewModel.prototype.getDiscountExactValue = function (orderItem) {
	var viewModel = this;
	return window.Crm.Order.ViewModels.BaseOrderDetailsViewModel.prototype.getDiscountExactValue.call(viewModel, orderItem);
};