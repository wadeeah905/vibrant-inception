import { namespace } from "@Main/namespace";
import type { HourSpan } from "../Model/HourSpan";
import type { SchedulerDetailsViewModel } from "../SchedulerDetailsViewModel";
import moment from "moment";
import _ from "lodash";

export class SchedulerEditProfileModalViewModel extends window.Main.ViewModels.ViewModelBase {
	parentViewModel: SchedulerDetailsViewModel = null;
	loading: KnockoutObservable<boolean> = ko.observable<boolean>(false);

	selectedGroups: KnockoutComputed<string[]>;
	selectedServiceOrderTooltips: KnockoutComputed<string[]>;
	selectedServiceOrderDispatchTooltips: KnockoutComputed<string[]>;
	selectedResourceTooltips: KnockoutComputed<string[]>;
	selected1stLine: KnockoutComputed<string>;
	selected2ndLine: KnockoutComputed<string>;
	selectedResourceGroups: KnockoutComputed<string[]>;
	dataForFirstRow: KnockoutComputed<string[]>;
	dataForSecondRow: KnockoutComputed<string[]>;
	dataForThirdRow: KnockoutComputed<string[]>;

	serviceOrderHeadTooltipProperties: string[];
	serviceOrderDispatchTooltipProperties: string[];
	resourceTooltipProperties: string[];
	dataTextFilter: string[];

	profile: KnockoutObservable<Sms.Scheduler.Rest.Model.ObservableSmsScheduler_Profile> = ko.observable<Sms.Scheduler.Rest.Model.ObservableSmsScheduler_Profile>(null);

	serviceOrderDispatchDefaultDuration = ko.pureComputed<string>({
		read: () => {
			const clientConfig = ko.unwrap(this.profile().ClientConfig) as unknown as Sms.Scheduler.Model.ObservableClientConfig;

			const value = clientConfig.ServiceOrderDispatchDefaultDuration() || 0;
			const duration = moment.duration(value, "minutes");
			return duration.toISOString();
		},
		write: (value) => {
			const clientConfig = ko.unwrap(this.profile().ClientConfig) as unknown as Sms.Scheduler.Model.ObservableClientConfig;

			const duration = moment.duration(value);
			clientConfig.ServiceOrderDispatchDefaultDuration(duration.asMinutes());
		}
	});

	serviceOrderDispatchMaximumDuration = ko.pureComputed<string>({
		read: () => {
			const clientConfig = ko.unwrap(this.profile().ClientConfig) as unknown as Sms.Scheduler.Model.ObservableClientConfig;

			const value = clientConfig.ServiceOrderDispatchMaximumDuration() || 0;
			const duration = moment.duration(value, "minutes");
			return duration.toISOString();
		},
		write: (value) => {
			const clientConfig = ko.unwrap(this.profile().ClientConfig) as unknown as Sms.Scheduler.Model.ObservableClientConfig;

			const duration = moment.duration(value);
			clientConfig.ServiceOrderDispatchMaximumDuration(duration.asMinutes());
		}
	});

	serviceOrderDispatchLimitMaximumDuration = ko.pureComputed<Boolean>({
		read: () => {
			const clientConfig = ko.unwrap(this.profile().ClientConfig) as unknown as Sms.Scheduler.Model.ObservableClientConfig;

			const value = clientConfig.ServiceOrderDispatchMaximumDuration() !== null;
			return value;
		},
		write: (value) => {
			const clientConfig = ko.unwrap(this.profile().ClientConfig) as unknown as Sms.Scheduler.Model.ObservableClientConfig;

			clientConfig.ServiceOrderDispatchMaximumDuration(0);
			if (!value) {
				clientConfig.ServiceOrderDispatchMaximumDuration(null);
				clientConfig.ServiceOrderDispatchIgnoreCalculatedDuration(false);
				clientConfig.ServiceOrderDispatchForceMaximumDuration(false);
			}	
		}
	});

	serviceOrderDispatchMaximumDurationSelectedOptions = ko.pureComputed(() => {
		const clientConfig = ko.unwrap(this?.profile?.()?.ClientConfig) as unknown as Sms.Scheduler.Model.ObservableClientConfig;

		if (clientConfig) {
			return Number(clientConfig.ServiceOrderDispatchIgnoreCalculatedDuration()) + Number(clientConfig.ServiceOrderDispatchForceMaximumDuration());
		} else {
			return 0;
		}
	});

