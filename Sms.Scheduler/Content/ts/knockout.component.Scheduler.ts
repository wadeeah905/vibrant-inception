import {Timeline} from "./Timeline";
import {Absence, Dispatch, SchedulerEvent, SchedulerEventType} from "./Model/Dispatch";
import {ResourceType, Technician} from "./Model/Technicians";
import {Tool} from "./Model/Tools";
import {Drag} from "./Helper/DragHelper";
import {MapPanel} from "./MapPanel";
import {registerComponent} from "@Main/componentRegistrar";
import {
	AssignmentModel,
	BrowserHelper,
	CalendarModel,
	DateField,
	DateHelper,
	Duration,
	LocaleManager,
	Model,
	PresetManager,
	Splitter,
	TimeAxisColumn,
	Store, ResourceModel, ViewPreset, Tooltip, type MenuItemConfig, StringHelper, TimeSpan
} from "@bryntum/schedulerpro";
import {AbsenceOrder, BaseOrder, OrderType, ServiceOrder} from "./Model/ServiceOrder";
import {Pipeline} from "./Pipeline";
import {ComboLegend} from "./Legend";
import {MapMarker, MapMarkerType} from "./Model/MapMessage";
import {SchedulerDetailsViewModel} from "./SchedulerDetailsViewModel";
import {asyncComputed} from "./knockout-async-computed";
import type {HourSpan} from "./Model/HourSpan";
import {Vehicle} from "./Model/Vehicle";
import {DispatchStore, StoreIds} from "./Model/DispatchStore";
import {CrmAssignmentStore} from "./Model/AssignmentStore";
import {CrmCrudManager} from "./Model/CrudManager";
import type {Assignment} from "./Model/Assignment";
import "@bryntum/schedulerpro/locales/schedulerpro.locale.De.js";
import "@bryntum/schedulerpro/locales/schedulerpro.locale.Es.js";
import "@bryntum/schedulerpro/locales/schedulerpro.locale.FrFr.js";
import "@bryntum/schedulerpro/locales/schedulerpro.locale.Hu.js";
import {CrmResourceUtilization} from "./ResourceUtilization";
import {RouteData} from "./Model/RouteData";
import {Consumer} from "./Consumer";
import type {Feature, FeatureCollection} from "geojson";
import moment from "moment";
import {DispatchDetailsViewModel} from "@Crm.Service/DispatchDetailsViewModel";

registerComponent({
	componentName: "scheduler",
	template: "Sms.Scheduler/Scheduler/TimelinePanel",
	viewModel: {
		createViewModel: function (data) {
			// StateProvider.setup({
			// 	//@ts-ignore
			// 	storage : 'local',
			// 	prefix  : `${window.Helper.User.getCurrentUserName()}:`
			// });
			return new Scheduler(data);
		}
	},
});

type DateRangeChangeEvent = {
	startDate: Date,
	endDate: Date,
	removeAllEvents?: boolean,
	callback?: (unknown) => void,
	processStarted: boolean,
	withdrawn: boolean
};

export default class Scheduler extends window.Main.ViewModels.ViewModelBase {
	disposed = false;
	scheduler: Timeline = null;
	drag: Drag = null;
	markerDrag: Drag = null;
	pipeline: Pipeline = null;
	resourceUtilization: CrmResourceUtilization = null;
	pipelineSelectedServiceOrders = ko.observableArray<ServiceOrder>([]);
	eventMarkers: KnockoutObservableArray<MapMarker> = ko.observableArray<MapMarker>([]);
	resourceMarkers: KnockoutObservableArray<MapMarker> = ko.observableArray<MapMarker>([]);
	mapPanel: MapPanel = null;
	parentViewModel: SchedulerDetailsViewModel = null;
	splitter: Splitter = null;
	horizontalSplitter: Splitter = null;
	defaultTaskDurationInPixel = ko.observable(100);
	crudManager: CrmCrudManager = null;
	attachToStore = new WeakSet<any>();
	detachFromStore = new WeakSet<any>();
	routeData: KnockoutObservableArray<RouteData> = ko.observableArray<RouteData>([]);
	dateRangeChangeEventsConsumer: Consumer<DateRangeChangeEvent>;

	pendingChanges = ko.observable(0);
	pendingChangesTrigger = ko.observable(1).extend({ rateLimit: 500 });

	edgeThreshold: number = 150;
	draggedEventData: {
		eventIds: (string | number)[],
		assignmentIds: (string | number)[]
	} = null;

	requiredPresetIds = {
		weekly: 1,
		daily: 1,
		monthly: 1
	};

	updateFromProfileHours(profile: Sms.Scheduler.Rest.Model.SmsScheduler_Profile) {
		//@ts-ignore
		this.scheduler.timeAxis.updateGenerateTicks()
	}

