namespace("Crm.Service.ViewModels").DispatchDetailsJobsTabViewModel = function(parentViewModel) {
	window.Crm.Service.ViewModels.ServiceOrderDetailsJobsTabViewModel.apply(this, arguments);
	var viewModel = this;
	viewModel.currentServiceOrderTimeId =
		parentViewModel.dispatch && parentViewModel.dispatch() && parentViewModel.dispatch().CurrentServiceOrderTimeId()
		? parentViewModel.dispatch().CurrentServiceOrderTimeId()
		: null;
	viewModel.dispatch = parentViewModel.dispatch;
	viewModel.timesCanBeAdded = window.ko.pureComputed(function() {
		return parentViewModel.dispatchIsEditable() &&
			window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode === "JobPerInstallation";
	});
};
namespace("Crm.Service.ViewModels").DispatchDetailsJobsTabViewModel.prototype =
	Object.create(window.Crm.Service.ViewModels.ServiceOrderDetailsJobsTabViewModel.prototype);
namespace("Crm.Service.ViewModels").DispatchDetailsJobsTabViewModel.prototype.applyOrderBy = function(query) {
	var viewModel = this;
	query = query.orderByDescending("orderByCurrentServiceOrderTime",
		{ currentServiceOrderTimeId: viewModel.currentServiceOrderTimeId });
	return window.Crm.Service.ViewModels.ServiceOrderDetailsJobsTabViewModel.prototype.applyOrderBy.call(this, query);
};
namespace("Crm.Service.ViewModels").DispatchDetailsJobsTabViewModel.prototype.canCompleteJob = function(jobSummary) {
	return jobSummary.StatusKey !== "Finished";
};
namespace("Crm.Service.ViewModels").DispatchDetailsJobsTabViewModel.prototype.canDeleteServiceOrderTime =
	function(serviceOrderTime) {
		var viewModel = this;
		var hasPermission = window.AuthorizationManager.isAuthorizedForAction("ServiceOrder", window.ko.unwrap(serviceOrderTime.CreateUser) === window.Helper.User.getCurrentUserName() ? "TimeDeleteSelfCreated" : "TimeDelete");
		return hasPermission && viewModel.parentViewModel.dispatchIsEditable();
	};
namespace("Crm.Service.ViewModels").DispatchDetailsJobsTabViewModel.prototype.canEditServiceOrderTime =
	function(serviceOrderTime) {
		var viewModel = this;
		return viewModel.parentViewModel.dispatchIsEditable();
	};
namespace("Crm.Service.ViewModels").DispatchDetailsJobsTabViewModel.prototype.completeJob = function(jobSummary) {
	var viewModel = this;
	if (!viewModel.canCompleteJob(jobSummary)) {
		return;
	}
	var d = new $.Deferred().resolve().promise();
	if (jobSummary.closedServiceCasesCount < jobSummary.serviceCasesCount) {
		d = d.then(function() {
			return window.Helper.Confirm.genericConfirm({
				title: window.Helper.String.getTranslatedString("Complete"),
				text: window.Helper.String.getTranslatedString("CompleteJobWithOpenServiceCasesConfirmation"),
				type: "warning",
				confirmButtonText: window.Helper.String.getTranslatedString("Complete")
			});
		});
	}
	d.then(function() {
		var serviceOrderTime = jobSummary;
		viewModel.loading(true);
		if (serviceOrderTime.Id === viewModel.dispatch().CurrentServiceOrderTimeId()) {
			window.database.attachOrGet(viewModel.dispatch().innerInstance);
			viewModel.dispatch().CurrentServiceOrderTimeId(null);
			viewModel.dispatch().CurrentServiceOrderTime(null);
		}
		window.database.attachOrGet(serviceOrderTime);
		serviceOrderTime.CompleteDate = new Date();
		serviceOrderTime.CompleteUser = window.Helper.User.getCurrentUserName();
		serviceOrderTime.StatusKey = "Finished";
		return window.database.saveChanges()
			.then(function() {
				viewModel.loading(false);
			});
	});
};
namespace("Crm.Service.ViewModels").DispatchDetailsJobsTabViewModel.prototype.toggleCurrentJob =
	function(selectedServiceOrderTime) {
		var viewModel = this;
		viewModel.loading(true);
		return Helper.Dispatch.toggleCurrentJob(viewModel.dispatch, selectedServiceOrderTime.Id)
			.then(function() {
				viewModel.loading(false);
			});
	};
namespace("Crm.Service.ViewModels").DispatchDetailsJobsTabViewModel.prototype.deleteServiceOrderTime =
	function(serviceOrderTime) {
		var viewModel = this;
		window.database.attachOrGet(viewModel.dispatch().innerInstance);
		var serviceOrderTimeId = window.ko.unwrap(serviceOrderTime.Id);
		if (viewModel.dispatch().CurrentServiceOrderTimeId() === serviceOrderTimeId) {
			viewModel.dispatch().CurrentServiceOrderTimeId(null);
			viewModel.dispatch().CurrentServiceOrderTime(null);
		}
		return window.Crm.Service.ViewModels.ServiceOrderDetailsJobsTabViewModel.prototype.deleteServiceOrderTime.apply(
			this,
			arguments);
	};
namespace("Crm.Service.ViewModels").DispatchDetailsJobsTabViewModel.prototype.getAvatarColor =
	function(serviceOrderTime) {
		var viewModel = this;
		if (viewModel.dispatch() && serviceOrderTime.Id === viewModel.dispatch().CurrentServiceOrderTimeId()) {
			return "#2196f3";
		}
		return window.Crm.Service.ViewModels.ServiceOrderDetailsJobsTabViewModel.prototype.getAvatarColor.apply(this,
			arguments);
	};