	nonWorkingHours: KnockoutObservableArray<HourSpanViewModel> = ko.observableArray([]).extend({
		validation: [{
			validator: (value: HourSpanViewModel[], params) => {
				const nonWorkingHours = value.map(x => x.toHourSpan()).toSorted((a, b) => a.from - b.from);

				for (let i = 1; i < nonWorkingHours.length; i++)
					if (nonWorkingHours[i].from < nonWorkingHours[i - 1].to)
						return false;

				return true;
			},
			message: params => window.Helper.getTranslatedString("TimesOrderAscending")
		}, {
			validator: (value: HourSpanViewModel[], params) => value.length <= 8,
			message: window.Helper.String.getTranslatedString("RuleViolation.LessOrEqual")
				.replace("{0}", window.Helper.String.getTranslatedString("Count"))
				.replace("{1}", "8")
		}]
	});

	errors = ko.validation.group([
		this.nonWorkingHours,
		this.profile,
		this.serviceOrderDispatchDefaultDuration,
		this.serviceOrderDispatchMaximumDuration,
		this.serviceOrderDispatchMaximumDurationSelectedOptions
	], { deep: true });

	constructor(parentViewModel) {
		super();
		this.parentViewModel = parentViewModel;

		//@ts-ignore
		this.selectedGroups = SchedulerEditProfileModalViewModel.createComputedFromArray(() => this.profile()?.ClientConfig().PipelineGroup);
		//@ts-ignore
		this.selectedServiceOrderTooltips =	SchedulerEditProfileModalViewModel.createComputedFromArray(() => this.profile()?.ClientConfig().ServiceOrderTooltip);
		//@ts-ignore
		this.selectedServiceOrderDispatchTooltips =	SchedulerEditProfileModalViewModel.createComputedFromArray(() => this.profile()?.ClientConfig().ServiceOrderDispatchTooltip);
		//@ts-ignore
		this.selectedResourceTooltips = SchedulerEditProfileModalViewModel.createComputedFromArray(() => this.profile()?.ClientConfig().ResourceTooltip);
		
		this.selected1stLine = ko.computed(() => {
			return this.profile()?.ClientConfig()?.PipelineFirstLine;
		});	
		this.selected2ndLine = ko.computed(() => {
			return this.profile()?.ClientConfig()?.PipelineSecondLine;
		});
		//@ts-ignore
		this.selectedResourceGroups = SchedulerEditProfileModalViewModel.createComputedFromArray(() => this.profile()?.ClientConfig().ResourceGroup);
		//@ts-ignore
		this.dataForFirstRow = SchedulerEditProfileModalViewModel.createComputedFromArray(() => this.profile()?.ClientConfig().DataForFirstRow);
		//@ts-ignore
		this.dataForSecondRow = SchedulerEditProfileModalViewModel.createComputedFromArray(() => this.profile()?.ClientConfig().DataForSecondRow);
		//@ts-ignore
		this.dataForThirdRow = SchedulerEditProfileModalViewModel.createComputedFromArray(() => this.profile()?.ClientConfig().DataForThirdRow);
	}
	
	private static createComputedFromArray(propertyAccessor: () => KnockoutObservable<string[]>): KnockoutComputed<string[]> {
		return ko.pureComputed({
			read: function () {
				let prop = propertyAccessor();
				return prop() ?? [];
			},
			write: function (value) {
				let prop = propertyAccessor();
				prop(value);
			},
			owner: this
		});
	}

