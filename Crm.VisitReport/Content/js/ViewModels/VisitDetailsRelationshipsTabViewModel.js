/// <reference path="../../../../../Content/js/ViewModels/GenericListViewModel.js" />
(function () {
	var baseViewModel = window.Main.ViewModels.BaseRelationshipsTabViewModel;
	namespace("Crm.VisitReport.ViewModels").VisitDetailsRelationshipsTabViewModel = function(parentViewModel) {
		baseViewModel.apply(this, arguments);
		var viewModel = this;
		viewModel.visitId = parentViewModel.visit().Id();

		viewModel.genericContactPersonRelationships = new window.Main.ViewModels.GenericListViewModel("CrmVisitReport_ContactPersonRelationship"
			, ["RelationshipTypeKey", "Child.Name"], ["ASC", "ASC"]
			, ["Child", "Child.Phones", "Child.Parent"]);
		viewModel.genericContactPersonRelationships.getFilter("ParentId").extend({ filterOperator: "===" })(viewModel.visitId);
		viewModel.contactPersonRelationships = viewModel.genericContactPersonRelationships.items;
		viewModel.contactPersonRelationships.distinct("RelationshipTypeKey");

		viewModel.subViewModels.push(viewModel.genericContactPersonRelationships);

		viewModel.lookups.contactPersonRelationshipTypes = {};
	};
	namespace("Crm.VisitReport.ViewModels").VisitDetailsRelationshipsTabViewModel.prototype = Object.create(baseViewModel.prototype);
	namespace("Crm.VisitReport.ViewModels").VisitDetailsRelationshipsTabViewModel.prototype.init = function() {
		var args = arguments;
		var viewModel = this;
		viewModel.loading(true);
		viewModel.lookups = {
			contactPersonRelationshipTypes: { $tableName: "CrmVisitReport_ContactPersonRelationshipType"  }
		};
		return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups)
			.then(function() {
				return baseViewModel.prototype.init.apply(viewModel, args);
			});
	};
})();