import { GridRowModel, EventModelConfig, Store } from "@bryntum/schedulerpro";
import _ from "lodash";
import moment from "moment";
import { LazyOfTTMetadata } from "../Lazy";

export enum OrderType {
	ServiceOrder = "ServiceOrder",
	AbsenceOrder = "AbsenceOrder",
	ArticleDowntime = "ArticleDowntime"
}
export class BaseOrder extends GridRowModel {
	type;
	name: string;
	static get $name() {
		return 'BaseOrder';
	}

	static get fields() {
		return [
			{name: 'id', type: 'string'},
			{name: 'name', type: 'string'},
		]
	}

	override toString() {
		return this.name;
	}
}
export class ServiceOrder extends BaseOrder {
	OriginalData: Crm.Service.Rest.Model.CrmService_ServiceOrderHead;
	_Status: LazyOfTTMetadata<any,string> = null;
	_StatusGroup: LazyOfTTMetadata<any,string> = null;
	_Type: LazyOfTTMetadata<any,string> = null;
	_Country: LazyOfTTMetadata<any,string> = null;
	_Region: LazyOfTTMetadata<any,string> = null;
	_Priority: LazyOfTTMetadata<any, string> = null;
	_Skills: LazyOfTTMetadata<any, string[]> = null;
	_Assets: LazyOfTTMetadata<any, string[]> = null;
	_ServiceObjectCategory: LazyOfTTMetadata<any, string> = null;
	_InstallationType: LazyOfTTMetadata<any, string> = null;
	_InstallationStatus: LazyOfTTMetadata<any, string> = null;
	_PlannedDuration: LazyOfTTMetadata<number, string[]> = null;

	static get $name() {
		return 'ServiceOrder';
	}
	constructor(config?: Partial<EventModelConfig>, store?: Store, meta?: Crm.Service.Rest.Model.CrmService_ServiceOrderHead) {
		super(config, store, meta);
		this.OriginalData = meta;
		this.type = OrderType.ServiceOrder;
	}
	
	get Status(): Crm.Service.Rest.Model.Lookups.CrmService_ServiceOrderStatus {
		let key = this.OriginalData.StatusKey;
		if (this._Status == null || this._Status.Metadata != key) {
			this._Status = new LazyOfTTMetadata(() => window.Helper.Scheduler.CreateLookupProxy(ServiceOrder.lookups.serviceOrderStatuses, key), key);
		}
		return this._Status.value;
	}

	get StatusGroup() {
		let key = this.OriginalData.StatusKey;
		if (this._StatusGroup == null || this._StatusGroup.Metadata != key) {
			let group: string;
			let sortOrder: number;

			if (key === 'New' || key === 'ReadyForScheduling') {
				group = window.Helper.getTranslatedString('New');
				sortOrder = 1;
			} else if (key === 'PartiallyCompleted') {
				group = window.Helper.getTranslatedString('FollowUpServiceOrderNeeded');
				sortOrder = 2;
			} else if (key) {
				group = window.Helper.getTranslatedString('DispatchStatus.Scheduled');
				sortOrder = 3;
			} else {
				group = window.Helper.String.getTranslatedString("Unspecified");
				sortOrder = Number.MAX_SAFE_INTEGER;
			}

			this._StatusGroup = new LazyOfTTMetadata(() => ({
				toString: () => group,
				SortOrder: sortOrder
			}), key);
		}
		return this._StatusGroup.value;
	}

	get Type(): Crm.Service.Rest.Model.Lookups.CrmService_ServiceOrderType {
		let key = this.OriginalData.TypeKey;
		if (this._Type == null || this._Type.Metadata != key) {
			this._Type = new LazyOfTTMetadata(() => window.Helper.Scheduler.CreateLookupProxy(ServiceOrder.lookups.serviceOrderTypes, key), key);
		}
		return this._Type.value;
	}

