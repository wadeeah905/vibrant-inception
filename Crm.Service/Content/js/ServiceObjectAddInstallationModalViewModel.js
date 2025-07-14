namespace("Crm.Service.ViewModels").ServiceObjectAddInstallationModalViewModel = function() {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	viewModel.installation = window.ko.observable(null);
	viewModel.installationId = window.ko.observable(null);
	viewModel.serviceObjectId = window.ko.observable(null);
	viewModel.errors = window.ko.validation.group(viewModel.installationId);
	viewModel.lookups = {};
};
namespace("Crm.Service.ViewModels").ServiceObjectAddInstallationModalViewModel.prototype.installationFilter =
	function(query, term) {
		query = query.filter(function(it) { return it.FolderId === null; });
		if (term) {
			query = query.filter(function(it) {
					return it.InstallationNo.contains(this.term) === true ||
						it.Description.contains(this.term) === true;
				},
				{ term: term });
		}
		return query;
	};
namespace("Crm.Service.ViewModels").ServiceObjectAddInstallationModalViewModel.prototype.init = function(id, params) {
	var viewModel = this;
	viewModel.serviceObjectId(id);
	viewModel.installationId.extend({
		required: {
			params: true,
			message: window.Helper.String.getTranslatedString("RuleViolation.Required")
				.replace("{0}", window.Helper.String.getTranslatedString("Installation"))
		}
	});
	return new $.Deferred().resolve().promise();
};
namespace("Crm.Service.ViewModels").ServiceObjectAddInstallationModalViewModel.prototype.onSelectInstallation =
	function (installation) {
		var viewModel = this;
		viewModel.installation(installation ? installation.asKoObservable() : null);
	};
namespace("Crm.Service.ViewModels").ServiceObjectAddInstallationModalViewModel.prototype.save = function() {
	var viewModel = this;
	viewModel.loading(true);
	if (viewModel.errors().length > 0) {
		viewModel.loading(false);
		viewModel.errors.showAllMessages();
		return;
	}
	window.database.attachOrGet(window.Helper.Database.getDatabaseEntity(viewModel.installation));
	viewModel.installation().FolderId(viewModel.serviceObjectId());
	window.database.saveChanges()
		.then(function() {
			viewModel.loading(false);
			$(".modal:visible").modal("hide");
		})
		.fail(function(e) {
			window.Log.error(e);
			viewModel.loading(false);
			window.swal(window.Helper.String.getTranslatedString("UnknownError"),
				window.Helper.String.getTranslatedString("Error_InternalServerError"),
				"error");
		});
};