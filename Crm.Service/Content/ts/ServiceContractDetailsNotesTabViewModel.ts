///<reference path="../../../../Content/@types/index.d.ts" />
import {namespace} from "../../../../Content/ts/namespace";

export class ServiceContractDetailsNotesTabViewModel extends window.Main.ViewModels.ContactDetailsNotesTabViewModel {
	constructor(parentViewModel: any) {
		super();
		this.contactId(parentViewModel.serviceContract().Id());
		this.contactType("ServiceContract");
		this.minDate(parentViewModel.serviceContract().CreateDate());
		this.plugin("Crm.Service");
	}
}

namespace("Crm.Service.ViewModels").ServiceContractDetailsNotesTabViewModel = ServiceContractDetailsNotesTabViewModel;