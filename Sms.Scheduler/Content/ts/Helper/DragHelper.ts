import {
	CalendarModel,
	DateHelper,
	DomHelper,
	DragHelper,
	DragHelperConfig,
	Grid,
	ScrollManager,
	Tooltip
} from "@bryntum/schedulerpro";
import type {Timeline} from "../Timeline";
import type {Pipeline} from "../Pipeline";
import {ServiceOrder} from "../Model/ServiceOrder";
import {SchedulerEvent, SchedulerEventType} from "../Model/Dispatch";
import {ResourceType, Technician} from "../Model/Technicians";
import {OrderType} from "../Model/ServiceOrder";


export class Drag extends DragHelper {
	static get $name() {
		return 'CRMPDrag';
	}

	// Factoryable type name
	static get type() {
		return 'CRMdrag';
	}
	static get configurable() {
		return {
			callOnFunctions      : false,
			// Don't drag the actual row element, clone it
			cloneTarget          : true,
			mode               : 'translateXY',
			// We size the cloned element manually
			autoSizeClonedTarget : false,
			// Only allow drops on the schedule area
			dropTargetSelector   : '.b-timeline-subgrid',
			schedule  : null,
			grid      : null,
		};
	}
	public scrollManager!:ScrollManager;
	public _schedule!:Timeline & { allowOverlap?: Boolean, isHorizontal?: Boolean };
	public grid!:Grid;
	tip: Tooltip;
	enablePlanningConfirmations: () => boolean;
	allowSchedulingForPast: () => boolean;
	orderSelector: (g: Grid, e: HTMLElement) => ServiceOrder[];

	constructor(config:Partial<DragHelperConfig> & {
		schedule: Timeline,
		grid: Pipeline,
		constrain: boolean,
		enablePlanningConfirmations: () => boolean,
		allowSchedulingForPast: () => boolean,
		orderSelector: (g: Grid, e: HTMLElement) => ServiceOrder[]
	}) {
		super(config);

		const me = this;
		me.grid = config.grid;
		me.schedule = config.schedule;
		me.enablePlanningConfirmations = config.enablePlanningConfirmations;
		me.orderSelector = config.orderSelector;
		me.allowSchedulingForPast = config.allowSchedulingForPast;

		// Configure DragHelper with schedule's scrollManager to allow scrolling while dragging
		//me.scrollManager = me.schedule.scrollManager;
		this.on({
			dragstart : this.onDragStart,
			drag: this.onDrag,
			drop      : this.onDrop,
			beforeDragStart: this.beforeDragStart
		});
		
	}

	createProxy(element) {
		const
			proxy = document.createElement('div'),
			{ schedule } = this,
			orders = this.orderSelector(this.grid, element);

		const duration = orders.reduce((sum, order) => {
			const duration = window.Helper.Scheduler.determineNewEventDuration(
				order,
				schedule.defaultEventDuration,
				schedule.serviceOrderDispatchMaximumDuration,
				schedule.ServiceOrderDispatchIgnoreCalculatedDuration
			);

			sum += duration.asMilliseconds();

			return sum;
		}, 0);
		
		let durationInPx = schedule.timeAxisViewModel.getDistanceForDuration(duration);

		// Fake an event bar
		proxy.classList.add('b-sch-event-wrap', 'b-unassigned-class')
		proxy.innerHTML = `<div class="b-event-name">${orders.map(o => o.name).join(", ")}</div>`;

		if (schedule.isHorizontal) {
			// @ts-ignore
			proxy.style.height = `${schedule.rowHeight - (2 * schedule.resourceMargin)}px`;
			proxy.style.width  = `${durationInPx}px`;
		}
		else {
			proxy.style.height = `${durationInPx}px`;
			proxy.style.width  = `${schedule.resourceColumnWidth}px`;
		}

		return proxy;
	}

	beforeDragStart = () => {
		return window.AuthorizationManager.currentUserHasPermission("Scheduler::Edit");		
	}

	onDragStart = ({ context }) => {
		const
			me                          = this,
			{ schedule }                = me,
			orders = this.orderSelector(this.grid, context.grabbed),
			{ eventTooltip } = schedule.features;

		// save a reference to the task so we can access it later
		context.tasks = orders.map(order => {
			let task = new SchedulerEvent();
			//@ts-ignore
			task.type = order.type == OrderType.ServiceOrder ? SchedulerEventType.Dispatch : SchedulerEventType.Absence;

			const duration = window.Helper.Scheduler.determineNewEventDuration(
				order,
				schedule.defaultEventDuration,
				schedule.serviceOrderDispatchMaximumDuration,
				schedule.ServiceOrderDispatchIgnoreCalculatedDuration
			);

			task.duration = duration.as(task.durationUnit as any);
			return task;
		});

		// Prevent tooltips from showing while dragging
		eventTooltip.disabled = true;
		context.orders = orders;
		schedule.enableScrollingCloseToEdges(schedule.timeAxisSubGrid);

		if (!me.tip) {
			me.tip = new Tooltip({
				align      : 'b-t',
				//clippedBy  : [schedule.timeAxisSubGridElement, schedule.bodyContainer],
				forElement : context.element,

				cls : 'b-popup b-sch-event-tooltip'
			});
		}
	};

