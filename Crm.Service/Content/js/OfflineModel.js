/// <reference path="../../../../Content/js/namespace.js" />
/// <reference path="../../../../Content/js/system/knockout-3.5.1.js" />
/// <reference path="../../../../Content/js/system/knockout.validation.js" />
/// <reference path="../../../../Content/js/knockout.custom.js" />
/// <reference path="../../../../content/js/offlinemodel.js" />

// TODO: move to Crm?
namespace("Crm.OfflineModel").User = function() {
	return window.ko.observable().config({ storage: "Main_User", model: "User", pluginName: "Main" });
};
namespace("Crm.OfflineModel").Users = function() {
	return window.ko.observableArray([]).config({ storage: "Main_User", model: "User", pluginName: "Main" });
};
namespace("Crm.OfflineModel").Company = function() {
	return window.ko.observable().config({ storage: "Main_Company", model: "Company", pluginName: "Main" });
};
namespace("Crm.OfflineModel").Companies = function() {
	return window.ko.observableArray([]).config({ storage: "Main_Company", model: "Company", pluginName: "Main" });
};
namespace("Crm.OfflineModel").Person = function() {
	return window.ko.observable().config({ storage: "Main_Person", model: "Person", pluginName: "Main" });
};
namespace("Crm.OfflineModel").Persons = function() {
	return window.ko.observableArray([]).config({ storage: "Main_Person", model: "Person", pluginName: "Main" });
};
namespace("Crm.OfflineModel").Currencies = function() {
	return window.ko.observableArray([]).config({ storage: "Main_Currency", model: "Currency", pluginName: "Main" });
};
namespace("Crm.OfflineModel").Note = function() {
    var note = window.Helper.Database.createInstance("Note", "Main");
	return window.ko.validatedObservable(note)
	.config({ storage: "Main_Note", model: "Note", pluginName: "Main" });
};
namespace("Crm.OfflineModel").Notes = function() {
	return window.ko.observableArray([]).config({ storage: "Main_Note", model: "Note", pluginName: "Main" });
};
namespace("Crm.OfflineModel").DocumentAttribute = function() {
	var documentAttribute = window.Helper.Database.createInstance("DocumentAttribute", "Main");
	return window.ko.validatedObservable(documentAttribute).config({ storage: "Main_DocumentAttribute", model: "DocumentAttribute", pluginName: "Main" });
};
namespace("Crm.OfflineModel").DocumentAttributes = function() {
	return window.ko.observableArray([]).config({ storage: "Main_DocumentAttribute", model: "DocumentAttribute", pluginName: "Main" });
};
namespace("Crm.OfflineModel").FileResource = function() {
	var fileResource = window.Helper.Database.createInstance("FileResource", "Main");
	return window.ko.validatedObservable(fileResource).config({ storage: "Main_FileResource", model: "FileResource", pluginName: "Main" });
};
namespace("Crm.OfflineModel").FileResources = function() {
	return window.ko.observableArray([]).config({ storage: "Main_FileResource", model: "FileResource", pluginName: "Main" });
};

namespace("Crm.Service.OfflineModel").Dispatch = function() {
	var dispatch = window.Helper.Database.createInstance("ServiceOrderDispatch", "Crm.Service");
	var requiredMessage = window.Helper.String.getTranslatedString('RuleViolation.Required').replace('{0}', window.Helper.String.getTranslatedString('Duration'));
	dispatch.Duration.extend({
		notEqual: {
			params: '00:00',
			message: requiredMessage
		}
	}).extend({
		notEqual: {
			params: '0:00',
			message: requiredMessage
		}
	}).extend({
		required: {
			params: true,
			message: requiredMessage
		}
	});
	return window.ko.validatedObservable(dispatch)
		.config({ storage: "CrmService_ServiceOrderDispatch", model: "ServiceOrderDispatch", pluginName: "Crm.Service" });
};

namespace("Crm.Service.OfflineModel").Dispatches = function() {
	return window.ko.observableArray([]).config({ storage: "CrmService_ServiceOrderDispatch", model: "ServiceOrderDispatch", pluginName: "Crm.Service" });
};

namespace("Crm.Service.OfflineModel").ServiceOrderHead = function (serviceOrderHead) {
	serviceOrderHead = serviceOrderHead || window.Helper.Database.createInstance("ServiceOrderHead", "Crm.Service");
	var maxLengthMessage = window.Helper.String.getTranslatedString('RuleViolation.MaxLength').replace('{0}', window.Helper.String.getTranslatedString('PurchaseOrderNo'));
	serviceOrderHead.PurchaseOrderNo.extend({
		maxLength: {
			params: 30,
			message: maxLengthMessage
		}
	});
	return window.ko.validatedObservable(serviceOrderHead)
		.config({ storage: "CrmService_ServiceOrderHead", model: "ServiceOrderHead", pluginName: "Crm.Service" });
};

namespace("Crm.Service.OfflineModel").ServiceOrderHeads = function() {
	return window.ko.observableArray([]).config({ storage: "CrmService_ServiceOrderHead", model: "ServiceOrderHead", pluginName: "Crm.Service" });
};

namespace("Crm.Service.OfflineModel").ServiceOrderMaterial = function() {
	return window.ko.validatedObservable(window.Helper.Database.createInstance("ServiceOrderMaterial", "Crm.Service"))
		.config({ storage: "CrmService_ServiceOrderMaterial", model: "ServiceOrderMaterial", pluginName: "Crm.Service" });
};

