import {
	DateHelper,
	DomClassList,
	DomHelper,
	SchedulerPro,
	SchedulerProConfig,
} from "@bryntum/schedulerpro";
import {Absence, Dispatch, SchedulerEvent, SchedulerEventType, ServiceOrderTimePosting} from "./Model/Dispatch";
import {ResourceType, Technician} from "./Model/Technicians";
import type {Tool} from "./Model/Tools";
import type {Vehicle} from "./Model/Vehicle";
import type moment from "moment";

export class Timeline extends SchedulerPro {
	version: number = null;
	defaultEventDuration: moment.Duration = null;
	serviceOrderDispatchMaximumDuration: moment.Duration = null;
	ServiceOrderDispatchIgnoreCalculatedDuration = false;
	AllowSchedulingForPast: () => boolean = null;
	baseRowHeight = 30;
	dataForFirstRow: () => string[] = null;
	dataForSecondRow: () => string[] = null;
	dataForThirdRow: () => string[] = null;
	
	numberOfRows() {
		const self = this;
		let nrOfRows = 1;
		if(Boolean(self.dataForSecondRow()) === true || Boolean(self.dataForThirdRow()) === true) {
			nrOfRows = 2;
			if(Boolean(self.dataForSecondRow()) === Boolean(self.dataForThirdRow())) {
				nrOfRows = 3;
			}
		}
		
		return nrOfRows;
	}

	static get $name() {
		return 'CRMTimeline';
	}

	// Factoryable type name
	static get type() {
		return 'CRMtimeline';
	}

	getResourcesToHighlight(event): null | Technician[] | Tool[] | Vehicle[] {
		let { eventRecords } = event;
		let dispatches: Dispatch[] = (eventRecords as SchedulerEvent[])?.filter(r => r.type === SchedulerEventType.Dispatch) as Dispatch[];
		let absences: Absence[] = (eventRecords as Absence[])?.filter(r => r.AbsenceTypeData instanceof Crm.PerDiem.Rest.Model.Lookups.CrmPerDiem_TimeEntryType) as Absence[];
		let articleDowntimes: Absence[] = (eventRecords as Absence[])?.filter(r => r.AbsenceTypeData instanceof Crm.Article.Model.Lookups.CrmArticle_ArticleDowntimeReason) as Absence[];

		if(dispatches.length == 0 && absences.length == 0 && articleDowntimes.length == 0) {
			return null;
		}
		let resourcesToHighlight: Technician[] | Tool[] | Vehicle[] = [];
		if(dispatches.length > 0) {
			if(dispatches[0].ServiceOrder.RequiredSkillKeys?.length == 0 && dispatches[0].ServiceOrder.RequiredAssetKeys?.length == 0) {
				resourcesToHighlight = this.resourceStore.query(resourceRecord => resourceRecord.type == ResourceType.Technician) as Technician[];
			} else if(dispatches[0].ServiceOrder.RequiredAssetKeys?.length == 0 && dispatches[0].ServiceOrder.RequiredSkillKeys?.length > 0) {
				resourcesToHighlight = this.resourceStore.query(resourceRecord => resourceRecord.type == ResourceType.Technician && window.Helper.Scheduler.hasSkillsForOrder(resourceRecord, (dispatches[0] as Dispatch).ServiceOrder.OriginalData, (dispatches[0].startDate as Date), DateHelper.add(dispatches[0].startDate, dispatches[0].duration))) as Technician[];
			} else if(dispatches[0].ServiceOrder.RequiredSkillKeys?.length == 0 && dispatches[0].ServiceOrder.RequiredAssetKeys?.length > 0) {
				resourcesToHighlight = this.resourceStore.query(resourceRecord => resourceRecord.type == ResourceType.Technician && window.Helper.Scheduler.hasAssetsForOrder(resourceRecord, (dispatches[0] as Dispatch).ServiceOrder.OriginalData, (dispatches[0].startDate as Date), DateHelper.add(dispatches[0].startDate, dispatches[0].duration))) as Technician[];
			} else {
				resourcesToHighlight = this.resourceStore.query(resourceRecord => resourceRecord.type == ResourceType.Technician && window.Helper.Scheduler.hasAssetsForOrder(resourceRecord, (dispatches[0] as Dispatch).ServiceOrder.OriginalData, (dispatches[0].startDate as Date), DateHelper.add(dispatches[0].startDate, dispatches[0].duration)) && window.Helper.Scheduler.hasSkillsForOrder(resourceRecord, (dispatches[0] as Dispatch).ServiceOrder.OriginalData, (dispatches[0].startDate as Date), DateHelper.add(dispatches[0].startDate, dispatches[0].duration))) as Technician[];
			}
		}
		if(absences.length > 0) {
			resourcesToHighlight = resourcesToHighlight = this.resourceStore.query(resourceRecord => resourceRecord.type == ResourceType.Technician) as Technician[];
		}
		if(articleDowntimes.length > 0) {
			resourcesToHighlight = this.resourceStore.query(resourceRecord => resourceRecord.type == ResourceType.Tool || resourceRecord.type == ResourceType.Vehicle) as Tool[] | Vehicle[];
		}
		return resourcesToHighlight;
	}

