import {namespace} from "@Main/namespace";
import {Dispatch, SchedulerEventType} from "../Model/Dispatch";
import {Technician} from "../Model/Technicians";
import {Assignment} from "../Model/Assignment";
import {Vehicle} from "../Model/Vehicle";
import {Tool} from "../Model/Tools";
import {AssignmentModel, CalendarModel, DateHelper, StringHelper, TimeSpan} from "@bryntum/schedulerpro";
import { SchedulerDetailsViewModel } from "../SchedulerDetailsViewModel";
import moment from "moment";
import { ViewModelBase } from "@Main/ViewModelBase";


export class SchedulerEditModalViewModel extends ViewModelBase {
	dispatch: KnockoutObservable<any> = ko.observable(null);
	type: SchedulerEventType = null;
	
	eventRecord = null;
	parentViewModel: SchedulerDetailsViewModel = null;
	isReleased = ko.observable(true);
	readonly = ko.observable(false);
	dispatchInEditableState = ko.observable(false);
	loading = ko.observable(false);

	//Technician's Map to hold both in and out of store resource
	techniciansMap = new Map<string, Technician>();

	manuallyScheduled: boolean;
	duration: KnockoutComputed<string>;
	subscriptions: KnockoutSubscription[] = [];

	assignments: AssignmentModel[];
	articleUserRelationshipValidationText = ko.observable("");
	assignedResources = ko.observableArray<Main.Rest.Model.Main_User>([]).extend({
		validation: {
			message: window.Helper.String.getTranslatedString("MinResourceNumber"),
			validator: function (val: Main.Rest.Model.Main_User[], minLength: number) {
				return Array.isArray(val) && val.length >= minLength;
			},
			params: 1,
			onlyIf: () => this.type == SchedulerEventType.Dispatch,
			propertyName: 'assignedResources'
		}
	});
	availableResources: Technician[];
	assignedTools = ko.observableArray<Crm.Article.Rest.Model.CrmArticle_Article>([]);
	availableTools: (Tool | Vehicle)[];
	errors = ko.validation.group([this.dispatch, this.assignedResources, this.assignedTools], { deep: true });
	selectedTeam = ko.observable<Main.Rest.Model.Main_Usergroup>(null);
	warnings = ko.observableArray<string>([]);

	lookups: LookupType = {
		timeEntryTypes: { $tableName: "CrmPerDiem_TimeEntryType" },
		articleDowntimeReason: { $tableName: 'CrmArticle_ArticleDowntimeReason'},
	};
	
	constructor(params) {
		super();
		this.eventRecord = params.eventRecord;
		this.parentViewModel = params.parentViewModel;

		this.manuallyScheduled = this.eventRecord.manuallyScheduled;
	}

