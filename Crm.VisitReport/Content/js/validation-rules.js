;
(function (ko) {
	ko.validationRules.add("CrmVisitReport_Visit",
		function (entity) {
			entity.PlannedEndDate.extend({
				validation: {
					validator: function(val) {
						var from = window.moment(entity.PlannedTime()).utc();
						var to = window.moment(val).utc();
						return !from.isSameOrAfter(to);
					},
					message: window.Helper.String.getTranslatedString("PlannedEndTimeAfterPlannedTimeRuleViolation"),
					onlyIf: function() {
						return entity.PlannedTime() != null && entity.PlannedEndDate() != null;
					}
				}
			});
			entity.PlannedDate.extend({
				required: {
					message: Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", Helper.String.getTranslatedString("PlannedDate")),
					params: true,
					onlyIf: function () {
						return entity.PlannedTime() != null && entity.PlannedEndDate() != null;
					}
				}
			});
		});
	ko.validationRules.add("Main_Company", 
		function (entity) {
			entity.ExtensionValues().VisitFrequencyTimeUnitKey.extend({
				required: {
					message: Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", Helper.String.getTranslatedString("VisitsNeededTimeUnit")),
					params: true,
					onlyIf: function() {
						return entity.ExtensionValues().VisitFrequencyValue() > 0;
					}
				}
			});
		});
})(window.ko);