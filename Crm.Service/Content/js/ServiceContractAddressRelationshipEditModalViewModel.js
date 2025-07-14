namespace("Crm.Service.ViewModels").ServiceContractAddressRelationshipEditModalViewModel = function() {
	window.Main.ViewModels.BaseRelationshipEditModalViewModel.apply(this, arguments);
	var viewModel = this;
	viewModel.table = window.database.CrmService_ServiceContractAddressRelationship;
	viewModel.lookups = {
		serviceContractAddressRelationshipTypes: { $tableName: "CrmService_ServiceContractAddressRelationshipType" }
	};
	viewModel.relationshipTypeLookup = viewModel.lookups.serviceContractAddressRelationshipTypes;
};
namespace("Crm.Service.ViewModels").ServiceContractAddressRelationshipEditModalViewModel.prototype =
	Object.create(window.Main.ViewModels.BaseRelationshipEditModalViewModel.prototype);
namespace("Crm.Service.ViewModels").ServiceContractAddressRelationshipEditModalViewModel.prototype.init =
	function(id, params) {
		var viewModel = this;
		return window.Main.ViewModels.BaseRelationshipEditModalViewModel.prototype.init.apply(this, arguments)
			.then(function() {
				return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups);
			});
	};
namespace("Crm.Service.ViewModels").ServiceContractAddressRelationshipEditModalViewModel.prototype.getQueryForEditing =
	function() {
		return window.database.CrmService_ServiceContractAddressRelationship
			.include("Child");
	};
namespace("Crm.Service.ViewModels").ServiceContractAddressRelationshipEditModalViewModel.prototype.getEditableId =
	function(relationship) {
		return relationship.ChildId;
	};
namespace("Crm.Service.ViewModels").ServiceContractAddressRelationshipEditModalViewModel.prototype
	.getAutoCompleterOptions = function() {
		return {
			table: "Main_Address",
			orderBy: ["Name1", "Name2", "Name3", "ZipCode", "City", "Street"],
			mapDisplayObject: window.Helper.Address.mapForSelect2Display,
			customFilter: window.Helper.Address.getSelect2Filter,
			key: "Id"
		};
	};
namespace("Crm.Service.ViewModels").ServiceContractAddressRelationshipEditModalViewModel.prototype
	.getAutoCompleterCaption = function() {
		return "Address";
	};
namespace("Crm.Service.ViewModels").ServiceContractAddressRelationshipEditModalViewModel.prototype.createNewEntity =
	function() {
		var relationship =
			window.Main.ViewModels.BaseRelationshipEditModalViewModel.prototype.createNewEntity.apply(this, arguments);
		relationship.ParentId = this.contactId();
		return relationship;
	};