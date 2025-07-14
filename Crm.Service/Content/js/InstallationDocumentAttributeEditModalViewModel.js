namespace("Crm.Service.ViewModels").InstallationDocumentAttributeEditModalViewModel = function() {
	window.Main.ViewModels.BaseDocumentAttributeEditModalViewModel.apply(this, arguments);
};
namespace("Crm.Service.ViewModels").InstallationDocumentAttributeEditModalViewModel.prototype =
	Object.create(window.Main.ViewModels.BaseDocumentAttributeEditModalViewModel.prototype);
namespace("Crm.Service.ViewModels").InstallationDocumentAttributeEditModalViewModel.prototype.init =
	function(id, params) {
		var viewModel = this;
		return window.Main.ViewModels.BaseDocumentAttributeEditModalViewModel.prototype.init.apply(this, arguments)
			.then(function() {
				if (!id) {
					viewModel.documentAttribute().ReferenceKey(params.contactId);
					viewModel.documentAttribute().ReferenceType(0);
				}
			});
	};