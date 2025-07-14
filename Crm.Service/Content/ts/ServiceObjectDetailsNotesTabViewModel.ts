///<reference path="../../../../Content/@types/index.d.ts" />
import {namespace} from "../../../../Content/ts/namespace";

export class ServiceObjectDetailsNotesTabViewModel extends window.Main.ViewModels.ContactDetailsNotesTabViewModel {
	constructor(parentViewModel: any) {
		super();
		this.contactId(parentViewModel.serviceObject().Id());
		this.contactType("ServiceObject");
		this.minDate(parentViewModel.serviceObject().CreateDate());
		this.plugin("Crm.Service");
	}
}

namespace("Crm.Service.ViewModels").ServiceObjectDetailsNotesTabViewModel = ServiceObjectDetailsNotesTabViewModel;