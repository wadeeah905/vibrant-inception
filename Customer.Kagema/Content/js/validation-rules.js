ko.validationRules.add("CrmService_ServiceOrderDispatch", function (entity) {
	entity.DispatchedUser.extend({
		required: false,
		maxLength: {
			onlyIf: () => false
		}
	});
	entity.Duration.extend({
		required: {
			params: true,
			message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("Duration"))
		}
	});
	entity.SignatureContactName.extend({
		required: {
			params: true,
			message: window.Helper.String.getTranslatedString("RuleViolation.Required")
				.replace("{0}", window.Helper.String.getTranslatedString("SignatureContactName")),
			onlyIf: function () {
				return !!entity.SignatureJson();
			}
		}
	});
	entity.SignatureJson.extend({
		required: {
			params: true,
			message: window.Helper.String.getTranslatedString("MissingCustomerSignature"),
			onlyIf: function () {
				return window.Crm.Service.Settings.Service.Dispatch.Requires.CustomerSignature && ["ClosedNotComplete", "ClosedComplete"].indexOf(entity.StatusKey()) !== -1;
			}
		}
	});
	entity.SignPrivacyPolicyAccepted.extend({
		validation: {
			validator: function (val) {
				return val === true;
			},
			message: window.Helper.String.getTranslatedString("PleaseAcceptDataPrivacyPolicy"),
			onlyIf: function () {
				return window.Crm.Service.Settings.Service.Dispatch.Show.PrivacyPolicy && !!entity.SignatureJson();
			}
		}
	});
	entity.SignatureOriginatorName.extend({
		required: {
			params: true,
			message: window.Helper.String.getTranslatedString("RuleViolation.Required")
				.replace("{0}", window.Helper.String.getTranslatedString("SignatureOriginatorName")),
			onlyIf: function () {
				return !!entity.SignatureOriginatorJson();
			}
		}
	});
	entity.StatusKey.extend({
		required: {
			params: true,
			message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("Status"))
		}
	});
	entity.RejectReasonKey.extend({
		required: {
			params: true,
			message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("RejectReason")),
			onlyIf: function () {
				return entity.StatusKey() === "Rejected";
			}
		}
	});
	entity.Username.extend({
		required: {
			params: true,
			message: window.Helper.String.getTranslatedString("RuleViolation.Required")
				.replace("{0}", window.Helper.String.getTranslatedString("Technician"))
		}
	});
	entity.DispatchNo.extend({
		unique: {
			params: [window.database.CrmService_ServiceOrderDispatch, 'DispatchNo', entity.Id],
			onlyIf: function () {
				return entity.innerInstance.entityState === $data.EntityState.Added;
			},
			message: Helper.String.getTranslatedString("RuleViolation.Unique")
				.replace("{0}", Helper.String.getTranslatedString("DispatchNo"))
		}
	});
	if (!!entity.ServiceOrder() && !!entity.ServiceOrder().Installation()) {
		ko.validation.addRule(entity.ServiceOrder().Installation().StatusKey,
			{
				rule: "required",
				message: Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", Helper.String.getTranslatedString("InstallationStatus")),
				params: true
			});
	}

	entity.SignatureTechnicianJson.extend({
		required: {
			params: true,
			message: window.Helper.String.getTranslatedString("MissingTechnicianSignature"),
			onlyIf: function () {
				return window.Crm.Service.Settings.Service.Dispatch.Requires.CustomerSignature && ["ClosedNotComplete", "ClosedComplete"].indexOf(entity.StatusKey()) !== -1;
			}
		}
	});
});

ko.validationRules.add("CrmService_ServiceOrderTimePosting",
	function (entity) {
		entity.ServiceOrderTimeId.extend({
			required: {
				params: true,
				message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("ServiceOrderTime"))
			}
		});
	});

ko.validationRules.add("CrmService_ServiceOrderMaterial",
	function (entity) {
		entity.ServiceOrderTimeId.extend({
			required: {
				params: true,
				message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("ServiceOrderTime"))
			}
		});
	});
