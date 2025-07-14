(function () {
    
var baseViewModel = window.Main.ViewModels.ContactDetailsNotesTabViewModel;

window.Main.ViewModels.ContactDetailsNotesTabViewModel = function(parentViewModel) {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	viewModel.contactId = window.ko.observable(null);
	viewModel.contactType = window.ko.observable(null);
	viewModel.minDate = window.ko.observable(null);
	viewModel.plugin = window.ko.observable(null);
	var joinFiles = {
		Selector: "Files",
		Operation: "orderBy(function(t) { return t.CreateDate; })"
	};
	var joinLinks = {
		Selector: "Links",
		Operation: "orderBy(function(t) { return t.CreateDate; })"
	};
	window.Main.ViewModels.GenericListViewModel.call(viewModel, "Main_Note"
		, ["ExtensionValues.iNoteLineNo"], ["ASC"]
		, [joinFiles, joinLinks, "User"]);
	viewModel.infiniteScroll(true);
	viewModel.lookups = {
		noteTypes: {}
	};
};
window.Main.ViewModels.ContactDetailsNotesTabViewModel.prototype = baseViewModel.prototype;
	window.Main.ViewModels.ContactDetailsNotesTabViewModel.prototype = Object.create(window.Main.ViewModels.GenericListViewModel.prototype);
  
})();