	async init(id: string): Promise<void> {
		const profile = window.Helper.Database.createClone(this.parentViewModel.profile());
		profile.ClientConfig = window.Helper.Database.createClone(this.parentViewModel.profile().ClientConfig);
		//@ts-ignore
		profile.resetChanges();

		if (profile.ClientConfig.ServiceOrderDispatchMaximumDuration === 0) {
			profile.ClientConfig.ServiceOrderDispatchMaximumDuration = null;
		}

		this.profile(profile.asKoObservable())

		this.serviceOrderHeadTooltipProperties = await this.getPropertiesArray(window.Helper.Url.action("GetServiceOrderHeadTooltipProperties", "Scheduler", { plugin: "Sms.Scheduler" }));
		this.serviceOrderHeadTooltipProperties["mapDisplayObject"] = window.Helper.Scheduler.Tooltips.GetPropertyTranslation;

		this.serviceOrderDispatchTooltipProperties = await this.getPropertiesArray(window.Helper.Url.action("GetServiceOrderDispatchTooltipProperties", "Scheduler", { plugin: "Sms.Scheduler" }));
		this.serviceOrderDispatchTooltipProperties["mapDisplayObject"] = window.Helper.Scheduler.Tooltips.GetPropertyTranslation;

		this.resourceTooltipProperties = await this.getPropertiesArray(window.Helper.Url.action("GetResourceTooltipProperties", "Scheduler", { plugin: "Sms.Scheduler" }));
		this.resourceTooltipProperties["mapDisplayObject"] = (x) => Helper.Scheduler.Tooltips.GetPropertyTranslation(x, 'Resource');

		this.dataTextFilter = window._.difference(this.serviceOrderDispatchTooltipProperties, this.dataForFirstRow().concat(this.dataForSecondRow().concat(this.dataForThirdRow())));
		this.dataTextFilter["mapDisplayObject"] = window.Helper.Scheduler.Tooltips.GetPropertyTranslation;

		let nonWorkingHours: HourSpan[] = [];
		//@ts-ignore
		if (this.profile().ClientConfig().NonWorkingHours()) {
			//@ts-ignore
			nonWorkingHours = this.profile().ClientConfig().NonWorkingHours().map(h => { return { from: h.From(), to: h.To() } });
		}
		else {
			let workingHours = [{
				//@ts-ignore
				from: parseInt(Sms.Scheduler.Settings.WorkingTime.FromHour),
				//@ts-ignore
				to: parseInt(Sms.Scheduler.Settings.WorkingTime.ToHour)
			}];
			nonWorkingHours = window.Helper.Scheduler.WorkingHours.getOtherHours(workingHours);
		}

		this.nonWorkingHours(nonWorkingHours.map(x => HourSpanViewModel.fromHourSpan(x)));

		this.profile().ClientConfig.extend({validatable: false});
		//@ts-ignore
		this.profile().ClientConfig().ResourceRowHeight.extend({
			validation: [
				{
					rule: "max",
					params: 20,
					message: window.Helper.String.getTranslatedString("RuleViolation.Less")
						.replace("{0}", window.Helper.String.getTranslatedString("ResourceRowHeight"))
						.replace("{1}", "20")
				},
				{
					rule: "min",
					params: 15,
					message: window.Helper.String.getTranslatedString("RuleViolation.Greater")
						.replace("{0}", window.Helper.String.getTranslatedString("ResourceRowHeight"))
						.replace("{1}", "15")
				}
			]
		});
		//@ts-ignore
		this.profile().ClientConfig().DataForFirstRow.extend({
			validation: [
				{
					rule: "required",
					message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("DataForFirstRow")),
					params: true
				}
			]
		});

		this.serviceOrderDispatchDefaultDuration.extend({
			validation: [
				{
					validator: (value) => {
						const clientConfig = ko.unwrap(this.profile().ClientConfig) as unknown as Sms.Scheduler.Model.ObservableClientConfig;

						return clientConfig.ServiceOrderDispatchDefaultDuration() <= 480;
					},
					message: window.Helper.String.getTranslatedString("RuleViolation.Less")
						.replace("{0}", window.Helper.String.getTranslatedString("DefaultDuration"))
						.replace("{1}", "08:00")
				},
				{
					validator: (value) => {
						const clientConfig = ko.unwrap(this.profile().ClientConfig) as unknown as Sms.Scheduler.Model.ObservableClientConfig;

						return clientConfig.ServiceOrderDispatchDefaultDuration() >= 30;
					},
					message: window.Helper.String.getTranslatedString("RuleViolation.Greater")
						.replace("{0}", window.Helper.String.getTranslatedString("DefaultDuration"))
						.replace("{1}", "00:30")
				}
			]
		});

