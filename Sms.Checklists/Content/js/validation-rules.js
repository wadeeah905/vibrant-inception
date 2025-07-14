;
(function(ko) {
	ko.validationRules.add("SmsChecklists_ServiceOrderChecklist",
		function(entity) {
			entity.DynamicFormKey.extend({
				required: {
					params: true,
					message: window.Helper.String.getTranslatedString("RuleViolation.Required")
						.replace("{0}", window.Helper.String.getTranslatedString("Checklist"))
				}
			});
		});
})(window.ko);