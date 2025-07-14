class HelperReplenishmentOrder {
	static getOrCreateCurrentReplenishmentOrder(responsibleUser, excludeId) {
		const d = new $.Deferred();
		window.database.CrmService_ReplenishmentOrder
			.filter(function (replenishmentOrder) {
				return replenishmentOrder.IsClosed === false && replenishmentOrder.ResponsibleUser === this.responsibleUser && replenishmentOrder.Id !== this.excludeId;
			}, {responsibleUser: responsibleUser, excludeId: excludeId || null})
			.take(1)
			.toArray(function (replenishmentOrders) {
				if (replenishmentOrders.length === 0) {
					const newReplenishmentOrder = window.database.CrmService_ReplenishmentOrder.CrmService_ReplenishmentOrder.create();
					newReplenishmentOrder.ResponsibleUser = responsibleUser;
					window.database.add(newReplenishmentOrder);
					d.resolve(newReplenishmentOrder.asKoObservable());
				} else {
					const replenishmentOrder = replenishmentOrders[0];
					window.database.attachOrGet(replenishmentOrder);
					d.resolve(replenishmentOrder.asKoObservable());
				}
			});
		return d.promise();
	}
}

(window.Helper = window.Helper || {}).ReplenishmentOrder = HelperReplenishmentOrder;