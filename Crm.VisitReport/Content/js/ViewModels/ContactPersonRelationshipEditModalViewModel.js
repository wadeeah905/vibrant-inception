(function() {
	var baseViewModel = window.Main.ViewModels.BaseRelationshipEditModalViewModel;
	namespace("Crm.VisitReport.ViewModels").ContactPersonRelationshipEditModalViewModel = function(parentViewModel) {
		baseViewModel.apply(this, arguments);
		var viewModel = this;
		viewModel.table = window.database.CrmVisitReport_ContactPersonRelationship;
		viewModel.lookups = parentViewModel.tabs()["tab-relationships"]().lookups;
		viewModel.relationshipTypeLookup = viewModel.lookups.contactPersonRelationshipTypes;
	};
	namespace("Crm.VisitReport.ViewModels").ContactPersonRelationshipEditModalViewModel.prototype = Object.create(baseViewModel.prototype);
	namespace("Crm.VisitReport.ViewModels").ContactPersonRelationshipEditModalViewModel.prototype.getQueryForEditing = function() {
		return window.database.CrmVisitReport_ContactPersonRelationship.include("Child");
	};
	namespace("Crm.VisitReport.ViewModels").ContactPersonRelationshipEditModalViewModel.prototype.getAutoCompleterOptions = function () {
		return {
			table: "Main_Person",
			columns: ["Firstname", "Surname"],
			orderBy: ["Surname"],
			mapDisplayObject: window.Helper.Person.mapForSelect2Display,
			key: "Id",
			customFilter: window.Helper.Person.getSelect2Filter
		};
	};
	namespace("Crm.VisitReport.ViewModels").ContactPersonRelationshipEditModalViewModel.prototype.getAutoCompleterCaption = function() {
		return "Person";
	};
})();