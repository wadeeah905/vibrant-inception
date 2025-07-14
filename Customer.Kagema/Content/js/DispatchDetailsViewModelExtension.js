(function () {

	var baseViewModel = window.Crm.Service.ViewModels.DispatchDetailsViewModel;

	window.Crm.Service.ViewModels.DispatchDetailsViewModel = function () {
		var viewModel = this;
		baseViewModel.apply(this, arguments);

		viewModel.installations = ko.computed(() => {
			if (!viewModel.dispatch() || !viewModel.dispatch().ServiceOrder()) {
				return [];
			}
			//if (window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode === "JobPerInstallation") {
			//	return viewModel.dispatch().ServiceOrder().ServiceOrderTimes().filter(function (x) {
			//		x.installationId!=null
			//	}).Installation;


			//} 

			if (window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode === "JobPerInstallation") {
				var installationTab = [];
				return viewModel.dispatch().ServiceOrder().ServiceOrderTimes().filter(function (x) {
					return x.InstallationId() != null && x.Installation && x.Installation()
				}).map(function (x) { return x.Installation().innerInstance })
			}
			else {
				let installationArray = [];
				if (viewModel.dispatch().ServiceOrder().Installation()) {
					installationArray.push(viewModel.dispatch().ServiceOrder().Installation().innerInstance);
				}
				return installationArray;
			}
		});

	};
	window.Crm.Service.ViewModels.DispatchDetailsViewModel.prototype = baseViewModel.prototype;
	var baseInit = window.Crm.Service.ViewModels.DispatchDetailsViewModel.prototype.init;
	window.Crm.Service.ViewModels.DispatchDetailsViewModel.prototype.init = function (id, params) {
		var viewModel = this;
		return baseInit.apply(this, arguments).then(function () {
			return window.database.CrmService_ServiceOrderDispatch
				.include("CurrentServiceOrderTime")
				.include("CurrentServiceOrderTime.Installation")
				.include("ServiceOrder")
				.include("ServiceOrder.Installation")
				.include("ServiceOrder.InitiatorPerson")
				.include("ServiceOrder.InitiatorPerson.Emails")
				.include("ServiceOrder.InitiatorPerson.Phones")
				.include("ServiceOrder.InvoiceRecipient")
				.include("ServiceOrder.Payer")
				.include("ServiceOrder.Station")
				.include("ServiceOrder.ServiceOrderTimes.Installation")
				.include("DispatchedUser")
				.find(id)
				.then(function (dispatch) {
					viewModel.dispatch(dispatch.asKoObservable());
				});

		});

	};


})();