namespace("Crm.Service.OfflineModel").ServiceOrderMaterials = function() {
	return window.ko.observableArray([]).config({ storage: "CrmService_ServiceOrderMaterial", model: "ServiceOrderMaterial", pluginName: "Crm.Service" });
};

namespace("Crm.Service.OfflineModel").ServiceOrderMaterialSerial = function (serviceOrderMaterialSerial) {
	serviceOrderMaterialSerial = serviceOrderMaterialSerial || window.Helper.Database.createInstance("ServiceOrderMaterialSerial", "Crm.Service");
	serviceOrderMaterialSerial.PreviousSerialNo.extend({
		requiresOneOf: {
			params: [serviceOrderMaterialSerial.PreviousSerialNo, serviceOrderMaterialSerial.NoPreviousSerialNoReasonKey],
			message: window.Helper.String.getTranslatedString("RuleViolation.PreviousSerialNoRequired")
		}
	});
	return window.ko.validatedObservable(serviceOrderMaterialSerial)
		.config({ storage: "CrmService_ServiceOrderMaterialSerial", model: "ServiceOrderMaterialSerial", pluginName: "Crm.Service" });
};

namespace("Crm.Service.OfflineModel").NoPreviousSerialNoReasons = function () {
	return window.ko.observableArray([]).config({ storage: "CrmService_NoPreviousSerialNoReason", model: "NoPreviousSerialNoReason", pluginName: "Crm.Service" });
};

namespace("Crm.Service.OfflineModel").ServiceOrderMaterialSerials = function() {
	var serviceOrderMaterialSerials = window.ko.observableArray([]).config({ storage: "CrmService_ServiceOrderMaterialSerial", model: "ServiceOrderMaterialSerial", pluginName: "Crm.Service" });
	return serviceOrderMaterialSerials;
};

namespace("Crm.Service.OfflineModel").ServiceOrderTimePostings = function() {
	return window.ko.observableArray([]).config({ storage: "CrmService_ServiceOrderTimePosting", model: "ServiceOrderTimePosting", pluginName: "Crm.Service" });
};

namespace("Crm.Service.OfflineModel").ServiceOrderTimes = function() {
	return window.ko.observableArray([]).config({ storage: "CrmService_ServiceOrderTime", model: "ServiceOrderTime", pluginName: "Crm.Service" });
};

namespace("Crm.Service.OfflineModel").ServiceOrderTime = function() {
	var serviceOrderTime = window.Helper.Database.createInstance("ServiceOrderTime", "Crm.Service");

	serviceOrderTime.CausingItemSerialNo.extend({
		requiresOneOf: {
			params: [serviceOrderTime.CausingItemSerialNo, serviceOrderTime.NoCausingItemSerialNoReasonKey],
			message: window.Helper.String.getTranslatedString("SerialNoRequired"),
			onlyIf: serviceOrderTime.CausingItemNo
		}
	});
	serviceOrderTime.CausingItemPreviousSerialNo.extend({
		requiresOneOf: {
			params: [serviceOrderTime.CausingItemPreviousSerialNo, serviceOrderTime.NoCausingItemPreviousSerialNoReasonKey],
			message: window.Helper.String.getTranslatedString("SerialNoRequired"),
			onlyIf: serviceOrderTime.CausingItemNo
		}
	});
	serviceOrderTime.CausingItemNo.extend({
		required: {
			params: true,
			message: window.Helper.String.getTranslatedString("CausingItemRequired"),
			onlyIf: function() { return !!serviceOrderTime.CausingItemSerialNo() || !!serviceOrderTime.NoCausingItemSerialNoReasonKey() || !!serviceOrderTime.CausingItemPreviousSerialNo() || !!serviceOrderTime.NoCausingItemPreviousSerialNoReasonKey(); }
		}
	});

	return window.ko.validatedObservable(serviceOrderTime).config({ storage: "CrmService_ServiceOrderTime", model: "ServiceOrderTime", pluginName: "Crm.Service" });
};

namespace("Crm.Service.OfflineModel").DispatchStatuses = function() {
	return window.ko.observableArray([]).config({ storage: "CrmService_ServiceOrderDispatchStatus", model: "ServiceOrderDispatchStatus", pluginName: "Crm.Service" });
};

namespace("Crm.Service.OfflineModel").DispatchRejectReasons = function() {
	return window.ko.observableArray([]).config({ storage: "CrmService_ServiceOrderDispatchRejectReason", model: "ServiceOrderDispatchRejectReason", pluginName: "Crm.Service" });
};

namespace("Crm.Service.OfflineModel").InstallationHeadStatuses = function() {
	return window.ko.observableArray([]).config({ storage: "CrmService_InstallationHeadStatus", model: "InstallationHeadStatus", pluginName: "Crm.Service" });
};

namespace("Crm.Service.OfflineModel").Installation = function (installation) {
	installation = installation || window.Helper.Database.createInstance("Installation", "Crm.Service");
	return window.ko.validatedObservable(installation)
		.config({ storage: "CrmService_Installation", model: "Installation", pluginName: "Crm.Service" });
};

namespace("Crm.Service.OfflineModel").Installations = function() {
	return window.ko.observableArray([]).config({ storage: "CrmService_Installation", model: "Installation", pluginName: "Crm.Service" });
};

namespace("Crm.Service.OfflineModel").ServiceObject = function() {
	return window.ko.observable().config({ storage: "CrmService_ServiceObject", model: "ServiceObject", pluginName: "Crm.Service" });
};

