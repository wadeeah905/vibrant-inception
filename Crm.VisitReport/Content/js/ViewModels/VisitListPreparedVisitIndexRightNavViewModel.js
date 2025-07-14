/// <reference path="../../../../../Content/js/ViewModels/GenericListViewModel.js" />
namespace("Crm.VisitReport.ViewModels").VisitListPreparedVisitIndexRightNavViewModel = function() {
	var viewModel = this;
	var currentUserName = document.getElementById("meta.CurrentUser").content;
	viewModel.currentUserName = currentUserName;
	window.Main.ViewModels.GenericListViewModel.call(viewModel, "CrmVisitReport_Visit", ["ModifyDate"], ["DESC", "DESC"], ["Parent", "ResponsibleUserUser", "Address"]);
	viewModel.enableUrlUpdate(false);
	var preparedVisits = {
		Category: window.Helper.String.getTranslatedString("Filter"),
		Name: window.Helper.String.getTranslatedString("PreparedVisits"),
		Key: "PreparedVisits",
		Expression: function(query) {
			return query.filter(function(visit) {
				return visit.PlannedDate === null && visit.ResponsibleUser === this.responsibleUser;
			}, { responsibleUser: currentUserName });
		}
	};
	viewModel.bookmarks.push(preparedVisits);
	viewModel.bookmark(preparedVisits);
	viewModel.lookups = {
		addressTypes: {},
		regions: {},
		countries: {},
		visitAim: {},
		visitStatus: {}
	};
};

namespace("Crm.VisitReport.ViewModels").VisitListPreparedVisitIndexRightNavViewModel.prototype = Object.create(window.Main.ViewModels.GenericListViewModel.prototype);

namespace("Crm.VisitReport.ViewModels").VisitListPreparedVisitIndexRightNavViewModel.prototype.init = function() {
	var viewModel = this;
	return window.Main.ViewModels.GenericListViewModel.prototype.init.apply(viewModel, arguments)
		.then(function () {
			return window.Helper.Lookup.getLocalizedArrayMap("Main_AddressType")
				.then(function (lookup) { viewModel.lookups.addressTypes = lookup; });
		})
		.then(function () {
			return window.Helper.Lookup.getLocalizedArrayMap("Main_Region")
				.then(function (lookup) { viewModel.lookups.regions = lookup; });
		})
		.then(function () {
			return window.Helper.Lookup.getLocalizedArrayMap("Main_Country")
				.then(function (lookup) { viewModel.lookups.countries = lookup; });
		})
		.then(function () {
			return window.Helper.Lookup.getLocalizedArrayMap("CrmVisitReport_VisitAim")
				.then(function (lookup) { viewModel.lookups.visitAim = lookup; });
		})
		.then(function () {
			return window.Helper.Lookup.getLocalizedArrayMap("CrmVisitReport_VisitStatus")
				.then(function (lookup) { viewModel.lookups.visitStatus = lookup; });
		});
};