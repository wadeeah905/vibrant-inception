import {EventStore, EventStoreConfig, Model} from "@bryntum/schedulerpro";
import {Absence, Dispatch, SchedulerEvent, SchedulerEventType, ServiceOrderTimePosting} from "./Dispatch";

export enum StoreIds {
	DispatchStore = "DispatchStore",
	AssignmentStore = "AssignmentStore"
}

export class DispatchStore extends EventStore {
	static get $name() {
		return StoreIds.DispatchStore;
	}
	static get $type() {
		return StoreIds.DispatchStore;
	}
	static get defaultConfig(): Partial<EventStoreConfig> {
		return {
			removeUnassignedEvent: false,
			//@ts-ignore
			storeId: StoreIds.DispatchStore
		}
	}
	
	createRecord(data, skipExpose = false, rawData = false) {
		let modelClass = SchedulerEvent as typeof Model;

		if (data instanceof Crm.Service.Rest.Model.CrmService_ServiceOrderDispatch || data instanceof Crm.Service.Rest.Model.CrmService_ServiceOrderTimePosting || data instanceof Crm.Article.Rest.Model.CrmArticle_Article) {
			throw "DispatchStore createRecord data type is not metadata";
		}

		if (data.type == SchedulerEventType.Dispatch) {
			modelClass = Dispatch as typeof Model;
		} else if (data.type == SchedulerEventType.ServiceOrderTimePosting) {
			modelClass = ServiceOrderTimePosting as typeof Model;
		} else if (data.type == SchedulerEventType.Absence) {
			modelClass = Absence as typeof Model;
		}

		return new modelClass(undefined, this, data);
	}
	
	constructor() {
		super();
	}
}
DispatchStore.initClass();