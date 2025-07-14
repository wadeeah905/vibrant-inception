;
(function() {

	function getOverlappingServiceOrderTimePosting(id, username, date, from, to, callback) {
		if (!username || !date || !from || !to || from > to || !window.database.CrmService_ServiceOrderTimePosting || window.Crm.Service.Settings.ServiceOrderTimePosting.AllowOverlap) {
			callback(null);
			return;
		}
		window.database.CrmService_ServiceOrderTimePosting
			.include("ServiceOrder")
			.first(function(timePosting) {
					return timePosting.Username === this.username &&
						!(timePosting.Date < this.date || timePosting.Date > this.date) &&
						timePosting.From < this.to &&
						timePosting.To > this.from &&
						timePosting.Id !== this.id;
				},
				{ id: id, username: username, date: date, from: from, to: to })
			.then(function(result) {
				return Helper.Culture.languageCulture().then(function(language) {
					return Helper.Article.loadArticleDescriptionsMap([result.ItemNo], language);
				}).then(function(description) {
					result.ItemDescription = description[result.ItemNo];
					callback(result);
				});
			})
			.fail(function() {
				callback(null);
			});
	}

	var overlappingTimeEntryValidator = window.OverlappingTimeEntryValidator;
	window.OverlappingTimeEntryValidator = window._.debounce(function(val, params, callback) {
		var args = arguments;
		var timeEntry = window.ko.unwrap(this);
		getOverlappingServiceOrderTimePosting(timeEntry.Id(),
			window.ko.unwrap(timeEntry.ResponsibleUser || timeEntry.Username),
			timeEntry.Date(),
			timeEntry.From(),
			timeEntry.To(),
			function(overlappingTimePosting) {
				if (!overlappingTimePosting) {
					overlappingTimeEntryValidator.apply(timeEntry, args);
				} else {
					var message = window.Helper.String.getTranslatedString("OverlappingByFromOrderNo")
						.replace("{0}", overlappingTimePosting.ItemDescription)
						.replace("{1}",
							window.Globalize.formatDate(overlappingTimePosting.From, { datetime: "medium" }))
						.replace("{2}", window.Globalize.formatDate(overlappingTimePosting.To, { datetime: "medium" }))
						.replace("{3}", overlappingTimePosting.ServiceOrder.OrderNo);
					callback({ isValid: false, message: message });
				}
			});
	});
})();