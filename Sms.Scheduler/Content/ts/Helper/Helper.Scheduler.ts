import {Popup, StringHelper} from "@bryntum/schedulerpro";
import {Absence, Dispatch, SchedulerEvent, SchedulerEventType} from "../Model/Dispatch";
import type { HourSpan } from "../Model/HourSpan";
import {ResourceType, Technician} from "../Model/Technicians";
import {OrderType, ServiceOrder} from "../Model/ServiceOrder";
import type {Timeline} from "../Timeline";
import type {ClusterGroup, ComboItem, groupedGridData} from "../../@types";
import type { Assignment } from "../Model/Assignment";
import moment from "moment";
import {MapMarkerType} from "../Model/MapMessage";
import type { Tool } from "../Model/Tools";
import type { Vehicle } from "../Model/Vehicle";

type groupedData<T> = {
	[key : string]: groupOf<T>
};

type groupOf<T> = {
	key: any,
	stringKeyValue: string,
	items: T[] | groupedData<T>
}

export class HelperScheduler {
	static createEvent(order, resource, date, duration: moment.Duration) {
		duration = moment.duration(duration.asMinutes(), "minutes");

		if(order.type == OrderType.ServiceOrder && resource.type == ResourceType.Technician) {
			let dispatch = window.database.CrmService_ServiceOrderDispatch.defaultType.create();
			dispatch.Id = window.$data.createGuid().toString().toLowerCase();
			dispatch.OrderId = order.OriginalData.Id;
			dispatch.StatusKey = "Scheduled";
			dispatch.Username = resource.ResourceKey;
			dispatch.Date = window.moment(date).utc(true).toDate();
			dispatch.EndDate = window.moment(date).add(duration).utc(true).toDate();
			dispatch.NetWorkMinutes = duration.asMinutes();
			return new Dispatch(undefined, undefined, { type: SchedulerEventType.Dispatch, data: dispatch, serviceOrder: order as ServiceOrder });
		} else if (order.type == OrderType.AbsenceOrder || order.type == OrderType.ArticleDowntime) {
			let absence: Sms.Scheduler.Rest.Model.SmsScheduler_Absence | Crm.Article.Rest.Model.CrmArticle_ArticleDowntime;
			if(resource.type == ResourceType.Technician) {
				absence = window.database.SmsScheduler_Absence.defaultType.create();
				absence.Id = window.$data.createGuid().toString().toLowerCase();
				absence.TimeEntryTypeKey = order.OriginalData.Key;
				absence.ResponsibleUser = resource.ResourceKey;
			} else if (resource.type == ResourceType.Tool || resource.type == ResourceType.Vehicle) {
				absence = window.database.CrmArticle_ArticleDowntime.defaultType.create();
				absence.Id = window.$data.createGuid().toString().toLowerCase();
				absence.ArticleKey = resource.ResourceKey;
				absence.DowntimeReasonKey = order.OriginalData.Key;
			}
			absence.From = moment(date).local(true).toDate();
			absence.To = moment(absence.From).add(duration).toDate();
			
			return new Absence(undefined, undefined, { type: SchedulerEventType.Absence, data: absence, typeData: order.OriginalData as (Crm.PerDiem.Rest.Model.Lookups.CrmPerDiem_TimeEntryType | Crm.Article.Model.Lookups.CrmArticle_ArticleDowntimeReason) });
		} else {
			throw new Error(`Couldn't create event with arguments: ${order}, ${resource}, ${date}`);
		}
	}

