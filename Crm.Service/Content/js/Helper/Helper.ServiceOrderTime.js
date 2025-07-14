class HelperServiceOrderTime {

	static async calculateEstimatedDuration(serviceOrderTimeId, serviceOrderTimePostingIdToSkip, additionalDuration) {
		let serviceOrderTime = await window.database.CrmService_ServiceOrderTime.find(serviceOrderTimeId);
		window.database.attachOrGet(serviceOrderTime);
		let plannedDurations = await window.database.CrmService_ServiceOrderTimePosting
			.filter("it.ServiceOrderTimeId === this.serviceOrderTimeId && it.Id !== this.id", {
				serviceOrderTimeId: serviceOrderTimeId,
				id: serviceOrderTimePostingIdToSkip
			})
			.map("it.PlannedDuration")
			.toArray();
		plannedDurations.push(additionalDuration);
		serviceOrderTime.EstimatedDuration = plannedDurations.filter(Boolean).reduce(function (sum, plannedDuration) {
			return sum.add(window.moment.duration(plannedDuration));
		}, window.moment.duration()).toString();
	}

	/** @returns {string[]} */
	static getAutocompleteColumns() {
		return ["PosNo", "ItemNo", "Description", "Installation.InstallationNo", "Installation.Description"];
	}

	/** @returns {string} */
	static getAutocompleteDisplay(serviceOrderTime, currentServiceOrderTimeId) {
		let result = "";
		serviceOrderTime = Helper.Database.getDatabaseEntity(serviceOrderTime);
		if (serviceOrderTime.PosNo) {
			result += serviceOrderTime.PosNo + ": ";
		}
		if (serviceOrderTime.ItemNo) {
			result += serviceOrderTime.ItemNo + " - ";
		}
		if (serviceOrderTime.Description) {
			result += serviceOrderTime.Description;
		}
		if (serviceOrderTime.Description && serviceOrderTime.Installation) {
			result += " - ";
		}
		if (serviceOrderTime.Installation) {
			result += serviceOrderTime.Installation.InstallationNo + " - " + serviceOrderTime.Installation.Description;
		}
		if (serviceOrderTime.Id === currentServiceOrderTimeId) {
			result += " (" + window.Helper.String.getTranslatedString("CurrentServiceOrderTime") + ")";
		}
		return result;
	}

	/** @returns {string[]} */
	static getAutocompleteJoins() {
		return ["Installation"];
	}

	/** @returns {{item, id: string, text: string}} */
	static mapForSelect2Display(serviceOrderTime) {
		return {
			id: serviceOrderTime.Id,
			item: serviceOrderTime,
			text: [serviceOrderTime.PosNo, serviceOrderTime.ItemNo, serviceOrderTime.Description].filter(Boolean)
				.join(" - ")
		};
	}
}

(window.Helper = window.Helper || {}).ServiceOrderTime = HelperServiceOrderTime;