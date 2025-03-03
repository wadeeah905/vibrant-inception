import {namespace} from "@Main/namespace";
import type { SchedulerDetailsViewModel } from "../SchedulerDetailsViewModel";


export class SchedulerLoadProfileModalViewModel extends window.Main.ViewModels.ViewModelBase {
	parentViewModel: SchedulerDetailsViewModel = null;
	loading: KnockoutObservable<boolean> = ko.observable<boolean>(false);
	showOtherUserProfile: KnockoutObservable<boolean> = ko.observable<boolean>(false);
	profiles: KnockoutObservableArray<Sms.Scheduler.Rest.Model.SmsScheduler_Profile> = ko.observableArray<Sms.Scheduler.Rest.Model.SmsScheduler_Profile>([]);
	selectedProfileId: KnockoutObservable<number> = ko.observable<number>(null);
	selectedProfile: KnockoutObservable<Sms.Scheduler.Rest.Model.SmsScheduler_Profile> = ko.observable<Sms.Scheduler.Rest.Model.SmsScheduler_Profile>(null);
	
	constructor(parentViewModel) {
		super();
		this.parentViewModel = parentViewModel;
	}
	async init(id: string): Promise<void> {
		this.profiles(await window.database.SmsScheduler_Profile.filter("it.Username == this.username", { username: window.Helper.User.getCurrentUserName() }).toArray());
	}
	async save(data, event): Promise<void> {
		$(event.target).closest(".modal-content").data("keepchanges", true);

		this.loading(true);
		this.parentViewModel.profile(this.selectedProfile());
		await this.parentViewModel.initAndloadInlineData();
		$(".modal:visible").modal("hide");
		this.loading(false);
	}
	cancel(data, event): void {
		$(event.target).closest(".modal-content").data("keepchanges", true);

		$(".modal:visible").modal("hide");
	}
	profileFilter(query, term) {
		if(!this.showOtherUserProfile()){
			query = query.filter("it.Username == this.username", { username: window.Helper.User.getCurrentUserName() });
		}
		if (term) {
			query = query.filter("it.Name.indexOf(this.term) !== -1",	{ term: term });
		}
		return query
			.orderBy("it.Id");
	}

	mapForSelect2Display(profile){
		return {
			id: profile.Id,
			item: profile,
			text: profile.Name + "(" + profile.Username + ")"
		};
	}
	
	onProfileSelected(profile){
		this.selectedProfile(profile);
	}
}

namespace("Sms.Scheduler.ViewModels").SchedulerLoadProfileModalViewModel = SchedulerLoadProfileModalViewModel;