	async init(id: string, args): Promise<void> {
		let self = this;
		self.type = args.type;
		await window.Helper.Lookup.getLocalizedArrayMaps(this.lookups);

		const observable = window.Helper.Database.createClone(this.eventRecord.OriginalData).asKoObservable();
		observable.innerInstance.addValidationRules();

		if (!JSON.parse(window.Sms.Scheduler.Settings.WorkingTime.IgnoreWorkingTimesInEndDateCalculation) &&
			this.eventRecord.OriginalData instanceof Crm.Service.Rest.Model.CrmService_ServiceOrderDispatch && this.manuallyScheduled) {
			this.manuallyScheduled = false;
		}

		this.dispatch(observable);
		if (this.type == SchedulerEventType.Dispatch) {
			this.availableResources = this.parentViewModel.scheduler().resourceStore.records.filter(r => r.constructor === Technician).map(r => (r as Technician));
			this.availableTools = this.parentViewModel.scheduler().resourceStore.records.filter(r => r.constructor === Tool || r.constructor === Vehicle).map(r => (r as Tool | Vehicle));

			this.assignments = this.parentViewModel.scheduler().project.assignmentStore.getAssignmentsForEvent(this.eventRecord);
			if(this.parentViewModel.profile().ClientConfig.AllowSchedulingForPast === false && window.moment((this.eventRecord as Dispatch).StartTime).isBefore(new Date(), "minute")) {
				this.warnings.push(window.Helper.String.getTranslatedString("EditingDispatchesInPastWarning"));
			}
			//Find the id of those technicians who are assigned but are not in the loaded profile
			const notLoadedTechnicianIds = this.assignments
				.filter(assignment => !assignment.resource && !window.Helper.String.isGuid(assignment.resourceId as string))
				.map(assignment => assignment.resourceId as string);
			//Fill the technician's map for them
			const missedTechnicians = await this.parentViewModel.loadTechnicians(notLoadedTechnicianIds);
			SchedulerDetailsViewModel.applyResourceCalendars(self.parentViewModel.profile(), missedTechnicians);
			missedTechnicians.forEach(t => this.techniciansMap.set(t.id as string, t));
			//Fill the technician's map from assignments
			this.assignments
				.filter(a => a.resource && a.resource.constructor === Technician)
				.forEach(a => this.techniciansMap.set(a.resourceId as string, a.resource as Technician));
			//Add those not in resourceStore to the list of available resources
			this.availableResources.push(...notLoadedTechnicianIds.filter(id => this.techniciansMap.has(id)).map(id => this.techniciansMap.get(id)));
			//Fill assigneds based on the map which now contains only assigneds
			this.assignedResources(this.availableResources.filter(it => this.techniciansMap.has(it.id as string)).map(r => r.OriginalData));
			//Add the rest (those in the profile) to the map
			this.availableResources
				.filter(r => !this.techniciansMap.has(r.id as string))
				.forEach(r => this.techniciansMap.set(r.id as string, r));

			//Tool's Map to hold both in and out of store resource
			const toolsMap = new Map<string, Tool | Vehicle>();
			//Find the id of those tools that are assigned but are not in the loaded profile
			const notLoadedToolIds = this.assignments
				.filter(assignment => !assignment.resource && window.Helper.String.isGuid(assignment.resourceId as string))
				.map(assignment => assignment.resourceId as string);
			//Fill the tool's map for them
			const [notLoadedTools, notLoadedVehicles] = await this.parentViewModel.loadTools(notLoadedToolIds);
			[...notLoadedTools, ...notLoadedVehicles].forEach(t => toolsMap.set(t.id as string, t));
			//Fill the tool's map from assignments
			this.assignments
				.filter(a => a.resource && (a.resource.constructor === Tool || a.resource.constructor === Vehicle))
				.forEach(a => toolsMap.set(a.resourceId as string, a.resource as (Tool | Vehicle)));
			//Add those not in resourceStore to the list of available tools
			this.availableTools.push(...notLoadedToolIds.filter(id => toolsMap.has(id)).map(id => toolsMap.get(id)));
			//Fill assigneds based on the map which now contains only assigneds
			this.assignedTools(this.availableTools.filter(it => toolsMap.has(it.id as string)).map(r => r.OriginalData));
			//Add the rest (thos in the profile) to the map
			this.availableTools
				.filter(r => !toolsMap.has(r.id as string))
				.forEach(r => toolsMap.set(r.id as string, r));

			this.readonly(this.eventRecord.readonly);
			this.dispatchInEditableState(this.eventRecord.dispatchInEditableState);

			if (this.dispatch().StatusKey() === 'Scheduled') {
				this.isReleased(false);
			}

			window.ko.validation.addRule(this.dispatch().Date, {
				message: window.Helper.String.getTranslatedString("MissingSkillsOrAssetsValidation"),
				//@ts-ignore
				validator: (val: Date) => {
					if (!self.assignedResources().some(a => self.techniciansMap.has(a.Id))) return true;

					const teamLeader = window.Helper.Scheduler.determineTeamLeader(self.eventRecord, self.assignedResources().map(it => ({ resourceId: it.Id, resource: self.techniciansMap.get(it.Id) })));
					const mainResource = self.techniciansMap.get(teamLeader);

					const endDate = self.dispatch().EndDate();
					return window.Helper.Scheduler.hasSkillsForOrder(mainResource, self.eventRecord.ServiceOrder.OriginalData, val, endDate)
						&& window.Helper.Scheduler.hasAssetsForOrder(mainResource, self.eventRecord.ServiceOrder.OriginalData, val, endDate);
				},
				onlyIf: () => self.assignedResources().length > 0,
				propertyName: "Date"
			});

			const calculateCurrentDurationInMinutes = () => {
				let duration: number;

				if (self.manuallyScheduled) {
					duration = moment(self.dispatch().EndDate()).diff(self.dispatch().Date(), "minutes");
				} else {
					try {
						const teamLeader = window.Helper.Scheduler.determineTeamLeader(self.eventRecord, self.assignedResources().map(it => ({ resourceId: it.Id, resource: self.techniciansMap.get(it.Id) })));
						const mainResource = self.techniciansMap.get(teamLeader);

						duration = moment.duration((mainResource.calendar as CalendarModel).calculateDurationMs(self.dispatch().Date(), self.dispatch().EndDate()), "milliseconds").asMinutes();
					} catch {
						duration = 0;
					}
				}

				return duration;
			}
			const updateNetWorkMinutes = () => self.dispatch().NetWorkMinutes(calculateCurrentDurationInMinutes());

			const calculateEndDate = () => {
				let endDate: Date = null;

				if (self.manuallyScheduled) {
					endDate = moment(self.dispatch().Date()).add(self.dispatch().NetWorkMinutes(), "minutes").toDate();
				} else {
					try {
						const teamLeader = window.Helper.Scheduler.determineTeamLeader(self.eventRecord, self.assignedResources().map(it => ({ resourceId: it.Id, resource: self.techniciansMap.get(it.Id) })));
						const mainResource = self.techniciansMap.get(teamLeader);

						endDate = (mainResource.calendar as CalendarModel).calculateEndDate(self.dispatch().Date(), window.moment.duration(self.dispatch().NetWorkMinutes(), "minutes").asMilliseconds());
					}
					catch { }
				}

				return endDate;
			}
			const updateEndDate = () => {
				const endDate = calculateEndDate();

				if (endDate) {
					self.dispatch().EndDate(endDate);
				}
			}

			//By this design duration is more important thant end date
			if (self.dispatch().NetWorkMinutes() == null) {
				//Net work in minutes will be null for migrated data.
				updateNetWorkMinutes();
			} else {
				//It is safer to always calculate end date maybe something has changed.
				updateEndDate();
			}

			self.duration = ko.pureComputed<string>({
				read: () => {
					const value = self.dispatch().NetWorkMinutes();
					const duration = moment.duration(value, "minutes");
					return duration.toISOString();
				},
				write: (value) => {
					const duration = moment.duration(value);
					self.dispatch().NetWorkMinutes(duration.asMinutes());
				}
			});
			self.subscriptions.push(self.duration);

			self.subscriptions.push((this.dispatch() as Crm.Service.Rest.Model.ObservableCrmService_ServiceOrderDispatch).NetWorkMinutes.subscribe(value => {
				const currentNetWorkMinutes = calculateCurrentDurationInMinutes();
				if (value != currentNetWorkMinutes && currentNetWorkMinutes > 0) {
					updateEndDate();
				}
			}));

			self.subscriptions.push((this.dispatch() as Crm.Service.Rest.Model.ObservableCrmService_ServiceOrderDispatch).Date.subscribe(updateNetWorkMinutes));
			self.subscriptions.push((this.dispatch() as Crm.Service.Rest.Model.ObservableCrmService_ServiceOrderDispatch).EndDate.subscribe(updateNetWorkMinutes));
			self.subscriptions.push(self.assignedResources.subscribe(updateEndDate));

			window.ko.validation.addRule(self.duration, {
				message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("NetWorkMinutes")),
				//@ts-ignore
				validator: (value) => {
					if (value) {
						const duration = window.moment.duration(value, "minutes");
						if (duration.isValid() && duration.asMilliseconds() > 0) {
							return true;
						}
					}
					return false;
				},
				propertyName: "NetWorkMinutes"
			});

			const originalDuration = moment.duration((this.eventRecord.OriginalData as Crm.Service.Rest.Model.CrmService_ServiceOrderDispatch).NetWorkMinutes, "minutes");
			window.ko.validation.addRule(self.duration, {
				message: window.Helper.String.getTranslatedString("RuleViolation.Less")
					.replace("{0}", window.Helper.String.getTranslatedString("NetWorkMinutes"))
					.replace("{1}", window.Helper.String.getTranslatedString("MaximumDuration")),
				//@ts-ignore
				validator: (value) => {
					if (value) {
						const duration = window.moment.duration(value, "minutes");
						if (duration.asMinutes() <= originalDuration.asMinutes() || !self.parentViewModel.profile().ClientConfig.ServiceOrderDispatchForceMaximumDuration ||
							duration.asMinutes() <= self.parentViewModel.profile().ClientConfig.ServiceOrderDispatchMaximumDuration) {
							return true;
						}
					}
					return false;
				},
				onlyIf: () => self.parentViewModel.profile().ClientConfig.ServiceOrderDispatchMaximumDuration && moment.duration(self.duration()).asMinutes() > originalDuration.asMinutes(),
				propertyName: "NetWorkMinutes"
			});

			window.ko.validation.addRule(this.assignedResources, {
				message: window.Helper.String.getTranslatedString("MissingSkillsOrAssetsValidation"),
				//@ts-ignore
				validator: () => {
					if (!self.assignedResources().some(a => self.techniciansMap.has(a.Id))) return true;

					const teamLeader = window.Helper.Scheduler.determineTeamLeader(self.eventRecord, self.assignedResources().map(it => ({ resourceId: it.Id, resource: self.techniciansMap.get(it.Id) })));
					const mainResource = self.techniciansMap.get(teamLeader);

					const endDate = self.dispatch().EndDate();
					return window.Helper.Scheduler.hasSkillsForOrder(mainResource, self.eventRecord.ServiceOrder.OriginalData, self.dispatch().Date(), endDate)
						&& window.Helper.Scheduler.hasAssetsForOrder(mainResource, self.eventRecord.ServiceOrder.OriginalData, self.dispatch().Date(), endDate);
				},
				onlyIf: () => self.assignedResources().length > 0,
				propertyName: "assignedResources"
			});
		} else if (this.type == SchedulerEventType.Absence) {
			window.ko.validation.addRule(this.dispatch().From, {
				message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("From")),
				//@ts-ignore
				validator: (value) => !!value,
				propertyName: "From"
			});
			window.ko.validation.addRule(this.dispatch().To, {
				message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("To")),
				//@ts-ignore
				validator: (value) => !!value,
				propertyName: "To"
			});
			window.ko.validation.addRule(this.dispatch().To, {
				message: `${window.Helper.String.getTranslatedString("RuleViolation.Greater").replace("{0}", window.Helper.String.getTranslatedString("To")).replace("{1}", window.Helper.String.getTranslatedString("From"))}`,
				//@ts-ignore
				validator: (val: Date) => val > this.dispatch().From(),
				onlyIf: () => this.dispatch().From() && this.dispatch().To(),
				propertyName: "To"
			});
		}
	}
	mapToolForSelect2Display(item: Crm.Article.Rest.Model.CrmArticle_Article) {
		return	{
			id: item.Id,
			item: item,
			text: item.ItemNo + " - " + item.Description
		}	
	}
	OnTeamSelected(team: Main.Rest.Model.Main_Usergroup): void {
		if(team) {
			this.selectedTeam(team);
		}
	}
	async addResourcesToProfile() {
		if (this.selectedTeam() !== null) {
			const teamMembersNotInAssignedResources = this.selectedTeam().Members.filter(m => !(this.assignedResources().map(r => r.Id).includes(m.Id)));
			const membersNotInTechniciansMap = teamMembersNotInAssignedResources.filter(t => !this.techniciansMap.has(t.Id));
			if (membersNotInTechniciansMap.length > 0) {
				const missedTechnicians = await this.parentViewModel.loadTechnicians(membersNotInTechniciansMap.map(t => t.Id));
				SchedulerDetailsViewModel.applyResourceCalendars(this.parentViewModel.profile(), missedTechnicians);
				missedTechnicians.forEach(t => this.techniciansMap.set(t.id as string, t));
			}
			this.assignedResources.push(...teamMembersNotInAssignedResources.filter(it => this.techniciansMap.has(it.Id)));

			const toolsAndVehicles = (await window.database.CrmArticle_ArticleUserGroupRelationship.include("Article").filter("it => it.UserGroupKey == this.teamId && it.From < this.end && this.start < it.To", { teamId: this.selectedTeam().Id, start: this.dispatch().Date(), end: this.dispatch().EndDate() } ).toArray()).map(a => a.Article);
			this.assignedTools.push(...toolsAndVehicles.filter(t => !(this.assignedTools().map(x => x.Id).includes(t.Id))));
		}
	}
	
	resourceFilter(query, term) {
		query = query.filter("t => t.Id in profileResources", { profileResources: this.availableResources.map(r => r.id) });
		if (term) {
			query = query.filter("it.Id.indexOf(this.term) !== -1",	{ term: term });
		}
		return query
			.orderBy("it.LastName")
			.orderBy("it.FirstName");
	}
	toolsFilter(query, term) {
		query = query.filter("t => t.Id in profileResources", { profileResources: this.availableTools.map(r => r.id) });
		if (term) {
			query = query.filter("it.Id.indexOf(this.term) !== -1",	{ term: term });
		}
		return query
			.orderBy("it.ItemNo");
	}
	
	checkArticleUserRelationshipValidation(): boolean {
		const self = this;
		const assignedTools = self.parentViewModel.scheduler().resourceStore.records.filter(r => self.assignedTools().map(r => r.Id).includes(r.id as string)) as (Tool | Vehicle)[];
		const assignedUsers = self.parentViewModel.scheduler().resourceStore.records.filter(r => self.assignedResources().map(r => r.Id).includes(r.id as string)) as Technician[];
		if(assignedUsers.length === 0) return false;
		const endDate = self.dispatch().EndDate();
		let conflictingRelationships: Crm.Article.Rest.Model.CrmArticle_ArticleUserRelationship[] = [];
		assignedTools.forEach(v => {
			conflictingRelationships = conflictingRelationships.concat(v.AssignedUsers.filter(au => !self.assignedResources().map(r => r.Id).includes(au.UserKey) && self.dispatch().Date() < DateHelper.endOf(au.To) && DateHelper.startOf(au.From) < endDate));
		});
		let errorItems: string = "";
		for (const conflict of conflictingRelationships) {
			errorItems += StringHelper.xss`<p>${window.Helper.getTranslatedString('OverlappingByArticleUserRelationship')
				.replace("{0}", conflict.Article.ItemNo + ' - ' + conflict.Article.Description)
				.replace("{1}", window.Globalize.formatDate(conflict.From, { date: "short" }))
				.replace("{2}", window.Globalize.formatDate(conflict.To, { date: "short" }))
				.replace("{3}", window.Helper.User.getDisplayName(conflict.User))}</p>`;
		}
		if(conflictingRelationships.length > 0) {
			self.articleUserRelationshipValidationText(`
			<div id="articleRelationships-validations" class="alert alert-danger" role="alert">
				<h4>${window.Helper.getTranslatedString('Error')}</h4>
				${errorItems}
			</div>`);
			return false;
		} else {
			self.articleUserRelationshipValidationText('');
			return true;
		}
	}
	
	async save(data, event): Promise<void> {
		$(event.target).closest(".modal-content").data("keepchanges", true);

		try {
			this.loading(true);
			this.errors = ko.validation.group([this.dispatch, this.assignedResources, this.assignedTools, this.duration], { deep: true });
			if (this.errors().length > 0) {
				this.loading(false);
				this.errors.showAllMessages();
				this.errors.scrollToError();
				return;
			}
			let dispatch: Crm.Service.Rest.Model.CrmService_ServiceOrderDispatch | Sms.Scheduler.Rest.Model.SmsScheduler_Absence | Crm.Article.Rest.Model.CrmArticle_ArticleDowntime;
			if(this.dispatch().innerInstance instanceof Sms.Scheduler.Rest.Model.SmsScheduler_Absence) {
				dispatch = this.dispatch().innerInstance as Sms.Scheduler.Rest.Model.SmsScheduler_Absence;
				this.eventRecord.setStartDate(dispatch.From, false);
				this.eventRecord.setEndDate(dispatch.To, false);
				this.eventRecord.set({
					Description: dispatch.Description,
					TimeEntryTypeKey: dispatch.TimeEntryTypeKey
				});
			} else if (this.dispatch().innerInstance instanceof Crm.Article.Rest.Model.CrmArticle_ArticleDowntime)  {
				dispatch = this.dispatch().innerInstance as Crm.Article.Rest.Model.CrmArticle_ArticleDowntime;
				this.eventRecord.setStartDate(dispatch.From, false);
				this.eventRecord.setEndDate(dispatch.To, false);
				this.eventRecord.set({
					Description: dispatch.Description,
					DowntimeReasonKey: dispatch.DowntimeReasonKey
				});
			} else if (this.type == SchedulerEventType.Dispatch) {
				if (this.manuallyScheduled != this.eventRecord.manuallyScheduled) {
					this.eventRecord.manuallyScheduled = this.manuallyScheduled;
				}

				if(!this.checkArticleUserRelationshipValidation()) {
					this.loading(false);
					return;
				}
				const addedIds = this.assignedResources().map(x => x.Id).concat(this.assignedTools().map(x => x.Id));

				let dispatch = this.dispatch().innerInstance as Crm.Service.Rest.Model.CrmService_ServiceOrderDispatch;
				if(this.dispatchInEditableState()) {
					this.eventRecord.setStartDate(new Date(dispatch.Date.getFullYear(), dispatch.Date.getMonth(), dispatch.Date.getUTCDate(), dispatch.Date.getHours(), dispatch.Date.getMinutes()));
					this.eventRecord.setEndDate(new Date(dispatch.EndDate.getFullYear(), dispatch.EndDate.getMonth(), dispatch.EndDate.getUTCDate(), dispatch.EndDate.getHours(), dispatch.EndDate.getMinutes()));
					if(this.isReleased() && dispatch.StatusKey != "Released") {
						dispatch.StatusKey = "Released";
					} else if(!this.isReleased() && dispatch.StatusKey != "Scheduled") {
						dispatch.StatusKey = "Scheduled";
					}
				}
				
				let added = window._.difference(addedIds, this.assignments.map(a => a.resourceId));
				let removed = window._.difference(this.assignments.map(a => a.resourceId), addedIds);
				
				let addedAssignments = added.map(resourceId => {
					let assignment = window.Helper.String.isGuid(resourceId as string) ? window.database.SmsScheduler_DispatchArticleAssignment.defaultType.create() : window.database.SmsScheduler_DispatchPersonAssignment.defaultType.create();
					assignment.Id = window.$data.createGuid().toString().toLowerCase();
					assignment.DispatchKey = dispatch.Id;
					assignment.ResourceKey = resourceId as string;
					return new Assignment(assignment);
				});

				this.parentViewModel.scheduler().project.assignmentStore.add(addedAssignments);
				this.parentViewModel.scheduler().project.assignmentStore.remove(this.assignments.filter(it => removed.includes(it.resourceId)));

				const remainingAssignments = this.parentViewModel.scheduler().project.assignmentStore.getAssignmentsForEvent(this.eventRecord as TimeSpan) as Assignment[];
				const newTeamLeader = window.Helper.Scheduler.determineTeamLeader(this.eventRecord as Dispatch, remainingAssignments, this.techniciansMap);

				this.eventRecord.set({
					IsFixed: dispatch.IsFixed,
					StatusKey: dispatch.StatusKey,
					TeamId: dispatch.TeamId,
					Username: newTeamLeader,
					Remark: dispatch.Remark
				});
			}

			this.parentViewModel.scheduler().refreshRows();

			this.loading(false);
			
			queueMicrotask(() => $(".modal:visible").modal("hide"));
		} catch (e) {
			this.loading(false);
			window.swal(window.Helper.String.getTranslatedString("UnknownError"), window.Helper.String.getTranslatedString("Error_InternalServerError"), "error");
		}
	}

	cancel(data,event): void {
		$(event.target).closest(".modal-content").data("keepchanges", true);
		$(".modal:visible").modal("hide");
	}

	dispose() {
		this.subscriptions.forEach(s => s.dispose());
	}
}

namespace("Sms.Scheduler.ViewModels").SchedulerEditModalViewModel = SchedulerEditModalViewModel;