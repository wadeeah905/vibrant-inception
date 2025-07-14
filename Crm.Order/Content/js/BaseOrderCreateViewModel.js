namespace("Crm.Order.ViewModels").BaseOrderCreateViewModel = function() {
	var viewModel = this;
	viewModel.loading = window.ko.observable(false);
	viewModel.addresses = window.ko.observableArray([]);
	viewModel.baseOrder = window.ko.observable(null);
	viewModel.errors = window.ko.validation.group(viewModel.baseOrder, { deep: true });
	viewModel.orderCategories = window.ko.observableArray([]);
	viewModel.orderEntryTypes = window.ko.observableArray([]);
	viewModel.user = window.ko.observable(null);
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
		return query.filter(function(x) {
			return x.IsRetired === false;
		});
	};
	viewModel.onPersonSelect = function(person) {
		viewModel.baseOrder().ContactId(person.ParentId);
	};
	viewModel.lookups = {
		addressTypes: { $tableName: "Main_AddressType" },
		regions: { $tableName: "Main_Region" },
		countries: { $tableName: "Main_Country" },
		currencies: { $tableName: "Main_Currency" },
		orderCategories: { $tableName: "CrmOrder_OrderCategory" },
		orderEntryTypes: { $tableName: "CrmOrder_OrderEntryType" }
	};
};
namespace("Crm.Order.ViewModels").BaseOrderCreateViewModel.prototype.init = async function (id, params) {
	const viewModel = this;
	const user = await window.Helper.User.getCurrentUser();
	viewModel.user(user);
	viewModel.baseOrder().ContactId.subscribe(async function (companyId) {
		if (companyId) {
			await window.database.Main_Address
				.filter(function (x) {
					return x.CompanyId === this.companyId;
				}, {companyId: companyId})
				.toArray(viewModel.addresses);
			const standardAddress = window.ko.utils.arrayFirst(viewModel.addresses(), function (address) {
				return address.IsCompanyStandardAddress();
			});
			const standardAddressId = standardAddress ? standardAddress.Id() : null;
			viewModel.baseOrder().BillingAddressId(viewModel.baseOrder().BillingAddressId() || standardAddressId);
			viewModel.baseOrder().DeliveryAddressId(viewModel.baseOrder().DeliveryAddressId() || standardAddressId);
		} else {
			viewModel.addresses([]);
		}
	});
	let oldContactId = viewModel.baseOrder().ContactId();
	viewModel.baseOrder().ContactId.subscribe(function (value) {
		if (oldContactId) {
			viewModel.baseOrder().ContactPersonId(null);
		}
		oldContactId = value;
	});
	if (params.companyId) {
		viewModel.baseOrder().ContactId(params.companyId);
	}
	await window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups);
	viewModel.baseOrder().CurrencyKey(window.Helper.Lookup.getDefaultLookupValueSingleSelect(viewModel.lookups.currencies, viewModel.baseOrder().CurrencyKey()));
	viewModel.baseOrder().OrderCategoryKey(window.Helper.Lookup.getDefaultLookupValueSingleSelect(viewModel.lookups.orderCategories, viewModel.baseOrder().OrderCategoryKey()));
	viewModel.baseOrder().OrderEntryType(window.Helper.Lookup.getDefaultLookupValueSingleSelect(viewModel.lookups.orderEntryTypes, viewModel.baseOrder().OrderEntryType()));
};
namespace("Crm.Order.ViewModels").BaseOrderCreateViewModel.prototype.addressDisplay = function(address) {
	var addressParts = [];
	if (!!address.Name1()) {
		addressParts.push(address.Name1());
	}
	if (!!address.Street()) {
		addressParts.push(address.Street());
	}
	if (!!address.ZipCode() || !!address.City()) {
		addressParts.push((address.ZipCode() || "") + " " + (address.City() || ""));
	}
	return addressParts.map(function(x) { return x.trim(); }).join(", ");
};
namespace("Crm.Order.ViewModels").BaseOrderCreateViewModel.prototype.cancel = function() {
	window.database.detach(this.baseOrder().innerInstance);
	window.history.back();
};
namespace("Crm.Order.ViewModels").BaseOrderCreateViewModel.prototype.getDefaultPrivateDescription = function() {
	return window.Globalize.formatDate(new Date());
};
namespace("Crm.Order.ViewModels").BaseOrderCreateViewModel.prototype.submit = function() {
	var viewModel = this;
	viewModel.loading(true);
	if (viewModel.errors().length > 0) {
		viewModel.loading(false);
		viewModel.errors.showAllMessages();
		return new $.Deferred().reject().promise();
	}
	return window.database.saveChanges();
};
