import { DateHelper, EventModel, EventModelConfig, Store } from "@bryntum/schedulerpro";
import {Lazy, LazyOfTTMetadata} from "../Lazy";
import { ServiceOrder } from "./ServiceOrder";

export enum SchedulerEventType {
	Absence = "Absence",
	Dispatch = "ServiceOrderDispatch",
	ServiceOrderTimePosting = "ServiceOrderTimePosting"
}

type AbsenceMetaData = {
	type: SchedulerEventType.Absence,
	data: Sms.Scheduler.Rest.Model.SmsScheduler_Absence | Crm.Article.Rest.Model.CrmArticle_ArticleDowntime,
	typeData: Crm.PerDiem.Rest.Model.Lookups.CrmPerDiem_TimeEntryType | Crm.Article.Model.Lookups.CrmArticle_ArticleDowntimeReason
}

type DispatchMetaData = {
	type: SchedulerEventType.Dispatch,
	data: Crm.Service.Rest.Model.CrmService_ServiceOrderDispatch,
	serviceOrder: ServiceOrder,
	timePostings?: ServiceOrderTimePosting[]
}

type ServiceOrderTimePostingMetaData = {
	type: SchedulerEventType.ServiceOrderTimePosting,
	data: Crm.Service.Rest.Model.CrmService_ServiceOrderTimePosting
}

export class SchedulerEvent extends EventModel {
	readonly type: SchedulerEventType;
	Username: string;

	static readonly defaultDurationUnit = "minute";

	static get $name() {
		return 'SchedulerEvent';
	}
	static get fields(): { name: string, type?: string, dataSource?: string, defaultValue?: unknown}[] {
		return [
			{ name: 'durationUnit', defaultValue: SchedulerEvent.defaultDurationUnit },
			{ name: 'Username', type: 'string' }
		]
	}
	
	constructor(config?: Partial<EventModelConfig>, store?: Store, meta?: object) {
		super(config, store, meta);
	}
	get Color(): string {
		throw new Error('Not implemented for base type SchedulerEvent!');
	}
}

export class Absence extends SchedulerEvent {
	type = SchedulerEventType.Absence;

	static get $name() {
		return 'Absence';
	}
	OriginalData: any;
	ResourceKey: any;
	AbsenceTypeData: Crm.PerDiem.Rest.Model.Lookups.CrmPerDiem_TimeEntryType | Crm.Article.Model.Lookups.CrmArticle_ArticleDowntimeReason;

	static get fields() {
		return [
			{ name: 'OriginalData', type: 'object'},
			{ name: 'AbsenceTypeData', type: 'object'},
			{ name: 'id', type: 'string', dataSource: 'OriginalData.Id' },
		]
	}
	//@ts-ignore
	public get name(): string {
		return this.OriginalData.Description;
	}
	
	public get AbsenceType(): string {
		return this.AbsenceTypeData.Value;
	}
	
	constructor(config?: Partial<EventModelConfig>, store?: Store, meta?: AbsenceMetaData) {
		super(config, store, meta);

		this.ignoreResourceCalendar = true;
		this.OriginalData = meta.data;
		this.AbsenceTypeData = meta.typeData;
		this.duration = window.moment(meta.data.To).diff(meta.data.From, this.durationUnit as any, true);
		this.manuallyScheduled = true;
	}
	get Color(): string {
		return this.AbsenceTypeData.Color;
	}
	//@ts-ignore
	public get readOnly() {
		return this.OriginalData instanceof Crm.PerDiem.Rest.Model.CrmPerDiem_UserTimeEntry;
	}
}
export class Dispatch extends SchedulerEvent {
	type = SchedulerEventType.Dispatch

	static get $name() {
		return 'Dispatch';
	}
	OriginalData: Crm.Service.Rest.Model.CrmService_ServiceOrderDispatch;
	private ___ServiceOrder: Lazy<ServiceOrder>;
	_Status: LazyOfTTMetadata<any, string> = null;
	private _NetWorkMinutes: LazyOfTTMetadata<any, number> = null;

	TimePostings: ServiceOrderTimePosting[]

	static readonly lookups: LookupType = {};
	static get fields() {
		return [
			{ name: 'OriginalData', type: 'object'},
			{ name: 'id', type: 'string', dataSource: 'OriginalData.Id' },
			{ name: 'ServiceOrder', type: 'object' },
			{ name: 'CreateUser', type: 'string', dataSource: 'OriginalData.CreateUser' },
			{ name: 'CreateDate', type: 'Date', dataSource: 'OriginalData.CreateDate' },
			{ name: 'ModifyUser', type: 'string', dataSource: 'OriginalData.ModifyUser' },
			{ name: 'ModifyDate', type: 'Date', dataSource: 'OriginalData.ModifyDate' },
			{ name: 'Date', type: 'Date', dataSource: 'OriginalData.Date' },
			{ name: 'EndDate', type: 'Date', dataSource: 'OriginalData.EndDate' },
			{ name: 'manuallyScheduled', type: 'boolean', defaultValue: `${JSON.parse(window.Sms.Scheduler.Settings.WorkingTime.IgnoreWorkingTimesInEndDateCalculation)}` },
		]
	}

