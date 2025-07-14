///<reference path="../../../../Content/@types/index.d.ts" />
import { namespace } from "../../../../Content/ts/namespace";

class StoreDetailsLocationsTabViewModel extends window.Main.ViewModels.GenericListViewModel {

	loading: KnockoutObservable<boolean> = ko.observable<boolean>(true);
	store: KnockoutObservable<any> = ko.observable(null);

	constructor(parentViewModel) {
		super("CrmService_Location", ["LocationNo"], ["ASC"]);
		this.store = parentViewModel.store;
		this.getFilter("StoreId").extend({ filterOperator: "===" })(this.store().Id());
		this.infiniteScroll(true);
	}

	async init(args): Promise<void> {
		await super.init(args);
	}

}
namespace("Crm.Service.ViewModels").StoreDetailsLocationsTabViewModel = StoreDetailsLocationsTabViewModel;

