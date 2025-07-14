class HelperServiceContract {
	static getTypeAbbreviation(serviceContract, serviceContractTypes) {
		serviceContract = window.ko.unwrap(serviceContract || {});
		const serviceContractTypeKey = window.ko.unwrap(serviceContract.ContractTypeKey);
		if (serviceContractTypeKey) {
			const serviceContractType = (serviceContractTypes || {})[serviceContractTypeKey];
			if (serviceContractType && serviceContractType.Value) {
				return serviceContractType.Value[0];
			}
		}
		return "";
	}

	static getDisplayName(serviceContract) {
		if (!serviceContract) {
			return "";
		}
		return ko.unwrap(serviceContract.ContractNo);
	}
	
	static getNextXGenerationDates(maintenancePlan, x){
		if(!maintenancePlan.FirstDate() || ! maintenancePlan.RhythmValue() || !maintenancePlan.RhythmUnitKey()){
			return null
		}
		var nextDates = [];
		var nextDate;

		if(!maintenancePlan.NextDate() || window.moment(maintenancePlan.NextDate()).isBefore(window.moment(maintenancePlan.FirstDate()), 'day')){
			nextDate = window.moment(maintenancePlan.FirstDate());
			while(nextDate.isBefore(window.moment(), 'day')){
				nextDate = this.addTimeSpan(nextDate, maintenancePlan.RhythmValue(), maintenancePlan.RhythmUnitKey());
			}
		} else {
			nextDate = window.moment(maintenancePlan.NextDate());
		}
		nextDates.push(Globalize.formatDate(nextDate.toDate(), { date: "full" }));
		
		for(let i = 0; i < x - 1; i++){
			nextDate = this.addTimeSpan(nextDate, maintenancePlan.RhythmValue(), maintenancePlan.RhythmUnitKey());
			nextDates.push(Globalize.formatDate(nextDate.toDate(), { date: "full" }));
		}
		return nextDates;
	}
	
	static addTimeSpan(date, val, key){
		return date.add(val, key.toLowerCase() + "s");
	}
}

(window.Helper = window.Helper || {}).ServiceContract = HelperServiceContract;