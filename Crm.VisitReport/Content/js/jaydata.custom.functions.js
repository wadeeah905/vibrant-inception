(function($data) {
	$data.Queryable.prototype.specialFunctions.orderByStandardAddressDistance = {
		"oData": function(urlSearchParams, data) {
			urlSearchParams.append("orderByStandardAddressDistanceLatitude", data.latitude);
			urlSearchParams.append("orderByStandardAddressDistanceLongitude", data.longitude);
			urlSearchParams.append("orderByStandardAddressDistanceFudge", data.fudge);
		},
		"webSql": function(query, data) {
			return query.orderBy(function(it) {
					return ((this.latitude - it.Addresses.Latitude) * (this.latitude - it.Addresses.Latitude) +
						(this.longitude - it.Addresses.Longitude) *
						(this.longitude - it.Addresses.Longitude) *
						this.fudge);
				},
				{
					latitude: data.latitude,
					longitude: data.longitude,
					fudge: data.fudge
				});
		}
	};
})($data);