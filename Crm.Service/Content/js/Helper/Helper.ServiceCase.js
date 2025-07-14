class HelperServiceCase {
	static addServiceCasesToServiceOrder(serviceCases, serviceOrderId, serviceOrderTimeId, maxPos) {
		const results = [];
		serviceCases.map(function (serviceCase) {
			return window.Helper.Database.getDatabaseEntity(serviceCase);
		}).forEach(function (serviceCase) {
			if (serviceOrderTimeId) {
				window.database.attachOrGet(serviceCase);
				serviceCase.ServiceOrderTimeId = serviceOrderTimeId;
			} else {
				const newServiceOrderTime =
					window.database.CrmService_ServiceOrderTime.CrmService_ServiceOrderTime.create();
				if (window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode ===
					"JobPerInstallation") {
					newServiceOrderTime.InstallationId = serviceCase.AffectedInstallationKey;
				}
				newServiceOrderTime.OrderId = serviceOrderId;
				newServiceOrderTime.PosNo = window.Helper.ServiceOrder.formatPosNo(++maxPos);
				window.database.add(newServiceOrderTime);
				window.database.attachOrGet(serviceCase);
				serviceCase.ServiceOrderTimeId = newServiceOrderTime.Id;
				results.push(newServiceOrderTime);
			}
			serviceCase.StatusKey = Helper.ServiceCase.defaults.inProgressStatusKey;
		});
		return window.database.saveChanges().then(function () {
			return results;
		});
	}

	static belongsToClosed(serviceCaseStatus) {
		return (serviceCaseStatus.Groups || "").split(",").indexOf("Closed") !== -1;
	}

	static defaults = {
		inProgressStatusKey: 4
	}

	static getCategoryAbbreviation(serviceCase, serviceCaseCategories) {
		serviceCase = ko.unwrap(serviceCase || {});
		const serviceCaseCategoryKey = ko.unwrap(serviceCase.CategoryKey);
		if (serviceCaseCategoryKey) {
			const serviceCaseCategory = (serviceCaseCategories || {})[serviceCaseCategoryKey];
			if (serviceCaseCategory && serviceCaseCategory.Value) {
				return serviceCaseCategory.Value[0];
			}
		}
		return "";
	}

	static getDisplayName(serviceCase) {
		return ko.unwrap(serviceCase.ServiceCaseNo);
	}

	static mapForSelect2Display(serviceCase) {
		return {
			id: serviceCase.Id,
			item: serviceCase,
			text: Helper.ServiceCase.getDisplayName(serviceCase)
		};
	}

	static setStatus(serviceCases, status) {
		serviceCases = Array.isArray(serviceCases) ? serviceCases : [serviceCases];
		serviceCases.map(function (serviceCase) {
			return window.Helper.Database.getDatabaseEntity(serviceCase);
		}).forEach(function (serviceCase) {
			serviceCase.StatusKey = status.Key;
			const belongsToClosed = window.Helper.ServiceCase.belongsToClosed(status);
			if (belongsToClosed) {
				serviceCase.CompletionDate = new Date();
				serviceCase.CompletionServiceOrderId = serviceCase.ServiceOrderTime ? serviceCase.ServiceOrderTime.OrderId : null;
				serviceCase.CompletionUser = window.Helper.User.getCurrentUserName();
			} else {
				serviceCase.CompletionDate = null;
				serviceCase.CompletionServiceOrderId = null;
				serviceCase.CompletionUser = null;
			}
		});
	}
}

(window.Helper = window.Helper || {}).ServiceCase = HelperServiceCase;