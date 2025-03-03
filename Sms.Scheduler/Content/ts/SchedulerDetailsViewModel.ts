import {namespace} from "@Main/namespace";
import type {Timeline} from "./Timeline";
import {Absence, Dispatch, SchedulerEventType, ServiceOrderTimePosting} from "./Model/Dispatch";
import {AbsenceOrder, OrderType, ServiceOrder} from "./Model/ServiceOrder";
import type Scheduler from "./knockout.component.Scheduler";
import {ResourceType, Technician} from "./Model/Technicians";
import {Tool} from "./Model/Tools";
import {
	CalendarIntervalModelConfig,
	CalendarModel,
	DateField,
	DateHelper,
	Mask,
	Model,
	ResourceModel,
	ResourceTimeRangeModel,
	StringHelper
} from "@bryntum/schedulerpro";
import {MapMarkerType} from "./Model/MapMessage";
import { Lazy } from "./Lazy";
import type { HourSpan } from "./Model/HourSpan";
import { Vehicle } from "./Model/Vehicle";
import { Assignment } from "./Model/Assignment";
import { Breadcrumb } from "@Main/breadcrumbs";
import moment from "moment";
import type {SchedulerResourceModel} from "@bryntum/schedulerpro/schedulerpro.node";
import type {groupedGridData} from "../@types";

export class SchedulerDetailsViewModel extends window.Main.ViewModels.ViewModelBase {
	profile: KnockoutObservable<Sms.Scheduler.Rest.Model.SmsScheduler_Profile> = ko.observable<Sms.Scheduler.Rest.Model.SmsScheduler_Profile>(null);
	scheduler: KnockoutObservable<Timeline> = ko.observable<Timeline>(null);
	autosave: KnockoutObservable<boolean> = ko.observable<boolean>(true);
	autosaveText: KnockoutComputed<string> = ko.pureComputed<string>(() => this.autosave() ? 'On' : 'Off');
	syncWasOff: KnockoutObservable<boolean> = ko.observable<boolean>(false);
	dataIsSyncing = ko.observable<boolean>(false);
	loadingMask: Mask;
	schedulerComponent: KnockoutObservable<Scheduler> = ko.observable<Scheduler>(null);

        pendingChanges = ko.pureComputed(() => this.schedulerComponent() ? this.schedulerComponent().pendingChanges() : 0);

	lookups: LookupType;
	isResourceUtilizationVisible: KnockoutObservable<boolean> = ko.observable<boolean>(false);
	isMapVisible: KnockoutObservable<boolean> = ko.observable<boolean>(false);
	startDate: Date = null;
	batchSize: number = 500;
	
	rootCalendar: Lazy<CalendarModel>;

	private inlineData = {
		resourcesData: new Array<ResourceModel>(),
		eventsData: [],
		assignmentsData: new Array<Assignment>(),
		serviceOrders: [],
		resourceTimeRangesData: new Array<ResourceTimeRangeModel>()
	};
	schedulerBroadcastChannel: BroadcastChannel = null;

	currentUserLocale: string;
	constructor() {
		super();
		const self = this;
		self.initGoogleMapsApi(window.Main.Settings.Geocoder.GoogleMapsApiKey, window.Main.Settings.Geocoder.GoogleMapsApiVersion);
		self.rootCalendar = new Lazy(() => {
			let profile = self.profile();

			if (!profile) {
				throw new Error("Profile is null. rootCalendar initialization failed.");
			}

			let workingHoursIntervals = SchedulerDetailsViewModel.createWorkingHoursIntervals(profile);

			let calendarConfig = {
				id: 'workinghours',
				name: 'Working Hours',
				unspecifiedTimeIsWorking: false,
				intervals: workingHoursIntervals
			};

			let calendar = new CalendarModel(calendarConfig);

			//The following code is to watch for profile change and NonWorkingHours changes
			let nonWorkingHoursTrigger = ko.observable(false);
			ko.computed(() => {
				let p = self.profile();
				let c = p.ClientConfig;
				let t = nonWorkingHoursTrigger();

				if (c == null)
					return null;

				if (!Reflect.getOwnPropertyDescriptor(c, "NonWorkingHours")) {
					let desc = Reflect.getOwnPropertyDescriptor(Reflect.getPrototypeOf(c), "NonWorkingHours");

					Reflect.defineProperty(c, "NonWorkingHours", {
						get() {
							return desc.get.call(c);
						},
						set(newValue) {
							desc.set.call(c, newValue);
							nonWorkingHoursTrigger(!nonWorkingHoursTrigger());
						},
						enumerable: true,
						configurable: true
					});
				}

				return JSON.stringify({ id: p.Id, nonWorkingHours: c.NonWorkingHours });
			}).subscribe(() => {
				const p = self.profile();
				const newWorkingHoursIntervals = SchedulerDetailsViewModel.createWorkingHoursIntervals(p);

				calendar.clearIntervals(true);
				calendar.addIntervals(newWorkingHoursIntervals);
			});

			return calendar;
		});

		self.schedulerComponent.subscribe(() => {
			const schedulerTag = document.getElementsByTagName("scheduler")[0] as HTMLElement;
			$(schedulerTag).on('mousewheel', function (e) {
				if (e.ctrlKey) {
					e.preventDefault();
				}
			});

			self.loadingMask = Mask.mask(window.Helper.String.getTranslatedString("Loading"), schedulerTag);
			self.loadingMask.hide();

			self.dataIsSyncing.subscribe(value => {
				if (value) {
					self.loadingMask.show();
				} else {
					self.loadingMask.hide();
				}
			})
		});
		self.schedulerBroadcastChannel = new BroadcastChannel("planning-board-integration");

		self.schedulerBroadcastChannel.onmessage = async (event) => {
			if(event) {
				switch (event.data.type) {
					case 'DiscoverOpenPlanningBoard':
						if(self.scheduler() !== null) {
							self.schedulerBroadcastChannel.postMessage({
								type: 'PlanningBoardReady'
							});
						}
						break;
					case 'ScrollToDispatch':
						await self.highlightDispatchOnTimeline(event.data.id, event.data.startDate);
						break;
				}
			}
		};
	}
	async init(id, args) {
		let self = this;
		self.loading(true);
		if(args.startDate) {
			self.startDate = new Date(args.startDate);
		} else {
			self.startDate = new Date();
		}
		const currentUser = await window.Helper.User.getCurrentUser();
		self.profile.subscribe(async (value) => {
			if (value && value?.Username === currentUser.Id) {
				window.database.attachOrGet(currentUser);
				currentUser.ExtensionValues.ActiveProfileId = value.Id;
				await window.database.saveChanges();
			}

			await this.setBreadcrumbs();
		});
		$('body').removeClass('toggled sw-toggled');
		await self.initSchedulerData(args.profileid);
		
		self.currentUserLocale = currentUser.DefaultLanguageKey;
		self.currentUserLocale =  self.currentUserLocale.charAt(0).toUpperCase() + self.currentUserLocale.slice(1);

		if (id) {
			self.scheduler.subscribe((value) => {
				if (value) {
					setTimeout(async function() {
						await self.highlightDispatchOnTimeline(id, self.startDate);
					}, 800);
				}
			});
		}
		
		self.scheduler.subscribe((value) => {
			window.Helper.Scheduler.ApplyRowState(value);
		});

		let resourceUtilizationStorageValue: { isVisible: boolean } = JSON.parse(localStorage.getItem( `${currentUser.Id}:resourceUtilization`));
		if (resourceUtilizationStorageValue != null) {
			self.isResourceUtilizationVisible(resourceUtilizationStorageValue.isVisible);
		}
		self.isResourceUtilizationVisible.subscribe(async (value) => {
			await self.toggleResourceUtilization(value);
		});

		let mapStorageValue: { isVisible: boolean } = JSON.parse(localStorage.getItem( `${currentUser.Id}:mapPanel`));
		if (mapStorageValue != null) {
			self.isMapVisible(mapStorageValue.isVisible);
		}
		self.isMapVisible.subscribe(async (value) => {
			await self.toggleMap(value);
		});
		self.autosave.subscribe(async (value) => {
			await self.toggleAutosave(value);
			const menuButton = $('#profile-settings>a');
			if(!value) {
				menuButton.css('pointer-events', 'none');
				$('#profile-settings').attr('title', `${window.Helper.getTranslatedString('FunctionalityNotAvailableWarning')}`);
			} else {
				menuButton.css('pointer-events', 'auto');
				$('#profile-settings').attr('title', "");
			}
		});
	}
	
