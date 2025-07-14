///<reference path="../../../../Content/@types/index.d.ts" />
import {namespace} from "../../../../Content/ts/namespace";

export class VisitDetailsNotesTabViewModel extends window.Main.ViewModels.ContactDetailsNotesTabViewModel {
	constructor(parentViewModel: any) {
		super();
		this.contactId(parentViewModel.visit().Id());
		this.contactType("Visit");
		this.minDate(parentViewModel.visit().CreateDate());
		this.plugin("Crm.VisitReport");
	}
}

namespace("Crm.VisitReport.ViewModels").VisitDetailsNotesTabViewModel = VisitDetailsNotesTabViewModel;