	constructor(data) {
		super();
		let self = this;
		self.parentViewModel = data.parentViewModel;

		if (data.modelForParent)
			data.modelForParent(self);
		
		self.initializeViewPresets();
		const presets = PresetManager.records.filter(p => this.requiredPresetIds[p.id]);
		LocaleManager.applyLocale('En', { DateHelper: { locale: 'en-GB', weekStartDay: 1 } });
		LocaleManager.locales.Fr ??= LocaleManager.locales.FrFr;
		LocaleManager.locale = data.locale;

		let initialStartDate = DateHelper.startOf(self.parentViewModel.startDate, 'week');

		ComboLegend.initClass();
		// @ts-ignore
		self.scheduler = new Timeline({
			appendTo: 'schedulertimelinepanel',
			ref: 'timeline',
			stateId: 'timeline',
			startDate: initialStartDate,
			flex: 1,
			presets,
			viewPreset: 'weekly',
			zoomKeepsOriginalTimespan: true,
			rowHeight: self.parentViewModel.profile().ClientConfig.ResourceRowHeight,
			keyMap: {
				//@ts-ignore
				ArrowLeft: { handler: () => self.gotoPreviousDate() },
				//@ts-ignore
				ArrowRight: { handler: () => self.gotoNextDate() },
			},
			project: {
				skipNonWorkingTimeWhenSchedulingManually: false,
				skipNonWorkingTimeInDurationWhenSchedulingManually: false,
				addConstraintOnDateSet: false,
				calendar: self.parentViewModel.rootCalendar.value,
			
				eventStore: new DispatchStore(),
				assignmentStore: new CrmAssignmentStore(),
				resourceStore: {
					sorters: [
						{ field: 'SortOrder', ascending: true },
						{ field: 'Lastname', ascending: true }
					]
				},
				//@ts-ignore
				serviceOrderStore: {
					removeUnassignedEvent: false,
					modelClass: ServiceOrder,
					storeId: "serviceOrders"
				},
				listeners: {
					beforeSend({ requestConfig }) {
						requestConfig.params.profile = self.parentViewModel.profile()?.Id;
					}
				}
			},
			listeners: {
				presetChange: function (e: { startDate: Date, endDate: Date, from: ViewPreset, to: ViewPreset, zoomDate?: Date }) {
					let toPresetId = e.to.id;
					let df = this.widgetMap.datePicker as DateField;

					if (e.zoomDate) {
						df.value = e.zoomDate;
					}

					let selectedDate = df.value as Date;

					let newStartDate: Date = null;
					let newEndDate: Date = null;

					if (toPresetId == 'monthly') {
						newStartDate = DateHelper.startOf(selectedDate,"month");
						newEndDate = DateHelper.add(newStartDate, 1, 'month');;
					} else if (toPresetId == 'weekly') {
						newStartDate = DateHelper.startOf(selectedDate, "week");
						newEndDate = DateHelper.add(newStartDate, 1, 'week');;
					} else if (toPresetId == 'daily') {
						newStartDate = DateHelper.startOf(selectedDate, "day");
						newEndDate = DateHelper.add(newStartDate, 1, 'day');;
					}
					else
						throw "Unknown preset id.";

					queueMicrotask(() => self.scheduler.setTimeSpan(newStartDate, newEndDate));
					queueMicrotask(() => self.defaultTaskDurationInPixel(self.getDefaultTaskDurationInPixel()));

					//this is to fix hidden headers that sometimes happens!
					//@ts-ignore
					queueMicrotask(() => self.scheduler.timeAxis.refreshData());
				},
				beforeEventDropFinalize(data) {
					let { dropData, assignmentRecords, eventRecords } = data.context;
					let { assignments, events} = dropData;
					for(let i = 0; i < assignments.length; i++) {
						let { startDate, endDate } = events[i];
						if(events[i].eventRecord.OriginalData instanceof Crm.Service.Rest.Model.CrmService_ServiceOrderDispatch && (!window.Helper.Scheduler.hasSkillsForOrder(assignments[i].resourceRecord, events[i].eventRecord.ServiceOrder.OriginalData, startDate, endDate) || !window.Helper.Scheduler.hasAssetsForOrder(assignments[i].resourceRecord, events[i].eventRecord.ServiceOrder.OriginalData, startDate, endDate))) {
							assignmentRecords.splice(assignmentRecords.indexOf(assignments[i]), 1);
							eventRecords.splice(eventRecords.indexOf(events[i]), 1);
							if(assignments.length == 1) {
								data.context.valid = false;
								return;
							}
						}
					}
					self.draggedEventData = null;

					queueMicrotask(() =>
						$('.overlayDiv').each(function () {
							$(this).hide();
						})
					);

					if (!JSON.parse(window.Sms.Scheduler.Settings.WorkingTime.IgnoreWorkingTimesInEndDateCalculation)) {
						for (const eventRecord of eventRecords) {
							if (eventRecord?.OriginalData instanceof Crm.Service.Rest.Model.CrmService_ServiceOrderDispatch && eventRecord?.manuallyScheduled) {
								eventRecord.manuallyScheduled = false;
							}
						}
					}
				},
				beforeEventResizeFinalize(e) {
					const { context } = e;
					context.async = true;
					let { assignmentRecord, eventRecord, startDate, endDate, originalStartDate, originalEndDate } = context;
					if (eventRecord.OriginalData instanceof Crm.Service.Rest.Model.CrmService_ServiceOrderDispatch) {
						if (!window.Helper.Scheduler.hasSkillsForOrder(assignmentRecord.resource, eventRecord.ServiceOrder.OriginalData, startDate, endDate) || !window.Helper.Scheduler.hasAssetsForOrder(assignmentRecord.resource, eventRecord.ServiceOrder.OriginalData, startDate, endDate)) {
							context.valid = false;
							context.finalize(false);
							return;
						}

						if (self.parentViewModel.profile().ClientConfig.ServiceOrderDispatchForceMaximumDuration && self.parentViewModel.profile().ClientConfig.ServiceOrderDispatchMaximumDuration) {
							const calendar = (context.resourceRecord as Technician).calendar as CalendarModel;

							const newDurationInMinutes = eventRecord.manuallyScheduled ?
								moment(endDate).diff(startDate, "minutes") :
								DateHelper.as("minute", calendar.calculateDurationMs(startDate, endDate), "ms");
							const oldDurationInMinutes = eventRecord.manuallyScheduled ?
								moment(originalEndDate).diff(originalStartDate, "minutes") :
								DateHelper.as("minute", calendar.calculateDurationMs(originalStartDate, originalEndDate), "ms");

							const startHasChanged = !moment(startDate).isSame(originalStartDate);
							const endHasChanged = !moment(endDate).isSame(originalEndDate);

							if (newDurationInMinutes > oldDurationInMinutes && self.parentViewModel.profile().ClientConfig.ServiceOrderDispatchMaximumDuration < newDurationInMinutes) {
								if (!startHasChanged && endHasChanged) {
									//only end has changed
									if (eventRecord.manuallyScheduled) {
										context.endDate = moment(startDate).add(self.parentViewModel.profile().ClientConfig.ServiceOrderDispatchMaximumDuration, "minutes").toDate();
									} else {
										context.endDate = calendar.calculateEndDate(startDate, DateHelper.asMilliseconds(self.parentViewModel.profile().ClientConfig.ServiceOrderDispatchMaximumDuration, "minute"));
									}
								} else if (startHasChanged && !endHasChanged) {
									//only start has changed
									if (eventRecord.manuallyScheduled) {
										context.startDate = moment(endDate).subtract(self.parentViewModel.profile().ClientConfig.ServiceOrderDispatchMaximumDuration, "minutes").toDate();
									} else {
										context.startDate = calendar.calculateStartDate(endDate, DateHelper.asMilliseconds(self.parentViewModel.profile().ClientConfig.ServiceOrderDispatchMaximumDuration, "minute"));
									}
								} else if (startHasChanged && endHasChanged) {
									//both have changed! this should not happen but lets cancel the change to be safe
									context.valid = false;
									context.finalize(false);
									return;
								}
							}
						}
						if(self.parentViewModel.profile().ClientConfig.AllowSchedulingForPast === false && startDate < new Date()) {
							context.valid = false;
							context.finalize(false);
							return;
						}
					}
					if (e?.eventName != "eventPartialResize") {
						context.finalize(true);
					}
				},
				eventPartialResize(e) {
					if (this?.listeners?.beforeeventresizefinalize?.[0]?.fn?.name == "beforeEventResizeFinalize") {
						this.listeners.beforeeventresizefinalize[0].fn(e);
					}
				},
				eventResizeStart(e) {
					if (!JSON.parse(window.Sms.Scheduler.Settings.WorkingTime.IgnoreWorkingTimesInEndDateCalculation) &&
						e?.eventRecord?.OriginalData instanceof Crm.Service.Rest.Model.CrmService_ServiceOrderDispatch && e?.eventRecord?.manuallyScheduled) {
						e.eventRecord.manuallyScheduled = false;
					}
				},
				// Listener called before the built in editor is shown
				beforeEventEdit({ eventRecord, resourceRecord }) {
					if(eventRecord.type == SchedulerEventType.ServiceOrderTimePosting) return false;
					// Show custom editor
					$('#lgModal').modal("show",
						{
							route: `Sms.Scheduler/Scheduler/EditTemplate/?type=${eventRecord.type}`,
							viewModel: {eventRecord: eventRecord, parentViewModel: self.parentViewModel } //using it to pass the event to the constructor
						});
					// Prevent built in editor
					return false;
				},
				beforeAssignmentDelete({ assignmentRecords, source, context }) {
					let assignmentsToRemove = assignmentRecords.filter(a => a.event.readOnly === false);
					if(assignmentsToRemove.length > 0) {
						self.scheduler.eventStore.remove(assignmentsToRemove.map(a => a.eventId));
						self.scheduler.assignmentStore.remove(assignmentsToRemove);
					}
					return false;
				},
				beforeEventDrag(data: { source : Scheduler, eventRecord : SchedulerEvent, resourceRecord : ResourceModel, eventRecords : SchedulerEvent[], assignmentRecords : Assignment[], event : PointerEvent }) {
					let { eventRecords, assignmentRecords } = data;
					self.draggedEventData = {
						eventIds: eventRecords.map(e => e.id),
						assignmentIds: assignmentRecords.map(a => a.id)
					};
					const rect = self.scheduler.timeAxisSubGrid.element;
					function createOverlayDiv(id: string, isLeft: boolean) {
						const overlayDiv = $(`#${id}`)[0];
						overlayDiv.className = 'overlayDiv';
						overlayDiv.style.height = `${rect.getBoundingClientRect().height}px`;
						overlayDiv.style.width = `${self.edgeThreshold}px`;
						if(isLeft === true) {
							overlayDiv.style.left = `-${self.edgeThreshold+6.5}px`;
							$(`#${rect.id}`).append(overlayDiv);
						} else {
							$(`#b-crmpipeline-1`).append(overlayDiv);
						}

						const overlayText = document.createElement('span');
						overlayText.textContent = isLeft ? window.Helper.getTranslatedString('Previous') : window.Helper.getTranslatedString('Next');
						overlayDiv.appendChild(overlayText);
					}
					if(!$('#rightOverlayDiv').hasClass('overlayDiv')) {
						createOverlayDiv('rightOverlayDiv', false);
					} else {
						$('#rightOverlayDiv').show();
					}
					if(!$('#leftOverlayDiv').hasClass('overlayDiv')) {
						createOverlayDiv('leftOverlayDiv', true);
					} else {
						$('#leftOverlayDiv').show();
					}
				},
				eventDragAbortFinalized(data) {
					$('.overlayDiv').each(function() {
						$(this).hide();
					});
				}
			},
			snap: true,
			tbar: [
				{
					// @ts-ignore
					type : 'comboLegend',
					width: "40%",
					store: {
						data: window.Helper.Scheduler.InitComboLegendsItems(self.parentViewModel.lookups.serviceOrderDispatchStatuses.$array)
					},
					onSelect({ source }) {
						// @ts-ignore
						self.scheduler.eventStore.clearFilters(this.records.length === 0);
						self.clearRoute();

						if (this.records.length > 0) {
							const statuses: string[] = this.records.filter(item => item.type == 'Status').map(item => item.value);
							if (statuses.length > 0) {
								self.scheduler.eventStore.filter(eventRecord => statuses.some(item => eventRecord.OriginalData.StatusKey == item || eventRecord.parent?.OriginalData?.StatusKey == item || eventRecord.type == item));
							}

							const entityStates: number[] = this.records.filter(item => item.type == 'EntityState').map(item => item.value);
							if (entityStates.length > 0) {
								self.scheduler.eventStore.filter(eventRecord => entityStates.includes(eventRecord?.OriginalData?.entityState) );
							}
						}
					}
				},
				'->',
				{
					label: window.Helper.getTranslatedString('Go to date'),
					inputWidth: '5%',
					width: 'auto',
					type: 'datefield',
					ref: 'datePicker',
					editable: false,
					picker: {
						showWeekColumn: true,
						disableWeekends: false
					},
					step: '1d',
					listeners: {
						change({ userAction, value, oldValue}) {
							if (userAction) {
								let presetId = self.scheduler.viewPreset["id"] as string;

								if (presetId == 'monthly')
									self.scheduler.setStartDate(DateHelper.startOf(DateHelper.clearTime(value), 'month'));
								else if (presetId == 'weekly')
									self.scheduler.setStartDate(DateHelper.startOf(DateHelper.clearTime(value), 'week'));
								else if (presetId == 'daily')
									self.scheduler.setStartDate(DateHelper.startOf(DateHelper.clearTime(value), 'day'));
								else
									throw "Unknown preset id.";
							}
						}
					},
					highlightExternalChange: false,
					value: initialStartDate
				},
				{
					label: window.Helper.getTranslatedString('View'),
					type: 'viewpresetcombo',
					width: '10%',
					ref: 'presetCombo',
					presets: presets.map(p => p.id),
					picker: {
						maxHeight: 500
					}
				},
				{
					text     : window.Helper.getTranslatedString('Current Week'),
					width    : '10%',
					cls      : 'b-raised b-blue',
					ref      : 'goToThisWeek',
					tooltip: window.Helper.getTranslatedString('CurrentWeekTooltip'),
					onAction: () => self.gotoDate(new Date(), "weekly")
				},
				{
					type                 : 'textfield',
					ref                  : 'filterByName',
					//@ts-ignore
					icon: 'b-fa b-fa-filter',
					cls: 'align-v-end',
					placeholder          : window.Helper.getTranslatedString('FilterEvents'),
					clearable            : true,
					width                : '15%',
					keyStrokeChangeDelay : 100,
					triggers             : {
						filter : {
							align : 'start',
							cls   : 'b-fa b-fa-filter'
						}
					},
					onChange({ value }) {
						value = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
						const regEx = new RegExp(value, 'i');
						// Replace all previous filters and set a new filter
						self.scheduler.eventStore.filter({
							filters: (event: Dispatch | Absence) => {
								if(event.type === SchedulerEventType.Dispatch) {
									const dispatch = event as Dispatch;
									return dispatch.name.match(regEx) ||
										dispatch.ServiceOrder?.Company?.match(regEx) ||
										//@ts-ignore
										dispatch.ServiceOrder?.ErrorMessage?.match(regEx) ||
										//@ts-ignore
										dispatch?.ServiceOrder?.Installation?.Name?.match(regEx) ||
										//@ts-ignore
										dispatch?.ServiceOrder?.Installation?.Description?.match(regEx) ||
										dispatch?.ServiceOrder?.Status?.toString().match(regEx);
								} else if(event.type === SchedulerEventType.Absence) {
									const absence = event as Absence;
									return absence.name?.match(regEx) ||
										absence.AbsenceType.match(regEx);
								}
							},
							replace: true
						});
						
						self.scheduler.resourceStore.filter({
							filters: (resource: ResourceModel) => {
								return value
								//TODO: Maybe doesn't need to be this complex
								// @ts-ignore
								? self.scheduler.assignmentStore.records.filter(r => self.scheduler.eventStore.records.map(r2 => r2.id).includes(r.eventId)).map(a => a.resourceId).includes(resource.id)
								: self.scheduler.resourceStore.clearFilters()},
							replace: true
						});
					}
				}
			],
			//@ts-ignore
			timeAxis: {
				continuous: false,
				generateTicks(axisStartDate, axisEndDate, unit = this.unit, increment = this.increment) {
					if (self?.scheduler?.isDestroyed) { return []; }

					const { nonWorkingHours } = window.Helper.Scheduler.WorkingHours.getProfileHours(self.parentViewModel.profile());
					//console.log(`unit is ${unit} and increment is ${increment}`);

					if (unit === 'hour') {
						//compress nonworking hours only for hour unit
						let ticks: { startDate: Date, endDate: Date }[] = [];

						let days = DateHelper.diff(axisStartDate, axisEndDate, 'days');
						for (let day = 0; day < days; day++) {
							let startOfDay = DateHelper.add(axisStartDate, day, 'days');

							let dayHourSpans: HourSpan[] = [];
							for (let h = 0; h < 24; h += increment) {
								dayHourSpans.push({ from: h, to: h + increment });
							}

							if (increment == 1) {
								//merge
								for (let i = 0; i < dayHourSpans.length - 1; i++) {
									//check merging possibility
									let currentHourSpan = dayHourSpans[i];
									let isCurrentCompletlyNonWorking = nonWorkingHours.some(x => currentHourSpan.from >= x.from && currentHourSpan.to <= x.to);
									//let isCurrentPartiallyNonWorking = self.nonWorkingHours.some(x => (currentHourSpan.from >= x.from && currentHourSpan.from <= x.to) || (currentHourSpan.to >= x.from && currentHourSpan.to <= x.to));

									let nexthourSpan = dayHourSpans[i + 1];
									let isNextCompletlyNonWorking = nonWorkingHours.some(x => nexthourSpan.from >= x.from && nexthourSpan.to <= x.to);
									//let isNextPartiallyNonWorking = self.nonWorkingHours.some(x => (nexthourSpan.from >= x.from && nexthourSpan.from <= x.to) || (nexthourSpan.to >= x.from && nexthourSpan.to <= x.to));

									if (isCurrentCompletlyNonWorking && isNextCompletlyNonWorking) {
										//if ((isCurrentCompletlyNonWorking && isNextPartiallyNonWorking) || (isCurrentPartiallyNonWorking && isNextCompletlyNonWorking)) {
										//merge the two
										currentHourSpan.to = nexthourSpan.to;
										dayHourSpans.splice(i + 1, 1);
										i--;
									}
								}
							}

							let dayTicks = dayHourSpans.map(x => ({
								startDate: DateHelper.add(startOfDay, x.from, 'hours'),
								endDate: DateHelper.add(startOfDay, x.to, 'hours')
							}));

							ticks.push(...dayTicks);
						}

						return ticks;
					}
					else {
						//copy paste of default implementation
						const me = this, ticks = [], usesExclusion = Boolean(me.include);
						let intervalEnd, tickEnd, isExcluded, dstDiff = 0, { startDate, endDate } = me.getAdjustedDates(axisStartDate, axisEndDate);
						me.tickCache = {};
						if (usesExclusion) {
							me.initExclusion();
						}
						while (startDate < endDate) {
							intervalEnd = DateHelper.getNext(startDate, unit, increment, me.weekStartDay);
							if (!me.autoAdjust && intervalEnd > endDate) {
								intervalEnd = endDate;
							}
							if (unit === "hour" && increment > 1 && ticks.length > 0 && dstDiff === 0) {
								const prev = ticks[ticks.length - 1];
								dstDiff = (prev.startDate.getHours() + increment) % 24 - prev.endDate.getHours();
								if (dstDiff !== 0) {
									intervalEnd = DateHelper.add(intervalEnd, dstDiff, "hour");
								}
							}
							isExcluded = false;
							if (usesExclusion) {
								tickEnd = new Date(intervalEnd.getTime());
								isExcluded = me.processExclusion(startDate, intervalEnd, unit);
							} else {
								tickEnd = intervalEnd;
							}
							if (!isExcluded) {
								ticks.push({
									id: ticks.length + 1,
									startDate,
									endDate: intervalEnd
								});
								me.tickCache[startDate.getTime()] = ticks.length - 1;
							}
							startDate = tickEnd;
						}

						this.owner.timeAxisColumn.refreshHeader();

						return ticks;
					}
				}
			}
		});
		self.scheduler.defaultEventDuration = moment.duration(self.parentViewModel.profile().ClientConfig.ServiceOrderDispatchDefaultDuration, "minutes");
		self.scheduler.serviceOrderDispatchMaximumDuration = moment.duration(self.parentViewModel.profile().ClientConfig.ServiceOrderDispatchMaximumDuration, "minutes");
		self.scheduler.ServiceOrderDispatchIgnoreCalculatedDuration = self.parentViewModel.profile().ClientConfig.ServiceOrderDispatchIgnoreCalculatedDuration;
		self.scheduler.AllowSchedulingForPast = () => self.parentViewModel.profile().ClientConfig.AllowSchedulingForPast;
		self.scheduler.dataForFirstRow = () => self.parentViewModel.profile().ClientConfig.DataForFirstRow;
		self.scheduler.dataForSecondRow = () => self.parentViewModel.profile().ClientConfig.DataForSecondRow;
		self.scheduler.dataForThirdRow = () => self.parentViewModel.profile().ClientConfig.DataForThirdRow;
		self.scheduler.rowHeight = self.scheduler.baseRowHeight + self.scheduler.numberOfRows() * self.parentViewModel.profile().ClientConfig.ResourceRowHeight;


		const throttleAndDebounceMouseMovement = (throttleLimit, debounceDelay) => {
			let inThrottle: boolean, debounceTimeout: NodeJS.Timeout, intervalId: NodeJS.Timeout;
			
			const throttleFunc = (event) => {
				if(!inThrottle) {
					inThrottle = true;					
					if (event.target.id === "leftOverlayDiv") {
						self.gotoPreviousDate();
					} else {
						self.gotoNextDate();
					}
					self.scheduler.highlightResourceCalendars(self.scheduler.getResourcesToHighlight({eventRecords: self.scheduler.eventStore.records.filter(e => self.draggedEventData.eventIds.includes(e.id))}));
					setTimeout(() => { inThrottle = false }, throttleLimit);
				}
			};
			
			return {
				start(event) {
					clearTimeout(debounceTimeout);
					if (self.draggedEventData === null) return;

					if (intervalId) return;
					debounceTimeout = setTimeout(() => {
						intervalId = setInterval(() => {
							throttleFunc(event);
						}, throttleLimit);
					}, debounceDelay);
				},
				stop() {
					clearInterval(intervalId);
					clearTimeout(debounceTimeout);
					intervalId = null;
					debounceTimeout = null;
					inThrottle = false;
				}
			}
		};
		const control = throttleAndDebounceMouseMovement(900, 100);
		$('#rightOverlayDiv')[0].addEventListener("mousemove", control.start.bind(control));
		$('#leftOverlayDiv')[0].addEventListener("mousemove", control.start.bind(control));
		
		$('#rightOverlayDiv')[0].addEventListener("mouseleave", control.stop.bind(control));
		$('#leftOverlayDiv')[0].addEventListener("mouseleave", control.stop.bind(control));
		
		let defaultTimeAxisFilter = t => {
			if (self.scheduler.isDestroyed) { return false; }

			const calendar = self.scheduler.project.calendar as CalendarModel;
			const presetId = self.scheduler.viewPreset["id"] as string;

			if (presetId != 'daily') {
				return calendar.isWorkingTime(t.startDate, t.endDate);
			}

			return true;
		}

		self.scheduler.timeAxis.filterBy(defaultTimeAxisFilter);
		
		self.scheduler.features.eventMenu.setConfig({
			items: {
				cutEvent: false,
				splitEvent: false,
				promoteToLeader: !window.AuthorizationManager.currentUserHasPermission("Scheduler::Edit") ? false : {
					text: `${window.Helper.getTranslatedString("PromoteToLeader")}`,
					icon: 'b-fa b-fa-solid b-fa-crown',
					weight: 100,
					async onItem({ eventRecord, resourceRecord }) {
						const scheduler = this.owner.owner as Timeline;

						eventRecord.set({
							Username: resourceRecord.ResourceKey
						});

						scheduler.refreshRows();
					}
				},
				confirmDispatch: !window.AuthorizationManager.currentUserHasPermission("Scheduler::Edit") ? false : {
					separator: true,
					text: `${window.Helper.getTranslatedString("Release")}`,
					icon: 'zmdi zmdi-mail-send',
					weight: 100,
					async onItem(event) {
						const scheduler = this.owner.owner;
						let selectedEvents = Timeline.getEventContextMenuSelectedItems(scheduler, event["eventRecord"]);

						for (let selectedEvent of selectedEvents) {
							if (selectedEvent?.type == SchedulerEventType.Dispatch) {
								selectedEvent.set({
									StatusKey: "Released"
								});
							}
						}
					}
				},
				fixDispatch: !window.AuthorizationManager.currentUserHasPermission("Scheduler::Edit") ? false : {
					text: `${window.Helper.getTranslatedString("FixDispatch")}`,
					weight: 100,
					async onItem(event) {
						const scheduler = this.owner.owner;
						let selectedEvents = Timeline.getEventContextMenuSelectedItems(scheduler, event["eventRecord"]);

						for (let selectedEvent of selectedEvents) {
							if (selectedEvent?.type == SchedulerEventType.Dispatch) {
								selectedEvent.set({
									IsFixed: event.item.checked
								});
							}
						}
					}
				},
				completeDispatch: !window.AuthorizationManager.currentUserHasPermission("Scheduler::Edit") ? false : {
					text: `${window.Helper.getTranslatedString("Complete")}`,
					icon: 'zmdi zmdi-mail-send',
					weight: 100,
					onItem({eventRecord}) {
						let dispatch: Crm.Service.Rest.Model.CrmService_ServiceOrderDispatch = (eventRecord as Dispatch).OriginalData;
						let element: HTMLElement = document.querySelector(`[data-ref="completeDispatch"]`);

						ko.cleanNode(element);
						let ddvm = new DispatchDetailsViewModel();
						ddvm.init(dispatch.Id);
						ko.applyBindings(ddvm, element);

						element.dataset.route = 'Crm.Service/Dispatch/ChangeStatusTemplate/' + dispatch.Id;
						element.dataset.toggle = "modal";
						element.dataset.target = "#modal";
					}
				},
				openDispatch: {
					separator: true,
					text: `${window.Helper.getTranslatedString("Open Dispatch")}`,
					icon: 'zmdi zmdi-layers',
					weight: 200,
					onItem({ eventRecord }) {
						const scheduler = this.owner.owner;
						let selectedEvents = Timeline.getEventContextMenuSelectedItems(scheduler, eventRecord);

						for (let selectedEvent of selectedEvents) {
							if (selectedEvent?.type == SchedulerEventType.Dispatch &&
								(selectedEvent?.OriginalData.entityState == $data.EntityState.Unchanged || selectedEvent?.OriginalData.entityState === undefined)) {
								window.open(`#/Crm.Service/Dispatch/DetailsTemplate/${selectedEvent.id}`, "_blank")
							}
						}
					}
				},
				openOrder: {
					text: `${window.Helper.getTranslatedString("Open Order")}`,
					icon: 'b-fa b-fa-fw b-fa-folder-open',
					weight: 200,
					onItem({ eventRecord }) {
						const scheduler = this.owner.owner;
						let selectedEvents = Timeline.getEventContextMenuSelectedItems(scheduler, eventRecord);

						for (let selectedEvent of selectedEvents) {
							if (selectedEvent?.type == SchedulerEventType.Dispatch) {
								window.open(`#/Crm.Service/ServiceOrder/DetailsTemplate/${(selectedEvent as Dispatch).OriginalData.OrderId}`, "_blank")
							}
						}
					}
				},
				deleteEvent: !window.AuthorizationManager.currentUserHasPermission("Scheduler::Edit") ? false : {
					weight : 250
				},
				unassignEvent: {
					text: `${window.Helper.getTranslatedString("Unassign")}`,
					weight : 260,
					async onItem({ assignmentRecord, eventRecord }) {
						const scheduler = this.owner.owner as Timeline;

						let validationItems = [];
						let serviceOrder = (eventRecord as Dispatch).ServiceOrder;
						if (serviceOrder.PreferredTechnician != null && serviceOrder.PreferredTechnician == (assignmentRecord as Assignment).resourceId) {
							validationItems.push({
								type: 'label',
								cls: 'scheduler-warning',
								text: `${serviceOrder.name}: ${window.Helper.String.getTranslatedString('PreferredTechnicianRemovedWarning').replace("{0}", window.Helper.User.getDisplayName(serviceOrder.OriginalData.PreferredTechnicianUser))}`,
								style: 'width: 100%',
							});
						}
						const assignments = scheduler.assignmentStore.getAssignmentsForEvent(eventRecord as TimeSpan);
						const otherAssignmentsHasPreferredUserGroups = assignments.filter(a => a.id != assignmentRecord.id).some(a => (a.resource as Technician).UserGroups?.includes(serviceOrder.PreferredUserGroup)); //filter out the assignment we are currently removing
						if (serviceOrder.PreferredUserGroup != null && ((assignmentRecord as Assignment).resource as Technician).UserGroups.includes(serviceOrder.PreferredUserGroup) && !otherAssignmentsHasPreferredUserGroups) {
							validationItems.push({
								type: 'label',
								cls: 'scheduler-warning',
								text: `${serviceOrder.name}: ${window.Helper.String.getTranslatedString('PreferredUserGroupRemovedWarning').replace("{0}", serviceOrder.PreferredUserGroup)}`,
								style: 'width: 100%',
							});
						}
						if(validationItems.length > 0) {
							window.Helper.Scheduler.ShowPopup(validationItems, () => { saveChanges(); });
						} else {
							saveChanges();
						}
						function saveChanges() {
							scheduler.assignmentStore.remove(assignmentRecord);
							const remainingAssignments = scheduler.assignmentStore.getAssignmentsForEvent(eventRecord as TimeSpan) as Assignment[];
							const dispatch = eventRecord as Dispatch;

							const newTeamLeader = window.Helper.Scheduler.determineTeamLeader(dispatch, remainingAssignments);
							if (dispatch.OriginalData.Username != newTeamLeader) {
								eventRecord.set({
									Username: newTeamLeader
								});
							}

							scheduler.refreshRows();
						}
					}
				},
				editEvent: false,
				editTimelineEvent :!window.AuthorizationManager.currentUserHasPermission("Scheduler::Edit") ? false : {
					separator: true,
					weight : 300,
					icon: 'b-fa b-fa-pencil',
					onItem({ assignmentRecord, eventRecord }) {
						if(eventRecord.type == SchedulerEventType.ServiceOrderTimePosting) return false;
						// Show custom editor
						$('#lgModal').modal("show",
							{
								route: `Sms.Scheduler/Scheduler/EditTemplate/?type=${eventRecord.type}`,
								viewModel: {eventRecord: eventRecord, parentViewModel: self.parentViewModel } //using it to pass the event to the constructor
							});
						// Prevent built in editor
						return false;
					}
				}
			},
			processItems(event) {
				const { resourceRecord, eventRecord, items } = event;

				if(!window.AuthorizationManager.currentUserHasPermission("Scheduler::Edit") || (eventRecord as SchedulerEvent).type === SchedulerEventType.ServiceOrderTimePosting) {
					items.editTimelineEvent = false;
					items.deleteEvent = false;
					items.completeDispatch = false;
					items.confirmDispatch = false;
					items.fixDispatch = false;
					items.openDispatch = false;
					items.openOrder = false;
					items.promoteToLeader = false;
					items.unassignEvent = false;

					return;
				}
				if((eventRecord as SchedulerEvent).type !== SchedulerEventType.Dispatch || resourceRecord instanceof Technician && this.project.assignmentStore.getAssignmentsForEvent(eventRecord).filter(a => a.OriginalData instanceof Sms.Scheduler.Rest.Model.SmsScheduler_DispatchPersonAssignment).length <= 1) {
					items.unassignEvent = false;
				}
				if((eventRecord as SchedulerEvent).type === SchedulerEventType.Dispatch) {
					let dispatch: Crm.Service.Rest.Model.CrmService_ServiceOrderDispatch = (eventRecord as Dispatch).OriginalData;
					(items.editTimelineEvent as MenuItemConfig).text = `${window.Helper.getTranslatedString("EditDispatch")}`;
					(items.deleteEvent as MenuItemConfig).text = `${window.Helper.getTranslatedString("DeleteDispatch")}`;

					if (!(dispatch.StatusKey === 'InProgress' || dispatch.StatusKey === 'SignedByCustomer')) {
						items.completeDispatch = false;
					}
					if (!(dispatch.StatusKey === 'Scheduled')) {
						items.confirmDispatch = false
					}
					if (dispatch.IsActive) {
						//@ts-ignore
						items.fixDispatch.checked = dispatch.IsFixed;
					} else {
						items.fixDispatch = false;
					}
					if (!(eventRecord as Dispatch).dispatchInEditableState) {
						items.fixDispatch = false;
					}
					if (dispatch.StatusKey !== 'Scheduled' || dispatch.IsFixed) {
						items.deleteEvent = false;
					}
					if (dispatch.Username == resourceRecord.ResourceKey || resourceRecord["type"] != ResourceType.Technician) {
						items.promoteToLeader = false;
					}
					if (dispatch.entityState == $data.EntityState.Modified) {
						let openDispatch = items.openDispatch as MenuItemConfig;
						openDispatch.disabled = true;
						openDispatch.tooltip = window.Helper.String.getTranslatedString("AutosaveOffWarning");
					}
				} else if ((eventRecord as SchedulerEvent).type === SchedulerEventType.Absence) {
					(items.editTimelineEvent as MenuItemConfig).text = `${window.Helper.getTranslatedString("EditAbsence")}`;
					(items.deleteEvent as MenuItemConfig).text = `${window.Helper.getTranslatedString("DeleteAbsence")}`;
					items.completeDispatch = false;
					items.confirmDispatch = false;
					items.fixDispatch = false;
					items.openDispatch = false;
					items.openOrder = false;
					items.promoteToLeader = false;
					items.unassignEvent = false;
				}
			}
		});
		
		self.scheduler.features.cellMenu.setConfig({
			items: {
				openDetails: {
					text: `${window.Helper.getTranslatedString("Details")}`,
					icon: 'b-fa b-fa-fw b-fa-folder-open',
					weight: 1,
					onItem({record}) {
						if((record as ResourceTypes).type === ResourceType.Technician) {
							window.open(`#/Main/User/DetailsTemplate/${(record as Technician).OriginalData.Id}`, "_blank")
						} else if((record as ResourceTypes).type === ResourceType.Tool || (record as ResourceTypes).type === ResourceType.Vehicle) {
							window.open(`#/Crm.Article/Article/DetailsTemplate/${(record as Tool | Vehicle).OriginalData.Id}`, "_blank")
						}
					}
				},
				getRoute: {
					weight : 250,
					icon: 'b-fa b-fa-solid b-fa-route',
					text: `${window.Helper.getTranslatedString("GetRoute")}`,
					async onItem(event) {
						self.routeData([]);
						self.routeData([new RouteData(ko.observable(event.id), ko.observable(self.parentViewModel.profile().ClientConfig.RouteColors[self.routeData().length]))]);

						await self.getRoute(self.routeData());
					}
				},
				orderResources: {
					separator: true,
					icon: 'b-fa b-fa-solid b-fa-arrows-up-down',
					text: `${window.Helper.getTranslatedString("ReorderResources")}`,
					async onItem(event) {
						const technicians = self.scheduler.resourceStore.records.filter(r => r.constructor === Technician) as Technician[];
						// Show custom editor
						$('#smModal').modal("show",
							{
								route: `Sms.Scheduler/Scheduler/ResourceReorder/`,
								viewModel: {technicians: technicians, parentViewModel: self.parentViewModel }
							});
						// Prevent built in editor
						return false;
					},
				},
			},
			processItems({items, record}) {
				let visibleEvents = self.scheduler.eventStore.getEvents({
					resourceRecord : record,
					startDate      : self.scheduler.timeAxis.startDate,
					endDate        : self.scheduler.timeAxis.endDate,
					filter		   : r => { return (r as SchedulerEvent).type == SchedulerEventType.Dispatch && (r as Dispatch).ServiceOrder.Latitude != null && (r as Dispatch).ServiceOrder.Longitude != null }
				});
				if ((visibleEvents as Model[]).length < 1) {
					items.getRoute = false;
				}
				if(record.constructor !== Technician) {
					items.orderResources = false;
				}
				if(record.constructor === Technician) {
					if(!self.parentViewModel.autosave()) {
						let orderResources = items.orderResources as MenuItemConfig;
						orderResources.disabled = true;
						orderResources.tooltip = window.Helper.String.getTranslatedString("FunctionalityNotAvailableWarning");
					}
				}
				if (!self.parentViewModel.autosave()) {
					let removeRow = items.removeRow as MenuItemConfig;
					removeRow.disabled = true;
					removeRow.tooltip = window.Helper.String.getTranslatedString("FunctionalityNotAvailableWarning");
				}
				if(record.constructor !== Technician && record.constructor !== Tool && record.constructor !== Vehicle) {
					items.openDetails = false;
				}
			}
		});

		self.scheduler.features.scheduleMenu.setConfig({
			items: {
				addEvent: !window.AuthorizationManager.currentUserHasPermission("Adhoc::Create") ? false : {
					text: window.Helper.String.getTranslatedString('CreateAdHocServiceOrderHere'),
					icon: 'b-fa b-fa-fw b-fa-solid b-fa-plus',
					onItem(event) {
						let { date, resourceRecord } = event;
						$('#lgModal').modal("show",
							{
								route: `Sms.Scheduler/Scheduler/AdHocTemplate/`,
								viewModel: { date: date, resourceRecord: resourceRecord, parentViewModel: self.parentViewModel } //using it to pass the event to the constructor
							});
					}
				},
				showNonWorkingHours: {
					separator: true,
					text: window.Helper.String.getTranslatedString('ShowNonWorkingHours'),
					icon: 'b-fa b-fa-fw b-fa-eye',
					onItem({ date, resourceRecord, items }) {
						self.scheduler.timeAxis.clearFilters();
					}
				},
				hideNonWorkingHours: {
					text: window.Helper.String.getTranslatedString('HideNonWorkingHours'),
					icon: 'b-fa b-fa-fw b-fa-eye-slash',
					onItem({ date, resourceRecord, items }) {
						self.scheduler.timeAxis.filterBy(defaultTimeAxisFilter);
					}
				},
				onlyForThisDayNonWorkingHours: {
					text: window.Helper.String.getTranslatedString('ShowDayNonWorkingHours'),
					icon: 'b-fa b-fa-fw b-fa-eye-low-vision',
					onItem({ date, resourceRecord, items }) {
						let startDate = DateHelper.startOf(date as Date, 'day');
						let endDate = DateHelper.add(startDate, 1, 'day');
						
						self.scheduler.timeAxis.filterBy(t =>
							(startDate <= t.endDate && t.startDate <= endDate) || defaultTimeAxisFilter(t)
						);
					}
				},
			},
			processItems: event => {
				const presetId = self.scheduler.viewPreset["id"] as string;

				if (presetId == 'daily') {
					event.items.showNonWorkingHours = false;
					event.items.hideNonWorkingHours = false;
					event.items.onlyForThisDayNonWorkingHours = false;
				}

				if (!self.parentViewModel.autosave()) {
					let addEvent = event.items.addEvent as MenuItemConfig;
					addEvent.disabled = true;
					addEvent.tooltip = window.Helper.String.getTranslatedString("FunctionalityNotAvailableWarning");
				}
			}
		});

		const getShiftDateFunction = function (forward: boolean) {
			const s = forward ? 1 : -1;

			return function () {
				const presetId = self.scheduler.viewPreset["id"] as string;
				let value = this.value;
				switch (presetId) {
					case 'monthly':
						value = DateHelper.add(this.value, s * 1, 'month');
						break;
					case 'weekly':
						value = DateHelper.add(this.value, s * 7, 'day');
						break;
					case 'daily': {
						let endValue: Date;
						let isWorking: boolean;
						do {
							value = DateHelper.add(value, s * 1, 'day');
							endValue = DateHelper.add(value, 1, 'day');
						} while (!(self.scheduler.project.calendar as CalendarModel).isWorkingTime(value, endValue));
						break;
					}
					default:
						throw "Unknown preset id.";
				}
				self.scheduler.saveState();
				return value;
			};		
		}

		Object.defineProperties(self.scheduler.widgetMap.datePicker, {
			backShiftDate: {
				get: getShiftDateFunction(false)
			},
			forwardShiftDate: {
				get: getShiftDateFunction(true)
			}
		});

		this.dateRangeChangeEventsConsumer = new Consumer(
			async (e: DateRangeChangeEvent) => {
				e.processStarted = true;
				if (e.withdrawn) {
					return;
				}
				this.parentViewModel.loading(true);

				const technicians = self.scheduler.resourceStore.allRecords.filter(r => r.constructor === Technician) as Technician[];
				const tools = self.scheduler.resourceStore.allRecords.filter(r => r.constructor === Tool || r.constructor == Vehicle);

				let dispatches = await self.parentViewModel.loadTechniciansDispatches(technicians, e.startDate, e.endDate);
				let dispatchesIds = new Set(dispatches.map(d => d.id));
				let absences = await self.parentViewModel.loadAbsences(technicians, tools, e.startDate, e.endDate);
				let absencesIds = new Set(absences.map(a => a.id));
				//This list is for when autosave is off and an event is unassigned. Unassigning wont mark the dispatch as modified. This list is used to not remove such dispatches from timeline while changing range.
				let removedAssignmentsDispatchIds = (self.scheduler.assignmentStore?.["removed"]?.["values"]?.map(x => x.eventId) || []) as (string | number)[];

				//Find Items to be removed
				let eventsToBeRemoved = e.removeAllEvents ? self.scheduler.eventStore.allRecords : self.scheduler.eventStore.allRecords.filter(e =>
					(!removedAssignmentsDispatchIds.includes(e.id)) && !self.draggedEventData?.eventIds.includes(e.id) &&
					(e["OriginalData"]?.["entityState"] === $data.EntityState.Unchanged || e["OriginalData"]?.["entityState"] === undefined) &&
					(((e["type"] === SchedulerEventType.Dispatch || e["type"] === SchedulerEventType.ServiceOrderTimePosting) && !dispatchesIds.has(e.id)) ||
					(e["type"] === SchedulerEventType.Absence && !absencesIds.has(e.id)))
				);
				let eventsToBeRemovedIds = new Set(eventsToBeRemoved.map(e => e.id));
				let assignmentsToBeRemoved = (self.scheduler.assignmentStore.allRecords as AssignmentModel[]).filter(a => eventsToBeRemovedIds.has(a.eventId));

				//Prevent DB deletes
				eventsToBeRemoved.forEach(e => self.detachFromStore.add(e));
				assignmentsToBeRemoved.forEach(e => self.detachFromStore.add(e));

				//Remove old items
				self.scheduler.eventStore.remove(eventsToBeRemoved, true);
				self.scheduler.assignmentStore.remove(assignmentsToBeRemoved, true);

				//Find Items to be added
				let eventStoreItemIds = new Set(self.scheduler.eventStore.allRecords.map(e => e.id));
				let eventsToBeAdded = [
					...dispatches.filter(d => !eventStoreItemIds.has(d.id)),
					...absences.filter(d => !eventStoreItemIds.has(d.id))
				];
				let assignmentsToBeAdded = await self.parentViewModel.loadAssignments(eventsToBeAdded);

				//Prevent DB inserts
				assignmentsToBeAdded.forEach(e => self.attachToStore.add(e));
				eventsToBeAdded.forEach(e => {
					self.attachToStore.add(e);
					(e.children as SchedulerEvent[])?.forEach(t => self.attachToStore.add(t));
				});


				//Add Items
				await self.scheduler.eventStore.addAsync(eventsToBeAdded);
				await self.scheduler.assignmentStore.addAsync(assignmentsToBeAdded);

				//Clear possible changes to newly added items
				eventsToBeAdded.forEach(x => x.clearChanges(true));
				assignmentsToBeAdded.forEach(x => x.clearChanges(true));

				//This workaround is to prevent the dirtyflag (dashed lines) to be on the events
				//@ts-ignore
				self.scheduler.refresh();

				e.callback?.(e);
				this.parentViewModel.loading(false);
			}
		);

		self.scheduler.on('dateRangeChange', async e => {
			let daysBefore: number, daysAfter: number;
			let presetId = self.scheduler.viewPreset["id"] as string;

			if (presetId == 'monthly') {
				daysBefore = daysAfter = 31;
			}
			else if (presetId == 'weekly') {
				daysBefore = daysAfter = 7;
			}
			else if (presetId == 'daily') {
				daysBefore = daysAfter = 3;
			}
			else
				throw "Unknown preset id.";

			let startDate = DateHelper.add(e.new.startDate, -daysBefore, 'day');
			let endDate = DateHelper.add(e.new.endDate, daysAfter, 'day');

			this.dateRangeChangeEventsConsumer.queue.forEach(e => {
				if (!e.processStarted) {
					e.withdrawn = true;
				}
			});
			this.dateRangeChangeEventsConsumer.enqueue({
				startDate: startDate,
				endDate: endDate,
				callback: () => this.triggerPendingChanges(),
				processStarted: false,
				withdrawn: false
			});
			this.dateRangeChangeEventsConsumer.notify();
		});

		// @ts-ignore
		self.scheduler.features.cellTooltip.tooltipRenderer = (data) => {
			if ((data.record as ResourceTypes).type == ResourceType.Technician) {
				let profile = ko.unwrap(this.parentViewModel.profile);
				let tooltipProps = ko.unwrap(profile.ClientConfig.ResourceTooltip);
				if(tooltipProps.length === 0) {
					return window.Helper.getTranslatedString('TooltipIsNotConfigured');
				}
				let tooltipContext = { "Resource": data.record };

				return window.Helper.Scheduler.Tooltips.BuildTooltip(tooltipContext, tooltipProps, "Resource");
			} else if ((data.record as ResourceTypes).type == ResourceType.Tool || (data.record as ResourceTypes).type == ResourceType.Vehicle) {
				let tooltipProps =  [
					"Resource.ItemNo",
					"Resource.Description"
				];
				let tooltipContext = { "Resource": data.record };
				return window.Helper.Scheduler.Tooltips.BuildTooltip(tooltipContext, tooltipProps, "Resource");
			}
		};

		//@ts-ignore
		self.scheduler.features.eventTooltip.template = (data) => {
			if (data.eventRecord.type == SchedulerEventType.Dispatch) {
				let profile = ko.unwrap(this.parentViewModel.profile);
				let tooltipProps = ko.unwrap(profile.ClientConfig.ServiceOrderDispatchTooltip);
				if(tooltipProps.length === 0) {
					return window.Helper.getTranslatedString('TooltipIsNotConfigured');
				}
				let tooltipContext = {
					"ServiceOrder": data.eventRecord.ServiceOrder,
					"ServiceOrderDispatch": data.eventRecord
				};

				return window.Helper.Scheduler.Tooltips.BuildTooltip(tooltipContext, tooltipProps, "ServiceOrderDispatch");
			} else {
				let tooltipProps = [
						"AbsenceType.Value",
						"Absence.Description",
						"#.#",
						"Absence.From",
						"Absence.To",
				];
				let tooltipContext = {
					"Absence": data.eventRecord.OriginalData,
					"AbsenceType": data.eventRecord.AbsenceTypeData
				};
				return window.Helper.Scheduler.Tooltips.BuildTooltip(tooltipContext, tooltipProps, "Absence");
			}
		};

		self.crudManager = new CrmCrudManager({
			//@ts-ignore
			project: self.scheduler.project,
			context: self
		}, self.attachToStore, self.detachFromStore);
		self.crudManager.on("save", () => {
			//The dirty class is not removed automatically after saves. This workaround removes it �
			self.scheduler.element.querySelectorAll(".b-sch-dirty.b-sch-event").forEach(e => e.classList.remove("b-sch-dirty"));

			self.triggerPendingChanges();
		});

		self.scheduler.project.assignmentStore.on("update", async (event) => {
			let assignment: any = window.database.attachOrGet((event.record as Assignment).OriginalData);
			try {
				if (event.changes['resourceId']) {
					if(event.record.event.constructor === Dispatch) {
						let dispatch: any = this.parentViewModel.syncWasOff() ?  (event.record.event as Dispatch).OriginalData : window.database.attachOrGet((event.record.event as Dispatch).OriginalData);
						if(!event.record.event.isTeamDispatch() || event.record.event.isTeamDispatch() && event.changes['resourceId'].oldValue == dispatch.Username) {
							dispatch.Username = event.changes['resourceId'].value;
							await (event.record.event as Dispatch).setAsync("Username", dispatch.Username);
							(event.record.event as Dispatch).OriginalData = dispatch;
						}
						assignment.ResourceKey = event.changes['resourceId'].value;
					} else if(event.record.event.constructor === Absence) {
						if(assignment instanceof Sms.Scheduler.Rest.Model.SmsScheduler_DispatchPersonAssignment) {
							let absence: any = this.parentViewModel.syncWasOff() ?  (event.record.event as Absence).OriginalData : window.database.attachOrGet((event.record.event as Absence).OriginalData);
							absence.ResponsibleUser = event.changes['resourceId'].value;
							await (event.record.event as Absence).setAsync("ResponsibleUser", absence.ResponsibleUser);
							assignment.ResourceKey = absence.ResponsibleUser;
							(event.record.event as Absence).OriginalData = absence;
						} else {
							let absence: any = this.parentViewModel.syncWasOff() ?  (event.record.event as Absence).OriginalData : window.database.attachOrGet((event.record.event as Absence).OriginalData);
							absence.ArticleKey = event.changes['resourceId'].value;
							await (event.record.event as Absence).setAsync("ArticleKey", absence.ArticleKey);
							assignment.ResourceKey = absence.ArticleKey;
							(event.record.event as Absence).OriginalData = absence;
						}
					}
				}
			} catch (e) {
				console.log(e);
			}
		});
		self.scheduler.project.eventStore.on("update", async (event) => {
			if(!event.record.type && ![SchedulerEventType.Absence, SchedulerEventType.Dispatch].includes(event.record.type)) return;
			//Attach on demand
			const attachOrGet = (() => {
				let _entity: $data.Entity = null;
				return <T extends $data.Entity>() => (_entity == null ? (_entity = window.database.attachOrGet(event.record.OriginalData)) : _entity) as T;
			})();


			try {
				if(event.record.readonly) {
					return;
				}
				if (event.record.type == SchedulerEventType.Dispatch) {
					if (event.changes['StatusKey']) {
						const dispatch = attachOrGet<Crm.Service.Rest.Model.CrmService_ServiceOrderDispatch>();
						dispatch.StatusKey = event.changes['StatusKey'].value;
					}
					if (event.changes['TeamId']) {
						const dispatch = attachOrGet<Crm.Service.Rest.Model.CrmService_ServiceOrderDispatch>();
						dispatch.TeamId = event.changes['TeamId'].value;
					}
					if (event.changes['IsFixed']) {
						const dispatch = attachOrGet<Crm.Service.Rest.Model.CrmService_ServiceOrderDispatch>();
						dispatch.IsFixed = event.changes['IsFixed'].value;
					}

					if (event.changes['startDate']) {
						const dispatch = attachOrGet<Crm.Service.Rest.Model.CrmService_ServiceOrderDispatch>();
						dispatch.Date = event.changes['startDate'].value;
					}

					if (event.changes['endDate']) {
						const dispatch = attachOrGet<Crm.Service.Rest.Model.CrmService_ServiceOrderDispatch>();
						dispatch.EndDate = event.changes['endDate'].value;
					}

					if (event.changes['duration']) {
						const dispatch = attachOrGet<Crm.Service.Rest.Model.CrmService_ServiceOrderDispatch>();
						dispatch.NetWorkMinutes = DateHelper.as('minute', event.changes['duration'].value, (event.record as Dispatch).durationUnit);
					}
					
					if (event.changes["Username"]) {
						const dispatch = attachOrGet<Crm.Service.Rest.Model.CrmService_ServiceOrderDispatch>();
						dispatch.Username = event.changes['Username'].value;
					}

					if (event.changes["manuallyScheduled"]) {
						const dispatch = attachOrGet<Crm.Service.Rest.Model.CrmService_ServiceOrderDispatch>();
						dispatch.NetWorkMinutes = DateHelper.as('minute', event.record.duration, (event.record as Dispatch).durationUnit);
					}
					
					if (event.changes["Remark"]) {
						const dispatch = attachOrGet<Crm.Service.Rest.Model.CrmService_ServiceOrderDispatch>();
						dispatch.Remark = event.changes['Remark'].value;
					}

				} else if (event.record.type == SchedulerEventType.Absence) {
					if (event.changes['startDate']) {
						const absence = attachOrGet<Sms.Scheduler.Rest.Model.SmsScheduler_Absence>();
						absence.From = event.changes['startDate'].value ?? absence.From;
					}

					if (event.changes['endDate']) {
						const absence = attachOrGet<Sms.Scheduler.Rest.Model.SmsScheduler_Absence>();
						absence.To = event.changes['endDate'].value ?? absence.To;
					}

					if (event.changes['Description']) {
						const absence = attachOrGet<Sms.Scheduler.Rest.Model.SmsScheduler_Absence>();
						absence.Description = event.changes['Description'].value;
					}
					if (event.changes['TimeEntryTypeKey'] || event.changes['DowntimeReasonKey']) {
						if (event.record.OriginalData instanceof Sms.Scheduler.Rest.Model.SmsScheduler_Absence) {
							const absence = attachOrGet<Sms.Scheduler.Rest.Model.SmsScheduler_Absence>();
							absence.TimeEntryTypeKey = event.changes['TimeEntryTypeKey'].value;
							event.record.AbsenceTypeData = await window.database.CrmPerDiem_TimeEntryType.filter("it => it.Key == this.key && it.Language == this.language", { key: event.changes['TimeEntryTypeKey'].value, language: self.parentViewModel.currentUserLocale }).first();
						} else if (event.record.OriginalData instanceof Crm.Article.Rest.Model.CrmArticle_ArticleDowntime) {
							const absence = attachOrGet<Crm.Article.Rest.Model.CrmArticle_ArticleDowntime>();
							absence.DowntimeReasonKey = event.changes['DowntimeReasonKey'].value;
							event.record.AbsenceTypeData = await window.database.CrmArticle_ArticleDowntimeReason.filter("it => it.Key == this.key && it.Language == this.language", { key: event.changes['DowntimeReasonKey'].value, language: self.parentViewModel.currentUserLocale }).first();
						}
					}
				}
				self.scheduler.refreshRows();
			} catch (e) {
				console.log(e);
			}
		});

		self.scheduler.project.resourceStore.on("beforeRemove", async (event) => {
			try {
				const resourceIdsToBeRemoved = event.records.map(t => t.id) as string[];
				const assignmentsToBeRemoved = (self.scheduler.assignmentStore.allRecords as AssignmentModel[]).filter(a => resourceIdsToBeRemoved.includes(a.resourceId as string));
				//Prevent DB deletes
				assignmentsToBeRemoved.forEach(e => self.detachFromStore.add(e));

				const profileResources = await window.database.SmsScheduler_ProfileResource.filter("it.ProfileKey == profileId && it.ResourceKey in resourceIdsToBeRemoved", { profileId: this.parentViewModel.profile().Id, resourceIdsToBeRemoved }).toArray();
				profileResources.forEach(profileResource => window.database.remove(profileResource));	

				this.parentViewModel.profile().ResourceKeys.splice(this.parentViewModel.profile().ResourceKeys.indexOf(event.records[0].id), 1);
			} catch (e) {
				console.log(e);
			}
		});
		

		self.loadInlineData(data.inlineData);

		//@ts-ignore
		self.scheduler.project.commit();
		self.parentViewModel.scheduler(self.scheduler);

		self.crudManager.on('hasChanges', () => self.triggerPendingChanges());
		self.crudManager.on('noChanges', () => self.triggerPendingChanges());
		ko.computed(() => self.pendingChangesTrigger() && self.updatePendingChanges());

		self.scheduler.eventStore.on('change', self.onEventStoreChange, self);
		self.scheduler.resourceStore.on('change', self.onResourceStoreChange, self);
		self.scheduler.timeAxis.on('reconfigure', self.onTimeAxisReconfigure, self);
		//If data loaded before the map, trigger onStoreChange manually
		if (self.scheduler.eventStore.count) {
			self.onEventStoreChange({ action: 'dataset', records: self.scheduler.eventStore.records });
		}
		if (self.scheduler.resourceStore.count) {
			self.onResourceStoreChange({ action: 'dataset', records: self.scheduler.resourceStore.records });
		}

		new Splitter({
			appendTo: 'scheduler'
		});

		self.pipeline = new Pipeline({
			label: window.Helper.getTranslatedString('Name'),
			appendTo: "scheduler",
			rowHeight: self.parentViewModel.profile().ClientConfig.PipelineSecondLine != null ? 45 : 30,
			store: {
				tree: true,
				data: data.inlineData.serviceOrders
			},
			stateId: 'pipelinePanel',
			collapsed: true,
			onSelectionChange() {
				const
					{ selectedRecords }   = this,
					{ calendarHighlight } = self.scheduler.features;
				let serviceOrders: ServiceOrder[] = selectedRecords?.filter(r => r.type === OrderType.ServiceOrder);
				self.pipelineSelectedServiceOrders(serviceOrders);
				let absenceOrders: AbsenceOrder[] = selectedRecords?.filter(r => r.type === OrderType.AbsenceOrder);
				let articleDowntimes: AbsenceOrder[] = selectedRecords?.filter(r => r.type === OrderType.ArticleDowntime);
				if(serviceOrders.length == 0 && absenceOrders.length == 0 && articleDowntimes.length == 0) {
					calendarHighlight.unhighlightCalendars();
					return;
				}
				let resourcesToHighlight: Technician[] | Tool[] | Vehicle[] = [];
				if(serviceOrders.length > 0) {
					if(serviceOrders[0].OriginalData.RequiredSkillKeys?.length == 0 && serviceOrders[0].OriginalData.RequiredAssetKeys?.length == 0) {
						resourcesToHighlight = self.scheduler.resourceStore.query(resourceRecord => resourceRecord.type == ResourceType.Technician) as Technician[];
					} else if(serviceOrders[0].OriginalData.RequiredAssetKeys?.length == 0 && serviceOrders[0].OriginalData.RequiredSkillKeys?.length > 0) {
						resourcesToHighlight = self.scheduler.resourceStore.query(resourceRecord => resourceRecord.type == ResourceType.Technician && window.Helper.Scheduler.hasSkillsForOrder(resourceRecord, serviceOrders[0].OriginalData, self.scheduler.startDate, self.scheduler.endDate)) as Technician[];
					} else if(serviceOrders[0].OriginalData.RequiredSkillKeys?.length == 0 && serviceOrders[0].OriginalData.RequiredAssetKeys?.length > 0) {
						resourcesToHighlight = self.scheduler.resourceStore.query(resourceRecord => resourceRecord.type == ResourceType.Technician && window.Helper.Scheduler.hasAssetsForOrder(resourceRecord, serviceOrders[0].OriginalData, self.scheduler.startDate, self.scheduler.endDate)) as Technician[];
					} else {
						resourcesToHighlight = self.scheduler.resourceStore.query(resourceRecord => resourceRecord.type == ResourceType.Technician && window.Helper.Scheduler.hasAssetsForOrder(resourceRecord, serviceOrders[0].OriginalData, self.scheduler.startDate, self.scheduler.endDate) && window.Helper.Scheduler.hasSkillsForOrder(resourceRecord, serviceOrders[0].OriginalData, self.scheduler.startDate, self.scheduler.endDate)) as Technician[];
					}
				}
				if(absenceOrders.length > 0) {
					resourcesToHighlight = resourcesToHighlight = self.scheduler.resourceStore.query(resourceRecord => resourceRecord.type == ResourceType.Technician) as Technician[];
				}
				if(articleDowntimes.length > 0) {
					resourcesToHighlight = self.scheduler.resourceStore.query(resourceRecord => resourceRecord.type == ResourceType.Tool || resourceRecord.type == ResourceType.Vehicle) as Tool[] | Vehicle[];
				}



				if(!calendarHighlight.disabled && resourcesToHighlight.length > 0) {
					calendarHighlight.highlightResourceCalendars(resourcesToHighlight);
				} else {
					calendarHighlight.unhighlightCalendars();
				}
			},
			tbar: [
				{
					type                 : 'textfield',

					ref                  : 'filterByName',
					//@ts-ignore
					icon: 'b-fa b-fa-filter',
					placeholder          : window.Helper.getTranslatedString('FilterPipeline'),
					cls: 'align-v-end',
					clearable            : true,
					width                : '15em',
					keyStrokeChangeDelay : 100,
					triggers             : {
						filter : {
							align : 'start',
							cls   : 'b-fa b-fa-filter'
						}
					},
					onChange({ value }) {
						if (self.pipeline?.selectedRecords?.length > 0) {
							self.pipeline.deselectAll(false, false);
						}

						value = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
						const regEx = new RegExp(value, 'i');
						// Replace all previous filters and set a new filter
						//@ts-ignore
						self.pipeline.store.filter({
							filters : (event: ServiceOrder) => {
								return event.name.match(regEx)
								|| event.Company?.match(regEx)
								//@ts-ignore
								|| event.ErrorMessage?.match(regEx)
								//@ts-ignore
								|| event?.Installation?.Name?.match(regEx)
								//@ts-ignore
								|| event?.Installation?.Description?.match(regEx)
								|| event.Status?.toString().match(regEx)
								//@ts-ignore
								|| event.AbsenceType?.match(regEx)
									;
							},
							replace : true
						});
					}
				},
				'->',
				{
					icon: 'b-fa b-fa-angle-double-down',
					cls: 'b-transparent',
					id: 'expand-collapse-button',
					onClick: ({source}) => {
						let pipeline = self.pipeline;
						if(pipeline["collapsed"]) {
							pipeline.expandAll();
							pipeline["collapsed"] = false;
							source.icon = 'b-fa b-fa-angle-double-up';
						} else {
							pipeline.collapseAll();
							pipeline["collapsed"] = true;
							source.icon = 'b-fa b-fa-angle-double-down';
						}
					}
				}
			],
			listeners: {
				expandNode() {
					let f = (n) => `${!n.parent.isRoot ? f(n.parent) : ''}\\${n.name}`;
					//@ts-ignore
					const expandedNodes = self.pipeline.store.allRecords.filter(x => x.isExpanded()).map(f);
					window.Helper.Database.saveToLocalStorage(`${window.Helper.User.getCurrentUserName()}_expandedNodes`, JSON.stringify(expandedNodes))
				}
			}
		});

		self.pipeline.pipelineFirstLineData = () => self.parentViewModel.profile().ClientConfig.PipelineFirstLine;
		self.pipeline.pipelineSecondLineData = () => self.parentViewModel.profile().ClientConfig.PipelineSecondLine;

		// @ts-ignore
		self.pipeline.features.cellTooltip.tooltipRenderer = (data) => {
			if ((data.record as BaseOrder).type == 'ServiceOrder') {
				let profile = ko.unwrap(this.parentViewModel.profile);
				let tooltipProps = ko.unwrap(profile.ClientConfig.ServiceOrderTooltip);
				if(tooltipProps.length === 0) {
					return window.Helper.getTranslatedString('TooltipIsNotConfigured');
				}
				let tooltipContext = { "ServiceOrder": data.record };

				return window.Helper.Scheduler.Tooltips.BuildTooltip(tooltipContext, tooltipProps, "ServiceOrder");
			} else {
				return ``
			}
		};

		self.splitter = new Splitter({
			appendTo: 'scheduler'
		});

		const FILTERS_STORAGE_KEY = 'b-example-gantt-fieldfilters-filters';
		const parseDate = dateString => dateString ? new Date(dateString) : dateString;
		//@ts-ignore
		const savedFiltersJSON = BrowserHelper.getLocalStorageItem(FILTERS_STORAGE_KEY);
		let savedFilters;
		if (savedFiltersJSON) {
			try {
				savedFilters = JSON.parse(savedFiltersJSON, function(key, value) {
					
					if (key === 'value' && this.type === 'date') {
						return (Array.isArray(value) ? value.map(parseDate) : parseDate(value));
					}
					else if (key === 'value' && this.type === 'duration') {
						return (Array.isArray(value)
							//@ts-ignore
							? value.map(durationStr => new Duration(durationStr))
							//@ts-ignore
							: new Duration(value));
					}
					return value;
				});
			}
			catch (e) {
				console.error(`Couldn't parse saved filters:\n\n${savedFilters}\n\nError was:\n\n${e}`);
			}
		}
		this.setupDragDrops();
		self.parentViewModel.groupPipeline(null, null);

		this.applyResourceGroup();

		self.scheduler.on("resize", () => {
			queueMicrotask(() => self.defaultTaskDurationInPixel(self.getDefaultTaskDurationInPixel()));
		});

		const updateSchedulerHeight = function () {
			let container = document.getElementById("scheduler");
			if (container) {
				let bound = container.getBoundingClientRect();
				let bottompad = 30;
				let height = window.innerHeight - bound.top - bottompad;
				container.style.height = `${height}px`;

				queueMicrotask(() => self.defaultTaskDurationInPixel(self.getDefaultTaskDurationInPixel()));
			}			
		};
		updateSchedulerHeight();
		window.onresize = updateSchedulerHeight;

		this.horizontalSplitter =new Splitter({
			appendTo: 'schedulertimelinepanel',
			orientation: 'horizontal'
		});

		this.scheduler.tickSize = 0;
	}

