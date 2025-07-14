window.Crm.Service.ViewModels.ServiceCaseTemplateCreateViewModel.prototype.getDynamicFormAutocompleteFilter =
	function(query, term) {
		var language = document.getElementById("meta.CurrentLanguage").content;
		return query
			.filter("it.CategoryKey === 'ServiceCaseChecklist'")
			.filter("filterByDynamicFormTitle", { filter: term, languageKey: language, statusKey: 'Released' });
	};
window.Crm.Service.ViewModels.ServiceCaseTemplateCreateViewModel.prototype.getDynamicFormAutocompleteFilterJoins =
	function() {
		return [
			{ Selector: "Languages", Operation: "filter(function(x){ return x.StatusKey === 'Released'; })" },
			{ Selector: "Localizations", Operation: "filter(function(x) { return x.DynamicFormElementId == null })" }
		];
	};