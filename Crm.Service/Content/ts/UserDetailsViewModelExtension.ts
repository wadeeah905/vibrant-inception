///<reference path="../../../../../Crm.Web/Content/@types/index.d.ts"/>
import { namespace } from "../../../../Content/ts/namespace";

export default class UserDetailsViewModelExtension extends window.Main.ViewModels.UserDetailsViewModel {

	constructor() {
		super();
		this.lookups.skills = { $tableName: "Main_Skill", $array: undefined }
	}

	getSkillsFromKeys(keys) {
		return this.lookups.skills.$array
			.filter(x => keys.indexOf(x.Key) !== -1)
			.map(window.Helper.Lookup.mapLookupForSelect2Display);
	};

	locationFilter(query, term: string, storeNo?: string) {
		if (storeNo) {
			query = query.filter('it.Store.StoreNo == this.storeNo', {storeNo: storeNo});
		}
		if (term) {
			query = query.filter('it.LocationNo.contains(this.term)', {term: term});
		}
		return query;
	};

	onStoreSelect = async function (userExtensionValues, store: Crm.Service.Rest.Model.CrmService_Store) {
		this.loading(true);
		if (store == null || store.Locations.length == 0 || store.Locations.map(x => x.LocationNo).indexOf(userExtensionValues.DefaultLocationNo()) === -1) {
			userExtensionValues.DefaultLocationNo(null);
		} else if (store.Locations.length == 1) {
			userExtensionValues.DefaultLocationNo(store.Locations[0].LocationNo);
		}
		this.loading(false);
	};
}
namespace("Main.ViewModels").UserDetailsViewModel = UserDetailsViewModelExtension;
