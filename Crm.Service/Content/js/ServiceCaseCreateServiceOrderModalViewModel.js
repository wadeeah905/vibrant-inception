namespace("Crm.Service.ViewModels").ServiceCaseCreateServiceOrderModalViewModel = function(parentViewModel) {
	var viewModel = this;
	viewModel.parentViewModel = parentViewModel;
	viewModel.loading = window.ko.observable(true);
	viewModel.arrayOrQueryable = window.ko.observable([]);
	viewModel.multipleServiceCasesSelected = window.ko.pureComputed(function() {
		return !Array.isArray(viewModel.arrayOrQueryable()) || viewModel.arrayOrQueryable().length > 1;
	});
	viewModel.jobPerServiceCase = window.ko.observable().extend({
		equal: {
			message: window.Helper.String.getTranslatedString("RuleViolation.Required")
				.replace("{0}", window.Helper.String.getTranslatedString("JobPerServiceCase")),
			onlyIf: function() {
				return viewModel.multipleServiceCasesSelected() && viewModel.multipleInstallationsSelected;
			},
			params: true
		}
	});
	viewModel.multipleServiceCasesSelected.subscribe(function(value) {
		viewModel.jobPerServiceCase(value);
	});
	viewModel.selectedAddress = window.ko.observable(null);
	viewModel.selectedServiceOrderType = window.ko.observable(null);
	viewModel.serviceOrder = window.ko.observable(null);
	viewModel.showCompanySelection = window.ko.pureComputed(function() {
		return viewModel.multipleServiceCasesSelected() ||
			(viewModel.arrayOrQueryable().length === 1 && !viewModel.arrayOrQueryable()[0].AffectedCompanyKey());
	});
	viewModel.showServiceObjectSelection = window.ko.pureComputed(function() {
		return viewModel.multipleServiceCasesSelected() ||
			(viewModel.arrayOrQueryable().length === 1 && !viewModel.arrayOrQueryable()[0].ServiceObjectId());
	});
	viewModel.errors = window.ko.validation.group(viewModel);
	viewModel.lookups = {
		skills: { $tableName: "Main_Skill" },
	};
};
namespace("Crm.Service.ViewModels").ServiceCaseCreateServiceOrderModalViewModel.prototype.addressFilter =
	function(query, term) {
		var viewModel = this;
		var contactIds = [viewModel.serviceOrder().CustomerContactId(), viewModel.serviceOrder().ServiceObjectId()]
			.filter(Boolean);
		if (contactIds.length > 0) {
			query = query.filter(function(it) {
					return it.CompanyId in this.contactIds;
				},
				{ contactIds: contactIds });
		}
		if (term) {
			query = query.filter(function(it) {
					return it.Name1.contains(this.term) === true ||
						it.Name2.contains(this.term) === true ||
						it.Name3.contains(this.term) === true ||
						it.ZipCode.contains(this.term) === true ||
						it.City.contains(this.term) === true ||
						it.Street.contains(this.term) === true;
				},
				{ term: term });
		}
		return query;
	};