	async applyResourceGroup() {
		const profile = ko.unwrap(this.parentViewModel.profile);
		const groupProps = ko.unwrap(profile.ClientConfig.ResourceGroup);

		if (groupProps && groupProps.length > 0) {
			const processedGroups = groupProps.map(g => g.split("."));

			if (processedGroups.some(g => g.length != 2 || g[0] != "Resource")) {
				throw new Error("Specified resource group is not supported.");
			}

			await this.scheduler.features.treeGroup.group(processedGroups.map(g => g[1]));
		} else {
			await this.scheduler.features.treeGroup.clearGroups();
		}
	}

	reloadDateRange() {
		const p = new Promise((fulfilled) => {
			this.dateRangeChangeEventsConsumer.queue.forEach(e => {
				if (!e.processStarted) {
					e.withdrawn = true;
				}
			});
			this.dateRangeChangeEventsConsumer.enqueue({
				startDate: this.scheduler.startDate,
				endDate: this.scheduler.endDate,
				removeAllEvents: true,
				callback: fulfilled,
				processStarted: false,
				withdrawn: false
			});
			this.dateRangeChangeEventsConsumer.notify();
		});

		p.then(() => {
			//This trigger is needed because noChanges events is sometimes called before hasChanges.
			this.triggerPendingChanges();
		});

		return p;
	}