	async highlightDispatchOnTimeline(id: string, startDate: Date) {
		const self = this;			
		if(!DateHelper.betweenLesserEqual(startDate, DateHelper.add(self.scheduler().startDate, -1, 'week'), DateHelper.add(self.scheduler().startDate, 1, 'week'))) {
			self.scheduler().setStartDate(DateHelper.startOf(startDate, 'week'));
			(self.scheduler().widgetMap.datePicker as DateField).value = self.scheduler().startDate;
			await self.schedulerComponent().reloadDateRange();
		}
		let eventRecord = self.scheduler().eventStore.find(r => r.id == id) as Dispatch;
		if (eventRecord) {
			let resourceRecord = self.scheduler().resourceStore.find(r => r.id == eventRecord.resourceId) as SchedulerResourceModel;
			setTimeout(async function() {
				await self.scheduler().scrollResourceEventIntoView(resourceRecord, eventRecord, { animate: true, highlight: true });
				self.schedulerComponent().mapPanel?.scrollMarkerIntoViewById(eventRecord.id as string, MapMarkerType.ServiceOrderDispatch);
			}, 200);
		}
	}
	
	async initLookups() {
		this.lookups = {
			timeEntryTypes: { $tableName: "CrmPerDiem_TimeEntryType" },
			serviceOrderStatuses: { $tableName: "CrmService_ServiceOrderStatus" },
			serviceOrderTypes: { $tableName: "CrmService_ServiceOrderType" },
			countries: { $tableName: "Main_Country" },
			regions: { $tableName: "Main_Region" },
			priorities: { $tableName: "CrmService_ServicePriority" },
			skills: { $tableName: "Main_Skill" },
			assets: { $tableName: "Main_Asset" },
			articleDowntimeReason: { $tableName: 'CrmArticle_ArticleDowntimeReason'},
			serviceOrderDispatchStatuses: { $tableName: "CrmService_ServiceOrderDispatchStatus" },
			serviceObjectCategories: { $tableName: "CrmService_ServiceObjectCategory" },
			installationHeadStatuses: {$tableName: "CrmService_InstallationHeadStatus"},
			installationTypes: {$tableName: "CrmService_InstallationType"},
		};
		await window.Helper.Lookup.getLocalizedArrayMaps(this.lookups);
		for (const lookupsKey in this.lookups) {
			ServiceOrder.lookups[lookupsKey] = Technician.lookups[lookupsKey] = Dispatch.lookups[lookupsKey] = Tool.lookups[lookupsKey] = Vehicle.lookups[lookupsKey] = this.lookups[lookupsKey];
		}
	}

	cachedServiceOrders = new Map<string, WeakRef<ServiceOrder>>();

	async loadServiceOrders(orderIds: string[]): Promise<ServiceOrder[]> {
		const orders: ServiceOrder[] = [];

		for (const orderId of orderIds) {
			if (this.cachedServiceOrders.has(orderId)) {
				const order = this.cachedServiceOrders.get(orderId).deref();
				if (order) {
					orders.push(order);
				} else {
					this.cachedServiceOrders.delete(orderId);
				}
			}
		}
		if (orders.length > 0) {
			orderIds = orderIds.filter(id => orders.every(order => order.id !== id));
		}

		const queries = Array.from(window.Helper.Scheduler.SplitArray(orderIds, this.batchSize)).map(orderKeys => (
			{
				queryable: window.database.CrmService_ServiceOrderHead
					.include("Company")
					.include("Installation")
					.include("ServiceObject")
					.include("ServiceContract")
					.include("PreferredTechnicianUser")
					.include("ResponsibleUserUser")
					.include("PreferredTechnicianUsergroupObject")
					.include("Station")
					.include("ServiceOrderTimePostings")
					.include("PayerAddress")
					.filter("it.Id in orderIds", { orderIds: orderKeys }),
				method: "toArray",
				handler: undefined
			}));

		if (queries.length > 0) {
			const items = await window.Helper.Batch.Execute(queries);
			orders.push(...items.flat().map((o: Crm.Service.Rest.Model.CrmService_ServiceOrderHead) => {
				const so = new ServiceOrder(undefined, undefined, o);
				so.clearChanges();

				this.cachedServiceOrders.set(o.Id, new WeakRef(so));

				return so;
			}));
		}

		return orders;
	}

	async loadPipelineServiceOrders() {
		let predicate: (it: any) => boolean;
		if (this.profile().ClientConfig.LoadClosedServiceOrders === true) {
			predicate = it => ["Scheduling", "InProgress"].includes(it.Groups)
		} else {
			predicate = it => ["Scheduling", "InProgress"].includes(it.Groups) && !(["Completed"].includes(it.Key));
		}
		const schedulableStatusKeys = this.lookups.serviceOrderStatuses.$array.filter(predicate).map(it => it.Key);

		const orderIds = await window.database.CrmService_ServiceOrderHead
			.filter("it.StatusKey in statuses", { statuses: schedulableStatusKeys})
			.select("it.Id")
			.toArray() as string[];

		return this.loadServiceOrders(orderIds);
	}