namespace("Crm.Service.OfflineModel").ServiceObjects = function() {
	return window.ko.observableArray([]).config({ storage: "CrmService_ServiceObject", model: "ServiceObject", pluginName: "Crm.Service" });
};

namespace("Crm.Service.OfflineModel").ServiceContracts = function() {
	return window.ko.observableArray([]).config({ storage: "CrmService_ServiceContract", model: "ServiceContract", pluginName: "Crm.Service" });
};

namespace("Crm.Service.OfflineModel").ServiceContractInstallationRelationships = function() {
	return window.ko.observableArray([]).config({ storage: "CrmService_ServiceContractInstallationRelationship", model: "ServiceContractInstallationRelationship", pluginName: "Crm.Service" });
};

namespace("Crm.Service.OfflineModel").ServiceOrderTimePosting = function() {
	var serviceOrderTimePosting = window.Helper.Database.createInstance("ServiceOrderTimePosting", "Crm.Service");
	return window.ko.validatedObservable(serviceOrderTimePosting)
		.config({ storage: "CrmService_ServiceOrderTimePosting", model: "ServiceOrderTimePosting", pluginName: "Crm.Service" });
};

namespace("Crm.Service.OfflineModel").ReplenishmentOrders = function() {
	return window.ko.observableArray([]).config({ storage: "CrmService_ReplenishmentOrder", model: "ReplenishmentOrder", pluginName: "Crm.Service" });
};

namespace("Crm.Service.OfflineModel").ReplenishmentOrder = function() {
	return window.ko.validatedObservable(window.Helper.Database.createInstance("ReplenishmentOrder", "Crm.Service"))
		.config({ storage: "CrmService_ReplenishmentOrder", model: "ReplenishmentOrder", pluginName: "Crm.Service" });
};

namespace("Crm.Service.OfflineModel").ReplenishmentOrderItems = function() {
	return window.ko.observableArray([]).config({ storage: "CrmService_ReplenishmentOrderItem", model: "ReplenishmentOrderItem", pluginName: "Crm.Service" });
};

namespace("Crm.Service.OfflineModel").Location = function () {
	return window.ko.validatedObservable(window.Helper.Database.createInstance("Location", "Crm.Service"))
		.config({ storage: "CrmService_Location", model: "Location", pluginName: "Crm.Service" });
};
namespace("Crm.Service.OfflineModel").Locations = function () {
	return window.ko.observableArray([]).config({ storage: "CrmService_Location", model: "Location", pluginName: "Crm.Service" });
};
namespace("Crm.Service.OfflineModel").Store = function () {
	return window.ko.validatedObservable(window.Helper.Database.createInstance("Store", "Crm.Service"))
		.config({ storage: "CrmService_Store", model: "Store", pluginName: "Crm.Service" });
};
namespace("Crm.Service.OfflineModel").Stores = function () {
	return window.ko.observableArray([]).config({ storage: "CrmService_Store", model: "Store", pluginName: "Crm.Service" });
};

namespace("Crm.Service.OfflineModel").ReplenishmentOrderItem = function() {
	return window.ko.validatedObservable(window.Helper.Database.createInstance("ReplenishmentOrderItem", "Crm.Service"))
		.config({ storage: "CrmService_ReplenishmentOrderItem", model: "ReplenishmentOrderItem", pluginName: "Crm.Service" });
};

window.Helper.Database.addIndex("CrmService_ServiceOrderDispatch", ["Username", "StatusKey", "Date", "Time"]);
window.Helper.Database.addIndex("CrmService_ServiceOrderDispatch", ["OrderId"]);
window.Helper.Database.addIndex("CrmService_ServiceOrderHead", ["OrderNo"]);
window.Helper.Database.addIndex("CrmService_ServiceOrderHead", ["Planned", "PlannedTime"]);
window.Helper.Database.addIndex("CrmService_ServiceOrderMaterial", ["DispatchId"]);
window.Helper.Database.addIndex("CrmService_ServiceOrderMaterial", ["OrderId"]);
window.Helper.Database.addIndex("CrmService_ServiceOrderMaterial", ["OrderId", "IsActive"]);
window.Helper.Database.addIndex("CrmService_ServiceOrderMaterialSerial", ["OrderMaterialId"]);
window.Helper.Database.addIndex("CrmService_ServiceOrderTimePosting", ["DispatchId"]);
window.Helper.Database.addIndex("CrmService_ServiceOrderTimePosting", ["OrderId"]);
window.Helper.Database.addIndex("CrmService_ServiceOrderTimePosting", ["OrderId", "DispatchId"]);
window.Helper.Database.addIndex("CrmService_ServiceOrderTime", ["OrderId"]);
window.Helper.Database.addIndex("CrmService_ServiceOrderTime", ["OrderId", "IsActive"]);
window.Helper.Database.addIndex("CrmService_InstallationHeadStatus", ["Language"]);
window.Helper.Database.addIndex("CrmService_Installation", ["InstallationNo"]);
window.Helper.Database.addIndex("CrmService_Installation", ["LegacyInstallationId"]);
window.Helper.Database.addIndex("CrmService_Installation", ["InstallationNo", "LegacyInstallationId", "Description", "LocationContactId", "FolderId"]);
window.Helper.Database.addIndex("CrmService_ServiceObject", ["Name"]);
window.Helper.Database.addIndex("Main_Company", ["Name"]);
window.Helper.Database.addIndex("Main_Company", ["LegacyId", "Name"]);
window.Helper.Database.addIndex("Main_Note", ["ContactId", "CreateDate"]);
window.Helper.Database.addIndex("Main_Note", ["ExtensionValues__DispatchId", "CreateDate"]);
window.Helper.Database.addIndex("Main_DocumentAttribute", ["ReferenceKey", "IsActive"]);
window.Helper.Database.registerTable("Main_FileResource", {
	Content: { type: "string", defaultValue: "" }
});
window.Helper.Database.addIndex("Main_FileResource", ["ParentId", "IsActive"]);
window.Helper.Database.addIndex("Main_LinkResource", ["ParentId"]);
window.Helper.Database.registerTable("Main_DocumentAttribute", {
	ServiceOrderTime: { type: "Crm.Offline.DatabaseModel.CrmService_ServiceOrderTime", inverseProperty: "$$unbound", keys: ["ExtensionValues__ServiceOrderTimeId"] }
});