		this.serviceOrderDispatchMaximumDuration.extend({
			validation: [
				{
					onlyIf: () => this.serviceOrderDispatchLimitMaximumDuration(),
					validator: (value) => {
						const clientConfig = ko.unwrap(this.profile().ClientConfig) as unknown as Sms.Scheduler.Model.ObservableClientConfig;

						return clientConfig.ServiceOrderDispatchMaximumDuration() <= 2400;
					},
					message: window.Helper.String.getTranslatedString("RuleViolation.Less")
						.replace("{0}", window.Helper.String.getTranslatedString("MaximumDuration"))
						.replace("{1}", "40:00")
				},
				{
					onlyIf: () => this.serviceOrderDispatchLimitMaximumDuration(),
					validator: (value) => {
						const clientConfig = ko.unwrap(this.profile().ClientConfig) as unknown as Sms.Scheduler.Model.ObservableClientConfig;

						return clientConfig.ServiceOrderDispatchMaximumDuration() >= 60;
					},
					message: window.Helper.String.getTranslatedString("RuleViolation.Greater")
						.replace("{0}", window.Helper.String.getTranslatedString("MaximumDuration"))
						.replace("{1}", "01:00")
				},
				{
					onlyIf: () => this.serviceOrderDispatchLimitMaximumDuration(),
					validator: (value) => {
						const clientConfig = ko.unwrap(this.profile().ClientConfig) as unknown as Sms.Scheduler.Model.ObservableClientConfig;

						return clientConfig.ServiceOrderDispatchMaximumDuration() >= clientConfig.ServiceOrderDispatchDefaultDuration();
					},
					message: window.Helper.String.getTranslatedString("RuleViolation.Greater")
						.replace("{0}", window.Helper.String.getTranslatedString("MaximumDuration"))
						.replace("{1}", window.Helper.String.getTranslatedString("DefaultDuration"))
				}
			]
		});

		this.serviceOrderDispatchMaximumDurationSelectedOptions.extend({
			validation: [{
				onlyIf: () => this.serviceOrderDispatchLimitMaximumDuration(),
				validator: (value: number) => value > 0,
				message: params => window.Helper.getTranslatedString("PleaseSelect")
			}]
		});
	}

	async getPropertiesArray(url: string): Promise<string[]> {
		const response = await fetch(url);
		const result = await response.json();
		return result;
	}

	async save(): Promise<void> {
		this.loading(true);
		if (this.errors().length > 0) {
			this.loading(false);
			this.errors.showAllMessages();
			this.errors.scrollToError();
			return;
		}

		const newNonWorkingHours = this.nonWorkingHours()
			.map(h => h.toHourSpan())
			.toSorted((a, b) => a.from - b.from);
		const oldNonWorkingHours = this.parentViewModel.profile()?.ClientConfig?.NonWorkingHours?.map(h => { return { from: h.From, to: h.To } });

		if (!_.isEqual(newNonWorkingHours, oldNonWorkingHours)) {
			const nonWorkingHours = newNonWorkingHours.map(hourSpan => Sms.Scheduler.Model.HourSpan.create({ From: hourSpan.from, To: hourSpan.to }));
			//@ts-ignore
			this.profile().ClientConfig().NonWorkingHours(nonWorkingHours);
		}

		//transferring changes from the cloned to the source
		const editedInnerInstance = this.profile().innerInstance;
		const changedProperties = (editedInnerInstance.changedProperties || []).map(x => x.name);
		const changedClientConfigProperties = (editedInnerInstance.ClientConfig.changedProperties || []).map(x => x.name);

		if (changedProperties.length || changedClientConfigProperties.length) {
			const innerInstance = this.parentViewModel.profile();

			window.database.attachOrGet(innerInstance);

			//@ts-ignore
			window.Helper.Database.transferData(changedProperties, editedInnerInstance, innerInstance);
			//@ts-ignore
			window.Helper.Database.transferData(changedClientConfigProperties, editedInnerInstance.ClientConfig, innerInstance.ClientConfig);	

			await window.database.saveChanges();
			await this.parentViewModel.initAndloadInlineData();

			this.parentViewModel.setBreadcrumbs();
		}

		this.loading(false);
		$(".modal:visible").modal("hide");
	}
	cancel(): void {
		window.database.detach(this.profile().innerInstance);
		$(".modal:visible").modal("hide");
	}

	GetDateOptions() {
		return [
			{ Name: window.Helper.String.getTranslatedString("OneWeek"), Value: 7 },
			{ Name: window.Helper.String.getTranslatedString("TwoWeeks"), Value: 14 },
			{ Name: window.Helper.String.getTranslatedString("OneMonth"), Value: 31 },
			{ Name: window.Helper.String.getTranslatedString("TwoMonths"), Value: 62 },
			{ Name: window.Helper.String.getTranslatedString("OneQuarter"), Value: 93 },
			{ Name: window.Helper.String.getTranslatedString("OneYear"), Value: 365 }
		];
	}

	mapPropertyForSelect2Display(propertyName: string): { id: string, text: string } {
		let propertyNameTranslation = window.Helper.Scheduler.Tooltips.GetPropertyTranslation(propertyName);

		return {
			id: propertyName,
			text: propertyNameTranslation
		};
	}

	getSelectedProperties(propertyNames: string[]): { id: string, text: string }[] {
		return propertyNames.map(this.mapPropertyForSelect2Display);
	}

	mapPropertyForSelect2DisplayOfResource(propertyName: string): { id: string, text: string } {
		let propertyNameTranslation = window.Helper.Scheduler.Tooltips.GetPropertyTranslation(propertyName, 'Resource');

		return {
			id: propertyName,
			text: propertyNameTranslation
		};
	}

	getSelectedPropertiesOfResource(propertyNames: string[]): { id: string, text: string }[] {
		return propertyNames.map(this.mapPropertyForSelect2DisplayOfResource);
	}

	addServiceOrderTooltipsSeparator() {
		this.addTooltipsSeparator(this.selectedServiceOrderTooltips);
	}

	addServiceOrderDispatchTooltipsSeparator() {
		this.addTooltipsSeparator(this.selectedServiceOrderDispatchTooltips);
	}

	addResourceTooltipsSeparator() {
		this.addTooltipsSeparator(this.selectedResourceTooltips);
	}

	addTooltipsSeparator(tooltips: KnockoutObservable<string[]>) {
		var t = tooltips();
		t.push(SchedulerEditProfileModalViewModel.separator);
		tooltips(t);
	}

	async addNonWorkingHour() {
		this.nonWorkingHours.push(new HourSpanViewModel());
	}

	removeNonWorkingHour(nonWorkingHour) {
		this.nonWorkingHours.remove(nonWorkingHour);
	}

	private static readonly separator = "#.#";
}