	setupDragDrops() {
		const self = this;
		let container = document.getElementById("scheduler");

		let prevResource = null;
		container.addEventListener("dragover", function (e) {
			e.preventDefault();

			if (Array.from(e.dataTransfer.types).includes('crm/serviceorder')) {
				let isValid = false;

				let isHorizontal = self.scheduler.mode === "horizontal";
				let allowOverlap = self.scheduler["allowOverlap"] as boolean;
				const startDate = self.scheduler.getDateFromDomEvent(e, "round", false);

				if (startDate) {
					const resource = e.target && self.scheduler.resolveResourceRecord(e, [e.offsetX, e.offsetY]);
					if (resource && (resource.constructor === Technician /*|| resource.constructor === Tool*/)) {
						if (isHorizontal) {
							if (prevResource) {
								self.scheduler.getRowFor(prevResource).removeCls('target-resource');
							}
							if (startDate && resource) {
								self.scheduler.getRowFor(resource).addCls('target-resource');
							}
						}

						isValid = Boolean(startDate && resource) && allowOverlap;

						prevResource = resource;
					}
				}

				if (!isValid) {
					e.dataTransfer.dropEffect = "none";
				}
			}
			else {
				e.dataTransfer.dropEffect = "none";
			}
		});

		container.addEventListener("drop", async function (e) {
			e.preventDefault();

			let serviceorderId = e.dataTransfer.getData('crm/serviceorder');
			if (serviceorderId) {
				let resource = prevResource as Technician

				if (resource) {
					let order = (self.pipeline.store as Store).find(so => so["id"] == serviceorderId) as ServiceOrder;
					if (order) {
						const date = self.scheduler.getDateFromDomEvent(e, "round", false);

						const duration = window.Helper.Scheduler.determineNewEventDuration(
							order,
							self.scheduler.defaultEventDuration,
							self.scheduler.serviceOrderDispatchMaximumDuration,
							self.scheduler.ServiceOrderDispatchIgnoreCalculatedDuration
						);

						const endDate = moment(date).add(duration).toDate();
						if(!self.scheduler.isDateRangeAvailable(date, endDate, null, resource)) {
							e.dataTransfer.dropEffect = "none";
							return;
						}
						
						let hasSkillFor = window.Helper.Scheduler.hasSkillsForOrder(resource, order.OriginalData, date, endDate);
						let hasAssetsFor = window.Helper.Scheduler.hasAssetsForOrder(resource, order.OriginalData, date, endDate);

						if (hasSkillFor && hasAssetsFor) {
							let violationItems = [];
							violationItems.push(...window.Helper.Scheduler.PlanningValidations.GetPlanningValidationItemsForOrder(order, resource, date, endDate));
							if(self.parentViewModel.profile().ClientConfig.EnablePlanningConfirmations && violationItems.length > 0) {
								window.Helper.Scheduler.ShowPopup(violationItems, async () => { await createEvent(); });
							} else {
								await createEvent();
							}
							
							async function createEvent() {
								try {
									if (order.type == OrderType.ServiceOrder) {
										const duration = window.Helper.Scheduler.determineNewEventDuration(
											order,
											self.scheduler.defaultEventDuration,
											self.scheduler.serviceOrderDispatchMaximumDuration,
											self.scheduler.ServiceOrderDispatchIgnoreCalculatedDuration
										);
										let task = window.Helper.Scheduler.createEvent(order, resource, date, duration);

										await self.scheduler.scheduleEvent({
											eventRecord: task,
											startDate: date,
											resourceRecord: resource
										});
									}
								} catch (e) {
									console.log(e);
								}
							}
						}
					}
				}

			} else {
				e.dataTransfer.dropEffect = "none";
			}
		});

		this.drag = new Drag({
			schedule: this.scheduler,
			grid: this.pipeline,
			constrain: false,
			enablePlanningConfirmations: () => this.parentViewModel.profile().ClientConfig.EnablePlanningConfirmations,
			targetSelector: ".draggable",
			orderSelector: (g, e) => g.selectedRecords as ServiceOrder[],
			allowSchedulingForPast: () => this.parentViewModel.profile().ClientConfig.AllowSchedulingForPast
		});

		this.markerDrag = new Drag({
			schedule: this.scheduler,
			grid: this.pipeline,
			constrain: false,
			enablePlanningConfirmations: () => this.parentViewModel.profile().ClientConfig.EnablePlanningConfirmations,
			targetSelector: ".marker-serviceorder",
			orderSelector: (g, e) => {
				let marker = $(e).data("mapElement") as MapMarker;
				let data = g.data as Model[];
				return [data.find(d => d.id == marker.id) as ServiceOrder];
			},
			allowSchedulingForPast: () => this.parentViewModel.profile().ClientConfig.AllowSchedulingForPast
		});

		//time axis header cell to display the timespan if its hours. this is used for day and week presets.
		new Tooltip({
			forSelector: '.b-sch-header-timeaxis-cell.hoursheadercell',
			getHtml: ({ tip, element, activeTarget, event }) => {
				if (activeTarget.dataset.tickIndex && self.scheduler.timeAxis) {
					var t = self.scheduler.timeAxis.getAt(parseInt(activeTarget.dataset.tickIndex));

					let startHour = DateHelper.format(t["startDate"], 'HH:mm');
					let endHour = DateHelper.format(t["endDate"], 'HH:mm');

					return `${startHour} - ${endHour}`;
				}
				return null;
			}
		});
	}