window.Helper.Database.registerTable("CrmService_MaintenancePlan", {
	ServiceOrders: { type: "Array", elementType: "Crm.Offline.DatabaseModel.CrmService_ServiceOrderHead", inverseProperty: "$$unbound", defaultValue: [], keys: ["MaintenancePlanId"] },
	ServiceOrderTemplate: { type: "Crm.Offline.DatabaseModel.CrmService_ServiceOrderHead", inverseProperty: "$$unbound", keys: ["ServiceOrderTemplateId"] }
	});
window.Helper.Database.registerTable("CrmService_ReplenishmentOrder", {
	Items: { type: "Array", elementType: "Crm.Offline.DatabaseModel.CrmService_ReplenishmentOrderItem", inverseProperty: "ReplenishmentOrder", keys: ["ReplenishmentOrderId"] },
	ResponsibleUserObject: { type: "Crm.Offline.DatabaseModel.Main_User", inverseProperty: "$$unbound", defaultValue: null, keys: ["ResponsibleUser"] }
});
window.Helper.Database.registerTable("CrmService_ReplenishmentOrderItem", {
	ReplenishmentOrder: { type: "Crm.Offline.DatabaseModel.CrmService_ReplenishmentOrder", inverseProperty: "Items", keys: ["ReplenishmentOrderId"] },
	ServiceOrderMaterials: { type: "Array", elementType: "Crm.Offline.DatabaseModel.CrmService_ServiceOrderMaterial", inverseProperty: "ReplenishmentOrderItem", defaultValue: [], keys: ["ReplenishmentOrderItemId"] },
	Article: { type: "Crm.Offline.DatabaseModel.CrmArticle_Article", inverseProperty: "$$unbound", keys: ["ArticleId"] },
});
window.Helper.Database.registerTable("CrmService_ServiceCase", {
	AffectedCompany: { type: "Crm.Offline.DatabaseModel.Main_Company", inverseProperty: "$$unbound", keys: ["AffectedCompanyKey"] },
	AffectedInstallation: { type: "Crm.Offline.DatabaseModel.CrmService_Installation", inverseProperty: "$$unbound", keys: ["AffectedInstallationKey"] },
	CompletionServiceOrder: { type: "Crm.Offline.DatabaseModel.CrmService_ServiceOrderHead", inverseProperty: "$$unbound", keys: ["CompletionServiceOrderId"] },
	CompletionUserUser: { type: "Crm.Offline.DatabaseModel.Main_User", inverseProperty: "$$unbound", defaultValue: null, keys: ["CompletionUser"] },
	ContactPerson: { type: "Crm.Offline.DatabaseModel.Main_Person", inverseProperty: "$$unbound", keys: ["ContactPersonId"] },
	OriginatingServiceOrder: { type: "Crm.Offline.DatabaseModel.CrmService_ServiceOrderHead", inverseProperty: "$$unbound", keys: ["OriginatingServiceOrderId"] },
	OriginatingServiceOrderTime: { type: "Crm.Offline.DatabaseModel.CrmService_ServiceOrderTime", inverseProperty: "$$unbound", keys: ["OriginatingServiceOrderTimeId"] },
	ResponsibleUserUser: { type: "Crm.Offline.DatabaseModel.Main_User", inverseProperty: "$$unbound", defaultValue: null, keys: ["ResponsibleUser"] },
	ServiceObject: { type: "Crm.Offline.DatabaseModel.CrmService_ServiceObject", inverseProperty: "$$unbound", keys: ["ServiceObjectId"] },
	ServiceOrderTime: { type: "Crm.Offline.DatabaseModel.CrmService_ServiceOrderTime", inverseProperty: "$$unbound", keys: ["ServiceOrderTimeId"] },
	Tags: { type: "Array", elementType: "Crm.Offline.DatabaseModel.Main_Tag", inverseProperty: "$$unbound", defaultValue: [], keys: ["ContactKey"] },
	Station: { type: "Crm.Offline.DatabaseModel.Main_Station", inverseProperty: "$$unbound", keys: ["StationKey"] }
});
window.Helper.Database.registerTable("CrmService_ServiceCaseTemplate", {
	ResponsibleUserUser: { type: "Crm.Offline.DatabaseModel.Main_User", inverseProperty: "$$unbound", defaultValue: null, keys: ["ResponsibleUser"] }
});
window.Helper.Database.registerTable("CrmService_ServiceContract", {
	Installations: { type: Array, elementType: "Crm.Offline.DatabaseModel.CrmService_ServiceContractInstallationRelationship", inverseProperty: "Parent", defaultValue: [], keys: ["ParentId"] },
	InvoiceAddress: { type: "Crm.Offline.DatabaseModel.Main_Address", inverseProperty: "$$unbound", keys: ["InvoiceAddressKey"] },
	InvoiceRecipient: { type: "Crm.Offline.DatabaseModel.Main_Company", inverseProperty: "$$unbound", keys: ["InvoiceRecipientId"] },
	ParentCompany: { type: "Crm.Offline.DatabaseModel.Main_Company", inverseProperty: "$$unbound", keys: ["ParentId"] },
	Payer: { type: "Crm.Offline.DatabaseModel.Main_Company", inverseProperty: "$$unbound", keys: ["PayerId"] },
	PayerAddress: { type: "Crm.Offline.DatabaseModel.Main_Address", inverseProperty: "$$unbound", keys: ["PayerAddressId"] },
	ResponsibleUserUser: { type: "Crm.Offline.DatabaseModel.Main_User", inverseProperty: "$$unbound", defaultValue: null, keys: ["ResponsibleUser"] },
	ServiceObject: { type: "Crm.Offline.DatabaseModel.CrmService_ServiceObject", inverseProperty: "$$unbound", keys: ["ServiceObjectId"] },
	Tags: { type: "Array", elementType: "Crm.Offline.DatabaseModel.Main_Tag", inverseProperty: "$$unbound", defaultValue: [], keys: ["ContactKey"] }
});
window.Helper.Database.registerTable("CrmService_ServiceContractAddressRelationship", {
	Child: { type: "Crm.Offline.DatabaseModel.Main_Address", inverseProperty: "$$unbound", defaultValue: null, keys: ["ChildId"] },
	Parent: { type: "Crm.Offline.DatabaseModel.CrmService_ServiceContract", inverseProperty: "$$unbound", defaultValue: null, keys: ["ParentId"] }
});
window.Helper.Database.registerTable("CrmService_ServiceContractInstallationRelationship", {
	Child: { type: "Crm.Offline.DatabaseModel.CrmService_Installation", inverseProperty: "ServiceContractInstallationRelationships", defaultValue: null, keys: ["ChildId"] },
	Parent: { type: "Crm.Offline.DatabaseModel.CrmService_ServiceContract", inverseProperty: "Installations", defaultValue: null, keys: ["ParentId"] }
});
window.Helper.Database.registerTable("CrmService_ServiceObject", {
	Addresses: { type: "Array", elementType: "Crm.Offline.DatabaseModel.Main_Address", inverseProperty: "$$unbound", defaultValue: [], keys: ["CompanyId"] },
	Installations: { type: "Array", elementType: "Crm.Offline.DatabaseModel.CrmService_Installation", inverseProperty: "ServiceObject", defaultValue: [], keys: ["FolderId"] },
	ResponsibleUserUser: { type: "Crm.Offline.DatabaseModel.Main_User", inverseProperty: "$$unbound", defaultValue: null, keys: ["ResponsibleUser"] },
	StandardAddress: { type: "Array", elementType: "StandardAddress", inverseProperty: "$$unbound", defaultValue: [], keys: ["CompanyId"] },
	Tags: { type: "Array", elementType: "Crm.Offline.DatabaseModel.Main_Tag", inverseProperty: "$$unbound", defaultValue: [], keys: ["ContactKey"] }
});
window.Helper.Database.registerTable("CrmService_ServiceOrderDispatch", {
	CurrentServiceOrderTime: { type: "Crm.Offline.DatabaseModel.CrmService_ServiceOrderTime", inverseProperty: "$$unbound", keys: ["CurrentServiceOrderTimeId"] },
	DispatchedUser: { type: "Crm.Offline.DatabaseModel.Main_User", inverseProperty: "$$unbound", keys: ["Username"] },
	ReportRecipients: { type: Array, elementType: "Crm.Offline.DatabaseModel.CrmService_ServiceOrderDispatchReportRecipient", inverseProperty: "$$unbound", defaultValue: [], keys: ["DispatchId"] },
	ServiceOrder: { type: "Crm.Offline.DatabaseModel.CrmService_ServiceOrderHead", inverseProperty: "$$unbound", keys: ["OrderId"] },
	ServiceOrderMaterial: { type: Array, elementType: "Crm.Offline.DatabaseModel.CrmService_ServiceOrderMaterial", inverseProperty: "$$unbound", defaultValue: [], keys: ["DispatchId"] },
	ServiceOrderTimePostings: { type: Array, elementType: "Crm.Offline.DatabaseModel.CrmService_ServiceOrderTimePosting", inverseProperty: "ServiceOrderDispatch", defaultValue: [], keys: ["DispatchId"] }
});
window.Helper.Database.registerTable("CrmService_ServiceOrderHead", {
	Installation: { type: "Crm.Offline.DatabaseModel.CrmService_Installation", inverseProperty: "$$unbound", keys: ["InstallationId"] },
	PreferredTechnicianUser: { type: "Crm.Offline.DatabaseModel.Main_User", inverseProperty: "$$unbound", defaultValue: null, keys: ["PreferredTechnician"] },
	PreferredTechnicianUsergroupObject: { type: "Crm.Offline.DatabaseModel.Main_Usergroup", inverseProperty: "$$unbound", defaultValue: null, keys: ["PreferredTechnicianUsergroupKey"] },
	ResponsibleUserUser: { type: "Crm.Offline.DatabaseModel.Main_User", inverseProperty: "$$unbound", defaultValue: null, keys: ["ResponsibleUser"] },
	ServiceContract: { type: "Crm.Offline.DatabaseModel.CrmService_ServiceContract", inverseProperty: "$$unbound", keys: ["ServiceContractId"] },
	ServiceObject: { type: "Crm.Offline.DatabaseModel.CrmService_ServiceObject", inverseProperty: "$$unbound", keys: ["ServiceObjectId"] },
	ServiceOrderMaterials: { type: Array, elementType: "Crm.Offline.DatabaseModel.CrmService_ServiceOrderMaterial", inverseProperty: "ServiceOrderHead", defaultValue: [], keys: ["OrderId"] },
	ServiceOrderTemplate: { type: "ServiceOrderTemplate", inverseProperty: "$$unbound", defaultValue: null, keys: ["ServiceOrderTemplateId"] },
	ServiceOrderTimes: { type: Array, elementType: "Crm.Offline.DatabaseModel.CrmService_ServiceOrderTime", inverseProperty: "$$unbound", defaultValue: [], keys: ["OrderId"] },
	ServiceOrderTimePostings: { type: Array, elementType: "Crm.Offline.DatabaseModel.CrmService_ServiceOrderTimePosting", inverseProperty: "$$unbound", defaultValue: [], keys: ["OrderId"] },
	DocumentAttributes: { type: Array, elementType: "Crm.Offline.DatabaseModel.Main_DocumentAttribute", inverseProperty: "$$unbound", defaultValue: [], keys: ["ReferenceKey"] },
	Initiator: { type: "Crm.Offline.DatabaseModel.Main_Company", inverseProperty: "$$unbound", keys: ["InitiatorId"] },
	InitiatorPerson: { type: "Crm.Offline.DatabaseModel.Main_Person", inverseProperty: "$$unbound", keys: ["InitiatorPersonId"] },
	Payer: { type: "Crm.Offline.DatabaseModel.Main_Company", inverseProperty: "$$unbound", keys: ["PayerId"] },
	PayerAddress: { type: "Crm.Offline.DatabaseModel.Main_Address", inverseProperty: "$$unbound", keys: ["PayerAddressId"] },
	InvoiceRecipient: { type: "Crm.Offline.DatabaseModel.Main_Company", inverseProperty: "$$unbound", keys: ["InvoiceRecipientId"] },
	InvoiceRecipientAddress: { type: "Crm.Offline.DatabaseModel.Main_Address", inverseProperty: "$$unbound", keys: ["InvoiceRecipientAddressId"] },
	Company: { type: "Crm.Offline.DatabaseModel.Main_Company", inverseProperty: "$$unbound", keys: ["CustomerContactId"] },
	UserGroup: { type: "Crm.Offline.DatabaseModel.Main_Usergroup", inverseProperty: "$$unbound", keys: ["UserGroupKey"] },
	Station: { type: "Crm.Offline.DatabaseModel.Main_Station", inverseProperty: "$$unbound", keys: ["StationKey"] },
	Tags: { type: "Array", elementType: "Crm.Offline.DatabaseModel.Main_Tag", inverseProperty: "$$unbound", defaultValue: [], keys: ["ContactKey"] }
});
window.Helper.Database.registerConverter("ServiceOrderTemplate", "CrmService_ServiceOrderHead");
window.Helper.Database.registerTable("CrmService_ServiceOrderMaterial", {
	Article: { type: "Crm.Offline.DatabaseModel.CrmArticle_Article", inverseProperty: "$$unbound", keys: ["ArticleId"] },
	DocumentAttributes: { type: Array, elementType: "Crm.Offline.DatabaseModel.Main_DocumentAttribute", inverseProperty: "$$unbound", defaultValue: [], keys: ["ExtensionValues__ServiceOrderMaterialId"] },
	ReplenishmentOrderItem: { type: "Crm.Offline.DatabaseModel.CrmService_ReplenishmentOrderItem", inverseProperty: "ServiceOrderMaterials", keys: ["ReplenishmentOrderItemId"] },
	ServiceOrderHead: { type: "Crm.Offline.DatabaseModel.CrmService_ServiceOrderHead", inverseProperty: "ServiceOrderMaterials", keys: ["OrderId"] },
	ServiceOrderMaterialSerials: { type: Array, elementType: "Crm.Offline.DatabaseModel.CrmService_ServiceOrderMaterialSerial", inverseProperty: "$$unbound", defaultValue: [], keys: ["OrderMaterialId"] },
	ServiceOrderTime: { type: "Crm.Offline.DatabaseModel.CrmService_ServiceOrderTime", inverseProperty: "$$unbound", keys: ["ServiceOrderTimeId"] }
});
window.Helper.Database.registerTable("CrmService_ServiceOrderTimePosting", {
	Article: { type: "Crm.Offline.DatabaseModel.CrmArticle_Article", inverseProperty: "$$unbound", keys: ["ArticleId"] },
	PerDiemReport: { type: "Crm.Offline.DatabaseModel.CrmPerDiem_PerDiemReport", inverseProperty: "$$unbound", keys: ["PerDiemReportId"] },
	ServiceOrder: { type: "Crm.Offline.DatabaseModel.CrmService_ServiceOrderHead", inverseProperty: "$$unbound", keys: ["OrderId"] },
	ServiceOrderDispatch: { type: "Crm.Offline.DatabaseModel.CrmService_ServiceOrderDispatch", inverseProperty: "ServiceOrderTimePostings", keys: ["DispatchId"] },
	ServiceOrderTime: { type: "Crm.Offline.DatabaseModel.CrmService_ServiceOrderTime", inverseProperty: "$$unbound", keys: ["ServiceOrderTimeId"] },
	User: { type: "Crm.Offline.DatabaseModel.Main_User", inverseProperty: "$$unbound", keys: ["Username"] }
});
window.Helper.Database.registerTable("CrmService_Installation", {
	Address: { type: "Crm.Offline.DatabaseModel.Main_Address", inverseProperty: "$$unbound", keys: ["LocationAddressKey"] },
	Company: { type: "Crm.Offline.DatabaseModel.Main_Company", inverseProperty: "$$unbound", keys: ["LocationContactId"] },
	Person: { type: "Crm.Offline.DatabaseModel.Main_Person", inverseProperty: "$$unbound", keys: ["LocationPersonId"] },
	PreferredUserUser: { type: "Crm.Offline.DatabaseModel.Main_User", inverseProperty: "$$unbound", defaultValue: null, keys: ["PreferredUser"] },
	ResponsibleUserUser: { type: "Crm.Offline.DatabaseModel.Main_User", inverseProperty: "$$unbound", defaultValue: null, keys: ["ResponsibleUser"] },
	ServiceContractInstallationRelationships: { type: Array, elementType: "Crm.Offline.DatabaseModel.CrmService_ServiceContractInstallationRelationship", inverseProperty: "Child", defaultValue: [], keys: ["ChildId"] },
	ServiceObject: { type: "Crm.Offline.DatabaseModel.CrmService_ServiceObject", inverseProperty: "Installations", keys: ["FolderId"] },
	Tags: { type: "Array", elementType: "Crm.Offline.DatabaseModel.Main_Tag", inverseProperty: "$$unbound", defaultValue: [], keys: ["ContactKey"] },
	Station: { type: "Crm.Offline.DatabaseModel.Main_Station", inverseProperty: "$$unbound", keys: ["StationKey"] }
});
window.Helper.Database.registerTable("CrmService_InstallationAddressRelationship", {
	Child: { type: "Crm.Offline.DatabaseModel.Main_Address", inverseProperty: "$$unbound", defaultValue: null, keys: ["ChildId"] },
	Parent: { type: "Crm.Offline.DatabaseModel.CrmService_Installation", inverseProperty: "$$unbound", defaultValue: null, keys: ["ParentId"] }
});
window.Helper.Database.registerTable("CrmService_InstallationPos", {
	Article: { type: "Crm.Offline.DatabaseModel.CrmArticle_Article", inverseProperty: "$$unbound", defaultValue: null, keys: ["ArticleId"] },
	RelatedInstallation: { type: "Crm.Offline.DatabaseModel.CrmService_Installation", inverseProperty: "$$unbound", defaultValue: null, keys: ["RelatedInstallationId"] }
});
window.Helper.Database.registerTable("CrmService_Store", {
	Locations: { type: "Array", elementType: "Crm.Offline.DatabaseModel.CrmService_Location", inverseProperty: "Store", keys: ["StoreId"] }
});
window.Helper.Database.registerTable("CrmService_Location", {
	Store: { type: "Crm.Offline.DatabaseModel.CrmService_Store", inverseProperty: "Locations", keys: ["StoreId"] }
});
window.Helper.Database.setTransactionId("CrmService_Installation", function(installation) {
	return new $.Deferred().resolve(installation.Id);
});
window.Helper.Database.setTransactionId("CrmService_InstallationAddressRelationship", function(installationAddressRelationship) {
	return new $.Deferred().resolve([installationAddressRelationship.ChildId, installationAddressRelationship.ParentId]).promise();
});
window.Helper.Database.setTransactionId("CrmService_MaintenancePlan",
	function (maintenancePlan) {
		return new $.Deferred().resolve([maintenancePlan.Id, maintenancePlan.ServiceContractId, maintenancePlan.ServiceOrderTemplateId]).promise();
	});
