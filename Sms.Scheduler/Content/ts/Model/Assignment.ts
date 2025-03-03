import {AssignmentModel} from "@bryntum/schedulerpro";

export class Assignment extends AssignmentModel {
	static get $name() {
		return 'Assignment';
	}	
	static get $type() {
		return 'Assignment';
	}
	
	type: string;
	OriginalData: Sms.Scheduler.Rest.Model.SmsScheduler_DispatchPersonAssignment;

	constructor(data = null) {
		super({ id: data?.Id, eventId: data?.DispatchKey, resourceId: data?.ResourceKey });
		this.type = "Assignment";
		this.OriginalData = data;
	}
}