	get Country(): Main.Rest.Model.Lookups.Main_Country {
		let key = this.OriginalData.CountryKey;
		if (this._Country == null || this._Country.Metadata != key) {
			this._Country = new LazyOfTTMetadata(() => window.Helper.Scheduler.CreateLookupProxy(ServiceOrder.lookups.countries, key), key);
		}
		return this._Country.value;
	}

	get Region(): Main.Rest.Model.Lookups.Main_Region {
		let key = this.OriginalData.RegionKey;
		if (this._Region == null || this._Region.Metadata != key) {
			this._Region = new LazyOfTTMetadata(() => window.Helper.Scheduler.CreateLookupProxy(ServiceOrder.lookups.regions, key), key);
		}
		return this._Region.value;
	}

	get Priority(): Crm.Service.Rest.Model.Lookups.CrmService_ServicePriority {
		let key = this.OriginalData.PriorityKey;
		if (this._Priority == null || this._Priority.Metadata != key) {
			this._Priority = new LazyOfTTMetadata(() => window.Helper.Scheduler.CreateLookupProxy(ServiceOrder.lookups.priorities, key), key);
		}
		return this._Priority.value;
	}

	get Station() {
		return this.OriginalData.StationKey != null ? this.OriginalData.Station?.Name : window.Helper.String.getTranslatedString("Unspecified");
	}

	get Company() {
		return this.OriginalData.Company?.Name
	}

	get CustomerNo() {
		return this.OriginalData.Company?.CompanyNo;
	}

	get ResponsibleUser() {
		return window.Helper.User.getDisplayName(this.OriginalData.ResponsibleUserUser);
	}

	get InstallationDescription() {
		return this.OriginalData.Installation?.Description;
	}

	get ZipCodeArea() {
		let count = window.Sms.Scheduler.Settings.ServiceOrderZipCodeAreaLength > 0 ? window.Sms.Scheduler.Settings.ServiceOrderZipCodeAreaLength : 1;
		return this.OriginalData.ZipCode?.substring(0, Math.min(this.OriginalData.ZipCode?.length ?? 0, count));
	}

	get Dispatches() {
		return (async () => {
			try {
				let dispatches = await window.database.CrmService_ServiceOrderDispatch
					.include("DispatchedUser")
					.filter("it=>it.OrderId == orderId", { orderId: this.id })
					.orderBy("it.Date")
					.toArray();

				const dateFormat = (from: Date, to: Date) => `${moment(from).format("lll")} - ${moment(to).format(window.Helper.Date.areOnSameDay(from, to) ? "LT" : "lll")}`;
				const mapped = dispatches.map(d => `${dateFormat(d.Date, d.EndDate)}, ${window.Helper.User.getDisplayName(d.DispatchedUser)}`);
				return mapped.join('\r\n');
			} catch (e) {
				return undefined; // fallback value;
			}
		})();
	}

	get RequiredSkillKeys() {
		return this.OriginalData.RequiredSkillKeys;
	}

	get Skills(): Main.Rest.Model.Lookups.Main_Skill[] {
		let keys = this.OriginalData.RequiredSkillKeys;
		if (this._Skills == null || !_.isEqual(this._Skills.Metadata, keys)) {
			this._Skills = new LazyOfTTMetadata(() => keys.map(key => window.Helper.Scheduler.CreateLookupProxy(ServiceOrder.lookups.skills, key)), keys);
		}
		return this._Skills.value;
	}

	get RequiredAssetKeys() {
		return this.OriginalData.RequiredAssetKeys;
	}