window.Helper.Database.registerTable("CrmService_ServiceOrderTime", {
	Installation: { type: "Crm.Offline.DatabaseModel.CrmService_Installation", inverseProperty: "$$unbound", keys: ["InstallationId"] },
	Article: { type: "Crm.Offline.DatabaseModel.CrmArticle_Article", inverseProperty: "$$unbound", keys: ["ArticleId"] },
	Postings: { type: Array, elementType: "Crm.Offline.DatabaseModel.CrmService_ServiceOrderTimePosting", inverseProperty: "$$unbound", defaultValue: [], keys: ["ServiceOrderTimeId"] },
	ServiceCases: { type: Array, elementType: "Crm.Offline.DatabaseModel.CrmService_ServiceCase", inverseProperty: "$$unbound", defaultValue: [], keys: ["ServiceOrderTimeId"] },
	ServiceOrderMaterials: { type: Array, elementType: "Crm.Offline.DatabaseModel.CrmService_ServiceOrderMaterial", inverseProperty: "$$unbound", defaultValue: [], keys: ["ServiceOrderTimeId"] }
});
window.Helper.Database.setTransactionId("CrmService_ReplenishmentOrder",
	function(replenishmentOrder) {
		return new $.Deferred().resolve(replenishmentOrder.Id).promise();
	});
