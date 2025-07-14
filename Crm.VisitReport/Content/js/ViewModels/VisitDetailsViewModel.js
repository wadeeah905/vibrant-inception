namespace("Crm.VisitReport.ViewModels").VisitDetailsViewModel = function() {
	var viewModel = this;
	viewModel.tabs = window.ko.observable({});
	viewModel.loading = window.ko.observable(true);
	viewModel.company = window.ko.observable(null);
	viewModel.visit = window.ko.observable(null);
	window.Main.ViewModels.ContactDetailsViewModel.apply(this, arguments);
	viewModel.contactType("Visit");
	viewModel.address = window.ko.observable(null);

	viewModel.lookups = {
		addressTypes: { $tableName: "Main_AddressType"},
		regions: { $tableName: "Main_Region" },
		countries: { $tableName: "Main_Country"},
		visitAims: { $tableName: "CrmVisitReport_VisitAim"},
		timeUnits: { $tableName: "Main_TimeUnit" },
		visitStatuses: { $tableName: "CrmVisitReport_VisitStatus" },
	};

	viewModel.settableStatuses = window.ko.pureComputed(function () {
		var currentStatus = viewModel.lookups.visitStatuses.$array.find(function (x) {
			return x.Key === viewModel.visit().StatusKey();
		});
		var settableStatusKeys = currentStatus
			? (currentStatus.SettableStatuses || "").split(",")
			: [];
		if (currentStatus.Key === "Completed" && window.Crm.VisitReport.Settings.Visit.EditVisitAfterClosing) {
			settableStatusKeys.push("InProgress");
		}
		return viewModel.lookups.visitStatuses.$array.filter(function (x) {
			return x === currentStatus || settableStatusKeys.indexOf(x.Key) !== -1;
		});
	});
	viewModel.canSetStatus = window.ko.pureComputed(function () {
		return viewModel.settableStatuses().length > 1 &&
			window.AuthorizationManager.isAuthorizedForAction("Visit", "SetStatus");
	});
	viewModel.visitIsEditable = window.ko.pureComputed(function () {
		if (viewModel.visit().StatusKey() === "Completed") {
			return false;
		}
		return true;
	});
}
namespace("Crm.VisitReport.ViewModels").VisitDetailsViewModel.prototype = Object.create(window.Main.ViewModels.ContactDetailsViewModel.prototype);
namespace("Crm.VisitReport.ViewModels").VisitDetailsViewModel.prototype.init = function(id) {
	var viewModel = this;
	viewModel.contactId(id);
	window.Helper.Address.registerEventHandlers(viewModel);
	return window.Main.ViewModels.ContactDetailsViewModel.prototype.init.apply(this, arguments)
		.then(function() {
			return window.database.CrmVisitReport_Visit
				.include("Address")
				.include("Parent")
				.include("Parent.Addresses")
				.include("ResponsibleUserUser")
				.find(id);
		})
		.then(function (visit) {
			viewModel.visit(visit.asKoObservable());
			viewModel.contact(viewModel.visit());
			viewModel.contactName(window.Helper.Company.getDisplayName(visit.Parent));
			if (visit.Address) {
				viewModel.address(visit.Address.asKoObservable());
			}
			viewModel.company(viewModel.visit().Parent());
		})
		.then(function () {
			viewModel.visit().PlannedTime.subscribe(function () {
				window.Helper.Visit.calculateDuration(viewModel.visit());
			});
			viewModel.visit().PlannedEndDate.subscribe(function () {
				window.Helper.Visit.calculateDuration(viewModel.visit());
			});
		})
		.then(function () { return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups); })
		.then(function () {
				var customAim = { Key: null, Value: window.Helper.String.getTranslatedString("SetCustomVisitAim") };
			viewModel.lookups.visitAims.$array.push(customAim);
		})
		.then(function () { return viewModel.setVisibilityAlertText(); })
		.then(() => viewModel.setBreadcrumbs(id));
};
namespace("Crm.VisitReport.ViewModels").VisitDetailsViewModel.prototype.onBeforeSaveVisit = function (context) {
	var visit = context.editContext().visit();
	window.Helper.Visit.calculateDates(visit);
	if (visit.StatusKey() === "Created" && visit.PlannedDate()) {
		visit.StatusKey("Scheduled");
	}
	if (visit.StatusKey() === "Scheduled" && !visit.PlannedDate()) {
		visit.StatusKey("Created");
	}
};
namespace("Crm.VisitReport.ViewModels").VisitDetailsViewModel.prototype.onAddressUpdate = function (sender, address) {
	this.address(address.asKoObservable());
};
namespace("Crm.VisitReport.ViewModels").VisitDetailsViewModel.prototype.deleteVisit = function(visitViewModel) {
	var viewModel = this;
	var visit = window.Helper.Database.getDatabaseEntity(visitViewModel.visit());
	var visitTopics = [];

	window.Helper.Confirm.confirmDelete()
		.done(function () {
			viewModel.loading(true);
			return new $.Deferred().resolve().promise();
		})
		.then(function () {
			var d = new $.Deferred();

			window.database.CrmVisitReport_VisitTopic.filter(function (topic) {
				return topic.VisitKey == visitId;
			}, { visitId: visit.Id }).toArray(visitTopics)
				.pipe(d.resolve)
				.fail(d.reject);
			return d.promise();
		})
		.then(function () {
			visitTopics.forEach(function (topic) {
				window.database.remove(topic);
			});
			window.database.remove(visit);
			return window.database.saveChanges();
		})
		.then(function () {
			viewModel.loading(false);
			window.location.hash = "/Crm.VisitReport/VisitList/IndexTemplate";
		})
		.fail(function () {
			viewModel.loading(false);
		});
};
namespace("Crm.VisitReport.ViewModels").VisitDetailsViewModel.prototype.onVisitAimChange = function (visit) {
	window.Helper.Visit.safeVisitAimSwitch(visit);
};
namespace("Crm.VisitReport.ViewModels").VisitDetailsViewModel.prototype.setBreadcrumbs = function (id) {
	var viewModel = this;
	window.breadcrumbsViewModel.setBreadcrumbs([
		new Breadcrumb(Helper.String.getTranslatedString("Visit"), "#/Crm.VisitReport/VisitList/IndexTemplate"),
		new Breadcrumb(Helper.Company.getDisplayName(viewModel.company), window.location.hash, null, id)
	]);
};
namespace("Crm.VisitReport.ViewModels").VisitDetailsViewModel.prototype.onAddressSelect = function (address) {
	var viewModel = this;
	if (address) {
		viewModel.address(address);
	}
};
namespace("Crm.VisitReport.ViewModels").VisitDetailsViewModel.prototype.addressFilter = function (query) {
	var viewModel = this;
	return query.filter(function (it) {
			return it.CompanyId === this.parentId;
		},
		{parentId: viewModel.visit().ParentId()});
};
namespace("Crm.VisitReport.ViewModels").VisitDetailsViewModel.prototype.setStatus = function (status) {
	var viewModel = this;
	viewModel.loading(true);
	window.Helper.Visit.setStatus(viewModel.visit(), status.Key).then(function(){
		viewModel.loading(false);
	});
};