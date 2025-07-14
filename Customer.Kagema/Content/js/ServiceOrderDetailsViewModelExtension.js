(function () {

	var baseViewModel = window.Crm.Service.ViewModels.ServiceOrderDetailsViewModel;



	namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel = function () {
		var viewModel = this;
		baseViewModel.apply(this, arguments);

		viewModel.installations = ko.computed(() => {
			if (!viewModel.serviceOrder()) {
				return [];
			}
			if (window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode === "JobPerInstallation") {
				var installationTab = []
				return viewModel.serviceOrder().ServiceOrderTimes().filter(function (x) {
					return x.InstallationId() != null
				}).map(function (x) { return x.Installation().innerInstance })
			} else {
				let installationArray = [];
				if (viewModel.serviceOrder().Installation()) {
					installationArray.push(viewModel.serviceOrder().Installation().innerInstance);
				}
				return installationArray;
			}
		});

	};
	window.Crm.Service.ViewModels.ServiceOrderDetailsViewModel.prototype = baseViewModel.prototype;
	namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.loadServiceOrder = function (id) {
		const viewModel = this;
		return window.database.CrmService_ServiceOrderHead
			.include("InitiatorPerson")
			.include("InitiatorPerson.Phones")
			.include("InitiatorPerson.Emails")
			.include("Installation")
			.include("InvoiceRecipient")
			.include("InvoiceRecipientAddress")
			.include("Payer")
			.include("PayerAddress")
			.include("PreferredTechnicianUser")
			.include("ResponsibleUserUser")
			.include("ServiceOrderTemplate")
			.include("UserGroup")
			.include("Station")
			.include("ServiceContract")
			.include("ServiceContract.ParentCompany")
			.include("ServiceOrderTimes.Installation")
			.include2("Tags.orderBy(function(t) { return t.Name; })")
			.find(id).then(function (serviceOrder) {
				viewModel.serviceOrder(serviceOrder.asKoObservable());
				viewModel.contact(viewModel.serviceOrder());
			});
	}

})();