window.Helper.Database.setTransactionId("CrmService_ReplenishmentOrderItem",
	function(replenishmentOrderItem) {
		return new $.Deferred().resolve(replenishmentOrderItem.ReplenishmentOrderId).promise();
	});
window.Helper.Database.setTransactionId("CrmService_ServiceCaseTemplate",
	function (serviceCaseTemplate) {
		return new $.Deferred().resolve(serviceCaseTemplate.Id).promise();
	});
window.Helper.Database.setTransactionId("CrmService_ServiceCase",
	function (serviceCase) {
		return new $.Deferred().resolve([serviceCase.ServiceCaseTemplateId,
			serviceCase.ServiceObjectId,
			serviceCase.AffectedCompanyKey,
			serviceCase.ContactPersonId,
			serviceCase.ServiceOrderTimeId]).promise();
	});
window.Helper.Database.setTransactionId("CrmService_ServiceContractAddressRelationship", function (serviceContractAddressRelationship) {
	return new $.Deferred().resolve([serviceContractAddressRelationship.ChildId, serviceContractAddressRelationship.ParentId]).promise();
});
window.Helper.Database.setTransactionId("CrmService_ServiceContractInstallationRelationship", function (serviceContractInstallationRelationship) {
	return new $.Deferred().resolve([serviceContractInstallationRelationship.ChildId, serviceContractInstallationRelationship.ParentId]).promise();
});
window.Helper.Database.setTransactionId("CrmService_ServiceOrderDispatch",
	function(serviceOrderDispatch) {
		return new $.Deferred().resolve(serviceOrderDispatch.OrderId).promise();
	});
