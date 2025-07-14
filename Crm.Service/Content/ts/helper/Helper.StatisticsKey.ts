
export class HelperStatisticsKey {

	static getAvailableLookups(lookups, entity): any {
		if(!window.AuthorizationManager || !window.AuthorizationManager.isAuthorizedForAction("StatisticsKey", "View"))
			return;
		let queries = [];
		const tableNames = [
			"CrmService_StatisticsKeyProductType",
			"CrmService_StatisticsKeyMainAssembly",
			"CrmService_StatisticsKeySubAssembly",
			"CrmService_StatisticsKeyAssemblyGroup",
			"CrmService_StatisticsKeyFaultImage",
			"CrmService_StatisticsKeyRemedy",
			"CrmService_StatisticsKeyCause",
			"CrmService_StatisticsKeyWeighting",
			"CrmService_StatisticsKeyCauser"
		];
		for(let tableName of tableNames) {
			queries.push({
				queryable: window.database[tableName],
				method: "count",
				handler: function(count) {
					if (count > 0) {
						let propertyName = HelperStatisticsKey.getJsNameByTable(tableName);
						let lookupDefinition = { $tableName: tableName, $lazy: true };
						//to fill up the lookup table with the key of the value stored part of the entity 
						if (entity) {
							const entityPropertyName = HelperStatisticsKey.getModelPropertyNameByJsName(entity, propertyName + "Key");
							if (!!window.ko.unwrap(entity[entityPropertyName]))
								lookupDefinition[window.ko.unwrap(entity[entityPropertyName])] = null;
						}
						lookups[propertyName](lookupDefinition);
					}
				}
			});
		}
		return window.Helper.Batch.Execute(queries);
	}

	static addLookupTables(lookups) {
		lookups.statisticsKeyProductType = window.ko.observable(null);
		lookups.statisticsKeyMainAssembly = window.ko.observable(null);
		lookups.statisticsKeySubAssembly = window.ko.observable(null);
		lookups.statisticsKeyAssemblyGroup = window.ko.observable(null);
		lookups.statisticsKeyFaultImage = window.ko.observable(null);
		lookups.statisticsKeyRemedy = window.ko.observable(null);
		lookups.statisticsKeyCause = window.ko.observable(null);
		lookups.statisticsKeyWeighting = window.ko.observable(null);
		lookups.statisticsKeyCauser = window.ko.observable(null);
		return lookups;
	}

	static getAutocompleteOptions(tableName, entity, additionalOptions) {
		let options = window.Helper.Lookup.getAutocompleteOptions(tableName);
		options.customFilter = function (query, key, filterExpression, filterParameters) {
			switch (tableName) {
				case "CrmService_StatisticsKeyAssemblyGroup":
					if (!!window.ko.unwrap(entity.StatisticsKeySubAssemblyKey)) {
						query = query.filter("it.SubAssemblyKey == this.key", { key: window.ko.unwrap(entity.StatisticsKeySubAssemblyKey).split(':')[2] })
					}
				case "CrmService_StatisticsKeySubAssembly":
					if (!!window.ko.unwrap(entity.StatisticsKeyMainAssemblyKey)) {
						query = query.filter("it.MainAssemblyKey == this.key", { key: window.ko.unwrap(entity.StatisticsKeyMainAssemblyKey).split(':')[1] })
					}
				case "CrmService_StatisticsKeyMainAssembly":
				case "CrmService_StatisticsKeyRemedy":
				case "CrmService_StatisticsKeyCause":
				case "CrmService_StatisticsKeyWeighting":
				case "CrmService_StatisticsKeyCauser":
					if (!!window.ko.unwrap(entity.StatisticsKeyProductTypeKey)) {
						query = query.filter("it.ProductTypeKey == null || it.ProductTypeKey == this.key", { key: window.ko.unwrap(entity.StatisticsKeyProductTypeKey) })
					}
					break;
				case "CrmService_StatisticsKeyFaultImage":
					if (!!window.ko.unwrap(entity.StatisticsKeyProductTypeKey)) {
						query = query.filter("it.ProductTypeKey == null || it.ProductTypeKey == this.key", { key: window.ko.unwrap(entity.StatisticsKeyProductTypeKey) })
					}
					if (!!window.ko.unwrap(entity.StatisticsKeyAssemblyGroupKey)) {
						query = query.filter("it.AssemblyGroupKey == this.key", { key: window.ko.unwrap(entity.StatisticsKeyAssemblyGroupKey) })
					}
					break;
			}
			return window.Helper.Lookup.queryLookup(query, key, filterExpression, filterParameters);
		}
		return { ...options, ...additionalOptions };
	}

	static getJsNameByTable(tableName) {
		let propertyName = tableName.split('_')[1];
		return propertyName[0].toLowerCase() + propertyName.substr(1);
	}

	static getModelPropertyNameByJsName(entity, propertyName) {
		return entity.getProperties().filter((x) => x.name.toLowerCase() === propertyName.toLowerCase())[0].name;;
	}
}