	async loadInlineData(data) {
		await this.scheduler.project.loadInlineData(data);
		SchedulerDetailsViewModel.applyResourceCalendars(this.parentViewModel.profile() ,data.resourcesData);
		this.pipeline.store.data = data.serviceOrders;
		//@ts-ignore
		const expandedNodes = JSON.parse(window.Helper.Database.getFromLocalStorage(`${window.Helper.User.getCurrentUserName()}_expandedNodes`)) as string;
		if(expandedNodes != null) {
			let f = (n) => `${!n.parent.isRoot ? f(n.parent) : ''}\\${n.name}`;
			//@ts-ignore
			const nodesToExpand = this.pipeline.store.allRecords.filter(x=> x.isParent && expandedNodes.includes(f(x)));
			nodesToExpand.forEach(i => this.pipeline.toggleCollapse(i, false, true));
		}
	}

	getDefaultTaskDurationInPixel() {
		return this.scheduler.timeAxisViewModel.getDistanceForDuration(this.scheduler.defaultEventDuration.asMilliseconds());
	}

	dispose() {
		this.drag?.destroy();
		this.markerDrag?.destroy();
		this.resourceUtilization?.destroy();
		this.mapPanel?.destroy();
		this.splitter.destroy();
		this.horizontalSplitter.destroy();
		this.crudManager.destroy();
		this.pipeline.destroy();
		this.scheduler.destroy();
		this.disposed = true;
	}

