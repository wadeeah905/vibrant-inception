///<reference path="../../../../Content/@types/index.d.ts" />
import {namespace} from "../../../../Content/ts/namespace";

export class ServiceOrderDetailsNotesTabViewModel extends window.Main.ViewModels.ContactDetailsNotesTabViewModel {
	parentViewModel: any;

	constructor(parentViewModel: any) {
		super();
		this.contactId(parentViewModel.serviceOrder().Id());
		this.contactType("ServiceOrder");
		this.minDate(parentViewModel.serviceOrder().CreateDate());
		this.plugin("Crm.Service");
		this.parentViewModel = parentViewModel;
		delete this.filters.ContactId;
	}

	applyFilters(query) {
		var viewModel = this;
		var query = super.applyFilters(query);
		query = query.filter(function (it) {
				return it.ContactId === this.serviceOrderId ||
					(this.serviceOrderTemplateId !== null &&
						it.ContactId === this.serviceOrderTemplateId &&
						it.IsSystemGenerated === false);
			},
			{
				serviceOrderId: viewModel.parentViewModel.serviceOrder().Id(),
				serviceOrderTemplateId: viewModel.parentViewModel.serviceOrder().ServiceOrderTemplateId()
			});
		return query;
	};
}

namespace("Crm.Service.ViewModels").ServiceOrderDetailsNotesTabViewModel = ServiceOrderDetailsNotesTabViewModel;