(function($data) {
	$data.Queryable.prototype.specialFunctions.orderByCurrentServiceOrderTime = {
		"oData": function(urlSearchParams, data) {
			urlSearchParams.append("orderByCurrentServiceOrderTime", data.currentServiceOrderTimeId);
		},
		getField: function(type) {
			if (type === window.database.Main_DocumentAttribute.elementType) {
				return "it.ExtensionValues.ServiceOrderTimeId";
			}
			if (type === window.database.CrmService_ServiceOrderTime.elementType) {
				return "it.Id";
			}
			return "it.ServiceOrderTimeId";
		},
		"webSql": function(query, data) {
			if (query.defaultType === window.database.CrmService_Installation.elementType) {
				return query.orderByDescending("it.Id === this.currentServiceOrderTimeInstallationId", { currentServiceOrderTimeInstallationId: data.currentServiceOrderTimeId });
			}
			var it = $data.Queryable.prototype.specialFunctions.orderByCurrentServiceOrderTime.getField(query.defaultType);
			var regex = new RegExp(/\$it/, 'g');
			if (data.currentServiceOrderTimeId) {
				query = query.orderByDescending(("$it !== null && $it === '" + data.currentServiceOrderTimeId + "'").replace(regex, it));
			}
			query = query.orderByDescending("$it === null".replace(regex, it));
			return query;
		}
	};
	$data.Queryable.prototype.specialFunctions.orderByFastLanePriority = {
		"oData": function (urlSearchParams, data) {
			urlSearchParams.append("orderByFastLanePriority", data.keys);
		},
		"webSql": function (query, data) {
			var orderBy = data.keys.map(function (x) { return "it.PriorityKey === " + x; })
				.reduce(function (ob, x) { return x + (ob ? " || " + ob : ""); }, "");
			query = query.orderByDescending(orderBy);
			return query;
		}
	};
	$data.Queryable.prototype.specialFunctions.expandDocumentAttributeExtension = {
		"oData": function(urlSearchParams, data) {
			urlSearchParams.append("expandDocumentAttributeExtension", true);
		},
		"webSql": function(query, data) {
			return query
							.include("ServiceOrderTime")
							.include("ServiceOrderTime.Installation");
		}
	};
	$data.Queryable.prototype.specialFunctions.filterByServiceOrderTimes = {
		"oData": function(urlSearchParams, data) {
			urlSearchParams.append("filterByServiceOrderTimes", data.orderId);
		},
		"webSql": function(query, data) {
			var installationIds = window.database.CrmService_ServiceOrderTime
				.filter(function(it) {
						return it.OrderId === this.orderId && it.InstallationId !== null;
					}, { orderId: data.orderId })
				.map(function(it) {
					return it.InstallationId;
				});
			return query.filter(function(it) {
					return it.Id in this.installationIds;
				}, { installationIds: installationIds });
		}
	};
	$data.Queryable.prototype.specialFunctions.filerByNextFireDate = {
		"oData": function(urlSearchParams, data) {
			urlSearchParams.append("filerByNextFireDateFrom", JSON.stringify(data.date.DateFrom));
			urlSearchParams.append("filerByNextFireDateTo", JSON.stringify(data.date.DateTo));
		},
		"webSql": function(query, data) {
			var maintenancePlanIds = window.database.CrmService_MaintenancePlan
				.filter("it.NextDate >= this.fromDate && it.NextDate <= this.toDate",
					{ fromDate: data.date.DateFrom, toDate: data.date.DateTo })
				.map(function(it) {
					return it.ServiceContractId;
				});
			return query.filter("it.Id in this.maintenancePlanIds", { maintenancePlanIds: maintenancePlanIds });
		}
	};
	$data.Queryable.prototype.specialFunctions.serviceObjectInstallationLocationFilter = {
		"oData": function (urlSearchParams, data) {
			urlSearchParams.append("locationContactId", JSON.stringify(data.locationContactId));
		},
		"webSql": function (query, data) {
			var serviceObjectIds = window.database.CrmService_Installation
				.filter("it.LocationContactId >= this.locationContactId",
					{ locationContactId: data.locationContactId })
				.map(function (it) {
					return it.FolderId;
				});
			return query.filter("it.Id in this.serviceObjectIds", { serviceObjectIds: serviceObjectIds });
		}
	};
})($data);