	async loadAbsenceOrders() {
		let absenceKeys = this.lookups.timeEntryTypes.$array.filter(it => it.ShowInScheduler == 1).concat(this.lookups.articleDowntimeReason.$array.filter(it => it.Key != null));

		return absenceKeys.map(a => new AbsenceOrder(a));
	}

	async loadAbsences(technicians: Technician[], tools: any, startDate: Date, endDate: Date) {
		let absenceTimeEntryTypes = this.lookups.timeEntryTypes.$array.filter(it => it.ShowInScheduler == 1).concat(this.lookups.articleDowntimeReason.$array.filter(it => it.Key != null));
		let absenceKeys = absenceTimeEntryTypes.map(it => it.Key);
		let techniciansIds = technicians.map(t => t.id);
		let toolsIds = tools.map(t => t.id);
		let absencesTypesDic = new Map(absenceTimeEntryTypes.map(a => [a.Key, a]));
		
		const queries = [];

		//Overlap of two ranges can be checked like this:
		//range1Start < range2End && range2Start < range1End
		for (const techniciansKeys of window.Helper.Scheduler.SplitArray(techniciansIds, this.batchSize)) {
			queries.push(
				{
					queryable: window.database.CrmPerDiem_UserTimeEntry
						.filter("it.TimeEntryTypeKey in absenceKeys && it.ResponsibleUser in techniciansKeys && it.From <= endDate && startDate <= it.To", { absenceKeys, techniciansKeys, startDate, endDate }),
					method: "toArray"
				});
			queries.push(
				{
					queryable: window.database.SmsScheduler_Absence
						.filter("it.TimeEntryTypeKey in absenceKeys && it.ResponsibleUser in techniciansKeys && it.From <= endDate && startDate <= it.To", { absenceKeys, techniciansKeys, startDate, endDate }),
					method: "toArray"
				});
		}

		for (const toolKeys of window.Helper.Scheduler.SplitArray(toolsIds, this.batchSize)) {
			queries.push(
				{
					queryable: window.database.CrmArticle_ArticleDowntime
						.filter("it.ArticleKey in toolKeys && it.From <= endDate && startDate <= it.To", { toolKeys, startDate, endDate }),
					method: "toArray"
				});
		}

		let absencesOfUserTimeEntry: Absence[] = [];
		let absencesOfToolTimeEntry: Absence[] = [];
		if (queries.length > 0) {
			const items = await window.Helper.Batch.Execute(queries);
			items.flat().forEach(d => {
				if (d instanceof Crm.PerDiem.Rest.Model.CrmPerDiem_UserTimeEntry) {
					let event = new Absence(undefined, undefined, { type: SchedulerEventType.Absence, data: d, typeData: absencesTypesDic.get(d.TimeEntryTypeKey) });
					event.startDate = d.From;
					event.ResourceKey = d.ResponsibleUser;
					event.endDate = d.To;
					//Some of the things that we are setting when creating the entity is picked up as modifications by bryntum and it makes the 'dirty' flag stuck on the entity after load
					event.clearChanges();
					absencesOfUserTimeEntry.push(event);
				} else if (d instanceof Crm.Article.Rest.Model.CrmArticle_ArticleDowntime) {
					let event = new Absence(undefined, undefined, { type: SchedulerEventType.Absence, data: d, typeData: absencesTypesDic.get(d.DowntimeReasonKey) });
					event.startDate = d.From;
					event.ResourceKey = d.ArticleKey;
					event.endDate = d.To;
					//Some of the things that we are setting when creating the entity is picked up as modifications by bryntum and it makes the 'dirty' flag stuck on the entity after load
					event.clearChanges();
					absencesOfToolTimeEntry.push(event);
				} else if (d instanceof Sms.Scheduler.Rest.Model.SmsScheduler_Absence) {
					let event = new Absence(undefined, undefined, { type: SchedulerEventType.Absence, data: d, typeData: absencesTypesDic.get(d.TimeEntryTypeKey) });
					event.startDate = d.From;
					event.ResourceKey = d.ResponsibleUser;
					event.endDate = d.To;
					//Some of the things that we are setting when creating the entity is picked up as modifications by bryntum and it makes the 'dirty' flag stuck on the entity after load
					event.clearChanges();
					absencesOfUserTimeEntry.push(event);
				}
			});
		}

		return [...absencesOfUserTimeEntry,...absencesOfToolTimeEntry];
	}

	async loadProfile(profileId: number = null) {
		const currentUsername = window.Helper.User.getCurrentUserName();
		let profile: Sms.Scheduler.Rest.Model.SmsScheduler_Profile = null;

		if (profileId != null) {
			//A profileId is provided. Lets see the possibility.
			const profiles = await window.database.SmsScheduler_Profile
				.filter("(it.Username == username || canSeeOtherUsersProfile == true) && it.Id == profileId",
					{
						username: currentUsername,
						canSeeOtherUsersProfile: window.AuthorizationManager.currentUserHasPermission("Scheduler::CanSeeOtherUsersProfile"),
						profileId: profileId
					})
				.take(1)
				.toArray();

			if (profiles && profiles.length > 0) {
				profile = profiles[0];
			}
		}

		if (profile == null) {
			//Either profileId was not provided or it was not good. Lets fallback to user profiles.
			const profiles = await window.database.SmsScheduler_Profile
				.filter("it.Username == username", { username: currentUsername })
				.orderByDescending("it.DefaultProfile")
				.orderBy("it.Name")
				.take(1)
				.toArray();

			if (profiles && profiles.length > 0) {
				profile = profiles[0];
			}
		}

		if (profile == null) {
			//No profile loaded yet. Lets create a new one.
			profile = window.database.SmsScheduler_Profile.defaultType.create();
			window.database.add(profile);
			profile.DefaultProfile = true;
			profile.Name = window.Helper.String.getTranslatedString("New Profile");
			profile.Username = currentUsername;
			profile.ClientConfig = await window.database.SmsScheduler_Profile.GetDefaultProfileConfig().first();
			await window.database.saveChanges();
		}

		this.profile(profile);
		await this.checkConfigDefaults();
	}

