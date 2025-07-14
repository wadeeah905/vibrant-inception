///<reference path="../../../../Content/@types/index.d.ts" />
import {namespace} from "../../../../Content/ts/namespace";

export class ServiceOrderNoInvoiceModalViewModel extends window.Main.ViewModels.ViewModelBase {
	loading = ko.observable<boolean>(true);
	serviceOrder = ko.observable<Crm.Service.Rest.Model.ObservableCrmService_ServiceOrderHead>(null);
	errors = ko.validation.group(this.serviceOrder, {deep: true});

	async init(id) {
		let serviceOrder = await window.database.CrmService_ServiceOrderHead.find(id);
		window.database.attachOrGet(serviceOrder);
		this.serviceOrder(serviceOrder.asKoObservable());
		this.serviceOrder().NoInvoiceReasonKey.extend({
			required: {
				params: true,
				message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("Reason"))
			}
		});
	}

	async save() {
		this.loading(true);
		if (this.errors().length > 0) {
			this.loading(false);
			this.errors.showAllMessages();
			return;
		}
		try {
			await window.database.CrmService_ServiceOrderMaterial
				.filter("it.OrderId === this.serviceOrderId", {serviceOrderId: this.serviceOrder().Id()})
				.forEach(serviceOrderMaterial => {
					window.database.attachOrGet(serviceOrderMaterial);
					serviceOrderMaterial.InvoiceQty = 0;
				});
			await window.database.CrmService_ServiceOrderTime
				.filter("it.OrderId === this.serviceOrderId", {serviceOrderId: this.serviceOrder().Id()})
				.forEach(serviceOrderTime => {
					window.database.attachOrGet(serviceOrderTime);
					serviceOrderTime.InvoiceDuration = window.moment.duration(0).toString();
				});
			this.serviceOrder().StatusKey("Closed");
			await window.database.saveChanges();
			this.loading(false);
			$(".modal:visible").modal("hide");
		} catch (e) {
			this.loading(false);
			window.swal(window.Helper.String.getTranslatedString("UnknownError"), window.Helper.String.getTranslatedString("Error_InternalServerError"), "error");
		}
	}
}

namespace("Crm.Service.ViewModels").ServiceOrderNoInvoiceModalViewModel = ServiceOrderNoInvoiceModalViewModel;