	/**
	 * This function is called during the drag and drop process and also when calculating which resources to highlight as possible drop targets.
	 * @param {Technician} technician The `Technician` we are checking if it has the necessary `Skills`
	 * @param {Crm.Service.Rest.Model.CrmService_ServiceOrderHead} serviceOrder The `ServiceOrder` we are validating against
	 * @param {Date} startDate The event's startDate during drag'n'drop or the timelines' startDate for highlight
	 * @param {Date} endDate The event's endDate during drag'n'drop or the timelines' endDate for highlight
	 * @returns {boolean} `true` if the technician has at least one of the required skills for the Order, `false` if it does not.
	 */
	static hasSkillsForOrder(technician: Technician, serviceOrder: Crm.Service.Rest.Model.CrmService_ServiceOrderHead, startDate: Date, endDate: Date, missings: string[] = null) : boolean {
		if(serviceOrder.RequiredSkillKeys?.length == 0) return true;
		if (technician.UserSkills?.length == 0) {
			if (missings) {
				missings.push(...serviceOrder.RequiredSkillKeys);
			}
			return false;
		}
		
		let validSkillsAtDate = [];
		technician.UserSkills?.forEach(s => {
			if(s.ValidFrom == null && s.ValidTo == null) {
				validSkillsAtDate.push(s.SkillKey);
			} else if(s.ValidFrom != null && s.ValidTo == null && window.moment(startDate).isSameOrAfter(s.ValidFrom, 'day')) {
				validSkillsAtDate.push(s.SkillKey);
			} else if(s.ValidFrom == null && s.ValidTo != null && window.moment(endDate).isSameOrBefore(s.ValidTo, 'day')) {
				validSkillsAtDate.push(s.SkillKey);
			} else if(s.ValidFrom != null && s.ValidTo != null && window.moment(startDate).isSameOrAfter(s.ValidFrom, 'day') && window.moment(endDate).isSameOrBefore(s.ValidTo, 'day')) {
				validSkillsAtDate.push(s.SkillKey);
			}
		});

		if (missings) {
			const requiredButMissing = window._.difference(serviceOrder.RequiredSkillKeys, validSkillsAtDate);
			missings.push(...requiredButMissing);
		}

		return window._.intersection(serviceOrder.RequiredSkillKeys, validSkillsAtDate).length > 0;
	}
	/**
	 * This function is called during the drag and drop process and also when calculating which resources to highlight as possible drop targets.
	 * @param {Technician} technician The `Technician` we are checking if it has the necessary `Assets`
	 * @param {Crm.Service.Rest.Model.CrmService_ServiceOrderHead} serviceOrder The `ServiceOrder` we are validating against
	 * @param {Date} startDate The event's startDate during drag'n'drop or the timelines' startDate for highlight
	 * @param {Date} endDate The event's endDate during drag'n'drop or the timelines' endDate for highlight
	 * @returns {boolean} `true` if the technician has at least one of the required assets for the Order, `false` if it does not.
	 */
	static hasAssetsForOrder(technician: Technician, serviceOrder: Crm.Service.Rest.Model.CrmService_ServiceOrderHead, startDate: Date, endDate: Date, missings: string[] = null) : boolean {
		if(serviceOrder.RequiredAssetKeys?.length == 0) return true;
		if (technician.UserAssets?.length == 0) {
			if (missings) {
				missings.push(...serviceOrder.RequiredAssetKeys);
			}
			return false;
		}
		
		let validAssetsAtDate = [];		
		technician.UserAssets?.forEach(a => {
			if(a.ValidFrom == null && a.ValidTo == null) {
				validAssetsAtDate.push(a.AssetKey);
			} else if(a.ValidFrom != null && a.ValidTo == null && window.moment(startDate).isSameOrAfter(a.ValidFrom, 'day')) {
				validAssetsAtDate.push(a.AssetKey);
			} else if(a.ValidFrom == null && a.ValidTo != null && window.moment(endDate).isSameOrBefore(a.ValidTo, 'day')) {
				validAssetsAtDate.push(a.AssetKey);
			} else if(a.ValidFrom != null && a.ValidTo != null && window.moment(startDate).isSameOrAfter(a.ValidFrom, 'day') && window.moment(endDate).isSameOrBefore(a.ValidTo, 'day')) {
				validAssetsAtDate.push(a.AssetKey);
			}
		});

		if (missings) {
			const requiredButMissing = window._.difference(serviceOrder.RequiredAssetKeys, validAssetsAtDate);
			missings.push(...requiredButMissing);
		}

		return window._.intersection(serviceOrder.RequiredAssetKeys, validAssetsAtDate).length > 0;
	}

	static isValidForResource(order, resource): boolean {
		// window.Log.debug(`Order type: ${order.type}`);
		// window.Log.debug(`Resource type: ${resource.type}`);
		if(order instanceof Crm.Service.Rest.Model.CrmService_ServiceOrderHead && resource instanceof Main.Rest.Model.Main_User) return true;
		if(order instanceof Crm.PerDiem.Rest.Model.Lookups.CrmPerDiem_TimeEntryType && resource instanceof Main.Rest.Model.Main_User) return true;
		if(order instanceof Crm.Article.Model.Lookups.CrmArticle_ArticleDowntimeReason && resource instanceof Crm.Article.Rest.Model.CrmArticle_Article) return true;
		
		return false;
	}
	