	async loadTechnicians(technicianIds: string[]): Promise<Technician[]> {
		let queries = [];
		const userSkills = [], userAssets = [];

		for (const technicianKeys of window.Helper.Scheduler.SplitArray(technicianIds, this.batchSize)) {
			queries.push(
				{
					queryable: window.database.Main_UserSkill.filter("it.Username in this.userIds", { userIds: technicianKeys }),
					method: "toArray"
				});
			queries.push(
				{
					queryable: window.database.Main_UserAsset.filter("it.Username in this.userIds", { userIds: technicianKeys }),
					method: "toArray"
				});
		}

		if (queries.length > 0) {
			const items = await window.Helper.Batch.Execute(queries);
			items.flat().map(item => {
				if(item instanceof Main.Rest.Model.Main_UserSkill) {
					userSkills.push(item);
				} else if(item instanceof Main.Rest.Model.Main_UserAsset) {
					userAssets.push(item);
				}
			});
		}
		
		queries = Array.from(window.Helper.Scheduler.SplitArray(technicianIds, this.batchSize)).map(technicianKeys => (
			{
				queryable: window.database.Main_User.include("expandAvatar").filter("t => t.Id in profileResources", { profileResources: technicianKeys }),
				method: "toArray"
			}));

		const skillsOrder = new Map(this.lookups.skills.$array.map((x, i) => ([x.Key as string, i])));
		const assetsOrder = new Map(this.lookups.assets.$array.map((x, i) => ([x.Key as string, i])));

		if (queries.length > 0) {
			const items = await window.Helper.Batch.Execute(queries);

			const stationsMap = new Map<string, Crm.Rest.Model.Crm_Station>();
			const stationIds = Array.from(new Set(items.flat().flatMap(t => t.ExtensionValues.StationIds)));
			queries = Array.from(window.Helper.Scheduler.SplitArray(stationIds, this.batchSize)).map(stationKeys => (
				{
					queryable: window.database.Crm_Station.filter("s => s.Id in stationKeys", { stationKeys: stationKeys }),
					method: "toArray"
				}));
			if (queries.length > 0) {
				const stations = (await window.Helper.Batch.Execute(queries)).flat() as Crm.Rest.Model.Crm_Station[];
				stations.forEach(s => stationsMap.set(s.Id, s));
			}

			return items.flat().map((t: Main.Rest.Model.Main_User) => {
				let technician = new Technician(t);
				technician.calendar = 'workinghours';
				technician.UserSkills = userSkills.filter(s => s.Username == t.Id).toSorted((a, b) => skillsOrder.get(a.SkillKey) - skillsOrder.get(b.SkillKey));
				technician.UserAssets = userAssets.filter(a => a.Username == t.Id).toSorted((a, b) => assetsOrder.get(a.AssetKey) - assetsOrder.get(b.AssetKey));
				technician.SortOrder = technicianIds.indexOf(t.Id);
				technician.UserStations = t.ExtensionValues.StationIds.map(sid => stationsMap.get(sid));
			
			//If technician.cls is not null (already has some classes set by code elsewhere, we don't want to override that) then we append our classes
			//If it is null then we set the cls field ourself
			// if(technician.hasExpiredAssets) technician.cls ? technician.cls += ' expired-assets' : technician.cls = 'expired-assets';
			// if(technician.hasExpiredSkills) technician.cls ? technician.cls += ' expired-skills' : technician.cls = 'expired-skills';

				return technician;
			});
		}
		else {
			return [];
		}
	}

	async loadResourceTimeRanges(resources: ResourceTypes[], startDate: Date, endDate: Date) {
		let resourceTimeRanges: ResourceTimeRangeModel[] = [];

		let queries = [];
		const resourceIds = resources.filter(resource => resource.type !== ResourceType.Technician).map(x => x.id);
		if (startDate != null && endDate != null) {
			for (const articlesKeys of window.Helper.Scheduler.SplitArray(resourceIds, this.batchSize)) {
				queries.push(
					{
						queryable: window.database.CrmArticle_ArticleUserRelationship
							.include("Article")
							.include("User")
							.filter("t => t.ArticleKey in profileResources && startDate < t.To && t.From < endDate", { profileResources: articlesKeys, startDate: startDate, endDate: endDate }),
						method: "toArray"
					});
			}
		}

		if (queries.length > 0) {
			const items = await window.Helper.Batch.Execute(queries);
			for (const resource of resources.filter(resource => resource.type !== ResourceType.Technician)) {
					const toolOrVehicle = resource as Tool | Vehicle;
					toolOrVehicle.AssignedUsers = items.flat().filter((i: Crm.Article.Rest.Model.CrmArticle_ArticleUserRelationship) => i.ArticleKey == resource.id);
					toolOrVehicle.AssignedUsers.forEach(au => {
						resourceTimeRanges.push(new ResourceTimeRangeModel({
							resourceId: toolOrVehicle.id,
							name: StringHelper.xss`${window.Helper.getTranslatedString('OverlappingByArticleUserRelationship')
								.replace("{0}", au.Article.ItemNo + ' - ' + au.Article.Description)
								.replace("{1}", window.Globalize.formatDate(au.From, { date: "short" }))
								.replace("{2}", window.Globalize.formatDate(au.To, { date: "short" }))
								.replace("{3}", window.Helper.User.getDisplayName(au.User))}`,
							startDate: DateHelper.startOf(au.From),
							endDate: DateHelper.endOf(au.To),
							readOnly: true,
						}));
					});
			}
		};

		for (const resource of resources.filter(resource => resource.type === ResourceType.Technician)) {
			const technician = resource as Technician;
			if (technician.OriginalData.Discharged) {
				resourceTimeRanges.push(new ResourceTimeRangeModel({
					resourceId: technician.id,
					name: window.Helper.String.getTranslatedString('Inactive'),
					startDate: DateHelper.startOf(technician.OriginalData.DischargeDate),
					endDate: DateHelper.startOf(DateHelper.add(technician.OriginalData.DischargeDate, 100, 'year')),
					readOnly: true,
					cls: 'incative'
				}));
			}
		}

		return resourceTimeRanges;
	}