	static get configurable(): Partial<SchedulerProConfig> {
		return {
			barMargin: 5,
			passStartEndParameters: true,
			createEventOnDblClick: false,
			multiEventSelect: true,
			selectResourceOnEventNavigate: false,
			readOnly: !window.AuthorizationManager.currentUserHasPermission("Scheduler::Edit"),
			displayDateFormat : 'HH:mm',


			// workingTime: {
			// 	fromDay  : parseInt(window.Sms.Scheduler.Settings.WorkingTime.FromDay),
			// 	toDay    : parseInt(window.Sms.Scheduler.Settings.WorkingTime.ToDay),
			// 	fromHour : parseInt(window.Sms.Scheduler.Settings.WorkingTime.FromHour),
			// 	toHour   : parseInt(window.Sms.Scheduler.Settings.WorkingTime.ToHour)
			// },

			// This controls the contents of each event bar. You can return JSON (a DOMConfig object) or a simple HTML string
			eventRenderer({ eventRecord,  assignmentRecord, resourceRecord, renderData }) {
				renderData.eventColor = null;
				if ((eventRecord as SchedulerEvent).type == SchedulerEventType.Dispatch) {
					(renderData.cls as DomClassList).add(`sch-status-${(eventRecord as Dispatch).Status}`);
					(eventRecord.assignments.length > 1 && (eventRecord as Dispatch).OriginalData.Username === resourceRecord["ResourceKey"]) ? (renderData.iconCls as DomClassList).add('b-fa b-fa-solid b-fa-crown') : (renderData.cls as DomClassList).remove('b-fa b-fa-solid b-fa-crown');
					if (eventRecord.assignments.length > 1) {
						renderData.children.push(DomHelper.createElement({
							html: `<span class="team-icon">T</span>`,
						}));
					}
				}
				
				const items = [];
				const dataText = (eventRecord as SchedulerEvent).type == SchedulerEventType.Dispatch ? (eventRecord as Dispatch).Status : (eventRecord as SchedulerEvent).type == SchedulerEventType.Absence ? (eventRecord as Absence).AbsenceType : (eventRecord as ServiceOrderTimePosting).OriginalData.ItemNo;
				const statusText = DomHelper.createElement({
					class: {
						'b-event-status': true
					},
					children: [
						{
							html: `<span class="sch-event-status-text" title='${dataText}'>${dataText}</span>`
						}
					],
					style: {
						...window.Helper.Scheduler.GetTextColorForBackground(eventRecord as SchedulerEvent),
					}
				});

				const topLine = DomHelper.createElement({
					class: {
						'sch-event-top-line': true
					},
					style: {
						'background-color': (eventRecord as SchedulerEvent).type == SchedulerEventType.Dispatch && (eventRecord as Dispatch).OriginalData.IsFixed ? 'red' : (eventRecord as SchedulerEvent).Color
					},
					children: [statusText]
				});

				renderData.children.push(topLine);
				
				if ((eventRecord as SchedulerEvent).type == SchedulerEventType.Dispatch) {
					items.push({
						class: 'b-event-name',
						text: (eventRecord as Dispatch).getRowData(this.dataForFirstRow()).join(' - ')
					});
					if (this.dataForSecondRow() !== null) {
						items.push(DomHelper.createElement({
							text: (eventRecord as Dispatch).getRowData(this.dataForSecondRow()).join(' - ')
						}));
					}

					if (this.dataForThirdRow() !== null) {
						items.push(DomHelper.createElement({
							text: (eventRecord as Dispatch).getRowData(this.dataForThirdRow()).join(' - ')
						}));
					}
				} else if ((eventRecord as SchedulerEvent).type == SchedulerEventType.Absence) {
					items.push({
						class: 'b-event-name',
						text: eventRecord.name
					});
				}
				
				return [
					{
						children: items
					}
				];
			},

			columns: [
				{ type: 'tree', minWidth: 0, autoWidth: true, cellCls: "b-0", leafIconCls: "", filterable: false },
				{
					type: 'resourceInfo',
					tree: true,
					renderer: function (p) {
						if (!p.record["generatedParent"]) {
							return this.defaultRenderer(p);
						} else {
							let key = p.record["key"];
							if (!key) {
								return `${window.Helper.String.getTranslatedString("Unspecified")} (${window.Helper.String.getTranslatedString(p.record["field"])})`;
							} else {
								return key.toString();
							}
						}
					},
					showEventCount: false,
					text: window.Helper.getTranslatedString('Resources'),
					field: 'DisplayName',
					width: 200,
					editor: false,
					useNameAsImageName: false,
					filterable: {
						filterField: {
							triggers: {
								search: {
									cls: 'b-icon b-fa-filter'
								}
							},
							placeholder: window.Helper.getTranslatedString('FilterResources'),
							hidden: false
						}
					},
					showMeta: window.Helper.Scheduler.GetMetaFunctionText,
					sortable: false
				}
			],
			features : {
				//stripe     : true,
				nonWorkingTime      : true,
				eventDragCreate: false,
				eventCopyPaste : false,
				filterBar : true,
				sortable: false,			
				tree: true,
				treeGroup: {
					levels: [],
				},
				dependencies : false,
				resourceTimeRanges : true,
				eventNonWorkingTime : {
					disabled : false
				},

				scheduleTooltip : {
					hideForNonWorkingTime: false,
					//@ts-ignore
					getText(date: Date, event: Dispatch | Absence | ServiceOrderTimePosting, resource: ResourceTypes) {
						let calendar = resource.calendar || this.owner.project.effectiveCalendar;
						let isWorkingTime: boolean = false;
						let tooltipText: string = null;
						if (calendar && calendar.isWorkingTime) {
							isWorkingTime = calendar.isWorkingTime(date);
							tooltipText = isWorkingTime ? '' : window.Helper.getTranslatedString("NonWorkingTime");
						}
						if (isWorkingTime && resource.timeRanges) {
							let timeRange = resource.timeRanges.find(t => DateHelper.timeSpanContains(DateHelper.startOf(t.dates[0]), DateHelper.endOf(t.dates[t.dates.length-1]), DateHelper.startOf(date), DateHelper.endOf(date)));
							if(timeRange != null) {
								tooltipText = timeRange.name;
							}
						}
						return tooltipText;
					}
				},
				timeRanges : {
					showCurrentTimeLine : true
				},
				eventDrag : {
					validatorFn(data) {
						let { eventRecords, newResource, startDate, endDate } = data;
						let canDrop = this.owner.AllowSchedulingForPast() || startDate > new Date();
						if(!canDrop) {
							return {
								valid   : false,
								message : window.Helper.String.getTranslatedString("SchedulingForPastIsNotAllowed")
							};
						}

						if (((eventRecords[0] as SchedulerEvent).type !== SchedulerEventType.Dispatch)) {
							if(((newResource as Technician).type == ResourceType.Technician && (eventRecords[0] as Absence).AbsenceTypeData instanceof Crm.PerDiem.Rest.Model.Lookups.CrmPerDiem_TimeEntryType) ||
								((newResource as Technician).type != ResourceType.Technician && (eventRecords[0] as Absence).AbsenceTypeData instanceof Crm.Article.Model.Lookups.CrmArticle_ArticleDowntimeReason)) {
								return {valid: true};
							}
							return {
								valid: false,
								message: `${window.Helper.getTranslatedString("NotValidFor")}: ${(newResource as Technician | Tool | Vehicle).type}`
							};
						}
						if((eventRecords[0] as SchedulerEvent).type == SchedulerEventType.Dispatch && (newResource as Technician).type != ResourceType.Technician) {
							return {
								valid: false,
								message: `${window.Helper.getTranslatedString("NotValidFor")}: ${(newResource as Technician | Tool | Vehicle).type}`
							};
						}
						let valid = (newResource as Technician).type == ResourceType.Technician;
						const
							dispatch = (eventRecords[0] as Dispatch),
							order = dispatch.ServiceOrder.OriginalData;

						if (valid && order.RequiredSkillKeys.length == 0 && order.RequiredAssetKeys.length == 0) return { valid: true };

						const missingSkillKeys: string[] = [];
						const missingAssetKeys: string[] = [];

						let technicianHasSkills = window.Helper.Scheduler.hasSkillsForOrder((newResource as Technician), order, startDate, endDate, missingSkillKeys);
						let technicianHasAssets = window.Helper.Scheduler.hasAssetsForOrder((newResource as Technician), order, startDate, endDate, missingAssetKeys);

						const missingSkills = Array.from(new Set(missingSkillKeys)).map(key => window.Helper.Scheduler.CreateLookupProxy(Technician.lookups.skills, key));
						const missingAssets = Array.from(new Set(missingAssetKeys)).map(key => window.Helper.Scheduler.CreateLookupProxy(Technician.lookups.assets, key));

						valid &&= technicianHasSkills && technicianHasAssets;
						
						let validationText = "";
						if(!technicianHasSkills) {
							validationText = window.Helper.String.getTranslatedString("TechnicianHasNoneOfTheRequiredOrderSkills")
								.replace("{0}", window.Helper.User.getDisplayName((newResource as Technician).OriginalData))
								.replace("{1}", missingSkills.join());
						} else if(technicianHasSkills && window._.difference(order.RequiredSkillKeys, (newResource as Technician).ValidSkills.map(s => s.Key)).length > 0) {
							validationText = window.Helper.String.getTranslatedString("TechnicianLacksSomeOfRequiredOrderSkills")
								.replace("{0}", window.Helper.User.getDisplayName((newResource as Technician).OriginalData))
								.replace("{1}", missingSkills.join());
						}
						if(!technicianHasAssets) {
							validationText = window.Helper.String.getTranslatedString("TechnicianHasNoneOfTheRequiredOrderAssets")
								.replace("{0}", window.Helper.User.getDisplayName((newResource as Technician).OriginalData))
								.replace("{1}", missingAssets.join());
						} else if(technicianHasAssets && window._.difference(order.RequiredAssetKeys, (newResource as Technician).ValidAssets.map(a => a.Key)).length > 0) {
							validationText = window.Helper.String.getTranslatedString("TechnicianLacksSomeOfRequiredOrderAssets")
								.replace("{0}", window.Helper.User.getDisplayName((newResource as Technician).OriginalData))
								.replace("{1}", missingAssets.join());
						}

						return {
							valid: valid,
							message: valid ? '' : validationText
						};
					}
				},
				calendarHighlight : {
					// visualize resource calendars while interacting with events
					calendar : 'resource',
					collectAvailableResources: context => {
						//@ts-ignore
						return context.scheduler.getResourcesToHighlight(context);
					}
				},
				cellTooltip: {
					allowOver: true,
					scrollable: true,
					width: '28em',
					tooltipRenderer: (data) => { return "" }
				},
				eventTooltip: {
					allowOver: true,
					scrollable: true,
					width: '28em',
				},
				resourceNonWorkingTime: { },
				nestedEvents : {
					// Stack nested events initially (can be changed from the toolbar)
					eventLayout  : 'stack',
					// Grow nested events a bit, compared to the default which is 30
					eventHeight  : 25,
					// Reserve more space above the nested events container
					headerHeight : 15,
					// Space between nested events
					barMargin    : 1,
					allowNestingOnDrop: false,
					allowDeNestingOnDrop: false
				}
			}
		};
	}

	static getEventContextMenuSelectedItems(scheduler, eventRecord) {
		let selectedEvents = [eventRecord];

		//trying to outsmart bryntum as always. If there are selected events but the context menu was opened on a non selected event then deselect all
		if (scheduler.selectedEvents && scheduler.selectedEvents.length > 0) {
			if (scheduler.selectedEvents.includes(eventRecord)) {
				selectedEvents = [...scheduler.selectedEvents];
			} else {
				//deselectAll method does not work, therefore we do it one by one!!
				let selecteds = [...scheduler.selectedEvents];
				for (let selected of selecteds) {
					scheduler.deselect(selected);
				}
			}
		}

		return selectedEvents;
	}
}