	static async groupBy<T>(data: T[], groupKeys: string[]): Promise<groupedData<T> | T[]> {
		let key = groupKeys[0];
		if (!key) return data;
		const result = {} as groupedData<T>;

		for (const item of data) {
			let keyValue = item[key];
			let stringKeyValue: string;

			if (keyValue instanceof Promise)
				keyValue = await keyValue;

			if (keyValue instanceof Date) {
				let dateMoment = window.moment(keyValue).startOf('day');
				keyValue = dateMoment.toDate();
				stringKeyValue = dateMoment.format("L");
			} else if (typeof keyValue == "undefined" || keyValue == null || keyValue == "") {
				keyValue = null;
				stringKeyValue = `${window.Helper.String.getTranslatedString("Unspecified")} (${window.Helper.String.getTranslatedString(key)})`;
			} else if (typeof keyValue == "object" && keyValue?.SortOrder === Number.MAX_SAFE_INTEGER) {
				keyValue = { ...keyValue, 'toString': () => `${window.Helper.String.getTranslatedString("Unspecified")} (${window.Helper.String.getTranslatedString(key)})` };
				stringKeyValue = keyValue.toString();
			} else {
				stringKeyValue = keyValue.toString();
			}

			const group = result[stringKeyValue] ??= { key: keyValue, stringKeyValue, items: [] };
			(group.items as T[]).push(item);
		}

		if (groupKeys.length > 1) {
			groupKeys = groupKeys.slice(1);
			for (let g in result) {
				let group = result[g];
				group.items = await this.groupBy(group.items as T[], groupKeys);
			}
		}
		return result;
	}
	
	static toGridData<T>(groups: groupedData<T> | T[], level: number): groupedGridData<T>[] | T[] {
		if (level == 0) {
			if (Array.isArray(groups)) {
				if (groups.length > 1) {
					groups.sort(__sort);
				}
				return groups;
			}
			throw new Error("toGridData should return an array in level 0.");
		} else {
			let groupsArray = Object.entries(groups as groupedData<T>).map(([, group]) => group);
			groupsArray.sort((a, b) => __sort(a.key, b.key));

			let subgroups = groupsArray.map(group => ({
				name: group.stringKeyValue ?? window.Helper.String.getTranslatedString("Unspecified"),
				expanded: false,
				children: window.Helper.Scheduler.toGridData(group.items, level - 1)
			}));

			return subgroups;
		}

		function __sort(a, b) {
			if (typeof a === 'undefined' || a == null) return 1;
			if (typeof b === 'undefined' || b == null) return -1;

			let aHasSortOrder = typeof a === 'object' && Reflect.has(a, "SortOrder");
			let bHasSortOrder = typeof b === 'object' && Reflect.has(b, "SortOrder");

			if (!aHasSortOrder && bHasSortOrder) return 1;
			if (aHasSortOrder && !bHasSortOrder) return -1;
			if (aHasSortOrder && bHasSortOrder && a.SortOrder != b.SortOrder) {
				return a.SortOrder - b.SortOrder;
			}

			if (typeof a === 'number' && typeof b === 'number') return a - b;
			if (typeof a === 'boolean' && typeof b === 'boolean') return Number(b) - Number(a);
			if (a instanceof Date && b instanceof Date) return b.getTime() - a.getTime();

			return a.toString().localeCompare(b.toString());
		}
	}

