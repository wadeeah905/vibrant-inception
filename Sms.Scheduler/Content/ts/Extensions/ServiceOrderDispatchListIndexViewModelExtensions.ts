import {Mixin} from "ts-mixer";
import {asyncComputed} from "../knockout-async-computed";
import {namespace} from "@Main/namespace";
import {ServiceOrderDispatchListIndexViewModel} from "@Crm.Service/ServiceOrderDispatchListIndexViewModel";

export class ServiceOrderDispatchListIndexViewModelExtension extends ServiceOrderDispatchListIndexViewModel {
	computedDispatches = new Map();
	schedulerBroadcastChannel: BroadcastChannel = null;
	isPlanningBoardOpen: boolean = false;
	constructor(parentViewModel: any) {
		super(parentViewModel);
		this.schedulerBroadcastChannel = new BroadcastChannel("planning-board-integration");

		this.schedulerBroadcastChannel.onmessage = (event) => {
			if(event && event.data.type === 'PlanningBoardReady') {
				this.isPlanningBoardOpen = true;
			}
		};
	}
	showInSchedulerButton = (dispatch: Crm.Service.Rest.Model.ObservableCrmService_ServiceOrderDispatch) => {
		if(!window.AuthorizationManager.currentUserHasPermission("Scheduler::View")) {
			return;
		}
		if(this.computedDispatches.has(dispatch.Id())) {
			return this.computedDispatches.get(dispatch.Id());
		}
		
		return asyncComputed(async () => {
			if (window?.Helper?.Offline?.status === "offline") {
				return false;
			}
			const currentUser = await window.Helper.User.getCurrentUser();
			let predicate = `it.Username == '${currentUser.Id}' && it.Id == ${currentUser.ExtensionValues.ActiveProfileId}`;
			let profile = await window.database.SmsScheduler_Profile.filter(predicate).toArray();
			
			if(!profile[0]) {
				this.computedDispatches.set(dispatch.Id(), false);
				return false;
			}

			let resourceCount = await window.database.SmsScheduler_ProfileResource.filter("it.ProfileKey == profileId && it.ResourceKey == resourceId", {
				profileId: profile[0].Id,
				resourceId: dispatch.Username()
			}).count();

			this.computedDispatches.set(dispatch.Id(), resourceCount != 0);
			return resourceCount != 0;
		}, false) as KnockoutObservable<boolean>;
	};
	
	openDispatchInPlanningBoard = (dispatch: Crm.Service.Rest.Model.ObservableCrmService_ServiceOrderDispatch) => {
		this.schedulerBroadcastChannel.postMessage({
			type: 'DiscoverOpenPlanningBoard'
		});
		setTimeout(() => {
			if(this.isPlanningBoardOpen) {
				this.schedulerBroadcastChannel.postMessage({
					type: 'ScrollToDispatch',
					id: dispatch.Id(),
					startDate: dispatch.Date()
				});
				this.isPlanningBoardOpen = false;
			} else {
				window.location.href = `#/Sms.Scheduler/Scheduler/DetailsTemplate/${dispatch.Id()}?startDate=${dispatch.Date()}`;
			}
		}, 300);
	}
}

namespace("Crm.Service.ViewModels").ServiceOrderDispatchListIndexViewModel = Mixin(ServiceOrderDispatchListIndexViewModelExtension);