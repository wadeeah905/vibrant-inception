///<reference path="../../../../Content/@types/index.d.ts" />
import { namespace } from "../../../../Content/ts/namespace";

class LocationEditModalViewModel extends window.Main.ViewModels.ViewModelBase {

	loading: KnockoutObservable<boolean> = ko.observable<boolean>(true);
	location: KnockoutObservable<Crm.Service.Rest.Model.ObservableCrmService_Location> = ko.observable(null);
	store: KnockoutObservable<Crm.Service.Rest.Model.ObservableCrmService_Store> = ko.observable(null);
	errors = ko.validation.group(this.location, { deep: true });

	constructor(parentViewModel) {
		super();
		this.store = parentViewModel.store;
	}

	async init(id: string): Promise<void> {
		let targetLocation: Crm.Service.Rest.Model.CrmService_Location;
		if (id) {
			targetLocation = await window.database.CrmService_Location.find(id);
			window.database.attachOrGet(targetLocation);
		} else {
			targetLocation = window.database.CrmService_Location.defaultType.create();
			targetLocation.StoreId = this.store().Id();
			window.database.add(targetLocation);
		}
		this.location(targetLocation.asKoObservable());
	}

	cancel(): void {
		window.database.detach(this.location().innerInstance);
		$(".modal:visible").modal("hide");
	}

	async save(): Promise<void> {
		try {
			this.loading(true);
			if (this.errors().length > 0) {
				this.loading(false);
				this.errors.showAllMessages();
				this.errors.scrollToError();
				return;
			}
			await window.database.saveChanges();
			$(".modal:visible").modal("hide");
		} catch (e) {
			this.loading(false);
			window.swal(window.Helper.String.getTranslatedString("UnknownError"), window.Helper.String.getTranslatedString("Error_InternalServerError"), "error");
		}
	}

}
namespace("Crm.Service.ViewModels").LocationEditModalViewModel = LocationEditModalViewModel;