	static Tooltips = class {
		static GetPropertyValue(context: object, propertyPath: string): any {
			if (propertyPath !== "#") {
				let propertyParts = propertyPath.split(".");

				let current = context;
				for (let property of propertyParts) {
					if (current && property in current) {
						current = current[property];
					} else {
						current = undefined;
						break;
					}
				}

				return (current !== undefined && current !== null) ? current : null;
			} else {
				return null;
			}
		}

		static GetPropertyTranslation(propertyName: string, root: string = null): string {
			let result = "";

			if (propertyName !== "#.#") {
				let splitPropertyName = propertyName.split(".");

				if (splitPropertyName.length != 2) {
					throw new Error("propertyName must be in 'a.b' format.");
				}

				if (splitPropertyName[0] != root) {
					result = `${window.Helper.getTranslatedString(splitPropertyName[0])} - `;
				}

				result += `${window.Helper.getTranslatedString(splitPropertyName[splitPropertyName.length - 1])}`;
			} else {
				result = window.Helper.getTranslatedString(propertyName);
			}

			return result;
		}

		static async BuildTooltip(context: object, properties: string | string[], root: string = null) {
			let props: string[];
			if (typeof properties === 'string') {
				props = properties.split(";").filter(p => p);
			}
			else {
				props = properties
			}

			let tooltip: string[] = [];
			tooltip.push("<dl class='scheduler-tooltip'>");

			for (let prop of props) {
				if (window.Helper.String.isNullOrEmpty(prop)) continue;

				if (prop !== "#.#") {
					let value = this.GetPropertyValue(context, prop);

					if (value instanceof Promise)
						value = await value;

					if ((typeof value !== 'undefined') && value !== null && (!Array.isArray(value) || value.length > 0)) {
						if (value instanceof Date) {
							value = window.Globalize.formatDate(value, { datetime: "medium" });
						} else if (prop.includes('CreateUser') || prop.includes('ModifyUser') || prop.includes('Username')) {
							const user = await window.database.Main_User.filter("it.Id == this.userId", { userId: value.toString() }).toArray();
							value = user.length > 0 ? window.Helper.User.getDisplayName(user[0]) : value.toString();
						} else if (Array.isArray(value)) {
							value = value.join(", ");
						} else {
							value = value.toString();
						}
					} else {
						value = window.Helper.String.getTranslatedString("Unspecified");
					}
					const propTitle = this.GetPropertyTranslation(prop, root);

					tooltip.push("<dt>");
					tooltip.push(StringHelper.encodeHtml(propTitle));
					tooltip.push(":</dt>");
					tooltip.push("<dd>");
					tooltip.push(StringHelper.encodeHtml(value));
					tooltip.push("</dd>");
				} else {
					tooltip.push("<div style='height:0.5em;'>&nbsp;</div>");
				}
			}

			tooltip.push("</dl>");

			return tooltip.join("");
		}
	}

	public static CreateLookupProxy(lookup: any, lookupKey: string, stringFieldNameOrHandler: string | ProxyHandler<any> = "Value") {
		if (lookupKey) {
			const lu = lookup[lookupKey];
			if (lu) {
				const handler = typeof stringFieldNameOrHandler === "string" ? window.Helper.Scheduler.toStringHandler(stringFieldNameOrHandler) : stringFieldNameOrHandler;
				return new Proxy(lu, handler);
			}
		}
		return {
			toString: () => window.Helper.String.getTranslatedString("Unspecified"),
			SortOrder: Number.MAX_SAFE_INTEGER
		};
	}

	private static toStringHandler(stringFieldName: string): ProxyHandler<any> {
		return {
			get: function (target, prop, receiver) {
				if (prop === 'toString') {
					return () => target[stringFieldName];
				}
				// @ts-ignore
				return Reflect.get(...arguments);
			}
		};
	}

