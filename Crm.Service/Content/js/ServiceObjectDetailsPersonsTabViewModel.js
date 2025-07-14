
namespace("Crm.Service.ViewModels").ServiceObjectDetailsPersonsTabViewModel = function (parentViewModel) {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	viewModel.serviceObjectId = window.ko.observable(null);
	viewModel.parentViewModel = parentViewModel;
	var joinTags = {
		Selector: "Tags",
		Operation: "orderBy(function(t) { return t.Name; })"
	};
	window.Main.ViewModels.GenericListViewModel.call(viewModel,
		"Main_Person",
		["Surname", "Firstname"],
		["ASC", "ASC"],
		["Address", "Emails", "Faxes", "Phones", "ResponsibleUserUser", joinTags]);
	var serviceObject = parentViewModel.serviceObject().Id();
	viewModel.serviceObjectId = window.ko.observable(serviceObject);
	viewModel.getFilter("ParentId").extend({ filterOperator: "===" })(serviceObject);
	viewModel.lookups = {
		countries: { $tableName: "Main_Country" },
		regions: { $tableName: "Main_Region" }
	};
	if (window.Main.Settings.Person.BusinessTitleIsLookup) {
		viewModel.lookups.businessTitles = { $tableName: "Main_BusinessTitle" };
	}
};
namespace("Crm.Service.ViewModels").ServiceObjectDetailsPersonsTabViewModel.prototype = Object.create(window.Main.ViewModels.GenericListViewModel.prototype);
namespace("Crm.Service.ViewModels").ServiceObjectDetailsPersonsTabViewModel.prototype.init = function () {
	var viewModel = this;
	return window.Main.ViewModels.GenericListViewModel.prototype.init.apply(viewModel, arguments)
		.then(function () { return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups); })
		.then(function () {
			if (window.Main.Settings.Person.BusinessTitleIsLookup) {
				viewModel.parentViewModel.lookups.businessTitles = viewModel.lookups.businessTitles;
			}
		});
};
(function () {
	var getParentAutocompleteOptions = window.Main.ViewModels.PersonCreateViewModel.prototype.getParentAutocompleteOptions;
	window.Main.ViewModels.PersonCreateViewModel.prototype.getParentAutocompleteOptions = function () {
		var viewModel = this;
		if (viewModel.parentType() === "ServiceObject") {
			return {
				table: "CrmService_ServiceObject",
				columns: ["ObjectNo", "Name"],
				orderBy: ["Name"],
				joins: [{
					Selector: "Addresses",
					Operation: "filter(function(a) { return a.IsCompanyStandardAddress == true; })"
				}],
				mapDisplayObject: function(o) { return { id: o.Id, text: Helper.ServiceObject.getDisplayName(o), item:o }; },
				onSelect: viewModel.onSelectParent
			};
		}
		return getParentAutocompleteOptions.apply(this, arguments);
	};
})();