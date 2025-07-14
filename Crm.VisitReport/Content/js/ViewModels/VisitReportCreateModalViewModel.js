namespace("Crm.VisitReport.ViewModels").VisitReportCreateModalViewModel = function() {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	viewModel.currentUser = window.ko.observable(null);
	viewModel.visitReport = window.ko.observable(null);
	viewModel.errors = window.ko.validation.group(viewModel.visitReport, { deep: true });
};
namespace("Crm.VisitReport.ViewModels").VisitReportCreateModalViewModel.prototype.copyLatestResponses = function() {
	var viewModel = this;
	if (!window.Crm.VisitReport.Settings.VisitReport.Prefill) {
		return new $.Deferred().resolve([]).promise();
	}
	return window.database.CrmVisitReport_VisitReport
		.include2("Responses.orderByDescending(function(it) { return it.ModifyDate })")
		.filter(function(it) {
				return it.DynamicFormKey === this.dynamicFormKey &&
					it.ReferenceKey === this.referenceKey &&
					it.Completed === true;
			},
			{
				dynamicFormKey: viewModel.visitReport().DynamicFormKey(),
				referenceKey: viewModel.visitReport().ReferenceKey()
			})
		.orderByDescending(function(it) {
			return it.ModifyDate;
		}).take(1).toArray().then(function(results) {
			var lastVisitReport = results.length === 1 ? results[0] : null;
			if (lastVisitReport) {
				(lastVisitReport.Responses || []).forEach(function(response) {
					response.Id = window.Helper.String.emptyGuid();
					response.DynamicFormReferenceKey = viewModel.visitReport().Id();
					window.database.add(response);
				});
			}
		});
};
namespace("Crm.VisitReport.ViewModels").VisitReportCreateModalViewModel.prototype.dispose = function() {
	var viewModel = this;
	window.database.detach(viewModel.visitReport().innerInstance);
};
namespace("Crm.VisitReport.ViewModels").VisitReportCreateModalViewModel.prototype.getDynamicFormAutocompleteFilter =
	function(query, term) {
		var viewModel = this;
		if (window.database.storageProvider.name === "webSql") {
			query = query
				.include2("Localizations.filter(function(x) { return x.DynamicFormElementId == null })")
				.include("Languages")
				.filter("it.Languages.StatusKey == 'Released'")
				.filter("it.CategoryKey === 'VisitReport'")
				.filter("filterByDynamicFormTitle",
					{ filter: term || "", languageKey: viewModel.currentUser().DefaultLanguageKey });
		} else {
			query = query
				.include2("Localizations.filter(function(x) { return x.DynamicFormElementId == null })")
				.include("Languages")
				.filter("it.Languages.some(function(item){ item.StatusKey == 'Released'; })")
				.filter("it.CategoryKey === 'VisitReport'")
				.filter("filterByDynamicFormTitle",
					{ filter: term || "", languageKey: viewModel.currentUser().DefaultLanguageKey });
		}
		return query;
	};
namespace("Crm.VisitReport.ViewModels").VisitReportCreateModalViewModel.prototype.init = function(id, params) {
	var viewModel = this;
	return window.Helper.User.getCurrentUser().then(function(user) {
		viewModel.currentUser(user);
		var visitReport = window.database.CrmVisitReport_VisitReport.CrmVisitReport_VisitReport.create();
		visitReport.Date = new Date();
		visitReport.ReferenceKey = params.referenceKey || visitReport.ReferenceKey;
		visitReport.ResponsibleUser = user.Id;
		visitReport.VisitId = params.visitId || visitReport.VisitId;
		window.database.add(visitReport);
		viewModel.visitReport(visitReport.asKoObservable());
		return viewModel.getDynamicFormAutocompleteFilter(window.database.CrmDynamicForms_DynamicForm).take(2).toArray();
	}).then(function(visitReports) {
		if (visitReports.length === 1) {
			viewModel.visitReport().DynamicFormKey(visitReports[0].Id);
		}
		return null;
	});
};
namespace("Crm.VisitReport.ViewModels").VisitReportCreateModalViewModel.prototype.save = function(redirectToEdit) {
	var viewModel = this;
	viewModel.loading(true);

	if (viewModel.errors().length > 0) {
		viewModel.loading(false);
		viewModel.errors.showAllMessages();
		return;
	}

	viewModel.copyLatestResponses().then(function() {
		return window.database.saveChanges();
	}).then(function() {
		if (redirectToEdit === true) {
			$("#lgModal").modal("show",
				{
					 route: `Crm.VisitReport/VisitReport/EditTemplate/${viewModel.visitReport().Id()}`,
					 viewModel: viewModel
				});
		} else {
			viewModel.loading(false);
			$(".modal:visible").modal("hide");
		}
	}).fail(function() {
		viewModel.loading(false);
		window.swal(window.Helper.String.getTranslatedString("UnknownError"),
			window.Helper.String.getTranslatedString("Error_InternalServerError"),
			"error");
	});
};