class HourSpanViewModel {
	From: KnockoutObservable<Date>;
	To: KnockoutObservable<Date>;
	errors: KnockoutValidationErrors;

	constructor(from: Date | number | null = null, to: Date | number | null = null) {
		this.From = ko.observable(HourSpanViewModel.processHour(from));
		this.To = ko.observable(HourSpanViewModel.processHour(to));

		const validations = [{
			validator: (value, params) => {
				const from = HourSpanViewModel.toHour(this.From());
				const to = HourSpanViewModel.toHour(this.To(), true);

				return from != null && to != null && from < to;
			},
			message: params => window.Helper.getTranslatedString('RuleViolation.Less').replace("{0}", window.Helper.String.getTranslatedString("From")).replace("{1}", window.Helper.getTranslatedString("To"))
		}];

		this.From.extend({ validation: validations });
		this.To.extend({ validation: validations });

		this.errors = ko.validation.group([this.From, this.To]);
	}

	private static processHour(input: Date | number | null): Date {
		if (input == null)
			return null;

		if (input instanceof Date)
			return input;

		if (typeof input == 'number') {
			return new Date(1901, 0, 1, 0, 0, input * 3600);
		}

		throw "invalid hour input";
	}

	private static toHour(input: Date | null, midnight = false) {
		if (input == null)
			return null;

		if (input instanceof Date) {
			let hour = input.getHours() + input.getMinutes() / 60 + input.getSeconds() / 3600;

			if (hour == 0 && midnight)
				hour = 24;

			return hour;
		}

		throw "invalid date input";
	}

	toHourSpan(): HourSpan {
		return {
			from: HourSpanViewModel.toHour(this.From()),
			to: HourSpanViewModel.toHour(this.To(), true)
		}
	}

	static fromHourSpan(input: HourSpan) {
		return new HourSpanViewModel(input?.from, input?.to);
	}
}

namespace("Sms.Scheduler.ViewModels").SchedulerEditProfileModalViewModel = SchedulerEditProfileModalViewModel;