import {namespace} from "@Main/namespace";
import {ResourceType} from "../Model/Technicians";
import type { SchedulerDetailsViewModel } from "../SchedulerDetailsViewModel";
import {HelperArticle} from "@Crm.Article/helper/Helper.Article";


export class SchedulerAddResourceModalViewModel extends window.Main.ViewModels.ViewModelBase {
	parentViewModel: SchedulerDetailsViewModel = null;
	loading: KnockoutObservable<boolean> = ko.observable<boolean>(false);
	addedResources: KnockoutObservableArray<Main.Rest.Model.Main_User> = ko.observableArray<Main.Rest.Model.Main_User>([]);
	addedTools: KnockoutObservableArray<any> = ko.observableArray<any>([]);
	existingTechnicianResources: KnockoutObservableArray<Main.Rest.Model.Main_User> = ko.observableArray<Main.Rest.Model.Main_User>([]);
	existingToolResources: KnockoutObservableArray<Crm.Article.Rest.Model.CrmArticle_Article> = ko.observableArray<Crm.Article.Rest.Model.CrmArticle_Article>([]);
	userIds: KnockoutObservableArray<string> = ko.observableArray<string>([]);
	toolIds: KnockoutObservableArray<string> = ko.observableArray<string>([]);
	selectedTeam: KnockoutObservable<Main.Rest.Model.Main_Usergroup> = ko.observable<Main.Rest.Model.Main_Usergroup>(null);
	userGroupSelector: KnockoutObservable<boolean> = ko.observable<boolean>(false);
	
	constructor(parentViewModel: SchedulerDetailsViewModel) {
		super();
		this.parentViewModel = parentViewModel;
	}
	async init(id: string): Promise<void> {
		let self = this;
		//@ts-ignore
		self.existingTechnicianResources(this.parentViewModel.scheduler().resourceStore.records.filter(it => it.type === ResourceType.Technician).map(it => it.OriginalData).filter(Boolean));
		//@ts-ignore
		self.existingToolResources(this.parentViewModel.scheduler().resourceStore.records.filter(it => it.type === ResourceType.Tool || it.type === ResourceType.Vehicle).map(it => it.OriginalData).filter(Boolean));
	}
	toggleUserGroupSelector(): void {
		this.userGroupSelector(!this.userGroupSelector());
		if (this.userGroupSelector()) {
			this.addedResources([]);
			this.addedTools([]);
		} else {
			this.selectedTeam(null);
		}
	};
	async save(): Promise<void> {
		this.loading(true);
		try {
			if (this.userIds().length > 0) {
				const technicians = await this.parentViewModel.loadTechnicians(this.userIds());
				technicians.forEach(t => t.SortOrder += this.parentViewModel.profile().ResourceKeys.length);
				await this.parentViewModel.scheduler().resourceStore.addAsync(technicians);

				window.Helper.Scheduler.Profile.AddResourceToProfile(this.parentViewModel.profile(), ...technicians.map(t => t.id as string));
			}

			if (this.toolIds().length > 0) {
				const [tools, vehicles] = await this.parentViewModel.loadTools(this.toolIds());
				await this.parentViewModel.scheduler().resourceStore.addAsync([...tools, ...vehicles]);

				window.Helper.Scheduler.Profile.AddResourceToProfile(this.parentViewModel.profile(), ...[...tools, ...vehicles].map(t => t.id as string));
			}

			await this.parentViewModel.schedulerComponent().reloadDateRange();
			this.loading(false);
			$(".modal:visible").modal("hide");
		} catch (e) {
			this.loading(false);
			window.swal(window.Helper.String.getTranslatedString("Error"), (e as Error).message, "error");
		}
	}

	OnResourceSelected(resource: Main.Rest.Model.Main_User | Crm.Article.Rest.Model.CrmArticle_Article): void {
		resource instanceof Crm.Article.Rest.Model.CrmArticle_Article ? this.addedTools.push(resource) : this.addedResources.push(resource);
	}
	async OnTeamSelected(team: Main.Rest.Model.Main_Usergroup): Promise<void> {
		this.addedResources(team?.Members.filter((m: Main.Rest.Model.Main_User) => !this.existingTechnicianResources().map(t => t.Id).includes(m.Id)) ?? []);
		this.userIds(team?.Members.filter((m: Main.Rest.Model.Main_User) => !this.existingTechnicianResources().map(t => t.Id).includes(m.Id)).map(m => m.Id) ?? []);
	}
	cancel(): void {
		$(".modal:visible").modal("hide");
	}
	resourceFilter(query: $data.Queryable<Main.Rest.Model.Main_User>, term: string) {
		let self = this;
		query = query.filter("!(it.Id in this.resources)", { resources: self.existingTechnicianResources().map(it => it.Id)});
		if (term) {
			query = query.filter("it.Id.contains(this.term)",	{ term: term });
		}
		return query
			.orderBy("it.LastName")
			.orderBy("it.FirstName");
	}
	toolFilter(query: $data.Queryable<Crm.Article.Rest.Model.CrmArticle_Article>, term: string) {
		let self = this;
		query = query.filter("!(it.Id in this.resources) && it.ArticleTypeKey in this.articleTypeKeys", { resources: self.existingToolResources().map(it => it.Id), articleTypeKeys: [ResourceType.Tool, ResourceType.Vehicle] });
		if (term) {
			query = query.filter("it.ItemNo.contains(this.term) || it.Description.contains(this.term)",	{ term: term });
		}
		return query.orderBy("it.ItemNo");
	}
	userGroupFilter(query: $data.Queryable<Main.Rest.Model.Main_Usergroup>, term: string) {
		let self = this;
		query = query.filter("it => !it.Members.every(m => m.Id in this.users)", { users: self.existingTechnicianResources().map(t => t.Id)});
		if (term) {
			query = query.filter("it.Name.contains(this.term)",	{ term: term });
		}
		return query.orderBy("it.Name");
	}
	mapToolsForSelect2Display(tool: Crm.Article.Rest.Model.CrmArticle_Article) {
		return {
			id: tool.Id,
			item: tool,
			text: HelperArticle.getArticleAutocompleteDisplay(tool)
		};
	}
	mapUsersForSelect2Display(user: Main.Rest.Model.Main_User): Select2AutoCompleterResult {
		let text = `${window.Helper.User.getDisplayName(user)}`;
		if(user.Discharged) {
			text = text.concat(` - (${window.Helper.String.getTranslatedString('Inactive')})`);
		}
		return {
			id: user.Id,
			item: user,
			text: text
		};
	}
}

namespace("Sms.Scheduler.ViewModels").SchedulerAddResourceModalViewModel = SchedulerAddResourceModalViewModel;