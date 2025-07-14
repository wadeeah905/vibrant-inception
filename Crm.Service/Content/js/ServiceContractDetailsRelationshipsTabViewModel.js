namespace("Crm.Service.ViewModels").ServiceContractDetailsRelationshipsTabViewModel = function(parentViewModel) {
	var viewModel = this;
	window.Main.ViewModels.GenericListViewModel.call(viewModel,
		"CrmService_ServiceContractAddressRelationship",
		[
			"RelationshipTypeKey", "Child.Name1", "Child.Name2", "Child.Name3", "Child.ZipCode", "Child.City",
			"Child.Street"
		],
		["ASC", "ASC", "ASC", "ASC", "ASC", "ASC", "ASC"],
		["Child"]);
	viewModel.getFilter("ParentId").extend({ filterOperator: "===" })(parentViewModel.serviceContract().Id());
	viewModel.items.distinct("RelationshipTypeKey");
	viewModel.lookups = {
		serviceContractAddressRelationshipTypes: { $tableName: "CrmService_ServiceContractAddressRelationshipType" }
	};
};
namespace("Crm.Service.ViewModels").ServiceContractDetailsRelationshipsTabViewModel.prototype =
	Object.create(window.Main.ViewModels.GenericListViewModel.prototype);
namespace("Crm.Service.ViewModels").ServiceContractDetailsRelationshipsTabViewModel.prototype.init = function() {
	var args = arguments;
	var viewModel = this;
	return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups)
		.then(function() {
			return window.Main.ViewModels.GenericListViewModel.prototype.init.apply(viewModel, args);
		});
};
namespace("Crm.Service.ViewModels").ServiceContractDetailsRelationshipsTabViewModel.prototype.deleteRelationship =
	window.Main.ViewModels.BaseRelationshipsTabViewModel.prototype.deleteRelationship;
namespace("Crm.Service.ViewModels").ServiceContractDetailsRelationshipsTabViewModel.prototype.getInverseRelationship =
	function() {
		return new $.Deferred().resolve(null).promise();
	};
namespace("Crm.Service.ViewModels").ServiceContractDetailsRelationshipsTabViewModel.prototype.getItemGroup =
	function(serviceContractAddressRelationship) {
		var viewModel = this;
		var relationshipTypeKey = serviceContractAddressRelationship.RelationshipTypeKey();
		return {
			title: window.Helper.Lookup.getLookupValue(viewModel.lookups.serviceContractAddressRelationshipTypes,
				relationshipTypeKey)
		};
	};