	static WorkingHours = class {
		static getOtherHours(inputHours: HourSpan[]): HourSpan[] {
			let result: HourSpan[] = [];

			let from = 0;
			let inputIndex = 0;

			do {
				let to: number;

				if (inputIndex < inputHours.length) {
					to = inputHours[inputIndex].from;
				}
				else {
					to = 24;
				}

				if (from != to) {
					result.push({ from, to });
				}

				if (inputIndex < inputHours.length) {
					from = inputHours[inputIndex].to;
					inputIndex++;
				} else {
					from = 24;
				}

			} while (from < 24);

			return result;
		}

		static getProfileHours(profile: Sms.Scheduler.Rest.Model.SmsScheduler_Profile) {
			let nonWorkingHours: HourSpan[] = [];
			let workingHours: HourSpan[] = [];
			if (profile.ClientConfig.NonWorkingHours.length > 0) {
				nonWorkingHours = profile.ClientConfig.NonWorkingHours.map(h =>  { return { from: h.From, to: h.To } });
				workingHours = window.Helper.Scheduler.WorkingHours.getOtherHours(nonWorkingHours);
			}
			else {
				workingHours = [{
					//@ts-ignore
					from: parseInt(Sms.Scheduler.Settings.WorkingTime.FromHour),
					//@ts-ignore
					to: parseInt(Sms.Scheduler.Settings.WorkingTime.ToHour)
				}];
				nonWorkingHours = window.Helper.Scheduler.WorkingHours.getOtherHours(workingHours);
			}

			return { nonWorkingHours, workingHours }
		}
	}
	static ApplyRowState(scheduler: Timeline) {
		if (scheduler.rowHeight < 70) {
			//@ts-ignore
			scheduler.columns.records[0].showImage = false;
		} else if(scheduler.rowHeight >= 70) {
			//@ts-ignore
			scheduler.columns.records[0].showImage = true;
		}
		if (scheduler.rowHeight < 60) {
			//@ts-ignore
			scheduler.columns.records[0].showEventCount = false;
		} else if(scheduler.rowHeight >= 60) {
			//@ts-ignore
			scheduler.columns.records[0].showEventCount = true;
		}
		if (scheduler.rowHeight < 50) {
			//@ts-ignore
			scheduler.columns.records[0].showMeta = null;
		} else if(scheduler.rowHeight >= 50) {
			//@ts-ignore
			scheduler.columns.records[0].showMeta = window.Helper.Scheduler.GetMetaFunctionText;
		}
	}

	static GetMetaFunctionText(property) {
		let result = "";
		if (property.type == ResourceType.Technician) {
			const technician = property as Technician;
			if (technician.Skills && technician.Skills.length > 0) {
				result += `${window.Helper.String.getTranslatedString("Skills")}: `
				technician.Skills.forEach((skill, i) => {
					const userSkill = technician.UserSkills.find(s => s.SkillKey == skill.Key);
					// +1 for when ValidTo == new Date()
					const diffInDays = window.moment(userSkill.ValidTo).diff(new Date(), 'd') + 1;
					result += `${skill}${diffInDays < userSkill.DaysToNotifyBeforeExpiration ? `(${window.Helper.getTranslatedString("ExpireInDays").replace("{0}", diffInDays.toString())})` : ''} ${i < technician.Skills.length - 1 ? ', ' : ''}`
				});
				result += `\n`;
			}
			if (technician.Assets && technician.Assets.length > 0) {
				result += `${window.Helper.String.getTranslatedString("Assets")}: `
				technician.Assets.forEach((asset, i) => {
					const userAsset = technician.UserAssets.find(a => a.AssetKey == asset.Key);
					// +1 for when ValidTo == new Date()
					const diffInDays = window.moment(userAsset.ValidTo).diff(new Date(), 'd') + 1;
					result += `${asset}${diffInDays < userAsset.DaysToNotifyBeforeExpiration ? `(${window.Helper.getTranslatedString("ExpireInDays").replace("{0}", diffInDays.toString())})` : ''} ${i < technician.Assets.length - 1 ? ', ' : ''}`
				});
			}
		} else if (property.type == ResourceType.Tool || property.type == ResourceType.Vehicle) {
			const article = property as (Tool | Vehicle);
			if (article.Skills && article.Skills.length > 0) {
				result += `${window.Helper.String.getTranslatedString("Skills")}: ${article.Skills.join(", ")}`;
				result += `\n`;
			}
			if (article.Assets && article.Assets.length > 0) {
				result += `${window.Helper.String.getTranslatedString("Assets")}: ${article.Assets.join(", ")}`
			}
		}

		return result;
	}

	static GetTextColorForBackground(data: SchedulerEvent): object {
		function calculateTextColor() {
			const hexToRgb = (hex: string) => hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b)
				.substring(1).match(/.{2}/g)
				.map(x => parseInt(x, 16));

			const rgb = hexToRgb(data.Color);
			
			const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
			
			return luminance > 0.5 ? "#000000" : "#ffffff";
		}
		
