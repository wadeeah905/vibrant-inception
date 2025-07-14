///<reference path="../../../../Content/@types/index.d.ts" />
import { Breadcrumb } from "../../../../Content/ts/breadcrumbs";
import { namespace } from "../../../../Content/ts/namespace";

class StoreDetailsViewModel extends window.Main.ViewModels.ViewModelBase {

	loading: KnockoutObservable<boolean> = ko.observable<boolean>(true);
	tabs: KnockoutObservable<any> = ko.observable({});
	store: KnockoutObservable<Crm.Service.Rest.Model.ObservableCrmService_Store> = ko.observable(null);

	constructor() {
		super();
	}

	async init(id: string): Promise<void> {
		let targetStore = await window.database.CrmService_Store.find(id);
		this.store(targetStore.asKoObservable());
		await this.setBreadcrumbs();
	}

	async deleteLocation(location): Promise<void> {
		await window.Helper.Confirm.confirmDelete();
		this.loading(true);
		window.database.remove(location);
		await window.database.saveChanges();
		this.loading(false);
	}

	async setBreadcrumbs() {
		await window.breadcrumbsViewModel.setBreadcrumbs([
			new Breadcrumb(window.Helper.String.getTranslatedString("Stores"), "#/Crm.Service/StoreList/IndexTemplate"),
			new Breadcrumb(this.store().Name(), window.location.hash)
		]);
	}

}
namespace("Crm.Service.ViewModels").StoreDetailsViewModel = StoreDetailsViewModel;