window.Helper.Database.setTransactionId("CrmService_ServiceOrderDispatch",
	function(serviceOrderDispatch) {
		var d = new $.Deferred();
		window.database.CrmService_ServiceOrderHead.first(function(serviceOrderHead) {
				return serviceOrderHead.Id === this.orderId;
			}, { orderId: serviceOrderDispatch.OrderId })
			.then(function(serviceOrder) {
				d.resolve(serviceOrder.InstallationId);
			})
			.fail(d.reject);
		return d.promise();
	});
window.Helper.Database.setTransactionId("CrmService_ServiceOrderDispatchReportRecipient",
	function(serviceOrderDispatchReportRecipient) {
		return new $.Deferred().resolve(serviceOrderDispatchReportRecipient.DispatchId).promise();
	});
window.Helper.Database.setTransactionId("CrmService_ServiceOrderHead",
	function(serviceOrderHead) {
		return new $.Deferred().resolve(serviceOrderHead.Id).promise();
	});
window.Helper.Database.setTransactionId("CrmService_ServiceOrderHead",
	function(serviceOrderHead) {
		return new $.Deferred().resolve([
			serviceOrderHead.ServiceOrderTemplateId,
			serviceOrderHead.ServiceObjectId,
			serviceOrderHead.InitiatorId,
			serviceOrderHead.InitiatorPersonId,
			serviceOrderHead.InstallationId,
			serviceOrderHead.CustomerContactId
		]).promise();
	});
