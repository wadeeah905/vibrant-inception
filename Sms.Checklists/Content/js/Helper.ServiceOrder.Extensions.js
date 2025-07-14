/// <reference path="../../../crm.service/content/js/helper/helper.serviceorder.js" />

class HelperServiceOrderExtensions extends window.Helper.ServiceOrder.CreateServiceOrderData {
	createServiceOrderChecklistFromTemplate(serviceOrderChecklistTemplate) {
		const serviceOrderChecklist = window.database.SmsChecklists_ServiceOrderChecklist
			.SmsChecklists_ServiceOrderChecklist.create();
		serviceOrderChecklist.DynamicFormKey = serviceOrderChecklistTemplate.DynamicFormKey;
		serviceOrderChecklist.ExtensionValues = serviceOrderChecklistTemplate.ExtensionValues;
		serviceOrderChecklist.ReferenceKey = this.serviceOrder.Id;
		serviceOrderChecklist.RequiredForServiceOrderCompletion =
			serviceOrderChecklistTemplate.RequiredForServiceOrderCompletion;
		serviceOrderChecklist.SendToCustomer = serviceOrderChecklistTemplate.SendToCustomer;
		window.database.add(serviceOrderChecklist);
		this.serviceOrderData.push(serviceOrderChecklist);
		return serviceOrderChecklist;
	}

	createServiceOrderTimeFromTemplate(serviceOrderTimeTemplate) {
		return super.createServiceOrderTimeFromTemplate.apply(this, arguments).then((serviceOrderTime) => {
			return window.database.SmsChecklists_ServiceOrderChecklist.filter("it.ServiceOrderTimeKey === this.serviceOrderTimeId",
				{serviceOrderTimeId: serviceOrderTimeTemplate.Id})
				.toArray()
				.then((serviceOrderChecklistTemplates) => {
					serviceOrderChecklistTemplates.forEach((serviceOrderChecklistTemplate) => {
						const serviceOrderChecklist =
							this.createServiceOrderChecklistFromTemplate(serviceOrderChecklistTemplate);
						serviceOrderChecklist.ServiceOrderTimeKey = serviceOrderTime.Id;
					});
					return serviceOrderTime;
				});
		});
	}

	createTemplateData() {
		return super.createTemplateData.apply(this, arguments).then((result) => {
			return window.database.SmsChecklists_ServiceOrderChecklist.filter(function (it) {
					return it.ReferenceKey === this.serviceOrderTemplateId && it.ServiceOrderTimeKey === null;
				},
				{serviceOrderTemplateId: this.serviceOrderTemplate.Id})
				.toArray()
				.then((serviceOrderChecklistTemplates) => {
					serviceOrderChecklistTemplates.forEach((serviceOrderChecklistTemplate) => {
						this.createServiceOrderChecklistFromTemplate(serviceOrderChecklistTemplate);
					});
					return result;
				});
		});
	}

}


(window.Helper.ServiceOrder = window.Helper.ServiceOrder || {}).CreateServiceOrderData = HelperServiceOrderExtensions;