namespace("Crm.Service.ViewModels").ServiceCaseDetailsViewModel = function() {
	var viewModel = this;
	viewModel.tabs = window.ko.observable({});
	viewModel.loading = window.ko.observable(true);
	viewModel.createUser = window.ko.observable(null);
	viewModel.serviceCase = window.ko.observable(null);
	window.Main.ViewModels.ContactDetailsViewModel.apply(this, arguments);
	viewModel.contactType("ServiceCase");
	viewModel.dropboxName = window.ko.pureComputed(function() {
		return viewModel.serviceCase() 
			? viewModel.serviceCase().ServiceCaseNo() +
				(viewModel.serviceCase().AffectedCompany() 
					? "-" + viewModel.serviceCase().AffectedCompany().Name().substring(0,25) 
					: "")
			: "";
	});
	viewModel.lookups = {
		installationHeadStatuses: { $tableName: "CrmService_InstallationHeadStatus" },
		serviceCaseCategories: { $tableName: "CrmService_ServiceCaseCategory" },
		serviceCaseStatuses: { $tableName: "CrmService_ServiceCaseStatus" },
		servicePriorities: { $tableName: "CrmService_ServicePriority" },
		skills: { $tableName: "Main_Skill" },
	};
	viewModel.lookups = window.Helper.StatisticsKey.addLookupTables(viewModel.lookups);
	viewModel.settableStatuses = window.ko.pureComputed(function() {
		var currentStatus = viewModel.lookups.serviceCaseStatuses.$array.find(function(x) {
			return x.Key === viewModel.serviceCase().StatusKey();
		});
		var settableStatusKeys = currentStatus
			? (currentStatus.SettableStatuses || "").split(",").map(function(x) {
				return parseInt(x);
			})
			: [];
		return viewModel.lookups.serviceCaseStatuses.$array.filter(function(x) {
			return x === currentStatus || settableStatusKeys.indexOf(x.Key) !== -1;
		});
	});
	viewModel.canSetStatus = window.ko.pureComputed(function () {
		return viewModel.settableStatuses().length > 1 &&
			window.AuthorizationManager.isAuthorizedForAction("ServiceCase", "SetStatus")
			&& viewModel.isEditable();
	});
	viewModel.isEditable = window.ko.pureComputed(function () {
		const hasEditPermission = window.AuthorizationManager.isAuthorizedForAction("ServiceCase", "Edit");
		const hasEditClosedPermission = window.AuthorizationManager.isAuthorizedForAction("ServiceCase", "EditClosed");
		const hasEditNotAssignedPermission = window.AuthorizationManager.isAuthorizedForAction("ServiceCase", "EditNotAssigned");
		const isClosed = window.Helper.ServiceCase.belongsToClosed(viewModel.lookups.serviceCaseStatuses[viewModel.serviceCase().StatusKey()]);
		const isUserAssigned = viewModel.serviceCase().ResponsibleUser() === window.Helper.User.getCurrentUserName();
		const isUserCreator = viewModel.serviceCase().ServiceCaseCreateUser() === window.Helper.User.getCurrentUserName();

		if (isClosed) {
			if (!hasEditClosedPermission)
				return false;
		}

		if (isUserCreator && hasEditPermission)
			return true;

		if (isUserAssigned && hasEditPermission)
			return true;

		if (!isUserAssigned && hasEditNotAssignedPermission)
			return true;

		return false;
	});
};
namespace("Crm.Service.ViewModels").ServiceCaseDetailsViewModel.prototype =
	Object.create(window.Main.ViewModels.ContactDetailsViewModel.prototype);
