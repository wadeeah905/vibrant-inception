namespace("Crm.Service.ViewModels").ServiceContractInstallationRelationshipEditModalViewModel = function () {
	window.Main.ViewModels.BaseRelationshipEditModalViewModel.apply(this, arguments);
	var viewModel = this;
	viewModel.table = window.database.CrmService_ServiceContractInstallationRelationship;
	viewModel.serviceContract = window.ko.observable(null);
};
namespace("Crm.Service.ViewModels").ServiceContractInstallationRelationshipEditModalViewModel.prototype = Object.create(window.Main.ViewModels.BaseRelationshipEditModalViewModel.prototype);
namespace("Crm.Service.ViewModels").ServiceContractInstallationRelationshipEditModalViewModel.prototype.getQueryForEditing = function () {
	return window.database.CrmService_ServiceContractInstallationRelationship
		.include("Child");
};
namespace("Crm.Service.ViewModels").ServiceContractInstallationRelationshipEditModalViewModel.prototype.getEditableId = function (relationship) {
	return relationship.ChildId;
};
namespace("Crm.Service.ViewModels").ServiceContractInstallationRelationshipEditModalViewModel.prototype.getAutoCompleterOptions = function () {
	var viewModel = this;
	return {
		customFilter: function(query, term) {
			if (term) {
				query = query.filter(function(it) {
						return it.InstallationNo.contains(this.term) === true ||
							it.Description.contains(this.term) === true;
					},
					{ term: term });
			}
			if (window.Crm.Service.Settings.ServiceContract.OnlyInstallationsOfReferencedCustomer) {
				query = query.filter(function(it) {
						return it.LocationContactId === this.ParentId;
					},
					{ ParentId: viewModel.serviceContract().ParentId });
			}
			if (viewModel.serviceContract().ServiceObjectId) {
				query = query.filter(function(it) {
						return it.FolderId === this.ServiceObjectId;
					},
					{ ServiceObjectId: viewModel.serviceContract().ServiceObjectId });
			}
			return query;
		},
		mapDisplayObject: window.Helper.Installation.mapForSelect2Display,
		orderBy: ["InstallationNo", "Description"],
		table: "CrmService_Installation"
	};
};
namespace("Crm.Service.ViewModels").ServiceContractInstallationRelationshipEditModalViewModel.prototype.getAutoCompleterCaption = function () {
	return "Installation";
};
namespace("Crm.Service.ViewModels").ServiceContractInstallationRelationshipEditModalViewModel.prototype.createNewEntity = function () {
	var relationship = window.Main.ViewModels.BaseRelationshipEditModalViewModel.prototype.createNewEntity.apply(this, arguments);
	relationship.ParentId = this.contactId();
	return relationship;
};
namespace("Crm.Service.ViewModels").ServiceContractInstallationRelationshipEditModalViewModel.prototype.showRelationshipTab = function () {
	$(".tab-nav a[href='#tab-installations']").tab("show");
};
namespace("Crm.Service.ViewModels").ServiceContractInstallationRelationshipEditModalViewModel.prototype.init = function(id, params) {
	var viewModel = this;
	return window.Main.ViewModels.BaseRelationshipEditModalViewModel.prototype.init.apply(this, arguments)
		.then(function() {
			return window.database.CrmService_ServiceContract.find(viewModel.contactId())
				.then(function(result) {
					viewModel.serviceContract(result);
				});
		});
};