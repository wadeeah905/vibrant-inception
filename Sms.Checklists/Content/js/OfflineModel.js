namespace("Sms.Checklists.OfflineModel").ServiceOrderChecklist = function () {
	var serviceOrderChecklist = window.Helper.Database.createInstance("ServiceOrderChecklist", "Sms.Checklists");
	serviceOrderChecklist.DynamicFormKey.extend({
		notEqual: {
			params: window.Helper.String.emptyGuid(),
			message: window.Helper.String.getTranslatedString('RuleViolation.Required').replace('{0}', window.Helper.String.getTranslatedString('Checklist'))
		}
	});
	return window.ko.validatedObservable(serviceOrderChecklist)
.config({ storage: "SmsChecklists_ServiceOrderChecklist", model: "ServiceOrderChecklist", pluginName: "Sms.Checklists" });
};
namespace("Sms.Checklists.OfflineModel").ServiceOrderChecklists = function () {
	return window.ko.observableArray([]).config({ storage: "SmsChecklists_ServiceOrderChecklist", model: "ServiceOrderChecklist", pluginName: "Sms.Checklists" });
};
window.Helper.Database.registerTable("SmsChecklists_ServiceCaseChecklist", {
	DynamicForm: { type: "Crm.Offline.DatabaseModel.CrmDynamicForms_DynamicForm", inverseProperty: "$$unbound", keys: ["DynamicFormKey"] },
	Responses: { type: "Array", elementType: "Crm.Offline.DatabaseModel.CrmDynamicForms_DynamicFormResponse", inverseProperty: "$unbound", defaultValue: [], keys: ["DynamicFormReferenceKey"] },
	ServiceCase: { type: "Crm.Offline.DatabaseModel.CrmService_ServiceCase", inverseProperty: "$$unbound", keys: ["ReferenceKey"] }
});
window.Helper.Database.registerTable("SmsChecklists_ServiceOrderChecklist", {
	DynamicForm: { type: "Crm.Offline.DatabaseModel.CrmDynamicForms_DynamicForm", inverseProperty: "$$unbound", keys: ["DynamicFormKey"] },
	Responses: { type: "Array", elementType: "Crm.Offline.DatabaseModel.CrmDynamicForms_DynamicFormResponse", inverseProperty: "$unbound", defaultValue: [], keys: ["DynamicFormReferenceKey"] },
	ServiceOrderTime: { type: "Crm.Offline.DatabaseModel.CrmService_ServiceOrderTime", inverseProperty: "$$unbound", keys: ["ServiceOrderTimeKey"] }
});
window.Helper.Database.addIndex("SmsChecklists_ServiceOrderChecklist", ["ReferenceKey", "DispatchId"]);
window.Helper.Database.setTransactionId("SmsChecklists_ServiceCaseChecklist",
	function(serviceCaseChecklist) {
		return new $.Deferred().resolve(serviceCaseChecklist.ReferenceKey).promise();
	});
window.Helper.Database.setTransactionId("SmsChecklists_ServiceCaseChecklist",
	function(serviceCaseChecklist) {
		var deferred = new $.Deferred();
		var fileResourceIds = [];
		(serviceCaseChecklist.Responses || []).filter(function(x) {
			return x.DynamicFormElementType === "FileAttachmentDynamicFormElement" && x.Value.length;
		}).map(function(x) {
			fileResourceIds = fileResourceIds.concat(x.Value);
		});

		deferred.resolve(fileResourceIds);
		return deferred.promise();
	});
window.Helper.Database.setTransactionId("SmsChecklists_ServiceOrderChecklist",
	function (serviceOrderChecklist) {
	  return new $.Deferred().resolve([serviceOrderChecklist.Id, serviceOrderChecklist.ReferenceKey]).promise();
	});
window.Helper.Database.setTransactionId("SmsChecklists_ServiceOrderChecklist",
	function(serviceOrderChecklist) {
		var deferred = new $.Deferred();
		var fileResourceIds = [];
		(serviceOrderChecklist.Responses || []).filter(function(x) {
			return x.DynamicFormElementType === "FileAttachmentDynamicFormElement" && x.Value.length;
		}).map(function(x) {
			fileResourceIds = fileResourceIds.concat(x.Value);
		});

		deferred.resolve(fileResourceIds);
		return deferred.promise();
	});