namespace("Crm.VisitReport.ViewModels").VisitCreateViewModel = function() {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);
	viewModel.visit = window.ko.observable(null);
	viewModel.companyName = window.ko.observable(null);
	viewModel.errors = window.ko.validation.group(viewModel.visit, { deep: true });
	viewModel.addresses = window.ko.observableArray([]);
	viewModel.lookups = {
		visitAims: {}
	};
	viewModel.onSelectCompany = function (company) {
		viewModel.visit().ParentId(company.Id);
		viewModel.companyName(company.Name);
	};
};
namespace("Crm.VisitReport.ViewModels").VisitCreateViewModel.prototype.init = function(id, params) {
	var viewModel = this;
	var d = new $.Deferred();
	window.Helper.Database.initialize()
		.then(function () {
			if (id) {
				return window.database.CrmVisitReport_Visit.find(id);
			}
			var visit = window.database.CrmVisitReport_Visit.CrmVisitReport_Visit.create();
			return visit;
		})
		.then(function (visit) {
			var currentUserName = document.getElementById("meta.CurrentUser").content;
			visit.ResponsibleUser = currentUserName;
			viewModel.visit(visit.asKoObservable());
			return new $.Deferred().resolve().promise();
		})
		.then(function () {
			viewModel.visit().ParentId.subscribe(function (parentId) {
				if (!parentId) {
					viewModel.visit().Parent(null);
					viewModel.addresses([]);
				} else {
					window.database.Main_Address
						.filter(function (x) {
							return x.CompanyId === this.parentId;
						},
						{ parentId: parentId })
						.toArray(viewModel.addresses)
						.then(function () {
							var standardAddress = window.ko.utils.arrayFirst(viewModel.addresses(),
								function (address) {
									return address.IsCompanyStandardAddress();
								});
							var standardAddressId = standardAddress ? standardAddress.Id() : null;
							viewModel.visit().AddressId(viewModel.visit().AddressId() || standardAddressId);
						});
				}
			});
			return new $.Deferred().resolve().promise();
		})
		.then(function () {
			viewModel.visit().ParentId(params.companyId);
		})
		.then(function () {
			if (viewModel.companyName() == null && viewModel.visit().ParentId() != null) {
				return window.database.Main_Company.find(viewModel.visit().ParentId()).then(function(company) {
					viewModel.companyName(company.Name);
				});
			} else {
				return new $.Deferred().resolve().promise();
			}
		})
		.then(function () {
			return window.Helper.Lookup.getLocalizedArrayMap("CrmVisitReport_VisitAim")
				.then(function (lookup) {
					var customAim = { Key: null, Value: window.Helper.String.getTranslatedString("SetCustomVisitAim") };
					lookup.$array.push(customAim);
					viewModel.lookups.visitAims = lookup;
				});
		})
		.then(function () {
			window.database.add(viewModel.visit().innerInstance);
		})
		.then(d.resolve)
		.fail(d.reject);
	return d.promise();
};
namespace("Crm.VisitReport.ViewModels").VisitCreateViewModel.prototype.cancel = function() {
	window.database.detach(this.visit().innerInstance);
	window.history.back();
};

namespace("Crm.VisitReport.ViewModels").VisitCreateViewModel.prototype.submit = function() {
	var viewModel = this;
	viewModel.loading(true);
	var deferred =  new $.Deferred().resolve().promise();
	if (viewModel.errors().length > 0) {
		viewModel.loading(false);
		viewModel.errors.showAllMessages();
		viewModel.errors.scrollToError();
		return;
	}
	if (!!deferred) {
		deferred.then(function () {
			if (!viewModel.visit().Name()) {
				viewModel.visit().Name("");
			}
			if (viewModel.visit().PlannedDate()) {
				viewModel.visit().StatusKey(viewModel.visit().PlannedDate() < new Date() ? "InProgress" : "Scheduled");
			} else {
				viewModel.visit().StatusKey("Created");
			}
			window.Helper.Visit.calculateDates(viewModel.visit());

			window.database.saveChanges().then(function () {
				window.location.hash = "/Crm.VisitReport/Visit/DetailsTemplate/" + viewModel.visit().Id();
			});
		});
	}
};