	get Assets(): Main.Rest.Model.Lookups.Main_Asset[] {
		let keys = this.OriginalData.RequiredAssetKeys;
		if (this._Assets == null || !_.isEqual(this._Assets.Metadata, keys)) {
			this._Assets = new LazyOfTTMetadata(() => keys.map(key => window.Helper.Scheduler.CreateLookupProxy(ServiceOrder.lookups.assets, key)), keys);
		}
		return this._Assets.value;
	}
	get PlannedDuration(): number {
		const keys = (this.OriginalData.ServiceOrderTimePostings ?? []).map(t => t.Id);

		if (this._PlannedDuration == null || !_.isEqual(this._PlannedDuration.Metadata, keys)) {
			this._PlannedDuration = new LazyOfTTMetadata(() => {
				const timepostings = this.OriginalData.ServiceOrderTimePostings;
				if (timepostings && this.OriginalData.ServiceOrderTimePostings.length > 0) {
					const sum = timepostings
						.filter(t => window.Helper.ServiceOrderTimePosting.isPrePlanned(t))
						.reduce((s, t) => s + moment.duration(t.PlannedDuration).asMilliseconds(), 0);

					return sum > 0 ? sum : null;
				}

				return null;
			}, keys);
		}

		return this._PlannedDuration.value;
	}
	get PreferredTechnician(): string {
		return this.OriginalData.PreferredTechnician;
	}
	get PreferredUserGroup(): string {
		return this.OriginalData.PreferredTechnicianUsergroupObject?.Name;
	}
	get Planned(): Date {
		return this.OriginalData.Planned;
	}
	get Deadline(): Date {
		return this.OriginalData.Deadline;
	}

	get DisplayPreferredUser(): string {
		//TODO: add Installations preferred here as a fallback if preferredTechnician is null like old scheduler?
		let preferredTechnician = this.OriginalData.PreferredTechnicianUser;
		return preferredTechnician ? window.Helper.User.getDisplayName(preferredTechnician) : this.OriginalData.PreferredTechnician;
	}

	get DisplayPlannedDate(): string {
		let parts = [];
		if (this.OriginalData.Planned)
			parts.push(window.Globalize.formatDate(this.OriginalData.Planned, { date: "medium" }));
		if (this.OriginalData.PlannedTime)
			parts.push(window.moment.duration(this.OriginalData.PlannedTime).format("hh:mm", { stopTrim: "h" }));
		if (this.OriginalData.PlannedDateFix)
			parts.push(window.Helper.String.getTranslatedString("Fix"));

		let result = parts.join(" ");

		return result.length ? result : null;
	}
	get ServiceObjectCategory(): Crm.Service.Rest.Model.Lookups.CrmService_ServiceObjectCategory {
		let key = this.OriginalData.ServiceObject?.CategoryKey;
		if (this._ServiceObjectCategory == null || this._ServiceObjectCategory.Metadata != key) {
			this._ServiceObjectCategory = new LazyOfTTMetadata(() => window.Helper.Scheduler.CreateLookupProxy(ServiceOrder.lookups.serviceObjectCategories, key), key);
		}
		return this._ServiceObjectCategory.value;
	}
	get ServiceObjectNo(): string {
		return this.OriginalData.ServiceObject?.ObjectNo;
	}
	get ServiceObjectName(): string {
		return this.OriginalData.ServiceObject?.Name;
	}
	get InstallationType(): string {
		let key = this.OriginalData.Installation?.InstallationTypeKey;
		if (this._InstallationType == null || this._InstallationType.Metadata != key) {
			this._InstallationType = new LazyOfTTMetadata(() => window.Helper.Scheduler.CreateLookupProxy(ServiceOrder.lookups.installationTypes, key), key);
		}
		return this._InstallationType.value;

	}
	get InstallationStatus(): string {
		let key = this.OriginalData.Installation?.StatusKey;
		if (this._InstallationStatus == null || this._InstallationStatus.Metadata != key) {
			this._InstallationStatus = new LazyOfTTMetadata(() => window.Helper.Scheduler.CreateLookupProxy(ServiceOrder.lookups.installationHeadStatuses, key), key);
		}
		return this._InstallationStatus.value;
	}
	
	get Latitude(): number {
		return this.OriginalData.Latitude;
	}
	get Longitude(): number {
		return this.OriginalData.Longitude;
	}