	async loadTools(resourceIds: string[], startDate: Date = null, endDate: Date = null): Promise<[Tool[], Vehicle[]]> {
		let tools: Tool[] = [], vehicles: Vehicle[] = [];

		let queries = [];
		for (const articlesKeys of window.Helper.Scheduler.SplitArray(resourceIds, this.batchSize)) {
			queries.push(
				{
					queryable: window.database.CrmArticle_Article
						.include("Station")
						.filter("t => t.Id in profileResources", { profileResources: articlesKeys }),
					method: "toArray"
				});
		}

		if (queries.length > 0) {
			const items = await window.Helper.Batch.Execute(queries);

			const articleIds = items.flat().filter(t => t instanceof Crm.Article.Rest.Model.CrmArticle_Article).map(a => a.Id);
			const imageUrlMap = new Map<string, string>();
			queries = Array.from(window.Helper.Scheduler.SplitArray(articleIds, this.batchSize)).map(articleKeys => (
				{
					queryable: window.database.Crm_DocumentAttribute.include("FileResource").filter("it.UseForThumbnail && it.ReferenceKey in articleKeys", { articleKeys: articleKeys }),
					method: "toArray"
				}));
			if (queries.length > 0) {
				const documents = (await window.Helper.Batch.Execute(queries)).flat() as Crm.Rest.Model.Crm_DocumentAttribute[];
				for (const document of documents) {
					if (!imageUrlMap.has(document.ReferenceKey)) {
						imageUrlMap.set(document.ReferenceKey, await window.Helper.FileResource.getDownloadLink(document.FileResource));
					}
				}
			}

			const articleUserGroupRelationshipsMap = new Map<string, string[]>();
			queries = Array.from(window.Helper.Scheduler.SplitArray(articleIds, this.batchSize)).map(articleKeys => (
				{
					queryable: window.database.CrmArticle_ArticleUserGroupRelationship
						.filter("it.ArticleKey in articleKeys && (it.From == null || it.From <= now) && (it.To == null || it.To > now)", { articleKeys: articleKeys, now: new Date() })
						.select("{ArticleKey: it.ArticleKey, UserGroupName: it.UserGroup.Name}"),
					method: "toArray"
				}));
			if (queries.length > 0) {
				const relations = (await window.Helper.Batch.Execute(queries)).flat() as ({ ArticleKey: string, UserGroupName: string }[]);
				for (const relation of relations) {
					if (articleUserGroupRelationshipsMap.has(relation.ArticleKey)) {
						articleUserGroupRelationshipsMap.get(relation.ArticleKey).push(relation.UserGroupName);
					} else {
						articleUserGroupRelationshipsMap.set(relation.ArticleKey, [relation.UserGroupName]);
					}
				}
			}

			items.flat().filter(t => t instanceof Crm.Article.Rest.Model.CrmArticle_Article).forEach((t: Crm.Article.Rest.Model.CrmArticle_Article) => {
				let currentItem = t.ArticleTypeKey == ResourceType.Tool ? new Tool(t, imageUrlMap.get(t.Id)) : new Vehicle(t, imageUrlMap.get(t.Id));
				currentItem.Teams = articleUserGroupRelationshipsMap.get(t.Id);
				if(t.ArticleTypeKey == ResourceType.Tool) {
					tools.push(currentItem as Tool);
				} else if(t.ArticleTypeKey == ResourceType.Vehicle) {
					vehicles.push(currentItem as Vehicle)
				}
			});
		}

		return [tools, vehicles];
	}

	async loadDispatches(dispatchIds: string[]) {
		const queries = Array.from(window.Helper.Scheduler.SplitArray(dispatchIds, this.batchSize)).map(dispatchesIds => (
			{
				queryable: window.database.CrmService_ServiceOrderDispatch
					.filter("it.Id in dispatchesIds", { dispatchesIds: dispatchesIds }),
				method: "toArray",
				handler: undefined
			}));

		if (queries.length > 0) {
			const items = await window.Helper.Batch.Execute(queries);
			const dispatches = items.flat() as Crm.Service.Rest.Model.CrmService_ServiceOrderDispatch[];

			const orderIds = Array.from(new Set(dispatches.map(dispatch => dispatch.OrderId)));
			const orders = new Map((await this.loadServiceOrders(orderIds)).map(o => [o.id as string, o]));

			const loadedDispatchIds = dispatches.map(dispatch => dispatch.Id);
			const timePostings = Map.groupBy((await this.loadDispatchesTimePostings(loadedDispatchIds)), t => t.OriginalData.DispatchId);

			return dispatches.map(dispatch => {
				const event = new Dispatch(undefined, undefined,
					{
						type: SchedulerEventType.Dispatch,
						data: dispatch,
						serviceOrder: orders.get(dispatch.OrderId),
						timePostings: timePostings.get(dispatch.Id)
					});
				//Some of the things that we are setting when creating the entity is picked up as modifications by bryntum and it makes the 'dirty' flag stuck on the entity after load
				event.clearChanges();
				return event;
			});
		}
		else {
			return [];
		}
	}

	async loadDispatchesTimePostings(dispatchIds: string[]) {
		const queries = Array.from(window.Helper.Scheduler.SplitArray(dispatchIds, this.batchSize)).map(dispatchesIds => (
			{
				queryable: window.database.CrmService_ServiceOrderTimePosting
					.filter("it.DispatchId in dispatchesIds", { dispatchesIds: dispatchesIds }),
				method: "toArray",
				handler: undefined
			}));

		if (queries.length > 0) {
			const items = await window.Helper.Batch.Execute(queries);
			const timePostings = items.flat() as Crm.Service.Rest.Model.CrmService_ServiceOrderTimePosting[];

			return timePostings.map(t => {
				const timePosting = new ServiceOrderTimePosting(undefined, undefined, { type: SchedulerEventType.ServiceOrderTimePosting, data: t });
				timePosting.clearChanges();
				return timePosting;
			});
		}
		else {
			return [];
		}
	}

	async loadServiceOrderDispatches(orderId: string) {
		const dispatchIds = await window.database.CrmService_ServiceOrderDispatch
			.filter("it.OrderId == orderId", { orderId: orderId })
			.select("it.Id")
			.toArray() as string[];

		return this.loadDispatches(dispatchIds);
	}

	async loadTechniciansDispatches(technicians: Technician[], startDate: Date, endDate: Date) {
		const dispatchesInRange = await window.database.CrmService_ServiceOrderDispatch.GetDispatchesInRange({ technicians: technicians.map(t => t.id as string), startDate, endDate }).toArray();

		return this.loadDispatches(dispatchesInRange);
	}
	
	async loadAssignments(events: (Dispatch | Absence)[]): Promise<Assignment[]> {
		const queries = [];

		const technicianAssignmentsDispatchKeys: string[] = Array.from(new Set([
			...events.map(e => e.id as string),
			...events.filter(e => e.type == SchedulerEventType.Dispatch).map(e => (e as Dispatch).TimePostings?.map(t => t.id as string))
		].flat(1).filter(Boolean)));

		for (const dispatchKeys of window.Helper.Scheduler.SplitArray(technicianAssignmentsDispatchKeys, this.batchSize)) {
			queries.push(
				{
					queryable: window.database.SmsScheduler_DispatchPersonAssignment.filter("it => it.DispatchKey in dispatchKeys", { dispatchKeys }),
					method: "toArray"
				});
		}

		const toolAndVehicleAssignmentsDispatchKeys = Array.from(new Set(events.map(e => e.id)));
		for (const dispatchKeys of window.Helper.Scheduler.SplitArray(toolAndVehicleAssignmentsDispatchKeys, this.batchSize)) {
			queries.push(
				{
					queryable: window.database.SmsScheduler_DispatchArticleAssignment.filter("it => it.DispatchKey in dispatchKeys", { dispatchKeys }),
					method: "toArray"
				});
		}

		if (queries.length > 0) {
			const items = await window.Helper.Batch.Execute(queries);
			return items.flat().map(a => new Assignment(a));
		}
		else
			return [];
	}
	
