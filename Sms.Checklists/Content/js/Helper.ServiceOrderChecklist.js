class HelperServiceOrderChecklist {
	static getTitle(serviceOrderChecklist) {
		let title = Helper.DynamicForm.getTitle(serviceOrderChecklist.DynamicForm);
		const serviceOrderTime = ko.unwrap(serviceOrderChecklist.ServiceOrderTime);
		if (serviceOrderTime) {
			title += " (";
			title += [ko.unwrap(serviceOrderTime.PosNo), ko.unwrap(serviceOrderTime.ItemNo), ko.unwrap(serviceOrderTime.Description)]
				.filter(Boolean).join(" - ");
			title += ")";
		}
		return title;
	}

	static mapForSelect2Display(serviceOrderChecklist) {
		return {
			id: serviceOrderChecklist.Id,
			item: serviceOrderChecklist,
			text: Helper.ServiceOrderChecklist.getTitle(serviceOrderChecklist)
		};
	}

	static hasPendingServiceCase() {
		return window.database.stateManager.trackedEntities.some(function (entity) {
			return entity.data.constructor.name === "CrmService_ServiceCase";
		});
	}

	static hasPendingFormResponse() {
		return window.database.stateManager.trackedEntities.some(function (entity) {
			return entity.data.constructor.name === "CrmDynamicForms_DynamicFormResponse";
		});
	}

	static serviceCaseIsDraft(serviceCase) {
		return window.database.stateManager.trackedEntities.some(function (entity) {
			return entity.data.Id === serviceCase.Id;
		});
	}
}

(window.Helper = window.Helper || {}).ServiceOrderChecklist = HelperServiceOrderChecklist;