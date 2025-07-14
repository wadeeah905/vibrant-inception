window.Helper.Database.registerTable("CrmVisitReport_Visit", {
	Address: { type: "Crm.Offline.DatabaseModel.Main_Address", inverseProperty: "$$unbound", defaultValue: null, keys: ["AddressId"] },
	Parent: { type: "Crm.Offline.DatabaseModel.Main_Company", inverseProperty: "$$unbound", defaultValue: null, keys: ["ParentId"] },
	ResponsibleUserUser: { type: "Crm.Offline.DatabaseModel.Main_User", inverseProperty: "$$unbound", defaultValue: null, keys: ["ResponsibleUser"] },
	VisitReports: { type: "Array", elementType: "Crm.Offline.DatabaseModel.CrmVisitReport_VisitReport", inverseProperty: "Visit", defaultValue: [], keys: ["VisitId"] }
});
window.Helper.Database.registerTable("CrmVisitReport_VisitReport", {
	DynamicForm: { type: "Crm.Offline.DatabaseModel.CrmDynamicForms_DynamicForm", inverseProperty: "$$unbound", defaultValue: null, keys: ["DynamicFormKey"] },
	Responses: { type: "Array", elementType: "Crm.Offline.DatabaseModel.CrmDynamicForms_DynamicFormResponse", inverseProperty: "$unbound", defaultValue: [], keys: ["DynamicFormReferenceKey"] },
	ResponsibleUserUser: { type: "Crm.Offline.DatabaseModel.Main_User", inverseProperty: "$$unbound", defaultValue: null, keys: ["ResponsibleUser"] },
	Visit: { type: "Crm.Offline.DatabaseModel.CrmVisitReport_Visit", inverseProperty: "VisitReports", defaultValue: null, keys: ["VisitId"] },
	Company: { type: "Crm.Offline.DatabaseModel.Main_Company", inverseProperty: "VisitReports", defaultValue: null, keys: ["ReferenceKey"] }
});
window.Helper.Database.registerTable("CrmVisitReport_ContactPersonRelationship", {
	Child: { type: "Crm.Offline.DatabaseModel.Main_Person", inverseProperty: "$$unbound", defaultValue: null, keys: ["ChildId"] }
});
window.Helper.Database.registerTable("CrmVisitReport_VisitTopic", {
	CreateUserUser: { type: "Crm.Offline.DatabaseModel.Main_User", inverseProperty: "$$unbound", defaultValue: null, keys: ["CreateUser"] },
	Visit: { type: "Crm.Offline.DatabaseModel.CrmVisitReport_Visit", inverseProperty: "$$unbound", defaultValue: null, keys: ["VisitKey"] }
});
window.Helper.Database.registerTable("Main_Company", {
	VisitReports: { type: "Array", elementType: "Crm.Offline.DatabaseModel.CrmVisitReport_VisitReport", inverseProperty: "Company", defaultValue: [], keys: ["ReferenceKey"] }
});

window.Helper.Database.addIndex("CrmVisitReport_Visit", ["ResponsibleUser"]);

window.Helper.Database.setTransactionId("CrmVisitReport_ContactPersonRelationship",
	function(relationship) {
		return new $.Deferred().resolve(relationship.ChildId).promise();
	});
window.Helper.Database.setTransactionId("CrmVisitReport_ContactPersonRelationship",
	function(relationship) {
		return new $.Deferred().resolve(relationship.ParentId).promise();
	});
window.Helper.Database.setTransactionId("CrmVisitReport_Visit",
	function(visit) {
		return new $.Deferred().resolve(visit.Id).promise();
	});
window.Helper.Database.setTransactionId("CrmVisitReport_Visit",
	function(visit) {
		return new $.Deferred().resolve(visit.ParentId).promise();
	});
window.Helper.Database.setTransactionId("CrmVisitReport_VisitReport",
	function(visitReport) {
		return new $.Deferred().resolve(visitReport.ReferenceKey).promise();
	});
window.Helper.Database.setTransactionId("CrmVisitReport_VisitReport",
	function(visitReport) {
		return new $.Deferred().resolve(visitReport.VisitId).promise();
	});
window.Helper.Database.setTransactionId("CrmVisitReport_VisitTopic",
	function(topic) {
		return new $.Deferred().resolve(topic.VisitKey).promise();
	});
window.Helper.Database.setTransactionId("CrmVisitReport_ContactPersonRelationship",
	function(relationship) {
		return new $.Deferred().resolve([relationship.ParentId, relationship.ChildId]).promise();
	});
