namespace("Crm.Order.ViewModels").OfferEnterCustomerEmailModalViewModel = function(parentViewModel) {
	var viewModel = this;
	viewModel.offer = parentViewModel.offer;
	viewModel.CustomEmail = ko.observable(null);
	viewModel.errors = window.ko.validation.group(viewModel.CustomEmail, { deep: true });
	viewModel.sendConfirmation = parentViewModel.sendConfirmation.bind(parentViewModel); 
}
namespace("Crm.Order.ViewModels").OfferEnterCustomerEmailModalViewModel.prototype.init = function() {
	var viewModel = this;
	viewModel.CustomEmail.extend({
		required: {
			params: true,
			message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("CustomEmail"))
		}
	});
};
namespace("Crm.Order.ViewModels").OfferEnterCustomerEmailModalViewModel.prototype.submit = function() {
	var viewModel = this;
	if (viewModel.errors().length > 0) {
		viewModel.errors.showAllMessages();
		return;
	}
	viewModel.offer().CustomEmail(viewModel.CustomEmail());
	return viewModel.sendConfirmation()
		.then( function () {
			$(".modal:visible").modal("hide");
		});
		
};