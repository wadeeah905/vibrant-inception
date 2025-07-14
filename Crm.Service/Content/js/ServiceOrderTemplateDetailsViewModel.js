/// <reference path="serviceordertemplatecreateviewmodel.js" />
namespace("Crm.Service.ViewModels").ServiceOrderTemplateDetailsViewModel = function() {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	viewModel.currentTabId = window.ko.observable(null);
	viewModel.previousTabId = window.ko.observable(null);
	viewModel.currentUser = window.ko.observable(null);
	viewModel.serviceOrderTemplate = window.ko.observable(null);
	viewModel.serviceOrder = viewModel.serviceOrderTemplate;
	viewModel.serviceOrderTemplateIsEditable = window.ko.pureComputed(function() {
		var hasPermission = window.AuthorizationManager.isAuthorizedForAction("ServiceOrderTemplate", "Edit");
		return hasPermission;
	});
	viewModel.serviceOrderIsEditable = window.ko.pureComputed(() => this.serviceOrderTemplateIsEditable(), viewModel);
	viewModel.showInvoiceData = window.ko.pureComputed(() => {
		return false;
	});
	viewModel.lookups = {
		invoicingTypes: { $tableName: "Main_InvoicingType" },
		serviceOrderStatuses: { $tableName: "CrmService_ServiceOrderStatus" },
		serviceOrderTypes: { $tableName: "CrmService_ServiceOrderType" },
		servicePriorities: { $tableName: "CrmService_ServicePriority" },
		skills: { $tableName: "Main_Skill" }
	};
	viewModel.tabs = window.ko.observable({});
	window.Main.ViewModels.ContactDetailsViewModel.apply(this, arguments);
	viewModel.contactType("ServiceOrder");
	viewModel.contactName = window.ko.pureComputed(function() {
		return viewModel.serviceOrderTemplate() ? viewModel.serviceOrderTemplate().OrderNo() : null;
	});
};
namespace("Crm.Service.ViewModels").ServiceOrderTemplateDetailsViewModel.prototype =
	Object.create(window.Main.ViewModels.ContactDetailsViewModel.prototype);
namespace("Crm.Service.ViewModels").ServiceOrderTemplateDetailsViewModel.prototype.getSkillsFromKeys =
	namespace("Crm.Service.ViewModels").ServiceOrderDetailsViewModel.prototype.getSkillsFromKeys;
namespace("Crm.Service.ViewModels").ServiceOrderTemplateDetailsViewModel.prototype.init = function(id) {
	var viewModel = this;
	return window.Main.ViewModels.ContactDetailsViewModel.prototype.init.apply(this, arguments).then(function() {
		return window.database.CrmService_ServiceOrderHead
			.include("PreferredTechnicianUser")
			.include("PreferredTechnicianUsergroupObject")
			.include("ResponsibleUserUser")
			.include("UserGroup")
			.find(id);
	}).then(function(serviceOrderTemplate) {
		viewModel.serviceOrderTemplate(serviceOrderTemplate.asKoObservable());
		viewModel.contact(viewModel.serviceOrderTemplate());
		return window.Helper.User.getCurrentUser();
	}).then(function(user) {
		viewModel.currentUser(user);
		return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups);
	}).then(function() { 
		return viewModel.setVisibilityAlertText();
	}).then(() => viewModel.setBreadcrumbs(id));
};
namespace("Crm.Service.ViewModels").ServiceOrderTemplateDetailsViewModel.prototype.onSaveScheduling =
	function(viewModel) {
		viewModel.viewContext.serviceOrderTemplate()
			.PreferredTechnicianUser(viewModel.editContext().serviceOrderTemplate().PreferredTechnicianUser());
		viewModel.viewContext.serviceOrderTemplate()
			.PreferredTechnicianUsergroupObject(viewModel.editContext().serviceOrderTemplate().PreferredTechnicianUsergroupObject());
		viewModel.viewContext.serviceOrderTemplate()
			.ResponsibleUserUser(viewModel.editContext().serviceOrderTemplate().ResponsibleUserUser());
		viewModel.viewContext.serviceOrderTemplate()
			.UserGroup(viewModel.editContext().serviceOrderTemplate().UserGroup());
	};
namespace("Crm.Service.ViewModels").ServiceOrderTemplateDetailsViewModel.prototype.preferredTechnicianFilter =
	function(query, term) {
		var serviceOrderTemplate = this.serviceOrderTemplate();
		if (query.specialFunctions.filterByPermissions[window.database.storageProvider.name]) {
			query = query.filter("filterByPermissions", "Dispatch::Edit");
		}
		return window.Helper.User.filterUserQuery(query, term, serviceOrderTemplate.PreferredTechnicianUsergroupKey());
	};
namespace("Crm.Service.ViewModels").ServiceOrderTemplateDetailsViewModel.prototype.setBreadcrumbs = function(id) {
	var viewModel = this;
	window.breadcrumbsViewModel.setBreadcrumbs([
		new window.Breadcrumb(window.Helper.String.getTranslatedString("ServiceOrderTemplate"),
			"#/Crm.Service/ServiceOrderTemplateList/IndexTemplate"),
		new window.Breadcrumb(viewModel.serviceOrderTemplate().OrderNo(), window.location.hash, null, id)
	]);
};
namespace("Crm.Service.ViewModels").ServiceOrderTemplateDetailsViewModel.prototype.getServiceOrderStatusAutocompleterOptions =
	function (tableName) {
		var viewModel = this;
		return {customFilter: function (query, term) {
				if (term) {
					query = query.filter(function (it) {
						return it.Value.toLowerCase().contains(this.term);
					},
						{ term: term });
				}
			return query.filter("(it.Groups == 'Preparation' || it.Groups == 'Scheduling') && it.Language === language", { language: viewModel.currentUser().DefaultLanguageKey });
			},
			table: tableName,
			mapDisplayObject: Helper.Lookup.mapLookupForSelect2Display,
			getElementByIdQuery: Helper.Lookup.getLookupByKeyQuery
		}
	};
namespace("Crm.Service.ViewModels").ServiceOrderTemplateDetailsViewModel.prototype.getServiceOrderStatusAutocompleterOptions =
	function (tableName) {
		var viewModel = this;
		var excluded = ["Released", "PartiallyReleased", "Scheduled"];
		return {
			customFilter: function (query, term) {
				if (term) {
					query = query.filter(function (it) {
						return it.Value.toLowerCase().contains(this.term);
					}, { term: term });
				}
				return query.filter("(it.Groups == 'Preparation' || it.Groups == 'Scheduling') && !(it.Key in this.excluded) && it.Language === language", { language: viewModel.currentUser().DefaultLanguageKey, excluded: excluded });
			},
			table: tableName,
			mapDisplayObject: Helper.Lookup.mapLookupForSelect2Display,
			getElementByIdQuery: Helper.Lookup.getLookupByKeyQuery
		}
	};