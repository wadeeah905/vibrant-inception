namespace("Crm.Service.ViewModels").InstallationDetailsRelationshipsTabViewModel = function(parentViewModel) {
	var viewModel = this;
	window.Main.ViewModels.GenericListViewModel.call(viewModel,
		"CrmService_InstallationAddressRelationship",
		[
			"RelationshipTypeKey", "Child.Name1", "Child.Name2", "Child.Name3", "Child.ZipCode", "Child.City",
			"Child.Street"
		],
		["ASC", "ASC", "ASC", "ASC", "ASC", "ASC", "ASC"],
		["Child"]);
	viewModel.getFilter("ParentId").extend({ filterOperator: "===" })(parentViewModel.installation().Id());
	viewModel.items.distinct("RelationshipTypeKey");
	viewModel.lookups = {
		installationAddressRelationshipTypes: { $tableName: "CrmService_InstallationAddressRelationshipType" }
	};
};
namespace("Crm.Service.ViewModels").InstallationDetailsRelationshipsTabViewModel.prototype =
	Object.create(window.Main.ViewModels.GenericListViewModel.prototype);
namespace("Crm.Service.ViewModels").InstallationDetailsRelationshipsTabViewModel.prototype.init = function() {
	var args = arguments;
	var viewModel = this;
	return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups)
		.then(function() {
			return window.Main.ViewModels.GenericListViewModel.prototype.init.apply(viewModel, args);
		});
};
namespace("Crm.Service.ViewModels").InstallationDetailsRelationshipsTabViewModel.prototype.deleteRelationship =
	window.Main.ViewModels.BaseRelationshipsTabViewModel.prototype.deleteRelationship;
namespace("Crm.Service.ViewModels").InstallationDetailsRelationshipsTabViewModel.prototype.getItemGroup =
	function(installationAddressRelationship) {
		var viewModel = this;
		var relationshipTypeKey = installationAddressRelationship.RelationshipTypeKey();
		return {
			title: window.Helper.Lookup.getLookupValue(viewModel.lookups.installationAddressRelationshipTypes,
				relationshipTypeKey)
		};
	};
namespace("Crm.Service.ViewModels").InstallationDetailsRelationshipsTabViewModel.prototype.getInverseRelationship =
	function() {
		return new $.Deferred().resolve(null).promise();
	};