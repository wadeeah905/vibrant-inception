namespace("Crm.Service.ViewModels").ServiceOrderDetailsDocumentsTabViewModel = function(parentViewModel) {
	var viewModel = this;
	window.Main.ViewModels.ContactDetailsDocumentsTabViewModel.call(viewModel, arguments);
	viewModel.serviceOrder = parentViewModel.serviceOrder;
	viewModel.orderBy(["FileName"]);
	viewModel.orderByDirection(["ASC"]);
	viewModel.contactId(viewModel.serviceOrder().Id());
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsDocumentsTabViewModel.prototype =
	Object.create(window.Main.ViewModels.ContactDetailsDocumentsTabViewModel.prototype);
namespace("Crm.Service.ViewModels").ServiceOrderDetailsDocumentsTabViewModel.prototype.applyJoins = function(query) {
	var viewModel = this;
	query = query.include("expandDocumentAttributeExtension");
	return window.Main.ViewModels.ContactDetailsDocumentsTabViewModel.prototype.applyJoins.call(viewModel, query);
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsDocumentsTabViewModel.prototype.applyFilters = function(query) {
	var viewModel = this;
	query = window.Main.ViewModels.ContactDetailsDocumentsTabViewModel.prototype.applyFilters.call(viewModel, query);
	query = query.filter("it.ReferenceKey === this.orderId", { orderId: viewModel.serviceOrder().Id() });
	return query;
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsDocumentsTabViewModel.prototype.applyOrderBy = function(query) {
	const viewModel = this;
	const dispatch = ko.unwrap(viewModel.dispatch);
	const serviceOrderTimeId = dispatch ? dispatch.CurrentServiceOrderTimeId() : null;
	query = query.orderByDescending("orderByCurrentServiceOrderTime", { currentServiceOrderTimeId: serviceOrderTimeId });
	return window.Main.ViewModels.ContactDetailsDocumentsTabViewModel.prototype.applyOrderBy.call(viewModel,
		query);
};
namespace("Crm.Service.ViewModels").ServiceOrderDetailsDocumentsTabViewModel.prototype.getItemGroup = function(item) {
	if (!item.ServiceOrderTime) {
		var dynamicProperties = item.ExtensionValues().DynamicProperties();
		var serviceOrderTime = dynamicProperties.ServiceOrderTime ? JSON.parse(dynamicProperties.ServiceOrderTime) : null;
		var installation = dynamicProperties.ServiceOrderTimeInstallation ? JSON.parse(dynamicProperties.ServiceOrderTimeInstallation) : null;
		if (serviceOrderTime && installation) {
			serviceOrderTime.Installation = installation;
		}
		if (serviceOrderTime) {
			var serviceOrderTimeObservable =
				new database.CrmService_ServiceOrderTime.createNew(serviceOrderTime).asKoObservable();
			item.ServiceOrderTime = ko.pureComputed(function () { return this }, serviceOrderTimeObservable);
		} else {
			item.ServiceOrderTime = ko.observable(null);
		}
	}
	return window.Helper.ServiceOrder.getServiceOrderPositionItemGroup(item);
};