namespace("Crm.Service.ViewModels").ServiceCaseDetailsViewModel.prototype.init = async function(id) {
	var viewModel = this;
	viewModel.contactId(id);
	await window.Main.ViewModels.ContactDetailsViewModel.prototype.init.apply(this, arguments);
	let serviceCase = await window.database.CrmService_ServiceCase
		.include("AffectedCompany")
		.include("AffectedInstallation")
		.include("CompletionServiceOrder")
		.include("CompletionUserUser")
		.include("ContactPerson")
		.include("OriginatingServiceOrder")
		.include("OriginatingServiceOrderTime")
		.include("ResponsibleUserUser")
		.include("ServiceObject")
				.include("Station")
		.include2("Tags.orderBy(function(t) { return t.Name; })")
		.find(id);
	viewModel.serviceCase(serviceCase.asKoObservable());
	viewModel.contact(viewModel.serviceCase());
	viewModel.contactName(window.Helper.ServiceCase.getDisplayName(viewModel.serviceCase()));
	viewModel.createUser(await window.database.Main_User.find(viewModel.serviceCase().CreateUser()));
	await window.Helper.StatisticsKey.getAvailableLookups(viewModel.lookups, viewModel.serviceCase());
	await window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups);
	await viewModel.setVisibilityAlertText();
	await viewModel.setBreadcrumbs(id);
};
namespace("Crm.Service.ViewModels").ServiceCaseDetailsViewModel.prototype.contactPersonFilter =
	window.Crm.Service.ViewModels.ServiceCaseCreateViewModel.prototype.contactPersonFilter;
namespace("Crm.Service.ViewModels").ServiceCaseDetailsViewModel.prototype.installationFilter =
	window.Crm.Service.ViewModels.ServiceCaseCreateViewModel.prototype.installationFilter;
namespace("Crm.Service.ViewModels").ServiceCaseDetailsViewModel.prototype.onSelectOriginatingServiceOrder =
	window.Crm.Service.ViewModels.ServiceCaseCreateViewModel.prototype.onSelectOriginatingServiceOrder;
namespace("Crm.Service.ViewModels").ServiceCaseDetailsViewModel.prototype.serviceOrderFilter =
	window.Crm.Service.ViewModels.ServiceCaseCreateViewModel.prototype.serviceOrderFilter;
namespace("Crm.Service.ViewModels").ServiceCaseDetailsViewModel.prototype.serviceOrderTimeFilter =
	window.Crm.Service.ViewModels.ServiceCaseCreateViewModel.prototype.serviceOrderTimeFilter;
namespace("Crm.Service.ViewModels").ServiceCaseDetailsViewModel.prototype.setStatus = function(status) {
	var viewModel = this;
	viewModel.loading(true);
	window.database.attachOrGet(viewModel.serviceCase().innerInstance);
	window.Helper.ServiceCase.setStatus(viewModel.serviceCase(), status);
	window.database.saveChanges().then(function() {
		viewModel.loading(false);
	});
};
namespace("Crm.Service.ViewModels").ServiceCaseDetailsViewModel.prototype.onRensponsibleUserSelect = function (user) {
	var serviceCase = this;
	if (user) {
		serviceCase.ResponsibleUserUser(user);
	} else {
		serviceCase.ResponsibleUserUser(null);
	}
};
namespace("Crm.Service.ViewModels").ServiceCaseDetailsViewModel.prototype.getSkillsFromKeys = function(keys) {
	var viewModel = this;
	return viewModel.lookups.skills.$array.filter(function(x) {
		return keys.indexOf(x.Key) !== -1;
	}).map(window.Helper.Lookup.mapLookupForSelect2Display);
};
namespace("Crm.Service.ViewModels").ServiceCaseDetailsViewModel.prototype.onAffectedCompanySelect = function (company) {
	var serviceCase = this;
	if (company) {
		serviceCase.AffectedCompany(company);
	} else {
		serviceCase.AffectedCompany(null);
	}
};
namespace("Crm.Service.ViewModels").ServiceCaseDetailsViewModel.prototype.onContactPersonSelect = function (person) {
	var serviceCase = this;
	if (person) {
		serviceCase.ContactPerson(person);
	} else {
		serviceCase.ContactPerson(null);
	}
};
namespace("Crm.Service.ViewModels").ServiceCaseDetailsViewModel.prototype.onAffectedInstallationSelect = function (installation) {
	var serviceCase = this;
	if (installation) {
		serviceCase.AffectedInstallation(installation);
	} else {
		serviceCase.AffectedInstallation(null);
	}
};

namespace("Crm.Service.ViewModels").ServiceCaseDetailsViewModel.prototype.setBreadcrumbs = function (id) {
	var viewModel = this;
	return window.breadcrumbsViewModel.setBreadcrumbs([
		new Breadcrumb(Helper.String.getTranslatedString("ServiceCase"), "#/Crm.Service/ServiceCaseList/IndexTemplate"),
		new Breadcrumb(Helper.ServiceCase.getDisplayName(viewModel.serviceCase()), window.location.hash, null, id)
	]);
};

