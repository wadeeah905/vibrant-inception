namespace("Main.ViewModels").CompanyDetailsVisitReportsTabViewModel = function(parentViewModel) {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	var joinLocalizations = {
		Selector: "DynamicForm.Localizations",
		Operation: "filter(function(x) { return x.DynamicFormElementId == null })"
	};
	window.Main.ViewModels.GenericListViewModel.call(viewModel, "CrmVisitReport_VisitReport", ["Completed", "Date"], ["ASC", "DESC"], ["DynamicForm", "DynamicForm.Languages", joinLocalizations, "ResponsibleUserUser", "Visit"]);
	var companyId = parentViewModel.company().Id();
	viewModel.companyId = window.ko.observable(companyId);
	viewModel.currentUser = window.ko.observable(null);
	viewModel.getFilter("ReferenceKey").extend({ filterOperator: "===" })(companyId);
	viewModel.lookups = {};
};
namespace("Main.ViewModels").CompanyDetailsVisitReportsTabViewModel.prototype = Object.create(window.Main.ViewModels.GenericListViewModel.prototype);
namespace("Main.ViewModels").CompanyDetailsVisitReportsTabViewModel.prototype.applyFilters = function (query) {
	var viewModel = this;
	query = window.Main.ViewModels.GenericListViewModel.prototype.applyFilters.call(viewModel, query);
	return query.filter("filterByDynamicFormTitle", { filter: "", languageKey: viewModel.currentUser().DefaultLanguageKey, statusKey: 'Released' });
};
namespace("Main.ViewModels").CompanyDetailsVisitReportsTabViewModel.prototype.getVisitReportTitle = function (visitReport) {
	var viewModel = this;
	return window.Helper.DynamicForm.getTitle(visitReport(), visitReport().Localizations(), viewModel.currentUser().DefaultLanguageKey);
};
namespace("Main.ViewModels").CompanyDetailsVisitReportsTabViewModel.prototype.init = function(parentViewModel) {
	var viewModel = this;
	var args = arguments;
	return window.Helper.User.getCurrentUser()
		.then(function (user) {
			viewModel.currentUser(user);
			return window.Helper.Lookup.getLocalizedArrayMap("CrmVisitReport_VisitAim").then(function(lookup) { viewModel.lookups.visitAims = lookup; });
		})
		.then(function() {
			 return window.Main.ViewModels.GenericListViewModel.prototype.init.apply(viewModel, args);
		});
};
namespace("Main.ViewModels").CompanyDetailsVisitReportsTabViewModel.prototype.deleteVisitReport = function(visitReport) {
	var viewModel = this;
	var fileResourceIds = [];
	return window.Helper.Confirm.confirmDelete().then(function() {
			viewModel.loading(true);
			return window.database.CrmDynamicForms_DynamicFormResponse
				.filter("it.DynamicFormReferenceKey === this.id", { id: visitReport.Id })
				.toArray(function(responses) {
					responses.forEach(function(response) {
						if (response.DynamicFormElementType === "FileAttachmentDynamicFormElement" && response.Value.length) {
							fileResourceIds = fileResourceIds.concat(JSON.parse(response.Value));
						}
						window.database.remove(response);
					});
				});
		})
		.then(function() {
			return window.database.Main_FileResource.filter(function(file) {
					return file.Id in this.fileResourceIds;
				},
				{ fileResourceIds: fileResourceIds }).toArray(function(fileResources) {
				fileResources.forEach(function(fileResource) {
					window.database.remove(fileResource);
				});
			});
		})
		.then(function () {
			window.database.remove(visitReport);
			return window.database.saveChanges();
		})
		.then(function () {
			viewModel.loading(false);
		});
};