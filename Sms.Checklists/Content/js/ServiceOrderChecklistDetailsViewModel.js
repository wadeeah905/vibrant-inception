
namespace("Sms.Checklists.ViewModels").ServiceOrderChecklistDetailsViewModel = function () {
	var self = this;

	self.iOSdevice = (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false);
	self.CustomerContact = window.ko.observable(null);
	self.Installation = window.ko.observable(null);
	self.ServiceOrder = window.ko.observable(null);
	self.ServiceOrderResponsibleUser = window.ko.observable(null);
	self.MaintenanceOrderGenerationMode = "";

	window.Crm.DynamicForms.ViewModels.DynamicFormDetailsViewModel.apply(this, arguments);
};
Sms.Checklists.ViewModels.ServiceOrderChecklistDetailsViewModel.prototype = Object.create(window.Crm.DynamicForms.ViewModels.DynamicFormDetailsViewModel.prototype);
Sms.Checklists.ViewModels.ServiceOrderChecklistDetailsViewModel.prototype.init = async function (id, routeValues) {
	var args = arguments;
	var self = this;
	var result;
	if (typeof id === "object" && !routeValues) {
		routeValues = id;
	}
	await window.Crm.Offline.Bootstrapper.initializeSettings();
	if (routeValues.DynamicFormReference) {
		result = window.Crm.DynamicForms.ViewModels.DynamicFormDetailsViewModel.prototype.init.apply(this, arguments);
	} else {
		result = window.database.SmsChecklists_ServiceOrderChecklist
			.include("DynamicForm")
			.includeDynamicFormElements()
			.include("Responses")
			.include("ServiceOrder")
			.include("ServiceOrder.CustomerContact")
			.include("ServiceOrder.CustomerContact.Company")
			.include("ServiceOrder.ResponsibleUserUser")
			.include("ServiceOrder.Country")
			.include("ServiceOrderTime.Installation")
			.find(routeValues.id)
			.then(function (serviceOrderChecklist) {
				routeValues.formReference = serviceOrderChecklist.asKoObservable();
				// Initialize the observables with proper data
				if (serviceOrderChecklist.ServiceOrder) {
					self.ServiceOrder(serviceOrderChecklist.ServiceOrder.asKoObservable());
					if (serviceOrderChecklist.ServiceOrder.CustomerContact) {
						self.CustomerContact(serviceOrderChecklist.ServiceOrder.CustomerContact.asKoObservable());
					}
					if (serviceOrderChecklist.ServiceOrder.ResponsibleUserUser) {
						self.ServiceOrderResponsibleUser(serviceOrderChecklist.ServiceOrder.ResponsibleUserUser.asKoObservable());
					}
				}
				if (serviceOrderChecklist.Installation) {
					self.Installation(serviceOrderChecklist.Installation.asKoObservable());
				}
				// Ensure MaintenanceOrderGenerationMode is set
				self.MaintenanceOrderGenerationMode = window.Crm.Offline.Bootstrapper.settings.getValue("Service.MaintenanceOrderGenerationMode") || "";
				return window.Crm.DynamicForms.ViewModels.DynamicFormDetailsViewModel.prototype.init.apply(self, args);
			});
	}
	return result.then(function () {
		if (!!routeValues.dispatch) {
			self.formReference().DispatchId(routeValues.dispatch().Id());
		}
	});
};
