window.Helper.Database.registerTable("CrmArticle_Article", {
	ArticleChildRelationships: {
		type: "Array",
		elementType: "Crm.Offline.DatabaseModel.CrmArticle_ArticleRelationship",
		inverseProperty: "Child",
		defaultValue: [],
		keys: ["ChildId"]
	}
});
window.Helper.Database.registerTable("CrmArticle_ArticleRelationship", {
	Child: {
		type: "Crm.Offline.DatabaseModel.CrmArticle_Article",
		inverseProperty: "ArticleChildRelationships",
		defaultValue: null,
		keys: ["ChildId"]
	}
});
window.Helper.Database.registerTable("CrmOrder_Offer", {
	Company: { type: "Crm.Offline.DatabaseModel.Main_Company", inverseProperty: "Offers", defaultValue: null, keys: ["ContactId"] },
	Person: { type: "Crm.Offline.DatabaseModel.Main_Person", inverseProperty: "$$unbound", defaultValue: null, keys: ["ContactPersonId"] },
	ResponsibleUserUser: { type: "Crm.Offline.DatabaseModel.Main_User", inverseProperty: "Offers", defaultValue: null, keys: ["ResponsibleUser"] }
});
window.Helper.Database.registerTable("CrmOrder_Order", {
	Company: { type: "Crm.Offline.DatabaseModel.Main_Company", inverseProperty: "Orders", defaultValue: null, keys: ["ContactId"] },
	Person: { type: "Crm.Offline.DatabaseModel.Main_Person", inverseProperty: "$$unbound", defaultValue: null, keys: ["ContactPersonId"] },
	ResponsibleUserUser: { type: "Crm.Offline.DatabaseModel.Main_User", inverseProperty: "Orders", defaultValue: null, keys: ["ResponsibleUser"] }
});
window.Helper.Database.registerTable("CrmOrder_OrderItem", {
	Article: { type: "Crm.Offline.DatabaseModel.CrmArticle_Article", inverseProperty: "$$unbound", defaultValue: null, keys: ["ArticleId"] }
});
window.Helper.Database.registerTable("Main_Company", {
	Offers: {
		type: "Array",
		elementType: "Crm.Offline.DatabaseModel.CrmOrder_Offer",
		inverseProperty: "Company",
		defaultValue: []
	},
	Orders: {
		type: "Array",
		elementType: "Crm.Offline.DatabaseModel.CrmOrder_Order",
		inverseProperty: "Company",
		defaultValue: []
	}
});
window.Helper.Database.registerTable("Main_User", {
	Offers: { type: "Array", elementType: "Crm.Offline.DatabaseModel.CrmOrder_Offer", inverseProperty: "ResponsibleUserUser", defaultValue: [], keys: ["ResponsibleUser"] },
	Orders: { type: "Array", elementType: "Crm.Offline.DatabaseModel.CrmOrder_Order", inverseProperty: "ResponsibleUserUser", defaultValue: [], keys: ["ResponsibleUser"] }
});
window.Helper.Database.addIndex("CrmArticle_ArticleRelationship", ["ChildId"]);
window.Helper.Database.addIndex("CrmArticle_ArticleRelationship", ["RelationshipTypeKey", "ParentId"]);
window.Helper.Database.addIndex("CrmOrder_Offer", ["ContactId"]);
window.Helper.Database.addIndex("CrmOrder_Offer", ["ResponsibleUser"]);

window.Helper.Database.addIndex("CrmOrder_Order", ["ContactId"]);
window.Helper.Database.addIndex("CrmOrder_Order", ["ResponsibleUser"]);

window.Helper.Database.setTransactionId("CrmOrder_CalculationPosition",
	function(calculationPosition) {
		return new $.Deferred().resolve(calculationPosition.BaseOrderId).promise();
	});
window.Helper.Database.setTransactionId("CrmOrder_Offer",
	function(offer) {
		return new $.Deferred().resolve([offer.Id, offer.BillingAddressId, offer.ContactAddressId, offer.ContactId, offer.ContactPersonId, offer.DeliveryAddressId]).promise();
	});
window.Helper.Database.setTransactionId("CrmOrder_Order",
	function(order) {
		return new $.Deferred().resolve([order.Id, order.BillingAddressId, order.ContactAddressId, order.ContactId, order.ContactPersonId, order.DeliveryAddressId]).promise();
	});
window.Helper.Database.setTransactionId("CrmOrder_OrderItem",
	function(orderItem) {
		return new $.Deferred().resolve(orderItem.OrderId).promise();
	});