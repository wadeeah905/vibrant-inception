import { namespace } from "@Main/namespace";
import type { Technician } from "../Model/Technicians";
import type { SchedulerDetailsViewModel } from "../SchedulerDetailsViewModel";
import type {CalendarModel} from "@bryntum/schedulerpro";

export class SchedulerAdHocModalViewModel extends window.Crm.Service.ViewModels.DispatchAdHocViewModel {
	parentViewModel: SchedulerDetailsViewModel;
	date: Date;
	endDate: Date;
	resourceRecord: Technician;
	technicians: KnockoutObservableArray<Main.Rest.Model.Main_User> = ko.observableArray([]);

	constructor(data) {
		super();
		this.date = data?.date ?? window.moment().startOf('minute').toDate();
		this.date.setUTCMinutes(Math.ceil(this.date.getUTCMinutes() / 5) * 5);
		this.resourceRecord = data?.resourceRecord;
		this.parentViewModel = data?.parentViewModel ?? data;

		window.database.SmsScheduler_ProfileResource.filter("it.ProfileKey == profile.Id", { profile: this.parentViewModel.profile() }).select(pr => pr.ResourceKey)
			.toArray()
			.then(profileResources => {
				window.database.Main_User.filter("t => t.Id in profileResources", { profileResources: profileResources })
					.toArray()
					.then(technicians => {
						this.technicians(technicians);
					});
			});
		let calendar = (this.resourceRecord && this.resourceRecord["calendar"] as CalendarModel) ?? (this.parentViewModel.scheduler().project.calendar as CalendarModel);
		this.endDate = this.parentViewModel.profile().ClientConfig.ServiceOrderDispatchIgnoreCalculatedDuration ? window.moment(this.date).add(this.parentViewModel.profile().ClientConfig.ServiceOrderDispatchDefaultDuration, "m").toDate() : calendar.calculateEndDate(this.date, window.moment.duration(this.parentViewModel.profile().ClientConfig.ServiceOrderDispatchDefaultDuration, "m").asMilliseconds());
	}

	async init(): Promise<void> {
		await super.init();
		this.dispatch().Username(this.resourceRecord?.ResourceKey ?? undefined);
		this.dispatch().Username.isModified(false);
		this.dispatch().Date(this.date);
		this.dispatch().EndDate(this.endDate);
		
		if(this.resourceRecord != null){
			this.serviceOrder().StationKey(this.resourceRecord.OriginalData.ExtensionValues.StationIds.length === 1 ? this.resourceRecord.OriginalData.ExtensionValues.StationIds[0] : null);
		}
	}

	override async submit() {
		this.loading(true);
		let dispatchNo = await window.NumberingService.createNewNumberBasedOnAppSettings(window.Crm.Service.Settings.Dispatch.DispatchNoIsGenerated, window.Crm.Service.Settings.Dispatch.DispatchNoIsCreateable, this.dispatch().DispatchNo(), "SMS.ServiceOrderDispatch", window.database.CrmService_ServiceOrderDispatch, "DispatchNo");
		if (dispatchNo !== null) {
			this.dispatch().DispatchNo(dispatchNo)
		}
		if (this.errors().length > 0) {
			this.loading(false);
			this.errors.showAllMessages();
			this.errors.scrollToError();
			return;
		}
		this.serviceOrder().StatusKey("Released");
		if (!this.serviceOrder().OrderNo()) {
			this.dispatch().OrderId(this.serviceOrder().Id());
			const adHocSequenceName = window.Crm.Service.Settings.AdHoc.AdHocNumberingSequenceName;
			let serviceOrderNo = await window.NumberingService.getNextFormattedNumber(adHocSequenceName);
			this.serviceOrder().OrderNo(serviceOrderNo);
		}
		await new window.Helper.ServiceOrder.CreateServiceOrderData(this.serviceOrder(),
			this.serviceOrder().ServiceOrderTemplate(),
			this.installationIds()).create();
		await window.database.saveChanges();

		this.loading(false);
		$(".modal:visible").modal("hide");

		if (this.parentViewModel.onNewServiceOrder)
			this.parentViewModel.onNewServiceOrder(this.serviceOrder().Id());
	};

	async cancel() {
		$(".modal:visible").modal("hide");
	}
}

namespace("Sms.Scheduler.ViewModels").SchedulerAdHocModalViewModel = SchedulerAdHocModalViewModel;