namespace("Crm.Service.ViewModels").ServiceCaseCreateServiceOrderModalViewModel.prototype.init = function(id) {
	var viewModel = this;
	var serviceOrder = window.database.CrmService_ServiceOrderHead.CrmService_ServiceOrderHead.create();
	serviceOrder.Reported = new Date();
	serviceOrder.StatusKey = viewModel.serviceOrderStatusKey;
	var init = (id ? window.database.CrmService_ServiceCase.find(id) : new $.Deferred().resolve(null).promise())
		.then(function(serviceCase) {
			if (serviceCase) {
				serviceOrder.CustomerContactId = serviceCase.AffectedCompanyKey;
				serviceOrder.ErrorMessage = serviceCase.ErrorMessage;
				serviceOrder.InstallationId = serviceCase.AffectedInstallationKey;
				serviceOrder.PriorityKey = serviceCase.PriorityKey;
				serviceOrder.ResponsibleUser = serviceCase.ResponsibleUser;
				serviceOrder.ServiceObjectId = serviceCase.ServiceObjectId;
				serviceOrder.StationKey = serviceCase.StationKey;
				serviceOrder.RequiredSkillKeys = serviceCase.RequiredSkillKeys;
				viewModel.arrayOrQueryable([serviceCase.asKoObservable()]);
			} else {
				viewModel.arrayOrQueryable(viewModel.parentViewModel.allItemsSelected() === true
					? viewModel.parentViewModel.getFilterQuery(false, false)
					: viewModel.parentViewModel.selectedItems());
				if (window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode ===
					"OrderPerInstallation") {
					serviceOrder.InstallationId =
						viewModel.parentViewModel.selectedItems()[0].AffectedInstallationKey();
				}
			}
			window.database.add(serviceOrder);
			viewModel.serviceOrder(serviceOrder.asKoObservable());
			return window.Helper.User.getCurrentUser();
		}).then(() => window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups))
		.then(() => {
			return database.CrmService_ServiceOrderType.filter(x => x.Favorite == true).toArray();
		}).then((favorites) => {
			return favorites.sort(function (a, b) {
				return a.SortOrder - b.SortOrder;
			})[0];
		}).then((favorite) => {
			if (favorite)
				viewModel.serviceOrder().TypeKey(favorite.Key);
		});

	if (id) {
		return init;
	}
	init = init.then(function() {
		return viewModel.parentViewModel.bulkSelectionHasMultipleSelectedValues("AffectedInstallationKey");
	}).then(function(multiple) {
		if (window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode === "OrderPerInstallation" &&
			multiple) {
			$(".modal:visible").modal("hide");
			window.swal(window.Helper.String.getTranslatedString("Error"),
				window.Helper.String.getTranslatedString(
					"CannotCreateServiceOrderForMultipleInstallationsInOrderPerInstallationMode"),
				"error");
		} else if (window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode ===
			"OrderPerInstallation" &&
			!multiple) {
			viewModel.serviceOrder()
				.InstallationId(viewModel.parentViewModel.selectedItems()[0].AffectedInstallationKey());
		}
		return viewModel.parentViewModel.bulkSelectionHasMultipleSelectedValues("AffectedCompanyKey");
	}).then(function(multiple) {
		if (!multiple) {
			viewModel.serviceOrder()
				.CustomerContactId(viewModel.parentViewModel.selectedItems()[0].AffectedCompanyKey());
		}
		return viewModel.parentViewModel.bulkSelectionHasMultipleSelectedValues("ErrorMessage");
	}).then(function(multiple) {
		viewModel.multipleErrorMessagesSelected = multiple;
		if (!multiple) {
			viewModel.serviceOrder()
				.ErrorMessage(viewModel.parentViewModel.selectedItems()[0].ErrorMessage());
		}
		return viewModel.parentViewModel.bulkSelectionHasMultipleSelectedValues("ServiceObjectId");
	}).then(function(multiple) {
		if (!multiple) {
			viewModel.serviceOrder()
				.ServiceObjectId(viewModel.parentViewModel.selectedItems()[0].ServiceObjectId());
		}
		return viewModel.parentViewModel.bulkSelectionHasMultipleSelectedValues("PriorityKey");
	}).then(function(multiple) {
		if (!multiple) {
			viewModel.serviceOrder()
				.PriorityKey(viewModel.parentViewModel.selectedItems()[0].PriorityKey());
		}
		return viewModel.parentViewModel.bulkSelectionHasMultipleSelectedValues("ResponsibleUser");
	}).then(function(multiple) {
		if (!multiple) {
			viewModel.serviceOrder()
				.ResponsibleUser(viewModel.parentViewModel.selectedItems()[0].ResponsibleUser());
		}
		return viewModel.parentViewModel.bulkSelectionHasMultipleSelectedValues("StationKey");
	}).then(function (multiple) {
		if (!multiple) {
			viewModel.serviceOrder()
				.StationKey(viewModel.parentViewModel.selectedItems()[0].StationKey());
		}
	});
	return init;
};
namespace("Crm.Service.ViewModels").ServiceCaseCreateServiceOrderModalViewModel.prototype.serviceOrderStatusKey =
	"New";
namespace("Crm.Service.ViewModels").ServiceCaseCreateServiceOrderModalViewModel.prototype.submit = function() {
	var viewModel = this;
	if (viewModel.errors().length > 0) {
		viewModel.errors.showAllMessages();
		return;
	}
	viewModel.errors.showAllMessages(false);
	viewModel.loading(true);

