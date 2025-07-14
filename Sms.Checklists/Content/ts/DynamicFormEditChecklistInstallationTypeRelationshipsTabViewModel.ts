///<reference path="../../../../Content/@types/index.d.ts" />
///<reference path="../../../../Plugins/Crm.DynamicForms/Content/ts/DynamicFormEditViewModel.ts" />
import {namespace} from "../../../../Content/ts/namespace";
import type {DynamicFormEditViewModel} from "../../../Crm.DynamicForms/Content/ts/DynamicFormEditViewModel";

class DynamicFormEditChecklistInstallationTypeRelationshipsTabViewModel extends window.Main.ViewModels.ViewModelBase {
	checklistInstallationTypeRelationship = ko.observable<Sms.Checklists.Rest.Model.ObservableSmsChecklists_ChecklistInstallationTypeRelationship>(null);
	checklistInstallationTypeRelationships = ko.observableArray<Sms.Checklists.Rest.Model.ObservableSmsChecklists_ChecklistInstallationTypeRelationship>([]);
	form = ko.observable<Crm.DynamicForms.Rest.Model.ObservableCrmDynamicForms_DynamicForm>(null);

	constructor() {
		super();
	}

	async init(parentViewModel: DynamicFormEditViewModel): Promise<void> {
		this.form(parentViewModel.form());
		this.createRelationship();
		let checklistInstallationTypeRelationships = await window.database.SmsChecklists_ChecklistInstallationTypeRelationship.filter("it.DynamicFormKey === this.dynamicFormKey", {dynamicFormKey: parentViewModel.form().Id()}).toArray();
		this.checklistInstallationTypeRelationships(checklistInstallationTypeRelationships.map(x => {
			window.database.attachOrGet(x);
			return x.asKoObservable();
		}));
		parentViewModel.lookups.installationTypes = {$tableName: "CrmService_InstallationType"};
		parentViewModel.lookups.serviceOrderTypes = {$tableName: "CrmService_ServiceOrderType"};
		await window.Helper.Lookup.getLocalizedArrayMaps(parentViewModel.lookups);
	}

	addRelationship() {
		let errors = ko.validation.group(this.checklistInstallationTypeRelationship, {deep: true});
		if (errors().length > 0) {
			errors.scrollToError();
			errors.showAllMessages();
			return;
		}
		window.database.add(this.checklistInstallationTypeRelationship().innerInstance);
		this.checklistInstallationTypeRelationships.push(this.checklistInstallationTypeRelationship());
		this.createRelationship();
	}

	createRelationship() {
		const checklistInstallationTypeRelationship = window.database.SmsChecklists_ChecklistInstallationTypeRelationship.defaultType.create();
		checklistInstallationTypeRelationship.DynamicFormKey = this.form().Id();
		this.checklistInstallationTypeRelationship(checklistInstallationTypeRelationship.asKoObservable());
		this.checklistInstallationTypeRelationship().InstallationTypeKey.extend({
			required: {
				message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("InstallationTypeKey")),
				params: true
			}
		});
		this.checklistInstallationTypeRelationship().ServiceOrderTypeKey.extend({
			required: {
				message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}", window.Helper.String.getTranslatedString("ServiceOrderTypeKey")),
				params: true
			}
		});
		this.checklistInstallationTypeRelationship.extend({
			validation: {
				validator: (val) => {
					let relationShipAlreadyExisting = this.checklistInstallationTypeRelationships().some(x => x.InstallationTypeKey() === val.InstallationTypeKey() && x.ServiceOrderTypeKey() === val.ServiceOrderTypeKey());
					return !relationShipAlreadyExisting;
				},
				message: window.Helper.String.getTranslatedString("RelationshipAlreadyExisting")
			}
		})
	}

	removeRelationship(relationship) {
		window.database.remove(relationship.innerInstance);
		this.checklistInstallationTypeRelationships.remove(relationship);
	}
}

namespace("Crm.DynamicForms.ViewModels").DynamicFormEditChecklistInstallationTypeRelationshipsTabViewModel = DynamicFormEditChecklistInstallationTypeRelationshipsTabViewModel;