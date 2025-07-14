namespace("Crm.Service.ViewModels").DispatchDetailsDocumentsTabViewModel = function(parentViewModel) {
	var viewModel = this;
	window.Crm.Service.ViewModels.ServiceOrderDetailsDocumentsTabViewModel.apply(viewModel, arguments);
	viewModel.canAddDocument(false);
	viewModel.dispatch = parentViewModel.dispatch;
};
namespace("Crm.Service.ViewModels").DispatchDetailsDocumentsTabViewModel.prototype =
	Object.create(window.Crm.Service.ViewModels.ServiceOrderDetailsDocumentsTabViewModel.prototype);
namespace("Crm.Service.ViewModels").DispatchDetailsDocumentsTabViewModel.prototype.applyFilters = function(query) {
	var viewModel = this;
	query =
		window.Crm.Service.ViewModels.ServiceOrderDetailsDocumentsTabViewModel.prototype.applyFilters.call(viewModel,
			query);
	var dispatchId = null;
	if (viewModel.dispatch()) {
		dispatchId = viewModel.dispatch().Id();
	}
	query = query.filter("it.ExtensionValues.DispatchId === null || it.ExtensionValues.DispatchId === this.dispatchId",
		{ dispatchId: dispatchId });
	return query;
};
namespace("Crm.Service.ViewModels").DispatchDetailsDocumentsTabViewModel.prototype.applyOrderBy = function(query) {
	var viewModel = this;
	var id = null;
	if (viewModel.dispatch() && viewModel.dispatch().CurrentServiceOrderTimeId()) {
		id = viewModel.dispatch().CurrentServiceOrderTimeId();
	}
	query = query.orderByDescending("orderByCurrentServiceOrderTime", { currentServiceOrderTimeId: id });
	return window.Crm.Service.ViewModels.ServiceOrderDetailsDocumentsTabViewModel.prototype.applyOrderBy.call(viewModel,
		query);
};
namespace("Crm.Service.ViewModels").DispatchDetailsDocumentsTabViewModel.prototype.getItemGroup = function(item) {
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
	return window.Crm.Service.ViewModels.DispatchDetailsViewModel.prototype.getServicOrderPositionItemGroup.apply(this,
		arguments);
};