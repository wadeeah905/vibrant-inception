; (function (ko, Helper) {
	ko.validationRules.add("CrmOrder_Offer", function (entity) {
		entity.OrderNo.extend({
			unique: {
				params: [window.database.CrmOrder_Offer, 'OrderNo', entity.Id],
				message: Helper.String.getTranslatedString("RuleViolation.Unique")
					.replace("{0}", Helper.String.getTranslatedString("OrderNo"))
			}
		});
		entity.OrderCategoryKey.extend({
			required: {
				params: true,
				message: Helper.String.getTranslatedString("RuleViolation.Required")
					.replace("{0}", Helper.String.getTranslatedString("OrderCategory")),
				onlyIf: function() {
					return entity.OrderEntryType() === "SingleDelivery" || entity.OrderEntryType() === "MultiDelivery";
				}
			}
		});
		entity.BillingAddressId.extend({
			required: {
				params: true,
				message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("BillAddress")),
				onlyIf: function () {
					return window.Crm.Order.Settings.OrderBillingAddressEnabled;
				}
			}
		});
		entity.DeliveryAddressId.extend({
			required: {
				params: true,
				message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("DeliveryAddress")),
				onlyIf: function () {
					return window.Crm.Order.Settings.OrderDeliveryAddressEnabled;
				}
			}
		});
		ko.validation.addRule(entity.OrderEntryType, {
			rule: "required",
			message: Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", Helper.String.getTranslatedString("OrderEntryType")),
			params: true
		});
		ko.validation.addRule(entity.ContactId, {
			rule: "required",
			message: Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", Helper.String.getTranslatedString("Contact")),
			params: true
		});
		ko.validation.addRule(entity.CurrencyKey, {
			rule: "required",
			message: Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", Helper.String.getTranslatedString("Currency")),
			params: true
		});
		ko.validation.addRule(entity.ValidTo, {
			rule: "required",
			message: Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", Helper.String.getTranslatedString("ValidTo")),
			params: true
		});
	});
	ko.validationRules.add("CrmOrder_Order", function (entity) {
		entity.OrderNo.extend({
			unique: {
				params: [window.database.CrmOrder_Order, 'OrderNo', entity.Id],
				message: Helper.String.getTranslatedString("RuleViolation.Unique")
					.replace("{0}", Helper.String.getTranslatedString("OrderNo"))
			}
		});
		entity.OrderCategoryKey.extend({
			required: {
				params: true,
				message: Helper.String.getTranslatedString("RuleViolation.Required")
					.replace("{0}", Helper.String.getTranslatedString("OrderCategory")),
				onlyIf: function() {
					return entity.OrderEntryType() === "SingleDelivery" || entity.OrderEntryType() === "MultiDelivery";
				}
			},
		});
		entity.BillingAddressId.extend({
			required: {
				params: true,
				message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("BillAddress")),
				onlyIf: function () {
					return window.Crm.Order.Settings.OrderBillingAddressEnabled;
				}
			}
		});
		entity.DeliveryAddressId.extend({
			required: {
				params: true,
				message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("DeliveryAddress")),
				onlyIf: function () {
					return window.Crm.Order.Settings.OrderDeliveryAddressEnabled;
				}
			}
		});
		ko.validation.addRule(entity.OrderEntryType, {
			rule: "required",
			message: Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", Helper.String.getTranslatedString("OrderEntryType")),
			params: true
		});
		ko.validation.addRule(entity.CurrencyKey, {
			rule: "required",
			message: Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", Helper.String.getTranslatedString("Currency")),
			params: true
		});
		ko.validation.addRule(entity.DeliveryDate, {
			message: window.Helper.String.getTranslatedString("RuleViolation.DateCanNotBeAfterDate")
				.replace("{0}", window.Helper.String.getTranslatedString("OrderDate"))
				.replace("{1}", window.Helper.String.getTranslatedString("DeliveryDate").toLowerCase()),
			validator: function (val) {
				if (!!entity.DeliveryDate() && !!entity.OrderDate())
					return window.moment(val).add(1, "day").isAfter(entity.OrderDate());
				else
					return true;
			}
		});
	});
	ko.validationRules.add("CrmOrder_OrderItem", function (entity) {
		entity.ArticleNo.extend({
			required: {
				params: true,
				message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("Material"))
			}
		});
		entity.QuantityValue.extend({
			validation: {
				validator: function (val) {
					return val >= 0;
				},
				message: window.Helper.String.getTranslatedString("RuleViolation.NotNegative")
					.replace("{0}", Helper.String.getTranslatedString("Discount")),
			}
		});
		entity.Price.extend({
			validation: {
				validator: function (val) {
					return val >= 0;
				},
				message: window.Helper.String.getTranslatedString("RuleViolation.NotNegative")
					.replace("{0}", Helper.String.getTranslatedString("Price")),
			}
		});
		entity.Discount.extend({
			validation: {
				validator: function (val) {
					return val >= 0;
				},
				message: window.Helper.String.getTranslatedString("RuleViolation.NotNegative")
					.replace("{0}", Helper.String.getTranslatedString("Discount")),
			}
		});
		entity.Discount.extend({
			validation: {
				validator: function (val) {
					return entity.DiscountType() === window.Crm.Article.Model.Enums.DiscountType.Percentage ? val <= 100 : val <= entity.Price();
				},
				message: window.Helper.String.getTranslatedString("RuleViolation.DiscountBiggerThanPrice")
			}
		});
	});
})(window.ko, window.Helper);