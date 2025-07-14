///<reference path="../../../../Content/@types/index.d.ts" />
import {namespace} from "../../../../Content/ts/namespace";

export class InstallationDetailsNotesTabViewModel extends window.Main.ViewModels.ContactDetailsNotesTabViewModel {
	constructor(parentViewModel: any) {
		super();
		this.contactId(parentViewModel.installation().Id());
		this.contactType("Installation");
		this.minDate(parentViewModel.installation().CreateDate());
		this.plugin("Crm.Service");
	}
}

namespace("Crm.Service.ViewModels").InstallationDetailsNotesTabViewModel = InstallationDetailsNotesTabViewModel;

window.Helper.RelatedContact.addRelatedContact("Installation",
	function(contactId) {
		return window.database.CrmService_ServiceCase
			.filter(function(it) { return it.AffectedInstallationKey === this.contactId; }, { contactId: contactId })
			.map("it.Id");
	});
window.Helper.RelatedContact.addRelatedContact("Installation",
	function(contactId) {
		return window.database.CrmService_ServiceOrderHead
			.filter(function(it) { return it.InstallationId === this.contactId; }, { contactId: contactId })
			.map("it.Id");
	});
window.Helper.RelatedContact.addRelatedContact("Installation",
	function(contactId) {
		return window.database.CrmService_ServiceOrderTime
			.filter(function(it) { return it.InstallationId === this.contactId; }, { contactId: contactId })
			.map("it.OrderId");
	});