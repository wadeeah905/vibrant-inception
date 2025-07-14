;
(function(ko) {
	var baseViewModel = window.Crm.Service.ViewModels.ServiceCaseDetailsViewModel;
	window.Crm.Service.ViewModels.ServiceCaseDetailsViewModel = function() {
		baseViewModel.apply(this, arguments);
		var viewModel = this;
		viewModel.dynamicFormElements = ko.observableArray([]);
		viewModel.localizations = ko.observableArray([]);
		viewModel.affectedDynamicFormReference = ko.observable(null);
		viewModel.affectedDynamicFormElement = ko.observable(null);
	};
	window.Crm.Service.ViewModels.ServiceCaseDetailsViewModel.prototype = baseViewModel.prototype;
	var init = window.Crm.Service.ViewModels.ServiceCaseDetailsViewModel.prototype.init;
	window.Crm.Service.ViewModels.ServiceCaseDetailsViewModel.prototype.init = function() {
		var viewModel = this;
		return init.apply(this, arguments).then(function() {
			return viewModel.setDynamicFormEntities(viewModel.serviceCase());
		});
	};

	window.Crm.Service.ViewModels.ServiceCaseDetailsViewModel.prototype.setDynamicFormEntities = async function (serviceCase) {
		const viewModel = this;
		viewModel.serviceCase().ExtensionValues.subscribe(extensionValues =>  {
			let dynamicFormElement =  viewModel.affectedDynamicFormReference().DynamicForm.Elements.find(x => x.Id === viewModel.serviceCase().ExtensionValues().AffectedDynamicFormElementId()) || null;
			viewModel.affectedDynamicFormElement(dynamicFormElement);
		});

		if (!serviceCase.ExtensionValues().AffectedDynamicFormReferenceId()) {
			viewModel.affectedDynamicFormReference(null);
			viewModel.affectedDynamicFormElement(null);
			return;
		}

		const checklist = await viewModel.getChecklist(serviceCase.ExtensionValues().AffectedDynamicFormReferenceId());
		viewModel.localizations(checklist.DynamicForm.Localizations);
		viewModel.affectedDynamicFormReference(checklist);
		const getLocalization = window.Crm.DynamicForms.ViewModels.DynamicFormDetailsViewModel.prototype
				.getLocalizationText.bind({
					localizations: ko.observableArray(viewModel.localizations())
			});
		const dynamicFormElements = checklist.DynamicForm.Elements
				.filter(element => element.ExtensionValues.CanAttachServiceCases === true)
			.map(element => ({
					id: element.Id,
					text: getLocalization(element)
			}));
		viewModel.dynamicFormElements(dynamicFormElements);
		let dynamicFormElement =  viewModel.affectedDynamicFormReference().DynamicForm.Elements.find(x => x.Id === viewModel.serviceCase().ExtensionValues().AffectedDynamicFormElementId()) || null;
		viewModel.affectedDynamicFormElement(dynamicFormElement);
	}

	window.Crm.Service.ViewModels.ServiceCaseDetailsViewModel.prototype.getChecklist = function(dynamicFormReferenceId) {
		return window.database.SmsChecklists_ServiceOrderChecklist
			.includeDynamicFormElements()
			.include("DynamicForm")
			.include("DynamicForm.Elements")
			.include("DynamicForm.Localizations")
			.include("ServiceOrderTime")
			.find(dynamicFormReferenceId);
	}

	window.Crm.Service.ViewModels.ServiceCaseDetailsViewModel.prototype.getChecklistAutocompleteFilter = window.Crm
		.Service.ViewModels.ServiceCaseCreateViewModel.prototype.getChecklistAutocompleteFilter;
	window.Crm.Service.ViewModels.ServiceCaseDetailsViewModel.prototype.getElementTitle = function(dynamicFormElement) {
		var viewModel = this;
		return window.Crm.DynamicForms.ViewModels.DynamicFormDetailsViewModel.prototype
			.getLocalizationText.call({
					localizations: viewModel.localizations
				},
				dynamicFormElement);
	};
	window.Crm.Service.ViewModels.ServiceCaseDetailsViewModel.prototype.onSelectChecklist = function(checklist){
		var viewModel = this;
		viewModel.affectedDynamicFormReference(checklist);
		return window.Crm.Service.ViewModels.ServiceCaseCreateViewModel.prototype.onSelectChecklist.apply(this, arguments);
	}
	var setStatus = window.Crm.Service.ViewModels.ServiceCaseDetailsViewModel.prototype.setStatus;
	window.Crm.Service.ViewModels.ServiceCaseDetailsViewModel.prototype.setStatus = function(status) {
		var viewModel = this;
		var args = arguments;
		var belongsToClosed = window.Helper.ServiceCase.belongsToClosed(status);
		if (!belongsToClosed) {
			return setStatus.apply(viewModel, args);
		}
		return window.database.SmsChecklists_ServiceCaseChecklist.filter(function(it) {
					return it.ReferenceKey === this.serviceCaseId && it.Completed === false;
				},
				{ serviceCaseId: viewModel.serviceCase().Id() })
			.count()
			.then(function(count) {
				if (count === 0) {
					return setStatus.apply(viewModel, args);
				}
				return window.Helper.Confirm.genericConfirm({
					confirmButtonText: window.Helper.String.getTranslatedString("SetStatus"),
					text: window.Helper.String.getTranslatedString("IncompleteCompletionDynamicFormMessage"),
					title: window.Helper.String.getTranslatedString("CompletionDynamicForm"),
					type: "warning"
				}).then(function() {
					return setStatus.apply(viewModel, args);
				}).fail(function() {
					viewModel.loading(false);
				});
			});
	};

	window.Crm.Service.ViewModels.ServiceCaseDetailsViewModel.prototype.handleOnAfterSave = async function (pmbbViewModel) {
		const viewModel = this;
		const editedServiceCase = pmbbViewModel.viewContext.serviceCase();
		return viewModel.setDynamicFormEntities(editedServiceCase);
	}

	window.Crm.Service.ViewModels.ServiceCaseDetailsViewModel.prototype.handleOnSave = function (pmbbViewModel) {
		const editedServiceCase = pmbbViewModel.viewContext.serviceCase();
		if (!editedServiceCase.ExtensionValues().AffectedDynamicFormElementId()) {
			editedServiceCase.ExtensionValues().AffectedDynamicFormElementId(null)
		}
	}

	window.Crm.Service.ViewModels.ServiceCaseDetailsViewModel.prototype.getElementByIdQuery = function (query, id) {
		return query
			.includeDynamicFormElements()
			.include("DynamicForm")
			.include("DynamicForm.Localizations")
			.include("ServiceOrderTime")
			.filter(function (it) {
				return it.Id === this.id
			}, {id});
	}


})(window.ko);