	initializeViewPresets() {
		PresetManager.registerPreset("weekly", {
			name: window.Helper.String.getTranslatedString('Week'),
			displayDateFormat: 'H:mm',
			tickWidth: 20,
			defaultSpan: 7,
			shiftUnit: 'day',
			shiftIncrement: 1,
			timeResolution: {
				unit: 'minute',
				increment: 15
			},
			headers: [
				{
					unit: 'Week',
					align: 'center',
					renderer: (startDate, endDate) => `${window.Helper.String.getTranslatedString("CalendarWeekAbbreviation")} ${DateHelper.format(startDate, 'WW')}`
				},
				{
					unit: 'Day',
					align: 'center',
					dateFormat: 'ddd L'
				},
				{
					unit: 'HOUR',
					align: 'center',
					increment: 4,
					dateFormat: 'HH',
					headerCellCls: "hoursheadercell"
				}
			],
			mainHeaderLevel: 1
		});
		PresetManager.registerPreset("monthly", {
			name: window.Helper.String.getTranslatedString('Month'),
			displayDateFormat: 'L',
			tickWidth: 15,
			defaultSpan: 1,
			shiftUnit: 'day',
			shiftIncrement: 1,
			timeResolution: {
				unit: 'hour',
				increment: 1
			},
			headers: [
				{
					unit: 'Month',
					align: 'center',
					dateFormat: 'MMMM'
				},
				{
					unit: 'Week',
					align: 'center',
					renderer: (startDate, endDate) => `${window.Helper.String.getTranslatedString("CalendarWeekAbbreviation")} ${DateHelper.format(startDate, 'WW')}`
				},
				{
					unit: 'Day',
					align: 'center',
					dateFormat: 'dd DD'
				}
			],
			mainHeaderLevel: 0
		});
		PresetManager.registerPreset("daily", {
			name: window.Helper.String.getTranslatedString('Day'),
			displayDateFormat: 'H:mm',
			tickWidth: 50,
			defaultSpan: 1,
			shiftUnit: 'day',
			shiftIncrement: 1,
			timeResolution: {
				unit: 'minute',
				increment: 5
			},
			headers: [
				{
					unit: 'Week',
					align: 'center',
					renderer: (startDate, endDate) => `${window.Helper.String.getTranslatedString("CalendarWeekAbbreviation")} ${DateHelper.format(startDate, 'WW')}`
				},
				{
					unit: 'Day',
					align: 'center',
					dateFormat: 'ddd L'
				},
				{
					unit: 'HOUR',
					align: 'center',
					increment: 1,
					headerCellCls: "hoursheadercell",
					renderer: (startDate, endDate, cfg) => {
						let diff = DateHelper.diff(startDate, endDate, "hours");

						if (diff > 1) {
							cfg.headerCellCls = 'hoursheadercell sch-hdr-startend';
							return `<span>${DateHelper.format(startDate, 'HH')}</span><span>${DateHelper.format(DateHelper.add(endDate, -1, "hour"), 'HH')}</span>`;
						} else {
							return DateHelper.format(startDate, 'HH');
						}
					}
				}
			],
			mainHeaderLevel: 1
		});
	}
	
