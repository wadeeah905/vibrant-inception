namespace("Crm.VisitReport.ViewModels").TopicEditModalViewModel = function(parentViewModel) {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	viewModel.topic = window.ko.observable(null);
	viewModel.visitKey = parentViewModel.visit().Id();
	viewModel.errors = window.ko.validation.group(viewModel, { deep: true });
}
namespace("Crm.VisitReport.ViewModels").TopicEditModalViewModel.prototype.init = function(id) {
	var viewModel = this;
	var d = new $.Deferred();
	window.Helper.Database.initialize()
		.then(function () {
			if (!!id) {
				return window.database.CrmVisitReport_VisitTopic.find(id).then(window.database.attachOrGet.bind(window.database));
			}
			var topic = window.database.CrmVisitReport_VisitTopic.CrmVisitReport_VisitTopic.create();
			topic.VisitKey = viewModel.visitKey;
			topic.CreateUser = document.getElementById("meta.CurrentUser").content;
			window.database.add(topic);
			return topic;
		})
		.then(function (topic) {
			viewModel.topic(topic.asKoObservable());
			return new $.Deferred().resolve().promise();
		})
		.then(d.resolve)
		.fail(d.reject);
	return d.promise();
}
namespace("Crm.VisitReport.ViewModels").TopicEditModalViewModel.prototype.dispose = function() {
	var viewModel = this;
	window.database.CrmVisitReport_VisitTopic.detach(viewModel.topic().innerInstance);
}
namespace("Crm.VisitReport.ViewModels").TopicEditModalViewModel.prototype.save = function() {
	var viewModel = this;
	viewModel.loading(true);
	if (viewModel.errors().length > 0) {
		viewModel.loading(false);
		viewModel.errors.showAllMessages();
		return;
	}

	window.database.saveChanges().then(function() {
		viewModel.loading(false);
		$(".modal:visible").modal("hide");
	}).fail(function() {
		viewModel.loading(false);
		window.swal(window.Helper.String.getTranslatedString("UnknownError"), window.Helper.String.getTranslatedString("Error_InternalServerError"), "error");
	});
}