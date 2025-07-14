namespace("Crm.Service.ViewModels").InstallationAddressRelationshipEditModalViewModel = function() {
	window.Main.ViewModels.BaseRelationshipEditModalViewModel.apply(this, arguments);
	var viewModel = this;
	viewModel.table = window.database.CrmService_InstallationAddressRelationship;
	viewModel.lookups = {
		installationAddressRelationshipTypes: { $tableName: "CrmService_InstallationAddressRelationshipType" }
	};
	viewModel.relationshipTypeLookup = viewModel.lookups.installationAddressRelationshipTypes;
};
namespace("Crm.Service.ViewModels").InstallationAddressRelationshipEditModalViewModel.prototype = Object.create(window.Main.ViewModels.BaseRelationshipEditModalViewModel.prototype);
namespace("Crm.Service.ViewModels").InstallationAddressRelationshipEditModalViewModel.prototype.init = function(id, params) {
	var viewModel = this;
	return window.Main.ViewModels.BaseRelationshipEditModalViewModel.prototype.init.apply(this, arguments)
		.then(function() {
			return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups);
		});
};
namespace("Crm.Service.ViewModels").InstallationAddressRelationshipEditModalViewModel.prototype.getQueryForEditing = function() {
	return window.database.CrmService_InstallationAddressRelationship
		.include("Child");
};
namespace("Crm.Service.ViewModels").InstallationAddressRelationshipEditModalViewModel.prototype.getEditableId = function(relationship) {
	return relationship.ChildId;
};
namespace("Crm.Service.ViewModels").InstallationAddressRelationshipEditModalViewModel.prototype.getAutoCompleterOptions = function() {
	return {
		table: "Main_Address",
		orderBy: ["Name1", "Name2", "Name3", "ZipCode", "City", "Street"],
		mapDisplayObject: window.Helper.Address.mapForSelect2Display,
		customFilter: window.Helper.Address.getSelect2Filter,
		key: "Id"
	};
};
namespace("Crm.Service.ViewModels").InstallationAddressRelationshipEditModalViewModel.prototype.getAutoCompleterCaption = function() {
	return "Address";
};
namespace("Crm.Service.ViewModels").InstallationAddressRelationshipEditModalViewModel.prototype.createNewEntity = function() {
	var relationship = window.Main.ViewModels.BaseRelationshipEditModalViewModel.prototype.createNewEntity.apply(this, arguments);
	relationship.ParentId = this.contactId();
	return relationship;
};