(() => {
	const asKoObservable = $data.Entity.prototype.asKoObservable;
	$data.Entity.prototype.asKoObservable = function() {
		const obj = asKoObservable.apply(this, arguments);
		if (window.database.CrmService_ServiceOrderTimePosting && this instanceof window.database.CrmService_ServiceOrderTimePosting.elementType) {
			obj.IsPrePlanned = window.ko.pureComputed(() => window.Helper.ServiceOrderTimePosting.isPrePlanned(obj));
			obj.WasPrePlanned = window.ko.pureComputed(() => window.Helper.ServiceOrderTimePosting.wasPrePlanned(obj));
		}
		return obj;
	}
})();

class HelperServiceOrderTimePosting {
	static isPrePlanned(timePosting) {
		const plannedDuration = ko.unwrap(timePosting.PlannedDuration);
		const userName = ko.unwrap(timePosting.Username);
		const duration = ko.unwrap(timePosting.Duration);
		if (!!plannedDuration && !userName && !duration) {
			return true;
		}
		return false;
	}
	static wasPrePlanned(timePosting) {
		const isPrePlanned = window.Helper.ServiceOrderTimePosting.isPrePlanned(timePosting);
		const plannedDuration = ko.unwrap(timePosting.PlannedDuration);
		if (!isPrePlanned && !!plannedDuration) {
			return true;
		}
		return false;
	}
}

(window.Helper = window.Helper || {}).ServiceOrderTimePosting = HelperServiceOrderTimePosting;