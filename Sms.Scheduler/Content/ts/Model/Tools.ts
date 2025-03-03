import {ResourceModel} from "@bryntum/schedulerpro";
import { LazyOfTTMetadata } from "../Lazy";
import { ResourceType } from "./Technicians";
import _ from "lodash";

export class Tool extends ResourceModel {
	static readonly lookups: LookupType = {};
	static get $name() {
		return 'Tool';
	}	
	static get $type() {
		return ResourceType.Tool;
	}
	
	OriginalData: Crm.Article.Rest.Model.CrmArticle_Article;
	AssignedUsers: Crm.Article.Rest.Model.CrmArticle_ArticleUserRelationship[];
	DisplayName: string;
	readonly type = ResourceType.Tool;
	_Skills: LazyOfTTMetadata<any, string[]> = null;
	_Assets: LazyOfTTMetadata<any, string[]> = null;
	_Stations: LazyOfTTMetadata<any, string> = null;
	Teams: string[] = undefined;

	get ResourceType() {
		return this.type;
	}

	get Assets(): Main.Rest.Model.Lookups.Main_Asset[] {
		let keys = this.OriginalData.RequiredAssetKeys;
		if (this._Assets == null || !_.isEqual(this._Assets.Metadata, keys)) {
			this._Assets = new LazyOfTTMetadata(() => keys.map(key => window.Helper.Scheduler.CreateLookupProxy(Tool.lookups.assets, key)), keys);
		}
		return this._Assets.value;
	}
	get Skills(): Main.Rest.Model.Lookups.Main_Skill[] {
		let keys = this.OriginalData.RequiredSkillKeys;
		if (this._Skills == null || !_.isEqual(this._Skills.Metadata, keys)) {
			this._Skills = new LazyOfTTMetadata(() => keys.map(key => window.Helper.Scheduler.CreateLookupProxy(Tool.lookups.skills, key)), keys);
		}
		return this._Skills.value;
	}

	get Stations(): Crm.Rest.Model.Crm_Station[] {
		let key = this.OriginalData.StationKey;
		if (this._Stations == null || this._Stations.Metadata != key) {
			this._Stations = new LazyOfTTMetadata(() => {
				if (this.OriginalData.Station) {
					return [new Proxy(this.OriginalData.Station, {
						get: function (target, prop, receiver) {
							if (prop === 'toString') {
								return () => window.Helper.Station.getDisplayName(target);
							}
							// @ts-ignore
							return Reflect.get(...arguments);
						}
					})];
				} else {
					return undefined;
				}
			}, key);
		}
		return this._Stations.value;
	}

	constructor(data, imageUrl) {
		super();
		this.OriginalData = data;
		this.DisplayName = this.OriginalData.ItemNo + " - " + this.OriginalData.Description;

		if (imageUrl) {
			this.imageUrl = imageUrl;
		}
	}
	static get fields() {
		return [
			{ name: 'OriginalData', type: 'object'},
			{ name: 'id', dataSource: 'OriginalData.Id', type: 'string'},
			{ name: 'name', dataSource: 'OriginalData.Description', type: 'string'},
			{ name: 'ResourceKey', type: 'string', dataSource: 'OriginalData.Id' },
			{ name: 'ItemNo', type: 'string', dataSource: 'OriginalData.ItemNo' },
			{ name: 'Description', type: 'string', dataSource: 'OriginalData.Description' },
		]
	}
}