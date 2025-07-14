///<reference path="../../../../Content/@types/index.d.ts" />
import { namespace } from "../../../../Content/ts/namespace";

class StoreListIndexViewModel extends window.Main.ViewModels.GenericListViewModel {

	locations: KnockoutObservable<any> = ko.observable({});

	constructor() {
		super("CrmService_Store", ["Name"], ["ASC"], ["Locations"]);
	}

	async init(args): Promise<void> {
		await super.init(args);
	}

	async deleteStore(store): Promise<void> {
		try {
			await window.Helper.Confirm.confirmDelete();
			let targetedLocations = await window.database.CrmService_Location
				.filter("it.StoreId === this.storeId", { storeId: store.Id() })
				.toArray();
			targetedLocations.forEach(async (targetedLocation) => {
				await window.database.remove(targetedLocation);
			});
			let entity = await window.Helper.Database.getDatabaseEntity(store);
			window.database.remove(entity);
			await window.database.saveChanges();
			this.loading(false);
		} catch (e) {
			this.loading(false);
			window.swal(window.Helper.String.getTranslatedString("UnknownError"), window.Helper.String.getTranslatedString("Error_InternalServerError"), "error");
		}

	}

}
namespace("Crm.Service.ViewModels").StoreListIndexViewModel = StoreListIndexViewModel;