	onDrag = ({ event, context }) => {
		const tasks = context.tasks as SchedulerEvent[];
		const orders = context.orders as ServiceOrder[];
		const
			me = this,
			{ schedule } = me,
			coordinate = DomHelper[`getTranslate${schedule.isHorizontal ? 'X' : 'Y'}`](
				context.element
			),
			resource = context.target && schedule.resolveResourceRecord(context.target, [event.offsetX, event.offsetY]),
			calendar = (resource && resource["calendar"] as CalendarModel) ?? (schedule.project.calendar as CalendarModel);
			// Coordinates required when used in vertical mode, since it does not use actual columns
		
		const startDate = schedule.getDateFromCoordinate(coordinate, 'round', false, true);
		let canDrop = this.allowSchedulingForPast() || startDate > new Date();

		if (startDate && resource && resource.isGroupHeader == false) {
			let endDate = startDate;
			for (let task of tasks) {
				endDate = calendar.calculateEndDate(endDate, DateHelper.asMilliseconds(task.duration, task.durationUnit));
			}

			if (schedule.isHorizontal) {
				if (context.resource) {
					schedule.getRowFor(context.resource).removeCls('target-resource');
				}
				if (startDate && resource) {
					schedule.getRowFor(resource).addCls('target-resource');
				}
			}
			
			let isValid = true;
			let technicianHasSkills: boolean = true;
			let technicianHasAssets: boolean = true;

			const missingSkillKeys: string[] = [];
			const missingAssetKeys: string[] = [];

			for (let order of orders) {
				if (resource && (resource as ResourceTypes).type == ResourceType.Technician) {
					if (order.OriginalData?.RequiredSkillKeys?.length > 0) {
						technicianHasSkills &&= window.Helper.Scheduler.hasSkillsForOrder((resource as Technician), order.OriginalData, startDate, endDate, missingSkillKeys);
					}
					if (order.OriginalData?.RequiredAssetKeys?.length > 0) {
						technicianHasAssets &&= window.Helper.Scheduler.hasAssetsForOrder((resource as Technician), order.OriginalData, startDate, endDate, missingAssetKeys);
					}
				}

				// Don't allow drops anywhere, only allow drops if the drop is on the timeaxis and on top of a Resource
				isValid &&= window.Helper.Scheduler.isValidForResource(order.OriginalData, (resource as ResourceTypes).OriginalData) && (schedule.allowOverlap || schedule.isDateRangeAvailable(startDate, endDate, null, resource));
			}

			const missingSkills = Array.from(new Set(missingSkillKeys)).map(key => window.Helper.Scheduler.CreateLookupProxy(ServiceOrder.lookups.skills, key));
			const missingAssets = Array.from(new Set(missingAssetKeys)).map(key => window.Helper.Scheduler.CreateLookupProxy(ServiceOrder.lookups.assets, key));

			if((resource as any).type === ResourceType.Technician) {
				isValid &&= (resource as Technician).isActiveAtDate(startDate);
			}

			context.canDrop = canDrop;
			// Save reference to resource so we can use it in onTaskDrop
			context.resource = resource;
			context.valid = isValid;
			context.startDate = startDate;
			context.endDate = endDate;

			if (me.tip && context.valid) {
				let tipHtml = "";
				let startAndEndAreOnSameDay = window.Helper.Date.areOnSameDay(startDate, endDate);

				let date = startDate;
				let taskIndex = 0;
				for (let order of orders) {
					let task = tasks[taskIndex];

					let formattedStartDate = window.moment(date).format(startAndEndAreOnSameDay ? "LT" : "lll");
					date = calendar.calculateEndDate(date, DateHelper.asMilliseconds(task.duration, task.durationUnit));
					let formattedEndDate = window.moment(date).format(startAndEndAreOnSameDay ? "LT" : "lll");
					let warningItems = (resource as ResourceTypes).type == ResourceType.Technician ? window.Helper.Scheduler.PlanningValidations.GetPlanningValidationTooltipForOrder(order, (resource as Technician), startDate, date) : [];
					
					context.valid &&= technicianHasSkills && technicianHasAssets;
					
					let validationText = "";
					if(!technicianHasSkills) {
						validationText = window.Helper.String.getTranslatedString("TechnicianHasNoneOfTheRequiredOrderSkills")
							.replace("{0}", window.Helper.User.getDisplayName((resource as Technician).OriginalData))
							.replace("{1}", missingSkills.join());
					} else if(technicianHasSkills && window._.difference(order.OriginalData.RequiredSkillKeys, (resource as Technician).ValidSkills.map(s => s.Key)).length > 0) {
						validationText = window.Helper.String.getTranslatedString("TechnicianLacksSomeOfRequiredOrderSkills")
							.replace("{0}", window.Helper.User.getDisplayName((resource as Technician).OriginalData))
							.replace("{1}", missingSkills.join());
					}
					if(!technicianHasAssets) {
						validationText = window.Helper.String.getTranslatedString("TechnicianHasNoneOfTheRequiredOrderAssets")
							.replace("{0}", window.Helper.User.getDisplayName((resource as Technician).OriginalData))
							.replace("{1}", missingAssets.join());
					} else if(technicianHasAssets && window._.difference(order.OriginalData.RequiredAssetKeys, (resource as Technician).ValidAssets.map(a => a.Key)).length > 0) {
						validationText = window.Helper.String.getTranslatedString("TechnicianLacksSomeOfRequiredOrderAssets")
							.replace("{0}", window.Helper.User.getDisplayName((resource as Technician).OriginalData))
							.replace("{1}", missingAssets.join());
					}

					tipHtml += `
						<div class="b-sch-event-title">${order.name}</div>
						<div class="b-sch-tooltip-startdate">${window.Helper.String.getTranslatedString("StartDate")}: ${formattedStartDate}</div>
						<div class="b-sch-tooltip-enddate">${window.Helper.String.getTranslatedString("EndDate")}: ${formattedEndDate}</div>
						${validationText != "" ? `<div class="restriction-title"><b>${window.Helper.getTranslatedString("Restrictions")}:</b></div>
						<ul class="restriction-list b-sch-tip-invalid">
							<li class="b-sch-tip-message">${validationText}</li>
						</ul>` : ''}
						${warningItems.length > 0 ? `<div class="restriction-title"><b>${window.Helper.String.getTranslatedString("Warning")}:</b></div>
							${window.Helper.Scheduler.PlanningValidations.displayWarningsAsTooltip(warningItems)}` : ''}
						${!canDrop ? `<div class="b-sch-tip-invalid"><div class="b-sch-tip-message">${window.Helper.getTranslatedString('SchedulingForPastIsNotAllowed')}</div></div>` : ''}
					`;

					taskIndex++;
				}

				me.tip.html = tipHtml;
				me.tip.showBy(context.element);
			}
			else {
				me.tip.html = `
		        <div class="b-sch-event-title">${orders.map(o => o.name).join(", ")}</div>
		        <div class="restriction-title"><b>${window.Helper.String.getTranslatedString("NotValidFor")}: ${(resource as ResourceTypes).type}</b></div>`
				me.tip.showBy(context.element);
			}
		} else {
			context.canDrop = context.valid = false;
		}
	};

