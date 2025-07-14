/// <reference path="../../../../../Content/js/ViewModels/GenericListViewModel.js" />
namespace("Crm.VisitReport.ViewModels").VisitDetailsTopicsTabViewModel = function (parentViewModel) {
	var viewModel = this;
	viewModel.currentUserName = document.getElementById("meta.CurrentUser").content;
	window.Main.ViewModels.GenericListViewModel.call(viewModel, "CrmVisitReport_VisitTopic", ["ModifyDate"], ["DESC"], ["Visit", "CreateUserUser"]);
	viewModel.getFilter("VisitKey").extend({ filterOperator: "===" })(parentViewModel.visit().Id());
};

namespace("Crm.VisitReport.ViewModels").VisitDetailsTopicsTabViewModel.prototype = Object.create(window.Main.ViewModels.GenericListViewModel.prototype);

namespace("Crm.VisitReport.ViewModels").VisitDetailsTopicsTabViewModel.prototype.init = function () {
	var viewModel = this;
	return window.Main.ViewModels.GenericListViewModel.prototype.init.apply(viewModel, arguments);
};

namespace("Crm.VisitReport.ViewModels").VisitDetailsTopicsTabViewModel.prototype.remove = function (topic) {
	var viewModel = this;
	window.Helper.Confirm.confirmDelete()
		.done(function() {
			viewModel.loading(true);
			var entity = window.Helper.Database.getDatabaseEntity(topic);
			window.database.remove(entity);
			window.database.saveChanges()
				.then(function() {
					viewModel.loading(false);
				})
				.fail(function(e) {
					window.swal(window.Helper.String.getTranslatedString("UnknownError"),
						window.Helper.String.getTranslatedString("Error_InternalServerError"),
						"error");
				});
		});
}