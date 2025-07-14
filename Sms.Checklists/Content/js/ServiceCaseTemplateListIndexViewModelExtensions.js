window.Crm.Service.ViewModels.ServiceCaseTemplateListIndexViewModel.prototype.getDynamicFormAutocompleteFilter =
	window.Crm.Service.ViewModels.ServiceCaseTemplateCreateViewModel.prototype.getDynamicFormAutocompleteFilter;
window.Crm.Service.ViewModels.ServiceCaseTemplateListIndexViewModel.prototype.getDynamicFormAutocompleteFilterJoins =
	window.Crm.Service.ViewModels.ServiceCaseTemplateCreateViewModel.prototype.getDynamicFormAutocompleteFilterJoins;
window.Crm.Service.ViewModels.ServiceCaseTemplateListIndexViewModel.prototype.initItems = function (items) {
	var completionDynamicFormIdMap = items.reduce(function (map, item) {
			item.CompletionDynamicForm = window.ko.observable(null);
			var completionDynamicFormId = window.ko.unwrap(item.ExtensionValues().CompletionDynamicFormId);
			if (completionDynamicFormId) {
				if (!Array.isArray(map[completionDynamicFormId])) {
					map[completionDynamicFormId] = [];
				}
				map[completionDynamicFormId].push(item);
			}
			return map;
		},
		{});
	var creationDynamicFormIdMap = items.reduce(function (map, item) {
			item.CreationDynamicForm = window.ko.observable(null);
			var creationDynamicFormId = window.ko.unwrap(item.ExtensionValues().CreationDynamicFormId);
			if (creationDynamicFormId) {
				if (!Array.isArray(map[creationDynamicFormId])) {
					map[creationDynamicFormId] = [];
				}
				map[creationDynamicFormId].push(item);
			}
			return map;
		},
		{});

	return window.database.CrmDynamicForms_DynamicForm
		.include2("Languages.filter(function(x){ return x.StatusKey === 'Released'; })")
		.include2("Localizations.filter(function(x) { return x.DynamicFormElementId == null })")
		.filter("it.Id in this.completionDynamicFormIds || it.Id in this.creationDynamicFormIds",
			{
				completionDynamicFormIds: Object.keys(completionDynamicFormIdMap),
				creationDynamicFormIds: Object.keys(creationDynamicFormIdMap)
			})
		.toArray()
		.then(function (dynamicForms) {
			dynamicForms.forEach(function (dynamicForm) {
				var serviceCases = completionDynamicFormIdMap[dynamicForm.Id] || [];
				serviceCases.forEach(function (item) {
					item.CompletionDynamicForm(dynamicForm.asKoObservable());
				});
				serviceCases = creationDynamicFormIdMap[dynamicForm.Id] || [];
				serviceCases.forEach(function (item) {
					item.CreationDynamicForm(dynamicForm.asKoObservable());
				});
			});
			return items;
		});
};