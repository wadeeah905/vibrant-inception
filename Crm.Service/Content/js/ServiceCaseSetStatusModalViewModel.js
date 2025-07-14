namespace("Crm.Service.ViewModels").ServiceCaseSetStatusModalViewModel = function(parentViewModel) {
	var viewModel = this;
	viewModel.parentViewModel = parentViewModel;
	viewModel.loading = window.ko.observable(true);
	viewModel.arrayOrQueryable = parentViewModel.allItemsSelected() === true
		? parentViewModel.getFilterQuery(false, false)
		: parentViewModel.selectedItems();
	viewModel.statusKey = window.ko.observable(null).extend({
		required: {
			message: window.Helper.String.getTranslatedString("RuleViolation.Required")
				.replace("{0}", window.Helper.String.getTranslatedString("ServiceCaseStatus")),
			params: true
		},
		validation: {
			async: true,
			validator: function (val, params, callback) {
				if (viewModel.statusKey() === null) {
					callback(true);
				}
				var invalidStatusKeys = viewModel.lookups.serviceCaseStatuses.$array.filter(function (x) {
					if (x.Key === null) {
						return false;
					}
					var settableStatusKeys = (x.SettableStatuses || "").split(",").map(function (statusKey) {
						return parseInt(statusKey);
					});
					return settableStatusKeys.indexOf(viewModel.statusKey()) === -1;
				}).map(function(x) {
					return x.Key;
				});
				new $.Deferred().resolve().promise().then(function () {
					if (Array.isArray(viewModel.arrayOrQueryable)) {
						return viewModel.arrayOrQueryable.filter(function (x) {
							return invalidStatusKeys.indexOf(x.StatusKey()) !== -1;
						});
					} else {
						return parentViewModel.getFilterQuery(false,
								false,
								{ "it.StatusKey in this.statusKeys": { statusKeys: invalidStatusKeys } })
							.withInlineCount()
							.take(10)
							.toArray();
					}
				}).then(function(invalidServiceCases) {
					if (invalidServiceCases.length === 0) {
						callback(true);
					} else {
						var additionalCount = invalidServiceCases.totalCount > 10 ? invalidServiceCases.totalCount - 10 : 0;
						var serviceCasesText = invalidServiceCases.map(window.Helper.ServiceCase.getDisplayName).join(",\r\n");
						if (additionalCount > 0) {
							serviceCasesText += "\r\n" +
								window.Helper.String.getTranslatedString("AndXAdditional")
								.replace("{0}", additionalCount);
						}
						var message = window.Helper.String.getTranslatedString("StatusNotSettable").replace("{0}", serviceCasesText);
						callback({ isValid: false, message: message });
					}
				});
			}
		}
	});
	viewModel.status = window.ko.pureComputed(function() {
		return viewModel.statusKey() === null
			? null
			: viewModel.lookups.serviceCaseStatuses.$array.find(function(x) {
				return x.Key === viewModel.statusKey();
			});
	});
	viewModel.lookups = {
		serviceCaseStatuses: { $tableName: "CrmService_ServiceCaseStatus" }
	};
	viewModel.errors = window.ko.validation.group(viewModel);
};
namespace("Crm.Service.ViewModels").ServiceCaseSetStatusModalViewModel.prototype.init = function () {
	var viewModel = this;
	return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups);
};
namespace("Crm.Service.ViewModels").ServiceCaseSetStatusModalViewModel.prototype.setStatus =
	function(serviceCases, status) {
		serviceCases = serviceCases.map(function(serviceCase) {
			return window.Helper.Database.getDatabaseEntity(serviceCase);
		});
		serviceCases.forEach(function(serviceCase) {
			window.database.attachOrGet(serviceCase);
		});
		window.Helper.ServiceCase.setStatus(serviceCases, status);
		return window.database.saveChanges();
	};
namespace("Crm.Service.ViewModels").ServiceCaseSetStatusModalViewModel.prototype.submit = function() {
	var viewModel = this;
	if (viewModel.errors().length > 0) {
		viewModel.errors.showAllMessages();
		return;
	}
	viewModel.errors.showAllMessages(false);
	viewModel.loading(true);
	var d = new $.Deferred();
	if (Array.isArray(viewModel.arrayOrQueryable)) {
		d = viewModel.setStatus(viewModel.arrayOrQueryable, viewModel.status());
	} else if (viewModel.arrayOrQueryable instanceof window.$data.Queryable) {
		var pageSize = 25;
		var page = 0;
		var processNextPage = function() {
			viewModel.arrayOrQueryable
				.orderBy(function(x) { return x.Id; })
				.skip(page * pageSize)
				.take(pageSize)
				.toArray()
				.then(function(serviceCases) {
					viewModel.setStatus(serviceCases, viewModel.status()).then(function() {
						if (serviceCases.length === pageSize) {
							page++;
							processNextPage();
						} else {
							d.resolve();
						}
					}).fail(d.reject);
				});
		};
		processNextPage();
	}
	d.then(function() {
		$(".modal:visible").modal("hide");
	});
};