	async toggleMap(showPanel: boolean) {
		const self = this;
		if(self.mapPanel === null) {
			self.mapPanel = new MapPanel({
				ref: 'map',
				appendTo: 'scheduler',
				stateId: 'mapPanel',
				eventStore: self.scheduler.project.eventStore,
				timeAxis: self.scheduler.timeAxis,
				listeners: {
					markerclick: self.onMapMarkerClick.bind(self)
				},
				monitorResize: true,
				hidden: true
			}, self.createAllMarkersObservableArray(), self.defaultTaskDurationInPixel);
			self.scheduler.on("eventClick", async (event) => {
				self.mapPanel?.scrollMarkerIntoViewById(event.eventRecord.id, MapMarkerType.ServiceOrderDispatch);
			});
			self.scheduler.on("afterEventSave", async (event) => {
				self.mapPanel?.scrollMarkerIntoViewById(event.eventRecord.id, MapMarkerType.ServiceOrderDispatch);
			});
			self.scheduler.on("cellClick", async (event) => {
				if (event.record && event.record instanceof Technician &&
					event.column && event.column instanceof Model && !(event.column instanceof TimeAxisColumn)) {
					self.mapPanel?.scrollMarkerIntoViewById(event.record.id, MapMarkerType.Resource);
				}
			});
			
		}
		await this.mapPanel.toggle(showPanel);
		if(!this.mapPanel.isVisible) {
			await this.splitter.hide();
		} else {
			await this.splitter.show();
		}
		
	}

	async toggleResourceUtilization(showPanel: boolean) {
		let self = this;
		if(self.resourceUtilization === null) {
			self.resourceUtilization = new CrmResourceUtilization({
				project: self.scheduler.project,
				stateId: 'resourceUtilization',
				ref: 'resourceUtilization',
				appendTo: 'schedulertimelinepanel',
				hideHeaders : true,
				partner     : self.scheduler,
				showBarTip: true,
				flex: 1,
				hidden: true,
				getBarText(datum) {
					const view = this.owner;
					
					let result = view.getBarTextDefault(...arguments);

					if(result && datum.resource) {
						if(datum.resource.type === ResourceType.Technician) {
							const technician = datum.resource as Technician;
							if(technician.OriginalData.Discharged && !technician.isActiveAtDate(datum.tick.startDate)) {
								datum.isOverallocated = true;
							}
						}
					}

					return result;
				}
			});
		}
		if(showPanel) {
			await self.resourceUtilization.show();
			await self.horizontalSplitter.show();
		} else {
			await self.resourceUtilization.hide(true);
			await self.horizontalSplitter.hide();
		}
		this.resourceUtilization.saveState();
	}

	// When data changes in the eventStore, update the map markers accordingly
	onEventStoreChange(event) {
		switch (event.action) {
			case 'add':
			case 'dataset':

				if (event.action === 'dataset') {
					this.removeAllMarkers(MapMarkerType.ServiceOrderDispatch);
				}
				event.records.forEach(eventRecord => this.addMarker(eventRecord, MapMarkerType.ServiceOrderDispatch));
				break;

			case 'remove':
				event.records.forEach(event => this.removeMarker(event, MapMarkerType.ServiceOrderDispatch));
				break;

			case 'update': {
				const eventRecord = event.record;

				this.removeMarker(eventRecord, MapMarkerType.ServiceOrderDispatch);
				this.addMarker(eventRecord, MapMarkerType.ServiceOrderDispatch);

				break;
			}

			case 'filter': {
				const renderedMarkers = [];

				let eventMarkers = this.eventMarkers();

				this.scheduler.project.eventStore.query(rec => eventMarkers.find(m => m.id == rec.id), true).forEach(eventRecord => {
					if (!event.records.includes(eventRecord)) {
						this.removeMarker(eventRecord as Dispatch, MapMarkerType.ServiceOrderDispatch);
					}
					else {
						renderedMarkers.push(eventRecord);
					}
				});

				event.records.forEach(eventRecord => {
					if (!renderedMarkers.includes(eventRecord)) {
						this.addMarker(eventRecord, MapMarkerType.ServiceOrderDispatch);
					}
				});

				break;
			}
		}
	}

	onResourceStoreChange(event) {
		switch (event.action) {
			case 'add':
			case 'dataset':

				if (event.action === 'dataset') {
					this.removeAllMarkers(MapMarkerType.Resource);
				}
				event.records.forEach(resourceRecord => this.addMarker(resourceRecord, MapMarkerType.Resource));
				break;

			case 'remove':
				event.records.forEach(resourceRecord => this.removeMarker(resourceRecord, MapMarkerType.Resource));
				break;

			case 'update': {
				const resourceRecord = event.record;

				this.removeMarker(resourceRecord, MapMarkerType.Resource);
				this.addMarker(resourceRecord, MapMarkerType.Resource);

				break;
			}

			case 'filter': {
				const renderedMarkers = [];

				let resourceMarkers = this.resourceMarkers();

				this.scheduler.project.resourceStore.query(rec => resourceMarkers.find(m => m.id == rec.id), true).forEach(resourceRecord => {
					if (!event.records.includes(resourceRecord)) {
						this.removeMarker(resourceRecord, MapMarkerType.Resource);
					}
					else {
						renderedMarkers.push(resourceRecord);
					}
				});

				event.records.forEach(resourceRecord => {
					if (!renderedMarkers.includes(resourceRecord)) {
						this.addMarker(resourceRecord, MapMarkerType.Resource);
					}
				});

				break;
			}
		}
	}

	// Only show markers for events inside currently viewed time axis
	onTimeAxisReconfigure({ source: timeAxis }) {
		if (timeAxis.owner.isDestroyed) { return; }	

		this.scheduler.project.eventStore.forEach(eventRecord => {
			this.removeMarker(eventRecord, MapMarkerType.ServiceOrderDispatch);
			this.addMarker(eventRecord, MapMarkerType.ServiceOrderDispatch);
		});
	}

	// Puts a marker on the map, if it has lat/lon specified + the timespan intersects the time axis
	addMarker(record: unknown, markerType: MapMarkerType) {
		let self = this;
		if(markerType === MapMarkerType.ServiceOrderDispatch) {
			const dispatch = record as Dispatch;
			if (dispatch.type != SchedulerEventType.Dispatch || !dispatch.ServiceOrder.Latitude || !dispatch.ServiceOrder.Longitude) return;
		
		if (window.Helper.Date.areRangesOverlapping(self.scheduler.timeAxis.startDate, self.scheduler.timeAxis.endDate, dispatch.startDate as Date, dispatch.endDate as Date)) {
			let marker = {
					id: dispatch.id as string,
				type: MapMarkerType.ServiceOrderDispatch,
					Latitude: dispatch.ServiceOrder.Latitude,
					Longitude: dispatch.ServiceOrder.Longitude,
					PopupInformation: dispatch.ServiceOrder.getPopupInformation(),
				ClassName: 'marker-dispatch',
				//@ts-ignore
				MarkerContent: 'D',
				MarkerColor: 'red',
			};

			self.eventMarkers.push(marker);
			self.mapPanel?.scrollMarkerIntoView(marker);
		}
		} else if(markerType === MapMarkerType.Resource) {
			const resourceRecord = record as Technician;

			if (resourceRecord.type != ResourceType.Technician
				|| resourceRecord.Latitude == null
				|| resourceRecord.Longitude == null
				|| (resourceRecord.LastStatusUpdate != null
				&& DateHelper.diff(resourceRecord.LastStatusUpdate, new Date(), 'h') > 24 ))
			{
				return;
	}

			let marker = {
				id: resourceRecord.OriginalData.Id,
				type: MapMarkerType.Resource,
				Latitude: resourceRecord.Latitude,
				Longitude: resourceRecord.Longitude,
				IconName: "marker_dude",
				PopupInformation: window.Helper.User.getDisplayName(resourceRecord.OriginalData)
			} as MapMarker;

			self.resourceMarkers.push(marker);
			self.mapPanel?.scrollMarkerIntoView(marker);
		}
	}
	removeMarker(record: unknown, markerType: MapMarkerType) {
		if(markerType === MapMarkerType.ServiceOrderDispatch) {
			this.eventMarkers.remove(m => m.id == (record as Dispatch).id);
		} else if(markerType === MapMarkerType.Resource) {
			this.resourceMarkers.remove(m => m.id == (record as Technician).id);
		}
	}

	removeAllMarkers(markerType: MapMarkerType) {
		if(markerType === MapMarkerType.ServiceOrderDispatch) {
			this.scheduler.project.eventStore.forEach(eventRecord => this.removeMarker(eventRecord, MapMarkerType.ServiceOrderDispatch));
		} else if(markerType === MapMarkerType.Resource) {
			this.scheduler.project.resourceStore.forEach(resourceRecord => this.removeMarker(resourceRecord, MapMarkerType.Resource));
		}
	}

	async onMapMarkerClick(e) {
		let marker: MapMarker = e.marker;
		if (marker.type == MapMarkerType.ServiceOrderDispatch) {
			// When a map marker is clicked, scroll the event bar into view and highlight it
			const eventRecord = this.scheduler.project.eventStore.getById(marker.id) as Dispatch;
			const resourceRecord = this.scheduler.resourceStore.find(r => r.id == eventRecord.resourceId) as ResourceModel;
			await this.scheduler.scrollResourceEventIntoView(resourceRecord, eventRecord, { animate: true, highlight: true });
			this.scheduler.selectedEvents = [eventRecord];
		} else if (marker.type == MapMarkerType.ServiceOrder) {
			this.pipeline.scrollRowIntoView(marker.id, { animate: true, highlight: true });
		} else if (marker.type == MapMarkerType.Resource || marker.type == MapMarkerType.TechnicianHome) {
			const resourceRecord = this.scheduler.project.resourceStore.getById(marker.id) as Technician;
			this.scheduler.scrollResourceIntoView(resourceRecord, { animate: true, highlight: true });
			this.scheduler.selectedRows = [resourceRecord];
		}
	}

