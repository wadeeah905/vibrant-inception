namespace("Crm.Order.ViewModels").BaseOrderAddDeliveryModalViewModel = function(parentViewModel) {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	viewModel.parent = parentViewModel;
	viewModel.deliveryDates = parentViewModel.deliveryDates;
	viewModel.deliveryDate = window.ko.observable(null);
	viewModel.deliveryDate.extend({
		required: {
			message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("DeliveryDate")),
			params: true
		}
	});
	viewModel.deliveryDate.extend({
		validation: {
			validator: function (val, otherVals) {
				return !otherVals.find(function (x) { return window.moment(x).isSame(window.moment(val)); });
			},
			message: window.Helper.String.getTranslatedString("RuleViolation.Unique").replace("{0}", window.Helper.String.getTranslatedString("DeliveryDate")),
			params: viewModel.deliveryDates
		}
	});
}
namespace("Crm.Order.ViewModels").BaseOrderAddDeliveryModalViewModel.prototype = Object.create(window.Main.ViewModels.ViewModelBase.prototype);
namespace("Crm.Order.ViewModels").BaseOrderAddDeliveryModalViewModel.prototype.init = function (parentViewModel) {
	var viewModel = this;
	return new $.Deferred().resolve().promise();
}
namespace("Crm.Order.ViewModels").BaseOrderAddDeliveryModalViewModel.prototype.addDeliveryDate = function () {
	var viewModel = this;
	var errors = window.ko.validation.group(viewModel.deliveryDate);
	if (errors().length > 0) {
		errors.showAllMessages();
		return;
	}
	errors.showAllMessages(false);
	if (viewModel.deliveryDates.indexOf(viewModel.deliveryDate()) === -1) {
		if (viewModel.deliveryDates.indexOf(null) >= 0) {
			return viewModel.replaceNullDeliveryDate();
		}
		viewModel.deliveryDates.push(viewModel.deliveryDate());
	}
	$(".modal:visible").modal("hide");
	viewModel.deliveryDate(null);
}
namespace("Crm.Order.ViewModels").BaseOrderAddDeliveryModalViewModel.prototype.replaceNullDeliveryDate = function () {
	var viewModel = this;
	viewModel.deliveryDates.splice(viewModel.deliveryDates.indexOf(null), 1);
	Promise.all(
		viewModel.parent.orderItems().filter(function (it) { return it.DeliveryDate() === null })
			.map(function (it) {
				window.database.attachOrGet(it);
				it.DeliveryDate(viewModel.deliveryDate());
				return window.database.saveChanges();
			})
	).then(() => {
		viewModel.deliveryDates.push(viewModel.deliveryDate());
		$(".modal:visible").modal("hide");
		viewModel.deliveryDate(null);
	});
}