window.Helper.Database.setTransactionId("CrmService_ServiceOrderMaterial",
	function(serviceOrderMaterial) {
		return new $.Deferred().resolve(serviceOrderMaterial.OrderId).promise();
	});
window.Helper.Database.setTransactionId("CrmService_ServiceOrderMaterialSerial",
	function(serviceOrderMaterialSerial) {
		var d = new $.Deferred();
		window.database.CrmService_ServiceOrderMaterial.filter(function(serviceOrderMaterial) {
					return serviceOrderMaterial.Id == this.orderMaterialId;
				},
				{ orderMaterialId: serviceOrderMaterialSerial.OrderMaterialId })
			.first()
			.then(function(serviceOrderMaterial) {
				d.resolve(serviceOrderMaterial.OrderId);
			})
			.fail(d.reject);
		return d.promise();
	});
window.Helper.Database.setTransactionId("CrmService_ServiceOrderTime",
	function (serviceOrderTime) {
		return new $.Deferred().resolve(serviceOrderTime.Id).promise();
	});
window.Helper.Database.setTransactionId("CrmService_ServiceOrderTime",
	function (serviceOrderTime) {
		return new $.Deferred().resolve(serviceOrderTime.InstallationId).promise();
	});
window.Helper.Database.setTransactionId("CrmService_ServiceOrderTime",
	function (serviceOrderTime) {
		return new $.Deferred().resolve(serviceOrderTime.OrderId).promise();
	});
window.Helper.Database.setTransactionId("CrmService_ServiceOrderTimePosting",
	function(serviceOrderTimePosting) {
		return new $.Deferred().resolve(serviceOrderTimePosting.OrderId).promise();
	});
window.Helper.Database.setTransactionId("CrmService_ServiceOrderTimePosting",
	function (timePosting) {
		return new $.Deferred().resolve(timePosting.PerDiemReportId).promise();
	});
window.Helper.Database.setTransactionId("CrmService_ServiceContract",
	function (serviceContract) {
		return new $.Deferred().resolve([
			serviceContract.ParentId,
			serviceContract.PayerId,
			serviceContract.InvoiceRecipientId,
			serviceContract.ServiceObjectId]).promise();
	});
window.Helper.Database.setTransactionId("CrmService_Installation",
	function (installation) {
		return new $.Deferred().resolve([installation.LocationContactId, installation.LocationAddressKey, installation.LocationPersonId]).promise();
	});