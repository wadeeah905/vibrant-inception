namespace("Crm.Order.ViewModels").BaseOrderSaveModalViewModel = function(parentViewModel) {
	var viewModel = this;
	viewModel.loading = window.ko.observable(false);
	viewModel.addresses = window.ko.observableArray([]);
	viewModel.baseOrderId = parentViewModel.baseOrder().Id();
	viewModel.baseOrder = window.ko.observable(parentViewModel.baseOrder().innerInstance.entityState === window.$data.EntityState.Added ? parentViewModel.baseOrder() : null);
	viewModel.errors = window.ko.validation.group(viewModel.baseOrder, { deep: true });
	viewModel.totalPrice = parentViewModel.totalPrice;
	viewModel.parentViewModel = parentViewModel;
	viewModel.personAutocompleteFilter = function(query,term) {
		var contactId = viewModel.baseOrder().ContactId();
		if (contactId) {
			query = query.filter(function(x) {
				return x.ParentId === this.parentId;
			}, { parentId: viewModel.baseOrder().ContactId() });
		}
		if (term) {
			query = query.filter('it.Surname.toLowerCase().contains(this.term)||it.Firstname.toLowerCase().contains(this.term)', { term: term });
		}
		return query.filter(function (x) {
			return x.IsRetired === false;
		});
	};
	viewModel.onPersonSelect = function (person) {
		if (person) {
			viewModel.baseOrder().ContactId(person.ParentId);
		}
		viewModel.parentViewModel.contactPerson(person);
	};
	viewModel.lookups = {
		addressTypes: { $tableName: "Main_AddressType" },
		regions: { $tableName: "Main_Region" },
		countries: { $tableName: "Main_Country" }
	};
};
namespace("Crm.Order.ViewModels").BaseOrderSaveModalViewModel.prototype.init = function() {
	var viewModel = this;
	function loadAddresses(companyId) {
		if (companyId) {
			return window.database.Main_Address
				.filter(function(x) {
						return x.CompanyId === this.companyId;
				}, { companyId: companyId })
				.toArray(function(results) {
					viewModel.addresses(results.map(function(x) { return x.asKoObservable(); }));
				});
		} else {
			viewModel.addresses([]);
		}
		return new $.Deferred().resolve().promise();
	}

	return new $.Deferred().resolve().promise()
		.then(function() {
			return loadAddresses(viewModel.baseOrder().ContactId());
		})
		.then(function() {
			if (viewModel.baseOrder().PrivateDescription() === null && window.Crm.Order.Settings.OrderPrivateDescriptionEnabled === true) {
				viewModel.baseOrder().PrivateDescription(viewModel.getDefaultPrivateDescription());
			}
			viewModel.baseOrder().ContactId.subscribe(function(contactId) {
				viewModel.baseOrder().ContactPersonId(null);
				loadAddresses(contactId);
			});
		})
		.then(function () { return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups); });
};
namespace("Crm.Order.ViewModels").BaseOrderSaveModalViewModel.prototype.getDefaultPrivateDescription = function() {
	return window.Globalize.formatDate(new Date());
};
namespace("Crm.Order.ViewModels").BaseOrderSaveModalViewModel.prototype.save = function() {
	var viewModel = this;
	viewModel.loading(true);
	if (viewModel.errors().length > 0) {
		viewModel.loading(false);
		viewModel.errors.showAllMessages();
		return;
	}
	viewModel.baseOrder().Price(viewModel.baseOrder().Price() || viewModel.totalPrice());
	window.database.saveChanges().then(function() {
		viewModel.loading(false);
		$(".modal:visible").modal("hide");
	});
};
namespace("Crm.Order.ViewModels").BaseOrderSaveModalViewModel.prototype.dispose = function() {
	if (this.baseOrder().innerInstance.entityState !== window.$data.EntityState.Added) {
		window.database.detach(this.baseOrder().innerInstance);
	}
};