	private async initSchedulerData(profileId = null) {
		let self = this;
		await self.initLookups();
		this.cachedServiceOrders.clear();
		if(window.Helper.User.currentUser.ExtensionValues.ActiveProfileId != null) {
			profileId ??= window.Helper.User.currentUser.ExtensionValues.ActiveProfileId;
		}
		if (typeof profileId === 'undefined' || profileId == null || profileId != ko.unwrap(this?.profile?.()?.Id)) {
			await self.loadProfile(profileId);
		}

		let startDate: Date = null, endDate: Date = null;

		if (self.scheduler()) {
			if (this.schedulerComponent().disposed) {
				return;
			}

			self.scheduler().dataForFirstRow = () => self.profile().ClientConfig.DataForFirstRow;
			self.scheduler().dataForSecondRow = () => self.profile().ClientConfig.DataForSecondRow;
			self.scheduler().dataForThirdRow = () =>  self.profile().ClientConfig.DataForThirdRow;
			self.scheduler().rowHeight = self.scheduler().baseRowHeight + self.scheduler().numberOfRows() * self.profile().ClientConfig.ResourceRowHeight;
			self.scheduler().defaultEventDuration = moment.duration(self.profile().ClientConfig.ServiceOrderDispatchDefaultDuration, "minutes");
			self.scheduler().serviceOrderDispatchMaximumDuration = moment.duration(self.profile().ClientConfig.ServiceOrderDispatchMaximumDuration, "minutes");
			self.scheduler().ServiceOrderDispatchIgnoreCalculatedDuration = self.profile().ClientConfig.ServiceOrderDispatchIgnoreCalculatedDuration;
			await self.schedulerComponent().applyResourceGroup();

			window.Helper.Scheduler.ApplyRowState(self.scheduler());
			self.schedulerComponent().updateFromProfileHours(self.profile());

			//scheduler is loaded, use its date range.
			const startDateMoment = moment(self.scheduler().startDate);
			const endDateMoment = moment(self.scheduler().endDate);
			const daysInRange = endDateMoment.startOf("day").diff(startDateMoment.startOf("day"), "days") + 1;
			startDate = startDateMoment.clone().subtract(daysInRange, "days").toDate();
			endDate = endDateMoment.clone().add(daysInRange, "days").toDate();
		} else {
			//scheduler is not loaded, load data for weekly preset.
			const startOfWeek = moment(self.startDate).startOf("week");
			startDate = startOfWeek.clone().subtract(7, "days").toDate();
			endDate = startOfWeek.clone().add(14, "days").toDate();
		}

		if(self.schedulerComponent()?.pipeline) {
			self.schedulerComponent().pipeline.rowHeight = self.profile().ClientConfig.PipelineSecondLine != null ? 45 : 30;
		}

		let orders: ServiceOrder[] | groupedGridData<ServiceOrder>[] = await self.loadPipelineServiceOrders();
		let technicians = await self.loadTechnicians(this.profile().ResourceKeys.filter(key => !window.Helper.String.isGuid(key)));
		let [tools, vehicles] = await self.loadTools(this.profile().ResourceKeys.filter(key => window.Helper.String.isGuid(key)), startDate, endDate);
		self.inlineData.resourcesData = [...technicians, ...tools, ...vehicles] as ResourceModel[];
		self.inlineData.resourceTimeRangesData = await self.loadResourceTimeRanges(self.inlineData.resourcesData as ResourceTypes[], startDate, endDate);

		await SchedulerDetailsViewModel.applyResourceCalendars(this.profile(), self.inlineData.resourcesData);

		let dispatches = await self.loadTechniciansDispatches(technicians, startDate, endDate);
		let absences = await self.loadAbsences(technicians, [...tools, ...vehicles], startDate, endDate);
		self.inlineData.eventsData = [...dispatches,...absences]

		self.inlineData.assignmentsData = await self.loadAssignments(self.inlineData.eventsData);
		if (self.profile().ClientConfig.PipelineGroup?.length > 0) {
			let groupKeys = self.profile().ClientConfig.PipelineGroup?.map(x => x.split('.')[1]);
			if (groupKeys && groupKeys.length > 0) { 
				const groupedOrders = await window.Helper.Scheduler.groupBy(orders, groupKeys);
				orders = window.Helper.Scheduler.toGridData(groupedOrders, groupKeys.length);
			}
		}

		self.inlineData.serviceOrders = this.groupPipeline(orders, await self.loadAbsenceOrders());
	}
	
	async deleteProfile() {
		this.dataIsSyncing(true);

		let profile = await window.database.SmsScheduler_Profile.find(this.profile()?.Id.toString());
		window.database.SmsScheduler_Profile.remove(profile);
		await window.database.saveChanges();
		await this.loadProfile(null)
		await this.initAndloadInlineData();

		this.dataIsSyncing(false);
	}

	async toggleAutosave(toggleValue: boolean) {
		if(toggleValue) {
			this.schedulerComponent().crudManager.resumeAutoSync(true);
		} else {
			this.schedulerComponent().crudManager.suspendAutoSync();
			this.syncWasOff(true);
		}
	}
	async syncData() {
		this.dataIsSyncing(true);

		if (!this.autosave()) {
			await this.schedulerComponent().crudManager.sync();
			await this.initAndloadInlineData();
		} else {
			await this.initAndloadInlineData();
		}

		this.dataIsSyncing(false);
	}

	async resetPlanning() {
		window.Helper.Scheduler.ShowPopup([{
			type: 'label',
			cls: 'scheduler-warning',
			text: window.Helper.String.getTranslatedString("ResetPlanningConfirmation"),
			style: 'width: 100%',
		}], async () => {
			window.Helper.Database.clearTrackedEntities();
			await this.schedulerComponent().reloadDateRange();
		});
	}

	async onNewServiceOrder(id: string) {
		if (this.schedulerComponent) {
			const gridServiceOrder = (await this.loadServiceOrders([id]))[0];

			let store = this.schedulerComponent().pipeline.store;
			//@ts-ignore
			let serviceOrdersNode = store.rootNode.children.find(n => n.id == "ServiceOrders");

			if (this.profile().ClientConfig.PipelineGroup?.length > 0) {
				let groupKeys = this.profile().ClientConfig.PipelineGroup?.map(x => x.split('.')[1]);
				if (groupKeys && groupKeys.length > 0) {
					const groupedOrder = await window.Helper.Scheduler.groupBy([gridServiceOrder], groupKeys);
					let groupData = window.Helper.Scheduler.toGridData(groupedOrder, groupKeys.length);

					let currentNode = serviceOrdersNode;

					for (let g of groupKeys) {
						let name = groupData[0].name;
						let child = currentNode.children.find(n => n.name == name);

						if (child) {
							currentNode = child;
							groupData = (groupData[0] as groupedGridData<ServiceOrder>).children;
						}
						else {
							serviceOrdersNode = currentNode;
							break;
						}
					}
					insertChildAtCorrectPosition(currentNode, (groupData as ServiceOrder[])[0]);
				}
				else {
					insertChildAtCorrectPosition(serviceOrdersNode, gridServiceOrder);
				}
			}
			else {
				insertChildAtCorrectPosition(serviceOrdersNode, gridServiceOrder);
			}

			this.schedulerComponent().pipeline.refreshRows();
			this.schedulerComponent().pipeline.scrollRowIntoView(gridServiceOrder.id, { animate: true, highlight: true });
			//adding dispatches to timeline
			const dispatches = await this.loadServiceOrderDispatches(id);

			for (const dispatch of dispatches) {
				const assignment = window.Helper.String.isGuid(dispatch.OriginalData.Username) ? window.database.SmsScheduler_DispatchArticleAssignment.defaultType.create() : window.database.SmsScheduler_DispatchPersonAssignment.defaultType.create();
				assignment.Id = window.$data.createGuid().toString().toLowerCase();
				assignment.DispatchKey = dispatch.id as string;
				assignment.ResourceKey = dispatch.OriginalData.Username;
				const assignmentModel = new Assignment(assignment);

				this.schedulerComponent().attachToStore.add(dispatch);
				this.scheduler().eventStore.addAsync(dispatch);

				this.schedulerComponent().attachToStore.add(assignmentModel)
				this.scheduler().assignmentStore.addAsync(assignmentModel);
			}
		}

		function insertChildAtCorrectPosition(parent: Model, child: Model) {
			if (Array.isArray(parent.children) && parent.children.length > 0) {
				let childName = child.toString();

				let i = 0;
				for (; i < parent.children.length; i++) {
					let name = parent.children[i].toString();

					if (name > childName) break;
				}				

				if (i < parent.children.length) {
					parent.insertChild(child, parent.children[i] as Model);
					return;
				}				
			}

			parent.appendChild(child);
		}
	}
	