		return {
			"background-color": data.Color,
			"color": calculateTextColor()
		};
	}
	static PlanningValidations = class {
		static displayWarningsAsTooltip(warningItems: string[]) {
			let listItems: string = "";
			for (const warningText of warningItems) {
				listItems += `<li>${warningText}</li>`;
			}
			return `<ul class="restriction-list">${listItems}</ul>`;
		}
		
		static GetPlanningValidationTooltipForOrder(serviceOrder: ServiceOrder, resource: Technician, startDate: Date, endDate: Date, resize: boolean = false): any[] {
			let warningItems = [];
			if (!resize && serviceOrder.PreferredTechnician != null && serviceOrder.PreferredTechnician != resource.ResourceKey)
			{
				warningItems.push(`${serviceOrder.name}: ${window.Helper.String.getTranslatedString('PreferredTechnicianWarning').replace("{0}", window.Helper.User.getDisplayName(serviceOrder.OriginalData.PreferredTechnicianUser))}`);
			}
			if (!resize && serviceOrder.PreferredUserGroup != null && !(resource as Technician).UserGroups.includes(serviceOrder.PreferredUserGroup)) 
			{
				warningItems.push(`${serviceOrder.name}: ${window.Helper.String.getTranslatedString('PreferredUserGroupWarning').replace("{0}", serviceOrder.PreferredUserGroup)}`);
			}
			if (serviceOrder.Planned != null 
				&& (window.moment(startDate).set({'h': 0, 'm': 0, 's': 0}).diff(window.moment(serviceOrder.Planned).set({'h': 0, 'm': 0, 's': 0}), "d") != 0
				|| window.moment(endDate).set({'h': 0, 'm': 0, 's': 0}).diff(window.moment(serviceOrder.Planned).set({'h': 0, 'm': 0, 's': 0}), "d") != 0))
			{
				warningItems.push(`${serviceOrder.name}: ${window.Helper.String.getTranslatedString('PlannedDateWarning').replace("{0}", window.moment(serviceOrder.Planned).format("ll"))}`);
			}
			if (serviceOrder.Deadline != null
				&& (window.moment(startDate).set({'h': 0, 'm': 0, 's': 0}).diff(window.moment(serviceOrder.Deadline).set({'h': 0, 'm': 0, 's': 0}), "d") > 0
				|| window.moment(endDate).set({'h': 0, 'm': 0, 's': 0}).diff(window.moment(serviceOrder.Deadline).set({'h': 0, 'm': 0, 's': 0}), "d") > 0)) 
			{
				warningItems.push(`${serviceOrder.name}: ${window.Helper.String.getTranslatedString('DeadlineWarning').replace("{0}", window.moment(serviceOrder.Deadline).format("ll"))}`);
			}
			
			return warningItems;
		}
		static GetPlanningValidationItemsForOrder(serviceOrder: ServiceOrder, resource: Technician, startDate: Date, endDate: Date, resourceChange: boolean = false): any[] {
			let validationItems = [];
			if (serviceOrder.PreferredTechnician != null && serviceOrder.PreferredTechnician != resource.ResourceKey) {
				validationItems.push({
					type: 'label',
					cls: 'scheduler-warning',
					text: `${serviceOrder.name}: ${window.Helper.String.getTranslatedString('PreferredTechnicianWarning').replace("{0}", window.Helper.User.getDisplayName(serviceOrder.OriginalData.PreferredTechnicianUser))}`,
					style: 'width: 100%',
				});
			}
			if (serviceOrder.PreferredUserGroup != null && !resource.UserGroups.includes(serviceOrder.PreferredUserGroup)) {
				validationItems.push({
					type: 'label',
					cls: 'scheduler-warning',
					text: `${serviceOrder.name}: ${window.Helper.String.getTranslatedString('PreferredUserGroupWarning').replace("{0}", serviceOrder.PreferredUserGroup)}`,
					style: 'width: 100%',
				});
			}
			if (!resourceChange && serviceOrder.Planned != null
				&& (window.moment(startDate).set({'h': 0, 'm': 0, 's': 0}).diff(window.moment(serviceOrder.Planned).set({'h': 0, 'm': 0, 's': 0}), "d") != 0 
					|| window.moment(endDate).set({'h': 0, 'm': 0, 's': 0}).diff(window.moment(serviceOrder.Planned).set({'h': 0, 'm': 0, 's': 0}), "d") != 0)) {
				validationItems.push({
					type: 'label',
					cls: 'scheduler-warning',
					text: `${serviceOrder.name}: ${window.Helper.String.getTranslatedString('PlannedDateWarning').replace("{0}", window.moment(serviceOrder.Planned).format("ll"))}`,
					style: 'width: 100%',
				});
			}
			if (!resourceChange && serviceOrder.Deadline != null
				&& (window.moment(startDate).set({'h': 0, 'm': 0, 's': 0}).diff(window.moment(serviceOrder.Deadline).set({'h': 0, 'm': 0, 's': 0}), "d") > 0
					|| window.moment(endDate).set({'h': 0, 'm': 0, 's': 0}).diff(window.moment(serviceOrder.Deadline).set({'h': 0, 'm': 0, 's': 0}), "d") > 0))  {
				validationItems.push({
					type: 'label',
					cls: 'scheduler-warning',
					text: `${serviceOrder.name}: ${window.Helper.String.getTranslatedString('DeadlineWarning').replace("{0}", window.moment(serviceOrder.Deadline).format("ll"))}`,
					style: 'width: 100%',
				});
			}

			const missingAssetKeys: string[] = [];
			window.Helper.Scheduler.hasAssetsForOrder((resource as Technician), serviceOrder.OriginalData, startDate, endDate, missingAssetKeys)

			if (missingAssetKeys.length > 0) {
				const missingAssets = Array.from(new Set(missingAssetKeys)).map(key => window.Helper.Scheduler.CreateLookupProxy(ServiceOrder.lookups.assets, key));

				validationItems.push({
					type: 'label',
					cls: 'scheduler-warning',
					text: `${serviceOrder.name}: ${window.Helper.String.getTranslatedString("TechnicianLacksSomeOfRequiredOrderAssets")
						.replace("{0}", window.Helper.User.getDisplayName(resource.OriginalData))
						.replace("{1}", missingAssets.join())}`,
					style: 'width: 100%',
				});
			}

			const missingSkillKeys: string[] = [];
			window.Helper.Scheduler.hasSkillsForOrder((resource as Technician), serviceOrder.OriginalData, startDate, endDate, missingSkillKeys)

			if (missingSkillKeys.length > 0) {
				const missingSkills = Array.from(new Set(missingSkillKeys)).map(key => window.Helper.Scheduler.CreateLookupProxy(ServiceOrder.lookups.skills, key));

				validationItems.push({
					type: 'label',
					cls: 'scheduler-warning',
					text: `${serviceOrder.name}: ${window.Helper.String.getTranslatedString("TechnicianLacksSomeOfRequiredOrderSkills")
						.replace("{0}", window.Helper.User.getDisplayName(resource.OriginalData))
						.replace("{1}", missingSkills.join())}`,
					style: 'width: 100%',
				});
			}
			
			return validationItems;
		}
	}
	static ShowPopup(items: any[], callbackConfirm: (() => (Promise<void>|void)) = null, callbackDiscard: (() => (Promise<void>|void)) = null, confirmText: string = null, cancelText: string = null) {
		const popup = new Popup({
			autoShow: true,
			centered: true,
			closable: false,
			modal: {
				closeOnMaskTap: false
			},
			width: '60em',
			minHeight: '10em',
			bbar: {
				items: {
					cancel: {
						text: cancelText ?? window.Helper.String.getTranslatedString('Discard'),
						minWidth: 100,
						onAction: async () => {
							await callbackDiscard?.();
							popup.close();
						}
					},
					close: {
						text: confirmText ?? window.Helper.String.getTranslatedString('Confirm'),
						minWidth: 100,
						cls: 'b-raised b-blue',
						onAction: async () => {
							await callbackConfirm?.();
							popup.close();
						}
					}
				}
			},
			items: items
		});

		return popup;
	}
	static InitComboLegendsItems(lookups: Crm.Service.Rest.Model.Lookups.CrmService_ServiceOrderDispatchStatus[]): ComboItem[] {
		let items: ComboItem[] = [];
		lookups.filter(status => status.Key != null).forEach(status => {
			items.push({
				type: 'Status',
				value: status.Key,
				text: status.Value,
				color: status.Color
			})
		});

		items.push({
			text: window.Helper.getTranslatedString('Absence'),
			value: 'Absence',
			color: '#fa825c',
			type: 'Status'
		});
		items.push({
			text: window.Helper.getTranslatedString('UnsavedChanges'),
			value: $data.EntityState.Modified,
			color: 'transparent',
			border: '1px dashed grey',
			type: 'EntityState'
		});
		
		return items;
	}

	static * SplitArray<T>(arr: T[], size: number) {
		for (let i = 0; i < arr.length; i += size) {
			yield arr.slice(i, i + size);
		}
	}

	static determineTeamLeader(dispatch: Dispatch, assignments: Pick<Assignment, "resource" | "resourceId">[], techniciansMap: Map<string, Technician> = null): string {
		if (dispatch == null) {
			throw new Error("cannot determine the team leader when the dispatch is null.");
		}
		if (assignments == null || assignments.length == 0) {
			throw new Error("cannot determine the team leader when there is no assignment.");
		}

		//If the map is not provided, create one from the assignments
		techniciansMap ??= new Map(assignments
			.filter(assignment => assignment.resource && assignment.resource.constructor === Technician)
			.map(assignment => [assignment.resourceId as string, assignment.resource as Technician]));

		if (techniciansMap.size == 0) {
			throw new Error("cannot determine the team leader when techniciansMap has no item.");
		}

		let teamLeader: string = dispatch.OriginalData.Username;

		if (assignments.every(a => a.resourceId !== teamLeader)) {
			const serviceOrder = dispatch.ServiceOrder;

			if (serviceOrder.PreferredTechnician && techniciansMap.has(serviceOrder.PreferredTechnician) && assignments.some(a => a.resourceId == serviceOrder.PreferredTechnician)) {
				//Found PreferredTechnician
				teamLeader = serviceOrder.PreferredTechnician;
			} else if (serviceOrder.PreferredUserGroup && assignments.some(a => techniciansMap.has(a.resourceId as string) && techniciansMap.get(a.resourceId as string).UserGroups.includes(serviceOrder.PreferredUserGroup))) {
				//Found PreferredUserGroup
				teamLeader = assignments.find(a => techniciansMap.get(a.resourceId as string).UserGroups.includes(serviceOrder.PreferredUserGroup)).resourceId as string;
			} else {
				//Found nothing special, picking the first technician
				teamLeader = assignments.find(a => techniciansMap.has(a.resourceId as string)).resourceId as string;
			}
		}

		return teamLeader;
	}

	static determineNewEventDuration(order: ServiceOrder, defaultDuration: moment.Duration, maximumDuration: moment.Duration, ignoreCalculatedDuration: boolean): moment.Duration {

		if (order instanceof ServiceOrder) {
			const plannedDuration = order.PlannedDuration ? window.moment.duration(order.PlannedDuration, "milliseconds") : null;

			if (plannedDuration != null) {
				if (maximumDuration != null && maximumDuration.valueOf() > 0 && ignoreCalculatedDuration && plannedDuration.asMinutes() > maximumDuration.asMinutes()) {
					return maximumDuration.clone();
				}

				return plannedDuration.clone();
			}
		}

		return defaultDuration.clone();
	}
	
	static Profile = class {
		static AddResourceToProfile(profile: Sms.Scheduler.Rest.Model.SmsScheduler_Profile, ...resourceIds: string[]): void {
			let i = 0;
			for (const resourceId of resourceIds) {
				const profileResource = window.database.SmsScheduler_ProfileResource.defaultType.create();
				profileResource.ProfileKey = profile.Id;
				profileResource.ResourceKey = resourceId;
				profileResource.SortOrder = profile.ResourceKeys.length + i++;
				window.database.add(profileResource);
			}

			profile.ResourceKeys.push(...resourceIds);
		}
	}
	
	static ClusterGroups(): ClusterGroup[] {
		return [
			{
				title: Helper.getTranslatedString("ServiceOrders"),
				markerTypes: [MapMarkerType.ServiceOrder]
			},
			{
				title: Helper.getTranslatedString("Dispatches"),
				markerTypes: [MapMarkerType.ServiceOrderDispatch]
			},
			{
				title: Helper.getTranslatedString("Resources"),
				markerTypes: [MapMarkerType.Resource]
			},
			{
				title: Helper.getTranslatedString("TechnicianHomeAddress"),
				markerTypes: [MapMarkerType.TechnicianHome]
			},
		]
	}
}