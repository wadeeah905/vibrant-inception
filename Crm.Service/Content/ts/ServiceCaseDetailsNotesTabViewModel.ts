///<reference path="../../../../Content/@types/index.d.ts" />
import {namespace} from "../../../../Content/ts/namespace";

export class ServiceCaseDetailsNotesTabViewModel extends window.Main.ViewModels.ContactDetailsNotesTabViewModel {
	constructor(parentViewModel: any) {
		super();
		this.contactId(parentViewModel.serviceCase().Id());
		this.contactType("ServiceCase");
		this.minDate(parentViewModel.serviceCase().CreateDate());
		this.plugin("Crm.Service");
	}
}

namespace("Crm.Service.ViewModels").ServiceCaseDetailsNotesTabViewModel = ServiceCaseDetailsNotesTabViewModel;