	async toggleMap(toggleValue) {
		this.schedulerComponent().toggleMap(toggleValue);
	}

	async toggleResourceUtilization(toggleValue) {
		await this.schedulerComponent().toggleResourceUtilization(toggleValue);
	}
	groupPipeline(serviceOrders, absences: any[]): any {
		let result = {
			Absences: {},
			ArticleDowntime: {},
			ServiceOrders: {}
		};

		let timeEntryTypes = absences?.filter(a => a.type === OrderType.AbsenceOrder);
		timeEntryTypes?.sort((_a: AbsenceOrder, _b: AbsenceOrder) => {
			let a = _a.OriginalData as Crm.PerDiem.Rest.Model.Lookups.CrmPerDiem_TimeEntryType;
			let b = _b.OriginalData as Crm.PerDiem.Rest.Model.Lookups.CrmPerDiem_TimeEntryType;

			return a.SortOrder - b.SortOrder;
		});

		result.Absences = {
			id: 'Absences',
			name: window.Helper.String.getTranslatedString("Absence"),
			expanded: false,
			children: timeEntryTypes
		}

		let articleDowntimes = absences?.filter(a => a.type === OrderType.ArticleDowntime);
		articleDowntimes?.sort((_a: AbsenceOrder, _b: AbsenceOrder) => {
			let a = _a.OriginalData as Crm.Article.Model.Lookups.CrmArticle_ArticleDowntimeReason;
			let b = _b.OriginalData as Crm.Article.Model.Lookups.CrmArticle_ArticleDowntimeReason;

			return a.SortOrder - b.SortOrder;
		});

		result.ArticleDowntime = {
			id: 'ArticleDowntime',
			name: window.Helper.String.getTranslatedString("CrmArticle_ArticleDowntime"),
			expanded: false,
			children: articleDowntimes
		}

		result.ServiceOrders = {
			id: 'ServiceOrders',
			name: window.Helper.String.getTranslatedString("ServiceOrder"),
			expanded: false,
			children: serviceOrders
		}
		return result;
	}

	async initAndloadInlineData() {
		if (this.schedulerComponent().disposed) {
			return;
		}

		await this.initSchedulerData(ko.unwrap(this?.profile?.()?.Id));

		if (this.schedulerComponent().disposed) {
			return;
		}

		await this.schedulerComponent().loadInlineData(this.inlineData);
	}

	static createWorkingHoursIntervals(profile: Sms.Scheduler.Rest.Model.SmsScheduler_Profile): Partial<CalendarIntervalModelConfig>[] {
		let { workingHours } = window.Helper.Scheduler.WorkingHours.getProfileHours(profile);

		let workingHoursIntervals: Partial<CalendarIntervalModelConfig>[];

		if (workingHours.length == 1 && workingHours[0].from == 0 && workingHours[0].to == 24) {
			//full working hours
			workingHoursIntervals = [{
				recurrentStartDate: "on Mon at 0:00",
				recurrentEndDate: "on Sat at 0:00",
				isWorking: true
			}];
		}
		//else if (workingHours[workingHours.length - 1].to == 24) {
		//	//There is a problem with To==Midnight it causes the scheduler to show the dialog and say that there is not working hour!. The follow code adds exact hour for each day buy doesn't solve the problem!
		//	workingHoursIntervals = [];

		//	const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		//	for (let i = 0; i < weekDays.length; i++) {
		//		let wd = weekDays[i];
		//		let nwd = weekDays[(i + 1) % weekDays.length];

		//		for (let wh of workingHours) {
		//			workingHoursIntervals.push({
		//				recurrentStartDate: `on ${wd} at ${DateHelper.format(DateHelper.getTime(0, 0, wh.from * 3600), "HH:mm")}`,
		//				recurrentEndDate: `on ${wh.to== 24 ? nwd :wd} at ${DateHelper.format(DateHelper.getTime(0, 0, wh.to * 3600), "HH:mm")}`,
		//				isWorking: true
		//			});
		//		}

		//	}
		//}
		else {
			workingHoursIntervals = workingHours.map(x => ({
				recurrentStartDate: `every weekday at ${DateHelper.format(DateHelper.getTime(0, 0, x.from * 3600), "HH:mm")}`,
				recurrentEndDate: x.to == 24 ? "EOD" : `every weekday at ${DateHelper.format(DateHelper.getTime(0, 0, x.to * 3600), "HH:mm")}`,
				isWorking: true
			}));
		}

		return [
			{
				recurrentStartDate: 'on Sat at 0:00',
				recurrentEndDate: 'on Mon at 0:00',
				isWorking: false
			},
			...workingHoursIntervals];
	}

