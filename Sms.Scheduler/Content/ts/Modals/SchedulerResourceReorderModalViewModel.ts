import { namespace } from "@Main/namespace";
import type { SchedulerDetailsViewModel } from "../SchedulerDetailsViewModel";
import type { Technician } from "../Model/Technicians";

export class SchedulerResourceReorderModalViewModel extends window.Main.ViewModels.ViewModelBase {
	parentViewModel: SchedulerDetailsViewModel = null;
	loading: KnockoutObservable<boolean> = ko.observable<boolean>(false);
	technicians: Technician[];
	profileResources: Sms.Scheduler.Rest.Model.SmsScheduler_ProfileResource[];

	schedulablePriority: KnockoutObservableArray<{ name: string, id: string }> = ko.observableArray([]);

	readonly sorters = [
		{
			title: `${window.Helper.String.getTranslatedString("LastName")}, ${Helper.String.getTranslatedString("FirstName")} ${Helper.String.getTranslatedString("Ascending")}`,
			sort: (a: Technician, b: Technician) => a.OriginalData.LastName.localeCompare(b.OriginalData.LastName) || a.OriginalData.FirstName.localeCompare(b.OriginalData.FirstName)
		},
		{
			title: `${window.Helper.String.getTranslatedString("LastName")}, ${Helper.String.getTranslatedString("FirstName")} ${Helper.String.getTranslatedString("Descending")}`,
			sort: (a: Technician, b: Technician) => b.OriginalData.LastName.localeCompare(a.OriginalData.LastName) || b.OriginalData.FirstName.localeCompare(a.OriginalData.FirstName)
		},
		{
			title: `${window.Helper.String.getTranslatedString("FirstName")}, ${Helper.String.getTranslatedString("LastName")} ${Helper.String.getTranslatedString("Ascending")}`,
			sort: (a: Technician, b: Technician) => a.OriginalData.FirstName.localeCompare(b.OriginalData.FirstName) || a.OriginalData.LastName.localeCompare(b.OriginalData.LastName)
		},
		{
			title: `${window.Helper.String.getTranslatedString("FirstName")}, ${Helper.String.getTranslatedString("LastName")} ${Helper.String.getTranslatedString("Descending")}`,
			sort: (a: Technician, b: Technician) => b.OriginalData.FirstName.localeCompare(a.OriginalData.FirstName) || b.OriginalData.LastName.localeCompare(a.OriginalData.LastName)
		},
	];

	constructor(params) {
		super();
		this.parentViewModel = params.parentViewModel;
		this.technicians = params.technicians;
		this.schedulablePriority(params.technicians.sort((a: Technician, b: Technician) => a.SortOrder - b.SortOrder).map(t => { return {"name": t.name, "id": t.id }; }));
	}
	async init(id: string): Promise<void> {
		this.profileResources = await window.database.SmsScheduler_ProfileResource.filter("it.ProfileKey == this.profileId", { profileId: this.parentViewModel.profile().Id } ).toArray();
	}
	async ok(data, event): Promise<void> {
		let self = this;
		$(event.target).closest(".modal-content").data("keepchanges", true);
		self.loading(true);

		self.schedulablePriority().forEach((technicianId, index) => {
			self.technicians.find(t => t.id === technicianId.id).SortOrder = index;
			let profileResource = self.profileResources.find(pr => pr.ResourceKey === technicianId.id);
			window.database.attach(profileResource);
			profileResource.SortOrder = index;
		});

		await window.database.saveChanges();
		await self.parentViewModel.scheduler().resourceStore.clearSorters();
		await self.parentViewModel.scheduler().resourceStore.sort([
			{ field: 'SortOrder', ascending: true },
			{ field: 'Lastname', ascending: true }
		]);
		self.loading(false);
		$(".modal:visible").modal("hide");
	}

	cancel(data, event): void {
		$(event.target).closest(".modal-content").data("keepchanges", true);
		$(".modal:visible").modal("hide");
	}

	resetSchedulablePriority(sorter) {
		this.schedulablePriority(this.technicians.sort(sorter.sort).map(t => { return { "name": t.name, "id": t.id as string }; }));
	}
}

namespace("Sms.Scheduler.ViewModels").SchedulerResourceReorderModalViewModel = SchedulerResourceReorderModalViewModel;