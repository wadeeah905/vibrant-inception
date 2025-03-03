import {AssignmentStore, AssignmentStoreConfig, Model} from "@bryntum/schedulerpro";
import {Assignment} from "./Assignment";
import {Technician} from "./Technicians";
import type {Dispatch} from "./Dispatch";
import type {Absence} from "./Dispatch";
import type {Tool} from "./Tools";
import type {Vehicle} from "./Vehicle";
import { StoreIds } from "./DispatchStore";

export class CrmAssignmentStore extends AssignmentStore {
	static get $name() {
		return 'CrmAssignmentStore';
	}	
	static get $type() {
		return 'CrmAssignmentStore';
	}
	static get defaultConfig(): Partial<AssignmentStoreConfig> {
		return {
			modelClass: Assignment,
			//@ts-ignore
			storeId: StoreIds.AssignmentStore
		}
	}
	
	createRecord(data: { event: (Dispatch | Absence), resource: (Technician | Tool | Vehicle) } , skipExpose?: boolean) {
		let modelClass = Assignment as typeof Model;
		let assignment = (data.resource.constructor === Technician) 
			? window.database.SmsScheduler_DispatchPersonAssignment.defaultType.create()
			: window.database.SmsScheduler_DispatchArticleAssignment.defaultType.create();
		assignment.Id = window.$data.createGuid().toString().toLowerCase();
		assignment.DispatchKey = data.event.id as string;
		assignment.ResourceKey = data.resource.id as string;
		//@ts-ignore
		return new modelClass(assignment, this);
	}
	
	constructor() {
		super();
	}
}

CrmAssignmentStore.initClass();