///<reference path="../../../../Content/@types/index.d.ts" />
export default function accountUserProfileViewModelExtensions() {
	window.Main.ViewModels.AccountUserProfileViewModel.prototype.locationFilter = function (query, term, storeNo = null) {
		if (storeNo) {
			query = query.filter('it.Store.StoreNo == this.storeNo', {storeNo: storeNo});
		}
		if (term) {
			query = query.filter('it.LocationNo.contains(this.term)', {term: term});
		}
		return query;
	};
	window.Main.ViewModels.AccountUserProfileViewModel.prototype.onStoreSelect = async function (userExtensionValues, store: Crm.Service.Rest.Model.CrmService_Store) {
		this.loading(true);
		if (store == null || store.Locations.length == 0 || store.Locations.map(x => x.LocationNo).indexOf(userExtensionValues.DefaultLocationNo()) === -1) {
			userExtensionValues.DefaultLocationNo(null);
		} else if (store.Locations.length == 1) {
			userExtensionValues.DefaultLocationNo(store.Locations[0].LocationNo);
		}
		this.loading(false);
	};
};