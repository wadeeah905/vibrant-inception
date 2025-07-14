///<reference path="../../../../Content/@types/index.d.ts" />
import {namespace} from "../../../../Content/ts/namespace";

export class DispatchDetailsRelatedOrdersTabViewModel extends window.Main.ViewModels.ViewModelBase {
	lists: KnockoutObservableArray<any> = ko.observableArray([]);
	dispatch: KnockoutObservable<any>;
	serviceOrder: KnockoutObservable<any>;

	constructor(parentViewModel) {
		super();
		this.dispatch = parentViewModel.dispatch;
		this.serviceOrder = parentViewModel.serviceOrder;
	}

	async init(): Promise<void> {
		if (this.serviceOrder().MaintenancePlanningRun() !== null) {
			let dispatchesForMaintenancePlanningRunViewModel = new window.Crm.Service.ViewModels.ServiceOrderDispatchListIndexViewModel();
			dispatchesForMaintenancePlanningRunViewModel.bookmark(dispatchesForMaintenancePlanningRunViewModel.bookmarks().find(x => x.Key === "AllDispatches") || dispatchesForMaintenancePlanningRunViewModel.bookmark());
			dispatchesForMaintenancePlanningRunViewModel.getFilter("ServiceOrder.MaintenancePlanningRun").extend({filterOperator: "==="})(this.serviceOrder().MaintenancePlanningRun());
			dispatchesForMaintenancePlanningRunViewModel.getFilter("Id").extend({filterOperator: "!=="})(this.dispatch().Id());
			this.lists.push({
				title: "RelatedDispatchesForMaintenancePlanningRun",
				type: "dispatch",
				viewModel: dispatchesForMaintenancePlanningRunViewModel
			});
			let serviceOrdersForMaintenancePlanningRunViewModel = new window.Crm.Service.ViewModels.ServiceOrderHeadListIndexViewModel();
			serviceOrdersForMaintenancePlanningRunViewModel.getFilter("MaintenancePlanningRun").extend({filterOperator: "==="})(this.serviceOrder().MaintenancePlanningRun());
			serviceOrdersForMaintenancePlanningRunViewModel.getFilter("Id").extend({filterOperator: "!=="})(this.serviceOrder().Id());
			this.lists.push({
				subtitle: "ReadyForScheduling",
				title: "RelatedOrdersForMaintenancePlanningRun",
				type: "serviceOrder",
				viewModel: serviceOrdersForMaintenancePlanningRunViewModel
			});
		}
		if (this.serviceOrder().InstallationId() !== null) {
			let dispatchesForInstallationViewModel = new window.Crm.Service.ViewModels.ServiceOrderDispatchListIndexViewModel();
			dispatchesForInstallationViewModel.bookmark(dispatchesForInstallationViewModel.bookmarks().find(x => x.Key === "AllDispatches") || dispatchesForInstallationViewModel.bookmark());
			dispatchesForInstallationViewModel.getFilter("ServiceOrder.InstallationId").extend({filterOperator: "==="})(this.serviceOrder().InstallationId());
			dispatchesForInstallationViewModel.getFilter("Id").extend({filterOperator: "!=="})(this.dispatch().Id());
			dispatchesForInstallationViewModel.joins.remove(x => (x.Selector || x).match(/\bInstallation\b/));
			this.lists.push({
				title: "RelatedDispatchesForInstallation",
				type: "dispatch",
				viewModel: dispatchesForInstallationViewModel
			});
			let serviceOrdersForInstallationViewModel = new window.Crm.Service.ViewModels.ServiceOrderHeadListIndexViewModel();
			serviceOrdersForInstallationViewModel.getFilter("InstallationId").extend({filterOperator: "==="})(this.serviceOrder().InstallationId());
			serviceOrdersForInstallationViewModel.getFilter("Id").extend({filterOperator: "!=="})(this.serviceOrder().Id());
			serviceOrdersForInstallationViewModel.joins.remove(x => (x.Selector || x).match(/\bInstallation\b/));
			this.lists.push({
				subtitle: "ReadyForScheduling",
				title: "RelatedOrdersForInstallation",
				type: "serviceOrder",
				viewModel: serviceOrdersForInstallationViewModel
			});
		}
		if (this.serviceOrder().ServiceOrderTimes().length > 0) {
			let serviceOrdersForInstallationViewModel = new window.Crm.Service.ViewModels.ServiceOrderHeadListIndexViewModel(this);
			serviceOrdersForInstallationViewModel.joins.remove(x => (x.Selector || x).match(/\bInstallation\b/));
			let originalServiceOrdersApplyFilters = serviceOrdersForInstallationViewModel.applyFilters;
			serviceOrdersForInstallationViewModel.applyFilters = function (query) {
				let viewModel = this;
				let parentVm = this.parentViewModel;
				let ids = parentVm.serviceOrder().ServiceOrderTimes().map(j => j.InstallationId())
				let orderId = parentVm.serviceOrder().Id();
				if (window.database.storageProvider.name === "oData") {
					query = query.filter("it.ServiceOrderTimes.some(function(it2){ return it2.InstallationId in this.ids; }) && it.Id !== this.orderId", {ids: ids, orderId: orderId});
				} else {
					return query.filter("it.ServiceOrderTimes.InstallationId in this.ids && it.Id !== this.orderId", {ids: ids, orderId: orderId});
				}
				query = originalServiceOrdersApplyFilters.call(viewModel, query);
				return query;
			}
			this.lists.push({
				subtitle: "ReadyForScheduling",
				title: "RelatedOrdersForInstallation",
				type: "serviceOrder",
				viewModel: serviceOrdersForInstallationViewModel
			});
			let dispatchesForServiceOrderTimeViewModel = new window.Crm.Service.ViewModels.ServiceOrderDispatchListIndexViewModel(this);
			dispatchesForServiceOrderTimeViewModel.bookmark(dispatchesForServiceOrderTimeViewModel.bookmarks().find(x => x.Key === "AllDispatches") || dispatchesForServiceOrderTimeViewModel.bookmark());
			dispatchesForServiceOrderTimeViewModel.joins.remove(x => (x.Selector || x).match(/\bInstallation\b/));
			if (window.database.storageProvider.name !== "oData") {
				let originalDispatchesApplyFilters = dispatchesForServiceOrderTimeViewModel.applyFilters;
				dispatchesForServiceOrderTimeViewModel.applyFilters = function (query) {
					let viewModel = this;
					let parentVm = this.parentViewModel;
					query = query.filter("it.ServiceOrder.ServiceOrderTimes.InstallationId in this.ids && it.Id !== this.id", {ids: parentVm.serviceOrder().ServiceOrderTimes().map(j => j.InstallationId()), id: parentVm.dispatch().Id()});
					query = originalDispatchesApplyFilters.call(viewModel, query);
					return query;
				}
			} else {
				let originalDispatchesInitItems = dispatchesForServiceOrderTimeViewModel.initItems;
				dispatchesForServiceOrderTimeViewModel.initItems = function (items) {
					let viewModel = this;
					let parentVm = this.parentViewModel;
					let ids = parentVm.serviceOrder().ServiceOrderTimes().map(j => j.InstallationId());
					items = items.filter(i => {
						return i.ServiceOrder().ServiceOrderTimes().some(time => {
							return ids.includes(time.InstallationId())
						}) && i.Id() !== parentVm.dispatch().Id();
					})
					return originalDispatchesInitItems.call(viewModel, items);
				}
			}
			this.lists.push({
				title: "RelatedDispatchesForInstallation",
				type: "dispatch",
				viewModel: dispatchesForServiceOrderTimeViewModel
			});
		}
		if (this.serviceOrder().CustomerContactId() !== null) {
			let dispatchesForCustomerViewModel = new window.Crm.Service.ViewModels.ServiceOrderDispatchListIndexViewModel();
			dispatchesForCustomerViewModel.bookmark(dispatchesForCustomerViewModel.bookmarks().find(x => x.Key === "AllDispatches") || dispatchesForCustomerViewModel.bookmark());
			dispatchesForCustomerViewModel.getFilter("ServiceOrder.CustomerContactId").extend({filterOperator: "==="})(this.serviceOrder().CustomerContactId());
			dispatchesForCustomerViewModel.getFilter("Id").extend({filterOperator: "!=="})(this.dispatch().Id());
			dispatchesForCustomerViewModel.joins.remove(x => (x.Selector || x).match(/\bCompany\b/));
			this.lists.push({
				title: "RelatedDispatchesForCustomer",
				type: "dispatch",
				viewModel: dispatchesForCustomerViewModel
			});
			let serviceOrdersForCustomerViewModel = new window.Crm.Service.ViewModels.ServiceOrderHeadListIndexViewModel();
			serviceOrdersForCustomerViewModel.getFilter("CustomerContactId").extend({filterOperator: "==="})(this.serviceOrder().CustomerContactId());
			serviceOrdersForCustomerViewModel.getFilter("Id").extend({filterOperator: "!=="})(this.serviceOrder().Id());
			serviceOrdersForCustomerViewModel.joins.remove(x => (x.Selector || x).match(/\bCompany\b/));
			this.lists.push({
				subtitle: "ReadyForScheduling",
				title: "RelatedOrdersForCustomer",
				type: "serviceOrder",
				viewModel: serviceOrdersForCustomerViewModel
			});
		}
		if (this.serviceOrder().ServiceObjectId() !== null) {
			let dispatchesForServiceObjectViewModel = new window.Crm.Service.ViewModels.ServiceOrderDispatchListIndexViewModel();
			dispatchesForServiceObjectViewModel.bookmark(dispatchesForServiceObjectViewModel.bookmarks().find(x => x.Key === "AllDispatches") || dispatchesForServiceObjectViewModel.bookmark());
			dispatchesForServiceObjectViewModel.getFilter("ServiceOrder.ServiceObjectId").extend({filterOperator: "==="})(this.serviceOrder().ServiceObjectId());
			dispatchesForServiceObjectViewModel.getFilter("Id").extend({filterOperator: "!=="})(this.dispatch().Id());
			dispatchesForServiceObjectViewModel.joins.remove(x => (x.Selector || x).match(/\bServiceObject\b/));
			this.lists.push({
				title: "RelatedDispatchesForServiceObject",
				type: "dispatch",
				viewModel: dispatchesForServiceObjectViewModel
			});
			let serviceOrdersForServiceObjectViewModel = new window.Crm.Service.ViewModels.ServiceOrderHeadListIndexViewModel();
			serviceOrdersForServiceObjectViewModel.getFilter("ServiceObjectId").extend({filterOperator: "==="})(this.serviceOrder().ServiceObjectId());
			serviceOrdersForServiceObjectViewModel.getFilter("Id").extend({filterOperator: "!=="})(this.serviceOrder().Id());
			serviceOrdersForServiceObjectViewModel.joins.remove(x => (x.Selector || x).match(/\bServiceObject\b/));
			this.lists.push({
				subtitle: "ReadyForScheduling",
				title: "RelatedOrdersForServiceObject",
				type: "serviceOrder",
				viewModel: serviceOrdersForServiceObjectViewModel
			});
		}
		await Promise.all(this.lists().map(x => {
			x.viewModel.infiniteScroll(false);
			return x.viewModel.init();
		}));
		this.lists().forEach(x => {
			x.viewModel.bulkActions([]);
			x.viewModel.loading(false);
			x.viewModel.loading.subscribe(() => {
				this.loading(this.lists().some(list => list.viewModel.loading()));
			});
		});
	}
}

namespace("Crm.Service.ViewModels").DispatchDetailsRelatedOrdersTabViewModel = DispatchDetailsRelatedOrdersTabViewModel;