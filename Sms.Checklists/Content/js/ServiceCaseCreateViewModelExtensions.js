;
(function(ko) {
	var baseViewModel = window.Crm.Service.ViewModels.ServiceCaseCreateViewModel;
	window.Crm.Service.ViewModels.ServiceCaseCreateViewModel = function() {
		var viewModel = this;
		baseViewModel.apply(this, arguments);
		viewModel.completionDynamicForm = ko.observable(null);
		viewModel.creationDynamicForm = ko.observable(null);
		viewModel.creationDynamicForms = ko.pureComputed(function() {
			return viewModel.creationDynamicForm() ? [viewModel.creationDynamicForm()] : [];
		});
		viewModel.dynamicFormElements = ko.observableArray([]);
	};
	window.Crm.Service.ViewModels.ServiceCaseCreateViewModel.prototype = baseViewModel.prototype;
	var init = window.Crm.Service.ViewModels.ServiceCaseCreateViewModel.prototype.init;
	window.Crm.Service.ViewModels.ServiceCaseCreateViewModel.prototype.init = function() {
		var viewModel = this;
		return init.apply(this, arguments).then(function() {
			viewModel.serviceCaseTemplate.subscribe(function(serviceCaseTemplate) {
				if (viewModel.creationDynamicForm()) {
					window.database.detach(viewModel.creationDynamicForm().formReference().innerInstance);
					viewModel.creationDynamicForm().dispose();
					viewModel.creationDynamicForm(null);
				}
				if (serviceCaseTemplate && serviceCaseTemplate.ExtensionValues.CreationDynamicFormId) {
					viewModel.loading(true);
					var formReference = window.database.SmsChecklists_ServiceCaseChecklist
						.SmsChecklists_ServiceCaseChecklist.create();
					formReference.DynamicFormKey = serviceCaseTemplate.ExtensionValues.CreationDynamicFormId;
					formReference.IsCreationChecklist = true;
					formReference.ReferenceKey = viewModel.serviceCase().Id();
					var dynamicFormDetailsViewModel =
						new window.Crm.DynamicForms.ViewModels.DynamicFormDetailsViewModel();
					dynamicFormDetailsViewModel.applyChanges = function() {
						return new $.Deferred().resolve().promise();
					};
					viewModel.creationDynamicForm(dynamicFormDetailsViewModel);
					dynamicFormDetailsViewModel.init({ formReference: formReference.asKoObservable() }).then(
						function() {
							viewModel.loading(false);
							dynamicFormDetailsViewModel.loading(false);
							dynamicFormDetailsViewModel.addValidationRules();
							dynamicFormDetailsViewModel.addRequiredValidationRules();
							window.database.add(dynamicFormDetailsViewModel.formReference().innerInstance);
						});
				}
				if (viewModel.completionDynamicForm()) {
					window.database.detach(viewModel.completionDynamicForm());
					viewModel.completionDynamicForm(null);
				}
				if (serviceCaseTemplate && serviceCaseTemplate.ExtensionValues.CompletionDynamicFormId) {
					var completionDynamicForm = window.database.SmsChecklists_ServiceCaseChecklist
						.SmsChecklists_ServiceCaseChecklist.create();
					completionDynamicForm.DynamicFormKey = serviceCaseTemplate.ExtensionValues.CompletionDynamicFormId;
					completionDynamicForm.IsCompletionChecklist = true;
					completionDynamicForm.ReferenceKey = viewModel.serviceCase().Id();
					viewModel.completionDynamicForm(completionDynamicForm);
					window.database.add(completionDynamicForm);
				}
			});
			viewModel.serviceCase().ExtensionValues().AffectedDynamicFormReferenceId.subscribe(function() {
				viewModel.serviceCase().ExtensionValues().AffectedDynamicFormElementId(null);
			});
			viewModel.serviceCase().OriginatingServiceOrderId.subscribe(function() {
				viewModel.serviceCase().ExtensionValues().AffectedDynamicFormReferenceId(null);
			});
			viewModel.serviceCase().OriginatingServiceOrderTimeId.subscribe(function() {
				viewModel.serviceCase().ExtensionValues().AffectedDynamicFormReferenceId(null);
			});
		});
	};
	var submit = window.Crm.Service.ViewModels.ServiceCaseCreateViewModel.prototype.submit;
	window.Crm.Service.ViewModels.ServiceCaseCreateViewModel.prototype.submit = function() {
		var viewModel = this;
		var args = arguments;
		viewModel.loading(true);
		return viewModel.setServiceCaseNo().then(function() {
			if (viewModel.creationDynamicForm()) {
				return viewModel.creationDynamicForm().complete();
			}
			return null;
		}).then(function () {
			if (viewModel.creationDynamicForm()) {
				viewModel.creationDynamicForm().formReference().Responses([]);
			}
			return null;
		}).then(function () {
			return submit.apply(viewModel, args);
		}).fail(function() {
			viewModel.loading(false);
		});
	};
	window.Crm.Service.ViewModels.ServiceCaseCreateViewModel.prototype.getChecklistAutocompleteFilter =
		function(query, term) {
			query = query.includeDynamicFormElements();
			var viewModel = this;
			var language = document.getElementById("meta.CurrentLanguage").content;
			query = query
				.filter("it.ReferenceKey === this.orderId && it.ServiceOrderTimeKey === this.serviceOrderTimeId",
					{ orderId: viewModel.serviceCase().OriginatingServiceOrderId(), serviceOrderTimeId: viewModel.serviceCase().OriginatingServiceOrderTimeId() || null });
			if (term) {
				query = query.filter("filterByDynamicFormTitle",
					{ filter: term, languageKey: language, statusKey: 'Released' });
			}
			return query;
		};
	window.Crm.Service.ViewModels.ServiceCaseCreateViewModel.prototype.onSelectChecklist = function(checklist) {
		var viewModel = this;
		if (!checklist) {
			viewModel.dynamicFormElements([]);
			return;
		}
		viewModel.loading(true);
		var localizations = checklist.DynamicForm.Localizations;
		var getLocalization = window.Crm.DynamicForms.ViewModels.DynamicFormDetailsViewModel.prototype
			.getLocalizationText.bind({
				localizations: ko.observableArray(localizations)
			});
		var dynamicFormElements = checklist.DynamicForm.Elements.filter(function(element) {
			return element.ExtensionValues.CanAttachServiceCases === true;
		}).map(function(element) {
			return {
				id: element.Id,
				text: getLocalization(element)
			};
		});
		viewModel.dynamicFormElements(dynamicFormElements);
		viewModel.loading(false);
	};
})(window.ko);