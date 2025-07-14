class HelperServiceObject {
	static getCategoryAbbreviation(serviceObject, serviceObjectCategories) {
		serviceObject = ko.unwrap(serviceObject || {});
		const serviceObjectCategoryKey = ko.unwrap(serviceObject.CategoryKey);
		if (serviceObjectCategoryKey) {
			const serviceObjectCategory = (serviceObjectCategories || {})[serviceObjectCategoryKey];
			if (serviceObjectCategory && serviceObjectCategory.Value) {
				return serviceObjectCategory.Value[0];
			}
		}
		return "";
	}

	/** @returns {string} */
	static getDisplayName(serviceObject) {
		if (!serviceObject) {
			return "";
		}
		return [ko.unwrap(serviceObject.ObjectNo), ko.unwrap(serviceObject.Name)].filter(Boolean).join(" - ");
	}

	static mapForSelect2Display(serviceObject) {
		return {
			id: serviceObject.Id,
			item: serviceObject,
			text: Helper.ServiceObject.getDisplayName(serviceObject)
		};
	}
}

(window.Helper = window.Helper || {}).ServiceObject = HelperServiceObject;