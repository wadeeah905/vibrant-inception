(function () {
	var baseViewModel = window.Crm.Service.ViewModels.DispatchAdHocViewModel;
	window.Crm.Service.ViewModels.DispatchAdHocViewModel = function () {
		baseViewModel.apply(this, arguments);
		var viewModel = this;
		viewModel.installationId = window.ko.observable(null);
		viewModel.installationId.subscribe(function (value) {
			viewModel.installationIds([]);
			viewModel.installationIds([value]);
		});
		viewModel.installationId.extend({
			required: {
				message: window.Helper.String.getTranslatedString("RuleViolation.Required")
					.replace("{0}", window.Helper.String.getTranslatedString("Installation")),
				params: true
			}
		});
		viewModel.errors = window.ko.validation.group([viewModel.dispatch, viewModel.serviceOrder, viewModel.installationId], { deep: true });
	};
	window.Crm.Service.ViewModels.DispatchAdHocViewModel.prototype = baseViewModel.prototype;

	var baseOnInstallationSelect = baseViewModel.prototype.onInstallationSelect;
	window.Crm.Service.ViewModels.DispatchAdHocViewModel.prototype.onInstallationSelect = function (installation) {
		baseOnInstallationSelect.apply(this, arguments);
		var viewModel = this;
		if (installation && installation.LocationAddressKey) {
			viewModel.selectedAddress(installation.LocationAddressKey);
		}
		else {
			viewModel.selectedAddress(null);
		}
	};

	var baseOnCustomerContactSelect = baseViewModel.prototype.onCustomerContactSelect;
	window.Crm.Service.ViewModels.DispatchAdHocViewModel.prototype.onCustomerContactSelect = function (customerContact) {
		var viewModel = this;
		if (customerContact) {
			viewModel.serviceOrder().Company(customerContact.asKoObservable());
			viewModel.serviceOrder().CustomerContactId(customerContact.Id);
			if (viewModel.serviceOrder().Installation() &&
				viewModel.serviceOrder().Installation().LocationContactId() !== customerContact.Id) {
				viewModel.onInstallationSelect(null);
			}
			var removed = viewModel.installations.remove(function(x) {
				return x.LocationContactId !== customerContact.Id;
			});
			viewModel.installationIds.removeAll(removed.map(function(x) {
				return x.Id;
			}));
		} else {
			viewModel.serviceOrder().Company(null);
			viewModel.serviceOrder().CustomerContactId(null);
		}
		if (!ko.unwrap(viewModel.installations()[0].LocationAddressKey) && !viewModel.selectedAddress()) {
			viewModel.selectedAddress(null);
		}
	};
})();