	static async applyResourceCalendars(profile: Sms.Scheduler.Rest.Model.SmsScheduler_Profile, resources: ResourceModel[]) {

		//let nonWorkingTimeEntryTypes = this.lookups.timeEntryTypes
		//	.$array.filter(it => it.DecreasesCapacity == 1)
		//	.map(it => it.Key);
		//console.log(nonWorkingTimeEntryTypes);

		let { workingHours } = window.Helper.Scheduler.WorkingHours.getProfileHours(profile);
		//defaultWorkingHoursPerDay is better to be calculated from the profile setting instead of window.Crm.PerDiem.Settings.TimeEntry.DefaultWorkingHoursPerDay
		let defaultWorkingHoursPerDay = workingHours.reduce((a, b) => a + (b.to - b.from), 0);

		for (let resource of resources) {
			if (resource.constructor === Technician) {
				let technician = resource as Technician;
				let workingHoursPerDay = technician.OriginalData.ExtensionValues.WorkingHoursPerDay > 0 ? technician.OriginalData.ExtensionValues.WorkingHoursPerDay : defaultWorkingHoursPerDay;

				//ignore users with the default working hours [below code commented because we need a calendar to use it calculateEndDate function]
				//if (workingHoursPerDay == defaultWorkingHoursPerDay)
				//	continue;

				//let timeEntries = await window.database.CrmPerDiem_UserTimeEntry
				//	.filter("it.TimeEntryTypeKey in nonWorkingTimeEntryTypes && it.ResponsibleUser == technicianid", { nonWorkingTimeEntryTypes: nonWorkingTimeEntryTypes, technicianid: technician.id })
				//	.toArray();
				//console.log(timeEntries);

				//let intervals = timeEntries.map(te => ({
				//	startDate: te.From,
				//	endDate: te.To,
				//	isWorking: false
				//}));

				let technicianWorkingHours: HourSpan[] = [];

				let sum = 0;
				for (let workingHour of workingHours) {
					let l = workingHour.to - workingHour.from;
					if (sum + l < workingHoursPerDay) {
						technicianWorkingHours.push({ ...workingHour });
						sum += l;
						continue;
					}
					else {
						technicianWorkingHours.push({
							from: workingHour.from,
							to: workingHour.from + (workingHoursPerDay - sum)
						});
						sum += workingHoursPerDay - sum;
						break;
					}
				}

				//in case the technician's workingHoursPerDay is bigger than the defaultWorkingHoursPerDay [below code commented because it was making problem calculating the calculateEndDate]
				//if (sum < workingHoursPerDay) {
				//	technicianWorkingHours[technicianWorkingHours.length - 1].to += workingHoursPerDay - sum;
				//}

				let intervals: Partial<CalendarIntervalModelConfig>[] = technicianWorkingHours.map(x => ({
					recurrentStartDate: `every weekday at ${DateHelper.format(DateHelper.getTime(0, 0, x.from * 3600), "HH:mm")}`,
					recurrentEndDate: x.to == 24 ? "EOD" : `every weekday at ${DateHelper.format(DateHelper.getTime(0, 0, x.to * 3600), "HH:mm")}`,
					isWorking: true
				}));

				let calendar = new CalendarModel({
					name: `ResourceCalendar_${technician.id}`,
					unspecifiedTimeIsWorking: false,
					//intervals: intervals
					intervals: [...SchedulerDetailsViewModel.createWorkingHoursIntervals(profile).filter(i => !i.isWorking), ...intervals]
				});

				await technician.setCalendar(calendar);
			}
		}
	}
	
	initGoogleMapsApi(apiKey: string, version: string) {
		//@ts-ignore
		(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
			key: apiKey,
			v: version,
		});
	}
	
	async checkConfigDefaults(): Promise<void> {
		let self = this;
		if (self.profile().ClientConfig.ResourceTooltip !== null
			&& self.profile().ClientConfig.ServiceOrderTooltip !== null
			&& self.profile().ClientConfig.ServiceOrderDispatchTooltip !== null
			&& self.profile().ClientConfig.RouteColors !== null
			&& self.profile().ClientConfig.AllowSchedulingForPast !== null
			&& self.profile().ClientConfig.PipelineFirstLine !== null
			&& self.profile().ClientConfig.DataForFirstRow !== null
			&& self.profile().ClientConfig.ServiceOrderDispatchDefaultDuration !== 0) {
			return;
		}
		const defaultConfig: Sms.Scheduler.Model.ClientConfig = (await window.database.SmsScheduler_Profile.GetDefaultProfileConfig().first());
		window.database.attachOrGet(self.profile());
		if(self.profile().ClientConfig.ResourceTooltip === null) {
			self.profile().ClientConfig.ResourceTooltip = defaultConfig.ResourceTooltip;
		}
		if(self.profile().ClientConfig.ServiceOrderTooltip === null) {
			self.profile().ClientConfig.ServiceOrderTooltip = defaultConfig.ServiceOrderTooltip;
		}
		if(self.profile().ClientConfig.ServiceOrderDispatchTooltip === null) {
			self.profile().ClientConfig.ServiceOrderDispatchTooltip = defaultConfig.ServiceOrderDispatchTooltip;
		}
		if(self.profile().ClientConfig.RouteColors === null) {
			self.profile().ClientConfig.RouteColors = defaultConfig.RouteColors;
		}
		if (self.profile().ClientConfig.ServiceOrderDispatchDefaultDuration == 0) {
			self.profile().ClientConfig.ServiceOrderDispatchDefaultDuration = defaultConfig.ServiceOrderDispatchDefaultDuration;
		}
		if (self.profile().ClientConfig.AllowSchedulingForPast == null) {
			self.profile().ClientConfig.AllowSchedulingForPast = defaultConfig.AllowSchedulingForPast;
		}
		if (self.profile().ClientConfig.PipelineFirstLine == null) {
			self.profile().ClientConfig.PipelineFirstLine = defaultConfig.PipelineFirstLine;
		}
		if (self.profile().ClientConfig.DataForFirstRow == null) {
			self.profile().ClientConfig.DataForFirstRow = defaultConfig.DataForFirstRow;
		}

		await window.database.saveChanges();
	}

	async setBreadcrumbs(): Promise<void> {
		const profile = this.profile();
		const schedulerUrl = "#/Sms.Scheduler/Scheduler/DetailsTemplate";
		
		const breadcrumbs = [new Breadcrumb(window.Helper.String.getTranslatedString("WebScheduler"), "Scheduler::Read", schedulerUrl,
			() => window.location.hash = `${schedulerUrl}?rnd=${Math.random()}`)];

		if (profile) {
			let title = profile.Name

			if (profile.Username !== window.Helper.User.getCurrentUserName())
				title += " (" + profile.Username + ")";

			let url = window.location.href;
			if(url.indexOf("?") !== -1) {
				url = url.substring(0, url.indexOf("?"));
			}
			const paramsUrl = `profileid=${profile.Id}`;
			url += "?" + paramsUrl;
			window.history.replaceState(null, null, url);

			breadcrumbs.push(new Breadcrumb(`${window.Helper.String.getTranslatedString("Profile")}: ${title}`, "Scheduler::Read", `${schedulerUrl}?profileid=${profile.Id}`));
		}

		await window.breadcrumbsViewModel.setBreadcrumbs(breadcrumbs);
	}
}

namespace("Sms.Scheduler.ViewModels").SchedulerDetailsViewModel = SchedulerDetailsViewModel;

// (function () {
// 	$(document).on('click', '.dropdown-menu', function (e) {
// 		e.stopPropagation();
// 	});
// })()
