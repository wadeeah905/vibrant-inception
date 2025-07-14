/// <reference path="../../../../../Content/js/ViewModels/ContactDetailsDocumentsTabViewModel.js" />
namespace("Crm.VisitReport.ViewModels").VisitDetailsDocumentsTabViewModel = function(parentViewModel) {
	window.Main.ViewModels.ContactDetailsDocumentsTabViewModel.apply(this, arguments);
	this.contactId(parentViewModel.visit().Id());
	this.canAddDocument(parentViewModel.visitIsEditable());
};
namespace("Crm.VisitReport.ViewModels").VisitDetailsDocumentsTabViewModel.prototype = Object.create(window.Main.ViewModels.ContactDetailsDocumentsTabViewModel.prototype);