	constructor(config?: Partial<EventModelConfig>, store?: Store, meta?: DispatchMetaData) {
		super(config, store, meta);

		this.OriginalData = meta.data;

		this.startDate = meta.data.Date;

		if (!!meta.data.NetWorkMinutes) {
			this.duration = DateHelper.as(this.durationUnit, meta.data.NetWorkMinutes, "minute");
		} else {
			this.duration = null;
			this.manuallyScheduled = true;
		}

		this.endDate = meta.data.EndDate;

		if (meta.serviceOrder) {
			this.___ServiceOrder = new Lazy(() => meta.serviceOrder);
		} else {
			if (this.OriginalData.ServiceOrder) {
				this.___ServiceOrder = new Lazy(() => new ServiceOrder(undefined, undefined, this.OriginalData.ServiceOrder));
			} else {
				throw new Error("Dispatch constructor needs ServiceOrder.");
			}
		}

		this.TimePostings = meta.timePostings ?? [];
	}
	public get StartTime() {
		return this.OriginalData.Date;
	}

	public get ServiceOrder() {
		return this.___ServiceOrder.value;
	}
	public get dispatchInEditableState() {
		return window.Sms.Scheduler.Settings.DispatchesAfterReleaseAreEditable || ['Scheduled', 'Released', 'Read'].includes(this.OriginalData.StatusKey);
	}
	
	public get readonly() {
		return ['Rejected', 'ClosedNotComplete', 'ClosedComplete'].includes(this.OriginalData.StatusKey) || !this.dispatchInEditableState;
	}

	//@ts-ignore
	public get name(): string {
		return this.ServiceOrder.OriginalData.OrderNo;
	}

	//@ts-ignore
	public get draggable() {
		return this.isLeaf && !this.readonly;
	}	
	//@ts-ignore
	public get resizable() {
		return this.draggable;
	}
	public get OrderId() {
		return this.OriginalData.OrderId;
	}

	public get NetWorkMinutes() {
		let key = this.OriginalData.NetWorkMinutes;
		if (this._NetWorkMinutes == null || this._NetWorkMinutes.Metadata !== key) {
			let result = null;

			if (this.OriginalData.NetWorkMinutes != null && this.OriginalData.NetWorkMinutes != undefined) {
				const formatted = window.moment.duration(key, "minute").format();

				result = {
					valueOf: () => key,
					toString: () => formatted
				};
			}

			this._NetWorkMinutes = new LazyOfTTMetadata(() => result, key);
		}
		return this._NetWorkMinutes.value;
	}

	public get ResourceKey() {
		return this.OriginalData.Username;
	}
	public isTeamDispatch() {
		return this.assignments.length > 1;
	}
	get Status(): Crm.Service.Rest.Model.Lookups.CrmService_ServiceOrderDispatchStatus {
		let key = this.OriginalData.StatusKey;
		if (this._Status == null || this._Status.Metadata != key) {
			this._Status = new LazyOfTTMetadata(() => window.Helper.Scheduler.CreateLookupProxy(Dispatch.lookups.serviceOrderDispatchStatuses, key), key);
		}
		return this._Status.value;
	}
	get Color(): string {
		return this.Status.Color;
	}
	get Remark(): string {
		return this.OriginalData.Remark;
	}
	set Remark(value: string) {
		this.OriginalData.Remark = ko.unwrap(value);
	}
	
	getRowData(propertyName: string[]): string[] {
		return propertyName.map(p => this.get(p.replace("ServiceOrderDispatch", "OriginalData"))).filter(Boolean);
	}
}

export class ServiceOrderTimePosting extends SchedulerEvent {
	type = SchedulerEventType.ServiceOrderTimePosting

	static get $name() {
		return 'ServiceOrderTimePosting';
	}
	OriginalData: Crm.Service.Rest.Model.CrmService_ServiceOrderTimePosting;

	static get fields() {
		return [
			{ name: 'OriginalData', type: 'object'},
			{ name: 'name', type: 'string', dataSource: 'OriginalData.ItemNo' },
			{ name: 'id', type: 'string', dataSource: 'OriginalData.Id' },
		]
	}

	//constructor(data = null) {
	constructor(config?: Partial<EventModelConfig>, store?: Store, meta?: ServiceOrderTimePostingMetaData) {
		super(config, store, meta);

		this.OriginalData = meta.data;
		this.draggable = false;
		this.resizable = false;
		this.startDate = meta.data.From;
		this.endDate = meta.data.To;
		this.duration = DateHelper.diff(meta.data.From, meta.data.To, this.durationUnit);
		this.schedulingMode = 'FixedDuration';
		this.manuallyScheduled = true;
	}
}