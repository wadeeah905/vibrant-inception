///<reference path="../../../../Content/@types/index.d.ts" />
import { namespace } from "../../../../Content/ts/namespace";

class StoreEditModalViewModel extends window.Main.ViewModels.ViewModelBase {

	loading = ko.observable<boolean>(true);
	store = ko.observable<Crm.Service.Rest.Model.ObservableCrmService_Store>(null);
	isNew = ko.observable<boolean>(true);
	errors = ko.validation.group(this.store, { deep: true });

	constructor() {
		super();
	}

	async init(id: string): Promise<void> {
		let targetStore;
		if (id) {
			targetStore = await window.database.CrmService_Store.find(id);
			window.database.attachOrGet(targetStore);
			this.isNew(false);
		} else {
			targetStore = window.database.CrmService_Store.defaultType.create();
			window.database.add(targetStore);
		}
		this.store(targetStore.asKoObservable());
	}

	cancel(): void {
		window.database.detach(this.store().innerInstance);
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
			if (this.isNew) {
				window.location.hash = "/Crm.Service/Store/DetailsTemplate/" + this.store().Id();
			} else {
				$(".modal:visible").modal("hide");
				this.loading(false);
			}
		} catch (e) {
			this.loading(false);
			window.swal(window.Helper.String.getTranslatedString("UnknownError"), window.Helper.String.getTranslatedString("Error_InternalServerError"), "error");
		}
	}

}
namespace("Crm.Service.ViewModels").StoreEditModalViewModel = StoreEditModalViewModel;