	// Drop callback after a mouse up, take action and transfer the unplanned task to the real EventStore (if it's valid)
	// @ts-ignore
	onDrop = async ({ context, event }) => {
		let
			me = this,
			{ schedule } = me,
			{ canDrop, target, resource, valid, element } = context;

		if (!resource || !canDrop) {
			context.valid = false;
			if(me.tip.isVisible){
				me.tip.hide();
			}
			return;
		}

		let calendar = (resource && resource["calendar"] as CalendarModel) ?? (schedule.project.calendar as CalendarModel);
		const tasks = context.tasks as SchedulerEvent[];
		const orders = context.orders as ServiceOrder[];

		let violationItems = [];

		if (resource.type == ResourceType.Technician) {
			for (const serviceOrder of orders.filter(o => o.type == OrderType.ServiceOrder)) {
				violationItems.push(...window.Helper.Scheduler.PlanningValidations.GetPlanningValidationItemsForOrder(serviceOrder, resource, context.startDate, context.endDate));
			}
		}

		if(valid && canDrop && this.enablePlanningConfirmations() && violationItems.length > 0) {
			window.Helper.Scheduler.ShowPopup(violationItems, async () => { await createEvent(); });
		} else if(valid && canDrop) {
			await createEvent();
		} else {
			return;
		}
		async function createEvent() {
			schedule.disableScrollingCloseToEdges(schedule.timeAxisSubGrid);
			// If drop was done in a valid location, set the startDate and transfer the task to the Scheduler event store
			let date = schedule.getDateFromCoordinate(context.newX, 'round', false, true);
			
			if ((resource.type == ResourceType.Technician || tasks[0].type == SchedulerEventType.Absence)) {
	
				for (let order of orders) {
					try {
						const duration = window.Helper.Scheduler.determineNewEventDuration(
							order,
							schedule.defaultEventDuration,
							schedule.serviceOrderDispatchMaximumDuration,
							schedule.ServiceOrderDispatchIgnoreCalculatedDuration
						);
						let task = window.Helper.Scheduler.createEvent(order, resource, date, duration);
						schedule.scheduleEvent({
							eventRecord: task,
							startDate: date,
							resourceRecord: resource
						});
	
						date = calendar.calculateEndDate(date, DateHelper.asMilliseconds(task.duration, task.durationUnit));
	
					} catch (e) {
						console.log(e);
					}
				}
			}
			
			schedule.features.eventTooltip.disabled = false;
		}
	}

	set schedule(schedule) {
		this._schedule = schedule;

		// Configure DragHelper with schedule's scrollManager to allow scrolling while dragging
		//this.scrollManager = schedule.scrollManager;
	}

	get schedule() {
		return this._schedule;
	}
	onDragAbort() {
		this.tip?.hide();
	}
}