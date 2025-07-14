function setupService() {
	function applyTimeEntryFilter(query, userId) {
		return query.filter(function(it) {
			return it.Username === this.currentUser && (it.IsClosed === 0 && it.PerDiemReportId === null);
		}, { currentUser: userId });
	}
	function configureOdataGetTimePostingDistinctDates() {
		if (!window.database.CrmService_ServiceOrderTimePosting) {
			return;
		}
		if (!window.database.CrmService_ServiceOrderTimePosting.GetDistinctServiceOrderTimePostingDates) {
			throw "CrmService_ServiceOrderTimePosting.GetDistinctServiceOrderTimePostingDates must be defined at this point";
		}
		const origGetDistinctServiceOrderTimePostingDates = window.database.CrmService_ServiceOrderTimePosting.GetDistinctServiceOrderTimePostingDates;
		window.database.CrmService_ServiceOrderTimePosting.GetDistinctServiceOrderTimePostingDates = function(userId) {
			return applyTimeEntryFilter(origGetDistinctServiceOrderTimePostingDates.call(this), userId);
		};
	}
	function configureWebSqlGetTimePostingDistinctDates() {
		if (!window.database.CrmService_ServiceOrderTimePosting) {
			return;
		}
		if (window.database.CrmService_ServiceOrderTimePosting.GetDistinctServiceOrderTimePostingDates) {
			throw "CrmService_ServiceOrderTimePosting.GetDistinctServiceOrderTimePostingDates must be undefined at this point";
		}
		window.database.CrmService_ServiceOrderTimePosting.GetDistinctServiceOrderTimePostingDates = function(userId) {
			return applyTimeEntryFilter(window.database.CrmService_ServiceOrderTimePosting, userId)
				.map(function(it) { return it.Date; })
				.distinct();
		};
	}

	document.addEventListener("DatabaseInitialized", function() {
		if (window.database.storageProvider.name === "webSql") {
			configureWebSqlGetTimePostingDistinctDates();
		} else if (window.database.storageProvider.name === "oData") {
			configureOdataGetTimePostingDistinctDates();
		}
	});
}
setupService();

class HelperService {
	static getLumpSumString(obj) {
		return [
			ko.unwrap(obj.IsCostLumpSum) ? "Cost" : null,
			ko.unwrap(obj.IsMaterialLumpSum) ? "Material" : null,
			ko.unwrap(obj.IsTimeLumpSum) ? "Time" : null,
		].filter(Boolean)
			.map(function(x) { return Helper.String.getTranslatedString(x); })
			.join(", ");

		return (serviceOrderStatus.Groups || "").split(",").indexOf("Closed") !== -1;
	}
	static onInvoicingTypeSelected(obj, invoicingType) {
		var src = invoicingType ?? { Key: undefined, ExtensionValues: { IsCostLumpSum: false, IsMaterialLumpSum: false, IsTimeLumpSum: false } };
		obj = ko.unwrap(obj);
		if (obj instanceof $data.KoObservableEntity) {
			obj.InvoicingTypeKey(src.Key);
			obj.IsCostLumpSum(src.ExtensionValues.IsCostLumpSum);
			obj.IsMaterialLumpSum(src.ExtensionValues.IsMaterialLumpSum);
			obj.IsTimeLumpSum(src.ExtensionValues.IsTimeLumpSum);
		} else {
			obj.InvoicingTypeKey = src.Key;
			obj.IsCostLumpSum = src.ExtensionValues.IsCostLumpSum;
			obj.IsMaterialLumpSum = src.ExtensionValues.IsMaterialLumpSum;
			obj.IsTimeLumpSum = src.ExtensionValues.IsTimeLumpSum;
		}
	}
	static async resetInvoicingType(entity) {
		if (entity.getType() === database.CrmService_ServiceOrderTime.elementType) {
			const order = await database.CrmService_ServiceOrderHead.find(entity.OrderId);
			if (!order.InvoicingTypeKey) {
				return;
			}
			for (const key of ["InvoicingTypeKey", "IsCostLumpSum", "IsMaterialLumpSum", "IsTimeLumpSum"]) {
				if (entity[key] !== order[key]) {
					entity[key] = order[key];
				}
			}
		}
	}
	static async resetPositions(entity) {
		const changedProperties = (entity.changedProperties || []).reduce((map, p) => { map[p.name] = true; return map; }, {});
		if (entity.entityState === $data.EntityState.Modified
			&& entity.getType() === database.CrmService_ServiceOrderHead.elementType
			&& ["InvoicingTypeKey", "IsCostLumpSum", "IsMaterialLumpSum", "IsTimeLumpSum"].some(x => changedProperties[x])) {
			const queries = [];
			let invoicingType = null;
			if (entity.InvoicingTypeKey) {
				queries.push({
					queryable: Helper.Lookup.getLookupByKeyQuery("Main_InvoicingType", entity.InvoicingTypeKey),
					method: "first",
					handler: x => invoicingType = x
				});
			}
			queries.push({
				queryable: database.CrmService_ServiceOrderTime.filter("OrderId", "===", entity.Id),
				method: "toArray",
				handler: times => {
					for (const x of times) {
						database.attachOrGet(x);
						x.InvoicingTypeKey = invoicingType ? invoicingType.Key : null;
						x.IsCostLumpSum = invoicingType ? invoicingType.ExtensionValues.IsCostLumpSum : false;
						x.IsMaterialLumpSum = invoicingType ? invoicingType.ExtensionValues.IsMaterialLumpSum : false;
						x.IsTimeLumpSum = invoicingType ? invoicingType.ExtensionValues.IsTimeLumpSum : false;
					}
				}
			});
			return Helper.Batch.Execute(queries);
		}
	}
	static async resetInvoicingIfLumpSumSettingsChanged(obj) {
		const entity = ko.unwrap(obj).getEntity();
		await Helper.Service.resetInvoicingType(entity);
		await Helper.Service.resetPositions(entity);
	}
};
(window.Helper = window.Helper ?? {}).Service = HelperService;