	get InstallationNo(): Promise<string> {
		return (async () => {
			let result: string = null;
			if (window.Crm.Service.Settings.ServiceContract.MaintenanceOrderGenerationMode === 'OrderPerInstallation') {
				result = this.OriginalData.Installation?.InstallationNo ?? null;
			} else {
				const serviceOrderTimes = await window.database.CrmService_ServiceOrderTime
					.include("Installation")
					.filter("it.OrderId == orderId && it.InstallationId != null", { orderId: this.id })
					.toArray();

				if (serviceOrderTimes.length > 0) {
					result = serviceOrderTimes
						.map(item => item?.Installation?.InstallationNo)
						.filter(Boolean)
						.join('\r\n');
				}
			}
			return result;
		})();
	}
	get Street(): string {
		return this.OriginalData.Street;
	}
	get ZipCode(): string {
		return this.OriginalData.ZipCode;
	}
	get City(): string {
		return this.OriginalData.City;
	}
	get ErrorMessage() {
		return this.OriginalData.ErrorMessage;
	}
	get OrderNo() {
		return this.OriginalData.OrderNo;
	}

	getPopupInformation(): string {
		let item = this.OriginalData;
		let helperElement = document.createElement("div");
		if (!item) {
			return helperElement.innerHTML;
		}
		let order: Crm.Service.Rest.Model.ObservableCrmService_ServiceOrderHead & {Installations: KnockoutObservableArray<Crm.Service.Rest.Model.ObservableCrmService_Installation>} = item.asKoObservable() as unknown as Crm.Service.Rest.Model.ObservableCrmService_ServiceOrderHead & {
			Installations: KnockoutObservableArray<Crm.Service.Rest.Model.ObservableCrmService_Installation>
		};
		order.Installations = ko.observableArray<Crm.Service.Rest.Model.ObservableCrmService_Installation>(window.Helper.ServiceOrder.getRelatedInstallations(order));
		const element = $(`#MapItemTemplate`);
		const context = ko.contextFor(element[0]).createChildContext(order);
		helperElement.innerHTML = element[0].innerHTML;
		ko.applyBindings(context, helperElement);
		return helperElement.innerHTML;
	}
	
	getRowData(propertyName: string): string {
		return this[propertyName.replace("ServiceOrder.", "")];
	}
	
	static readonly lookups: LookupType = {};
	static get fields() {
		return [
			{ name: 'OriginalData', type: 'object' },
			{ name: 'id', dataSource: 'OriginalData.Id', type: 'string' },
			{ name: 'name', dataSource: 'OriginalData.OrderNo', type: 'string' },
			{ name: 'City', type: 'string', dataSource: 'City', convert: (v) => (window.Helper.String.isNullOrEmpty(v) || v === 'Unspecified') ? window.Helper.String.getTranslatedString("Unspecified") : v },
		]
	}

	override toString() {
		return `${this.name} - ${window.Helper.Company.getDisplayName(this?.OriginalData?.Company)}`;
	}
}
export class AbsenceOrder extends BaseOrder {

	static get $name() {
		return 'AbsenceOrder';
	}
	OriginalData: Crm.PerDiem.Rest.Model.Lookups.CrmPerDiem_TimeEntryType | Crm.Article.Model.Lookups.CrmArticle_ArticleDowntimeReason;
	AbsenceType: string;


	static get fields() {
		return [
			{ name: 'OriginalData', type: 'object'},
			{ name: 'name', type: 'string', dataSource: 'OriginalData.Value' },
			{ name: 'id', type: 'string', dataSource: 'OriginalData.Key' }
		]
	}

	constructor(data = null) {
		super();
		this.OriginalData = data;
		this.type = data instanceof Crm.PerDiem.Rest.Model.Lookups.CrmPerDiem_TimeEntryType ? OrderType.AbsenceOrder : OrderType.ArticleDowntime;
		this.AbsenceType = data instanceof Crm.PerDiem.Rest.Model.Lookups.CrmPerDiem_TimeEntryType ? window.Helper.getTranslatedString('SmsScheduler_Absence') : window.Helper.getTranslatedString('CrmArticle_ArticleDowntime');
	}
}