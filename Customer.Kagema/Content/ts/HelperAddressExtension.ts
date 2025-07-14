; (function () {
	const getSelect2Filter = window.Helper.Address.getSelect2Filter;
	window.Helper.Address.getSelect2Filter = (query, term) => {
	if (term) {
		query = query.filter(function (it) {
			return it.Name1.contains(this.term)
				|| it.Name2.contains(this.term)
				|| it.Name3.contains(this.term)
				|| it.ZipCode.contains(this.term)
				|| it.City.contains(this.term)
				|| it.Street.contains(this.term);


		}, { term: term });
	}
		query = query.filter(function (it) { return it.Name1 !== null && it.Name1 !== "" });
		return query;
	}
})();