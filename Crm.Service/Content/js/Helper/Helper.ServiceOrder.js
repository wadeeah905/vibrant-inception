class HelperServiceOrder {
	static belongsToClosed(serviceOrderStatus) {
		return (serviceOrderStatus.Groups || "").split(",").indexOf("Closed") !== -1;
	}

	static canEditActualQuantities(serviceOrderId) {
		return Helper.ServiceOrder.isInStatusGroup(serviceOrderId, ["InProgress", "PostProcessing"]);
	}

	static canEditEstimatedQuantities(serviceOrderId) {
		return Helper.ServiceOrder.isInStatusGroup(serviceOrderId, ["Preparation", "Scheduling"]);
	}

	static canEditEstimatedQuantitiesSync(serviceOrderStatus, statusGroups) {
		return Helper.ServiceOrder.isInStatusGroupSync(serviceOrderStatus, statusGroups, ["Preparation", "Scheduling"]);
	}

	static canEditInvoiceQuantities(serviceOrderId) {
		return Helper.ServiceOrder.isInStatusGroup(serviceOrderId, "PostProcessing");
	}

	static formatPosNo(posNo) {
		if (typeof posNo !== "number") {
			return posNo;
		}
		return posNo < 10000 ? ("0000" + posNo.toString()).slice(-4) : posNo.toString();
	}

	static getDisplayName(serviceOrder) {
		return [ko.unwrap(serviceOrder.OrderNo), ko.unwrap(serviceOrder.ErrorMessage)].filter(Boolean).join(" - ");
	}

	static getServiceOrderPositionItemGroup(serviceOrderPosition) {
		if (window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode === "OrderPerInstallation") {
			return null;
		}
		if (serviceOrderPosition.ServiceOrderTime() === null) {
			return {title: window.Helper.String.getTranslatedString("ServiceOrder")};
		}
		let title = serviceOrderPosition.ServiceOrderTime().PosNo();
		if (serviceOrderPosition.ServiceOrderTime().Description()) {
			title += ": " + serviceOrderPosition.ServiceOrderTime().Description();
		}
		const itemGroup = {title: title};
		if (serviceOrderPosition.ServiceOrderTime().Installation()) {
			itemGroup.subtitle =
				window.Helper.Installation.getDisplayName(serviceOrderPosition.ServiceOrderTime().Installation());
		}
		return itemGroup;
	}

	static getServiceOrderTemplateAutocompleteFilter(query, term) {
		query = query.filter(function (it) {
			return it.IsTemplate === true;
		});
		if (term) {
			query = query.filter(function (it) {
				return it.OrderNo.contains(this.term) || it.ErrorMessage.contains(this.term);
			}, {term: term});
		}
		return query;
	}

	static isInStatusGroup(serviceOrderId, statusGroupOrGroups, serviceOrderStatusKey) {
		statusGroupOrGroups = Array.isArray(statusGroupOrGroups) ? statusGroupOrGroups : [statusGroupOrGroups];
		let deferred = new $.Deferred().resolve(serviceOrderStatusKey).promise();
		if (!serviceOrderStatusKey) {
			deferred = window.database.CrmService_ServiceOrderHead
				.map("it.StatusKey")
				.find(serviceOrderId);
		}
		return deferred
			.then(function (statusKey) {
				return Helper.Lookup.getLookupByKeyQuery("CrmService_ServiceOrderStatus", statusKey).first();
			}).then(function (serviceOrderStatus) {
				let result = false;
				const groups = (serviceOrderStatus.Groups || "").split(",");
				statusGroupOrGroups.forEach(function (statusGroup) {
					result = result || groups.indexOf(statusGroup) !== -1;
				});
				return result;
			});
	}

	static isInStatusGroupSync(serviceOrderStatus, statusGroupsHaystack, statusGroupsNeedles) {
		serviceOrderStatus = ko.unwrap(serviceOrderStatus);
		const status = statusGroupsHaystack[serviceOrderStatus];
		const haystack = (status.Groups || "").split(",");
		const needles = Array.isArray(statusGroupsNeedles) ? statusGroupsNeedles : [statusGroupsNeedles];
		for (const needle of needles) {
			if (haystack.indexOf(needle) !== -1) {
				return true;
			}
		}
		return false;
	}

	static mapForSelect2Display(serviceOrder) {
		return {
			id: serviceOrder.Id,
			item: serviceOrder,
			text: Helper.ServiceOrder.getDisplayName(serviceOrder)
		};
	}

	static queryServiceOrderType(query, term) {
		if (!window.AuthorizationManager.isAuthorizedForAction("ServiceOrderType", "SelectNonMobileLookupValues")) {
			query = query.filter("it.ShowInMobileClient === true");
		}
		return Helper.Lookup.queryLookup(query, term);
	}

	static setStatus(serviceOrders, status) {
		serviceOrders = Array.isArray(serviceOrders) ? serviceOrders : [serviceOrders];
		serviceOrders.map(function (serviceOrder) {
			return window.Helper.Database.getDatabaseEntity(serviceOrder);
		}).forEach(function (serviceOrder) {
			serviceOrder.StatusKey = status.Key;
			if (serviceOrder.StatusKey !== "Closed" && !serviceOrder.IsTemplate) {
				serviceOrder.NoInvoiceReasonKey = null;
				serviceOrder.InvoiceReasonKey = null;
			}
			const belongsToClosed = window.Helper.ServiceOrder.belongsToClosed(status);
			if (belongsToClosed) {
				serviceOrder.Closed = new Date();
			} else {
				serviceOrder.Closed = null;
			}
		});
	}

	static getMaxPosNo(serviceOrderId) {
		let posNo = 0;
		return window.database.CrmService_ServiceOrderTime.filter(function (it) {
				return it.OrderId === this.orderId;
			},
			{orderId: serviceOrderId})
			.orderByDescending("it.PosNo")
			.take(1)
			.toArray()
			.then(function (results) {
				if (results.length > 0) {
					posNo = Math.max(posNo, parseInt(results[0].PosNo, 10));
				}
				return window.database.CrmService_ServiceOrderMaterial.filter(function (it) {
						return it.OrderId === this.orderId;
					},
					{orderId: serviceOrderId})
					.orderByDescending("it.PosNo")
					.take(1)
					.toArray();
			}).then(function (results) {
				if (results.length > 0) {
					posNo = Math.max(posNo, parseInt(results[0].PosNo, 10));
				}
				return posNo;
			});
	}

	static getNextPosNo(serviceOrderId) {
		return window.Helper.ServiceOrder.getMaxPosNo(serviceOrderId).then(function (maxPosNo) {
			return window.Helper.ServiceOrder.formatPosNo(maxPosNo + 1);
		});
	}

	static getNextMaterialPosNo(serviceOrderId) {
		let posNo = 0;
		return window.database.CrmService_ServiceOrderMaterial.filter(function (it) {
				return it.OrderId === this.orderId;
			},
			{orderId: serviceOrderId})
			.orderByDescending("it.PosNo")
			.take(1)
			.toArray()
			.then(function (results) {
				if (results.length > 0) {
					posNo = Math.max(posNo, parseInt(results[0].PosNo, 10));
				}

				return window.Helper.ServiceOrder.formatPosNo(posNo + 1);
			});
	}

	static getNextJobPosNo(serviceOrderId) {
		let posNo = 0;
		return window.database.CrmService_ServiceOrderTime.filter(function (it) {
				return it.OrderId === this.orderId;
			},
			{orderId: serviceOrderId})
			.orderByDescending("it.PosNo")
			.take(1)
			.toArray()
			.then(function (results) {
				if (results.length > 0) {
					posNo = Math.max(posNo, parseInt(results[0].PosNo, 10));
				}

				return window.Helper.ServiceOrder.formatPosNo(posNo + 1);
			});
	}

	static getTypeAbbreviation(serviceOrder, serviceOrderTypes) {
		serviceOrder = window.ko.unwrap(serviceOrder || {});
		const serviceOrderTypeKey = window.ko.unwrap(serviceOrder.TypeKey);
		if (serviceOrderTypeKey) {
			const serviceOrderType = (serviceOrderTypes || {})[serviceOrderTypeKey];
			if (serviceOrderType && serviceOrderType.Value) {
				return serviceOrderType.Value[0];
			}
		}
		return "";
	}

	static transferTemplateData(serviceOrderTemplate, serviceOrder, revertTemplate) {
		if (!revertTemplate) {
			serviceOrderTemplate = Helper.Database.getDatabaseEntity(serviceOrderTemplate);
		}
		serviceOrder = Helper.Database.getDatabaseEntity(serviceOrder);
		if (serviceOrderTemplate.ExtensionValues) {
			const extensionValues = Object.getOwnPropertyNames(JSON.parse(JSON.stringify(serviceOrderTemplate.ExtensionValues)));
			extensionValues.forEach(function(value){
				serviceOrder.ExtensionValues[value] = serviceOrderTemplate.ExtensionValues[value];
			});
		}
		serviceOrder.InvoicingTypeKey = serviceOrderTemplate.InvoicingTypeKey;
		serviceOrder.PreferredTechnician = serviceOrderTemplate.PreferredTechnician;
		serviceOrder.PreferredTechnicianUsergroupKey = serviceOrderTemplate.PreferredTechnicianUsergroupKey;
		serviceOrder.PriorityKey = serviceOrderTemplate.PriorityKey;
		serviceOrder.RequiredSkillKeys = serviceOrderTemplate.RequiredSkillKeys;
		serviceOrder.UserGroupKey = serviceOrderTemplate.UserGroupKey;
			if (!!serviceOrderTemplate.ResponsibleUser) {
				serviceOrder.ResponsibleUser = serviceOrderTemplate.ResponsibleUser;
			}
		serviceOrder.StatusKey = serviceOrderTemplate.StatusKey;
		serviceOrder.TypeKey = serviceOrderTemplate.TypeKey;
		if (revertTemplate) {
			serviceOrder.ServiceOrderTemplate = null;
			serviceOrder.ServiceOrderTemplateId = null;
		}
		return new $.Deferred().resolve().promise();
	}

	static updatePosNo(serviceOrderPosition) {
		serviceOrderPosition = Helper.Database.getDatabaseEntity(serviceOrderPosition);
		if (serviceOrderPosition.PosNo) {
			return new $.Deferred().resolve().promise();
		}
		return window.Helper.ServiceOrder.getNextPosNo(serviceOrderPosition.OrderId).then(function (posNo) {
			serviceOrderPosition.PosNo = posNo;
		});
	}

	static updateJobPosNo(serviceOrderPosition) {
		serviceOrderPosition = Helper.Database.getDatabaseEntity(serviceOrderPosition);
		if (serviceOrderPosition.PosNo) {
			return new $.Deferred().resolve().promise();
		}
		return window.Helper.ServiceOrder.getNextJobPosNo(serviceOrderPosition.OrderId).then(function (posNo) {
			serviceOrderPosition.PosNo = posNo;
		});
	}

	static updateMaterialPosNo(serviceOrderPosition) {
		serviceOrderPosition = Helper.Database.getDatabaseEntity(serviceOrderPosition);
		if (serviceOrderPosition.PosNo) {
			return new $.Deferred().resolve().promise();
		}
		return window.Helper.ServiceOrder.getNextMaterialPosNo(serviceOrderPosition.OrderId).then(function (posNo) {
			serviceOrderPosition.PosNo = posNo;
		});
	}

	static getRelatedInstallations(serviceOrderHead) {
		const installations = [];
		if (!!serviceOrderHead.Installation() && serviceOrderHead.Installation().IsActive()) {
			installations.push(window.ko.unwrap(serviceOrderHead.Installation));
		}
		serviceOrderHead.ServiceOrderTimes().forEach(function (x) {
			if (!!x.Installation() && x.Installation().IsActive()) {
				if (installations.map(function (i) {
					return i.Id();
				}).indexOf(x.Installation().Id()) === -1) {
					installations.push(window.ko.unwrap(x.Installation));
				}
			}
		});
		return installations;
	}
}

(window.Helper = window.Helper || {}).ServiceOrder = HelperServiceOrder;