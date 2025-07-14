namespace("Crm.VisitReport.ViewModels").VisitEditModalViewModel = function(parentViewModel) {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	viewModel.visit = window.ko.observable(null);
	viewModel.errors = window.ko.validation.group(viewModel, { deep: true });
}
namespace("Crm.VisitReport.ViewModels").VisitEditModalViewModel.prototype.init = function(id, params) {
	var viewModel = this;
	var d = new $.Deferred();
	window.Helper.Database.initialize()
		.then(function () {
			if (id) {
				return window.database.CrmVisitReport_Visit.find(id).then(window.database.attachOrGet.bind(window.database));
			} else {
				return window.database.Main_Company.find(params.companyId).then(function(company) {
					var visit = window.database.CrmVisitReport_Visit.CrmVisitReport_Visit.create();
					window.database.add(visit);
					visit.AddressId = params.addressId;
					visit.Name = "";
					visit.ParentId = params.companyId;
					var currentUserName = document.getElementById("meta.CurrentUser").content;
					visit.ResponsibleUser = currentUserName;
					return visit;
				});
			}
		})
		.then(function (visit) {
			viewModel.visit(visit.asKoObservable());
			return new $.Deferred().resolve().promise();
		})
		.then(d.resolve)
		.fail(d.reject);
	return d.promise();
}
namespace("Crm.VisitReport.ViewModels").VisitEditModalViewModel.prototype.dispose = function() {
	var viewModel = this;
	window.database.CrmVisitReport_Visit.detach(viewModel.visit().innerInstance);
}
namespace("Crm.VisitReport.ViewModels").VisitEditModalViewModel.prototype.save = function() {
	var viewModel = this;
	viewModel.loading(true);
	if (viewModel.errors().length > 0) {
		viewModel.loading(false);
		viewModel.errors.showAllMessages();
		return;
	}
	if (viewModel.visit().PlannedDate()) {
		viewModel.visit().StatusKey("Scheduled");
	} else {
		viewModel.visit().StatusKey("Created");
	}
	window.Helper.Visit.calculateDates(viewModel.visit());
	window.database.saveChanges().then(function() {
		viewModel.loading(false);
		$(".modal:visible").modal("hide");
	}).fail(function() {
		viewModel.loading(false);
		window.swal(window.Helper.String.getTranslatedString("UnknownError"), window.Helper.String.getTranslatedString("Error_InternalServerError"), "error");
	});
}