	return window.NumberingService.createNewNumberBasedOnAppSettings(window.Crm.Service.Settings.ServiceOrder.OrderNoIsGenerated, window.Crm.Service.Settings.ServiceOrder.OrderNoIsCreateable, viewModel.serviceOrder().OrderNo(), viewModel.selectedServiceOrderType().NumberingSequence || "SMS.ServiceOrderHead.ServiceOrder", window.database.CrmService_ServiceOrderHead, "OrderNo")
		.then(function (serviceOrderNo) {
			if (serviceOrderNo !== undefined) {
				viewModel.serviceOrder().Name(serviceOrderNo);
				viewModel.serviceOrder().OrderNo(serviceOrderNo);
			} else {
				viewModel.serviceOrder().Name(viewModel.serviceOrder().OrderNo())
			}
			var serviceOrderTimeId = null;
			if (viewModel.jobPerServiceCase() === false) {
				var newServiceOrderTime =
					window.database.CrmService_ServiceOrderTime.CrmService_ServiceOrderTime.create();
				if (!viewModel.multipleInstallationsSelected &&
					window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode ===
					"JobPerInstallation") {
					newServiceOrderTime.InstallationId =
						viewModel.parentViewModel.selectedItems()[0].AffectedInstallationKey();
				}
				newServiceOrderTime.OrderId = viewModel.serviceOrder().Id();
				newServiceOrderTime.PosNo = "0001";
				window.database.add(newServiceOrderTime);
				serviceOrderTimeId = newServiceOrderTime.Id;
			}
			var maxPosNo = 0;
			if (Array.isArray(viewModel.arrayOrQueryable())) {
				return window.Helper.ServiceCase.addServiceCasesToServiceOrder(viewModel.arrayOrQueryable(),
					viewModel.serviceOrder().Id(),
					serviceOrderTimeId,
					maxPosNo);
			} else if (viewModel.arrayOrQueryable() instanceof window.$data.Queryable) {
				var pageSize = 25;
				var page = 0;
				var d = new $.Deferred();
				var processNextPage = function() {
					viewModel.arrayOrQueryable()
						.orderBy(function(x) { return x.Id; })
						.skip(page * pageSize)
						.take(pageSize)
						.toArray()
						.then(function(serviceCases) {
							window.Helper.ServiceCase.addServiceCasesToServiceOrder(serviceCases,
								viewModel.serviceOrder().Id(),
								serviceOrderTimeId,
								maxPosNo
							).then(function(results) {
								if (serviceCases.length === pageSize) {
									page++;
									maxPosNo = results.map(function(x) {
										return x.PosNo;
									}).sort().pop();
									processNextPage();
								} else {
									d.resolve();
								}
							}).fail(d.reject);
						});
				};
				processNextPage();
				return d.promise();
			} else {
				throw "arrayOrQueryable is neither array nor queryable";
			}
		}).then(function() {
			$(".modal:visible").modal("hide");
			window.location.hash = "/Crm.Service/ServiceOrder/DetailsTemplate/" + viewModel.serviceOrder().Id();
		});
};
namespace("Crm.Service.ViewModels").ServiceCaseCreateServiceOrderModalViewModel.prototype.selectedAddressOnSelect = function (selectedAddress) {
	var viewModel = this;
	if (selectedAddress) {
		viewModel.serviceOrder().Name1(selectedAddress.Name1);
		viewModel.serviceOrder().Name2(selectedAddress.Name2);
		viewModel.serviceOrder().Name3(selectedAddress.Name3);
		viewModel.serviceOrder().Street(selectedAddress.Street);
		viewModel.serviceOrder().ZipCode(selectedAddress.ZipCode);
		viewModel.serviceOrder().City(selectedAddress.City);
		viewModel.serviceOrder().CountryKey(selectedAddress.CountryKey);
		viewModel.serviceOrder().RegionKey(selectedAddress.RegionKey);
	} else {
		viewModel.serviceOrder().Name1(null);
		viewModel.serviceOrder().Name2(null);
		viewModel.serviceOrder().Name3(null);
		viewModel.serviceOrder().Street(null);
		viewModel.serviceOrder().ZipCode(null);
		viewModel.serviceOrder().City(null);
		viewModel.serviceOrder().CountryKey(null);
		viewModel.serviceOrder().RegionKey(null);
	}
};
namespace("Crm.Service.ViewModels").ServiceCaseCreateServiceOrderModalViewModel.prototype.onServiceOrderTemplateSelect =
	namespace("Crm.Service.ViewModels").ServiceOrderCreateViewModel.prototype.onServiceOrderTemplateSelect;

namespace("Crm.Service.ViewModels").ServiceCaseCreateServiceOrderModalViewModel.prototype.getSkillsFromKeys = async function(keys) {
	var viewModel = this;
	return viewModel.lookups.skills.$array.filter(function(x) {
		return keys.indexOf(x.Key) !== -1;
	}).map(window.Helper.Lookup.mapLookupForSelect2Display);
};