	createAllMarkersObservableArray(): KnockoutObservableArray<KnockoutObservable<MapMarker[]>> {
		let self = this;

		let pipelineSelectedServiceOrdersMarkers = ko.computed(() => {
			let serviceOrders = self.pipelineSelectedServiceOrders();
			let markers = serviceOrders
				.filter(so => so.OriginalData.Latitude != null && so.OriginalData.Longitude != null)
				.map(so => ({
					id: so.OriginalData.Id,
					type: MapMarkerType.ServiceOrder,
					Latitude: so.OriginalData.Latitude,
					Longitude: so.OriginalData.Longitude,
					IconName: "marker_contract",
					ClassName: "marker-serviceorder",
					//@ts-ignore
					MarkerContent: window.Helper.ServiceOrder.getTypeAbbreviation(so.OriginalData, self.parentViewModel.lookups.serviceOrderTypes),
					MarkerColor: window.Helper.Lookup.getLookupColor(self.parentViewModel.lookups.serviceOrderTypes, so.OriginalData.TypeKey),
					PopupInformation: so.getPopupInformation(),
					DurationInPx: self.scheduler.timeAxisViewModel.getDistanceForDuration(window.Helper.Scheduler.determineNewEventDuration(
						so,
						self.scheduler.defaultEventDuration,
						self.scheduler.serviceOrderDispatchMaximumDuration,
						self.scheduler.ServiceOrderDispatchIgnoreCalculatedDuration
					).asMilliseconds())
				} as MapMarker));

			if (markers && markers.length > 0) {
				self.mapPanel?.scrollMarkerIntoView(markers[markers.length - 1]);
			}

			return markers;
		});

		let technicians = self.scheduler.resourceStore.allRecords.filter(r => r.constructor === Technician).map(r => (r as Technician).OriginalData);
		let techniciansHomeMarkers = asyncComputed(async () => {
			let techniciansHomeAddresses = [];
			for (let t of technicians) {
				let homeAddressId = t?.ExtensionValues?.HomeAddressId;
				if (homeAddressId) {
					let addresses = await window.database.Crm_Address.filter("it.Id == homeAddressId", { homeAddressId }).toArray();
					if (addresses.length > 0)
						techniciansHomeAddresses.push({ technician: t, address: addresses[0] });
				}
			}

			let markers = techniciansHomeAddresses
				.filter(r => r.address.Latitude != null && r.address.Longitude != null)
				.map(a => ({
					id: a.technician.Id,
					type: MapMarkerType.TechnicianHome,
					Latitude: a.address.Latitude,
					Longitude: a.address.Longitude,
					IconName: "marker_home",
					PopupInformation: `${window.Helper.User.getDisplayName(a.technician)}, ${window.Helper.String.getTranslatedString("Home")}`
				} as MapMarker));

			if (markers && markers.length > 0) {
				self.mapPanel?.scrollMarkerIntoView(markers[markers.length - 1]);
			}

			return markers;
		}, []);

		return ko.observableArray([
			pipelineSelectedServiceOrdersMarkers as KnockoutObservable<MapMarker[]>,
			self.resourceMarkers as KnockoutObservable<MapMarker[]>,
			techniciansHomeMarkers as KnockoutObservable<MapMarker[]>,
			self.eventMarkers as KnockoutObservable<MapMarker[]>
		]);
	}

	triggerPendingChanges() {
		this.pendingChangesTrigger(this.pendingChangesTrigger() + 1);
	}

	updatePendingChanges() {
		let result = 0;
		let changingDispatchIds = new Set<string>();

		const crudManager = this.crudManager;
		if (crudManager) {
			const dispatchIds: string[] = [];
			const states = [
				{
					name: "added"
				},
				{
					name: "modified",
					changeName: "updated",
					onlyIfInChanges: true
				},
				{
					name: "removed",
					exceptionSet: this.detachFromStore
				}
			];

			const stores = [
				{
					storeId: StoreIds.AssignmentStore,
					idSelector: x => x?.eventId
				},
				{
					storeId: StoreIds.DispatchStore,
					idSelector: x => x?.OriginalData?.Id
				}
			];

			for (const store of stores) {
				const changedStore = crudManager?.getCrudStore?.(store.storeId);
				if (changedStore) {
					for (const state of states) {
						const changedState = changedStore[state.name];
						if (changedState && changedState.values) {
							dispatchIds.push(...changedState
								.values
								.filter(x => !state.exceptionSet || !state.exceptionSet.has(x))
								.filter(x => !state.onlyIfInChanges || (crudManager.changes?.[store.storeId]?.[state.changeName || state.name]?.map(store.idSelector).includes(store.idSelector(x))))
								.map(store.idSelector));
						}
					}
				}
			}

			changingDispatchIds = new Set(dispatchIds.filter(Boolean));
			result = changingDispatchIds.size;
		}

		this.pendingChanges(result);

		if (this.pipeline) {
			const changingDispatches = this.scheduler.eventStore.allRecords.filter(e => e["type"] == SchedulerEventType.Dispatch && changingDispatchIds.has(e.id as string)) as Dispatch[];
			const affectedServiceOrders = new WeakSet(changingDispatches.map(d => d.ServiceOrder));

			this.pipeline.assignClassToRecords("serviceorder-dirtyrow", affectedServiceOrders);
		}
	}

	async getRoute(routeData: RouteData[], startDate: Date = this.scheduler.timeAxis.startDate, endDate: Date = this.scheduler.timeAxis.endDate,
		useTechnicianHomeAddressAsOrigin = false, useTechnicianHomeAddressAsFinalDestination = false, getRoutePerDay = false) {

		const self = this;
		const missingCoordinatesFor = new Set<string>();
		const foundCoordinatesFor = new Set<string>();
		const geoJsonFeatureCollection: FeatureCollection = {
			type: 'FeatureCollection',
			features: []
		};

		const { DirectionsService, TravelMode } = await google.maps.importLibrary("routes") as google.maps.RoutesLibrary;
		const service = new DirectionsService();

		await self.clearRoute();

		//map to hold the marker content. important to multi assignment dispatches to get the right content.
		const dispatchMarkerContent = new Map<string, string[]>();

		for (const data of routeData) {
			if (data.technician() == null || data.color() == null) {
				continue;
			}

			const technician = self.scheduler.resourceStore.find(r => r.id == data.technician()) as Technician;
			const visibleEvents = self.scheduler.eventStore.getEvents({
				resourceRecord: technician,
				startDate: startDate,
				endDate: endDate,
				filter: r => { return (r as SchedulerEvent).type == SchedulerEventType.Dispatch && (r as Dispatch).ServiceOrder.Latitude != null && (r as Dispatch).ServiceOrder.Longitude != null }
			});
			const eventsWithValidCoordinates = (visibleEvents as Dispatch[]).toSorted((a, b) => (a.startDate as Date).getTime() - (b.startDate as Date).getTime());

			const periods = getRoutePerDay ?
				window.Helper.Date.getDatesOfRange(startDate, endDate).map(d => ({ from: d, to: moment(d).endOf("day").toDate() })) :
				[{ from: startDate, to: endDate }];

			for (const period of periods) {
				const periodEventsWithValidCoordinates = eventsWithValidCoordinates.filter(e => e.startDate < period.to && period.from < e.endDate);

				if (periodEventsWithValidCoordinates.length == 0) {
					missingCoordinatesFor.add(technician.name);
					continue;
				}

				const eventCoordinates: google.maps.LatLngLiteral[] = periodEventsWithValidCoordinates
					.map(e => ({ lat: e.ServiceOrder.Latitude, lng: e.ServiceOrder.Longitude }));

				if (useTechnicianHomeAddressAsOrigin || useTechnicianHomeAddressAsFinalDestination) {
					const homeAddress = await technician.getHomeAddress();
					if (homeAddress && homeAddress.Latitude !== null && homeAddress.Longitude !== null) {
						if (useTechnicianHomeAddressAsOrigin) {
							eventCoordinates.unshift({ lat: homeAddress.Latitude, lng: homeAddress.Longitude });
						}
						if (useTechnicianHomeAddressAsFinalDestination) {
							eventCoordinates.push({ lat: homeAddress.Latitude, lng: homeAddress.Longitude });
						}
					}
				}

				if (eventCoordinates.length < 2 || (eventCoordinates.length == 2 && eventCoordinates[0].lat == eventCoordinates[1].lat && eventCoordinates[0].lng == eventCoordinates[1].lng)) {
					missingCoordinatesFor.add(technician.name);
					continue;
				} else {
					foundCoordinatesFor.add(technician.name);
				}

				try {
					const request: google.maps.DirectionsRequest = {
						origin: eventCoordinates[0],
						destination: eventCoordinates.at(-1),
						waypoints: eventCoordinates.slice(1, -1).map(ec => ({
							location: ec,
							stopover: true
						})),
						travelMode: TravelMode.DRIVING,
					};
					const result = await service.route(request);
					const routes = result.routes;

					//routes will always contain one route unless we use provideRouteAlternatives parameter.
					routes.forEach((route) => {
						route.legs.forEach((leg, index) => {
							const steps = leg.steps;
							steps.forEach((step) => {
								const coordinates = step.path.map(point => [point.lng(), point.lat()]);
								const feature: Feature = {
									type: 'Feature',
									properties: {
										name: data.technician(),
										popupContent: StringHelper.decodeHtml(`
										<div style="font-size: 1.75em">
											<h5>${technician.name} ${(getRoutePerDay ? `- ${moment(period.from).format("L")}` : "")}</h5>
											<p class="c-gray" style="margin: 5px 0 5px 0">${leg.start_address}</p>
											<p class="c-gray" style="margin: 5px 0 5px 0">${leg.end_address}</p>
											<p class="c-gray" style="margin: 5px 0 5px 0">${leg.distance.text} - ${leg.duration.text}</p>
										</div>
									`),
										color: data.color()
									},
									geometry: {
										type: 'LineString',
										coordinates: coordinates
									}
								};
								geoJsonFeatureCollection.features.push(feature);
							});
						});
					});
					periodEventsWithValidCoordinates.forEach((pe, index) => addDispatchMarkerContent(pe.id as string, `${index + 1}`));
				} catch (e) {
					let errorMessage: string;
					if (typeof e === "string") {
						errorMessage = e.toUpperCase();
					} else if (e instanceof Error) {
						errorMessage = window.Helper.String.tryExtractErrorMessageValue(e.message) ?? e.message;
					}
					swal(window.Helper.String.getTranslatedString("Error"), errorMessage, "error");
				}
			}

			dispatchMarkerContent.forEach((contents, id) => self.mapPanel.mapComponent().updateMarkerContent(id, contents.join()));
		}

		const noRouteTechnicians = Array.from(missingCoordinatesFor).filter(t => !foundCoordinatesFor.has(t));
		if (noRouteTechnicians.length > 0) {
			window.swal(window.Helper.String.getTranslatedString("Warning"), window.Helper.getTranslatedString("RouteCouldNotBeCalculatedWarning").replace("{0}", noRouteTechnicians.join(", ")), "warning");
		}

		self.mapPanel.showRouteOnMap(geoJsonFeatureCollection);

		function addDispatchMarkerContent(id: string, content: string) {
			let contentArray: string[];

			if (!dispatchMarkerContent.has(id)) {
				contentArray = [];
				dispatchMarkerContent.set(id, contentArray);
			} else {
				contentArray = dispatchMarkerContent.get(id);
			}

			contentArray.push(content);
		}
	}

	async getRoutesQuick() {
		const selectedTechnicians = this.scheduler.selectedRecords;

		if(selectedTechnicians.length == 0) {
			window.swal(window.Helper.String.getTranslatedString("Warning"), window.Helper.String.getTranslatedString("SelectResourceForRouteWarning"), "warning");
			return;
		}

		const colors = this.parentViewModel.profile().ClientConfig.RouteColors;
		this.routeData(selectedTechnicians.map((t, index) =>
			new RouteData(ko.observable(t.id), ko.observable(colors[index % colors.length]))
		));
		
		await this.getRoute(this.routeData());
	}
	async clearRoute() {
		let self = this;
		self.mapPanel.clearRoute();
	}

	gotoDate(newDate: Date, newPreset: string = null) {
		if (newDate) {
			//We need to set _isUserAction to true, because datepicker's change lister has a condition to only take action for user input and this is a user input.
			this.scheduler.widgetMap.datePicker["_isUserAction"] = true;
			this.scheduler.widgetMap.datePicker["value"] = newDate;
		}

		if (newPreset) {
			this.scheduler.widgetMap.presetCombo["value"] = newPreset;
		}
	}

	gotoPreviousDate() {
		this?.scheduler?.widgetMap?.['datePicker']?.["onBackClick"]?.();
	}

	gotoNextDate() {
		this?.scheduler?.widgetMap?.['datePicker']?.["onForwardClick"]?.();
	}
}
