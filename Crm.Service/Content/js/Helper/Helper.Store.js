class HelperStore {
	static getStoreNameAbbrevation(StoreName) {
		return StoreName.substring(0, 1);
	}
	
	static mapForSelect2Display(store) {
		return {
			id: store.Id,
			item: store,
			text: store.StoreNo + ' - ' + store.Name
		};
	}
}

(window.Helper = window.Helper || {}).Store = HelperStore;
