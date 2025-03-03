//@ts-nocheck
import {CrudManager, CrudManagerConfig} from "@bryntum/schedulerpro";
import {CrmAssignmentStore} from "./AssignmentStore";
import { StoreIds } from "./DispatchStore";
export class CrmCrudManager extends CrudManager {
	static get $name() {
		return 'CrmCrudManager';
	}
	static get $type() {
		return 'CrmCrudManager';
	}
	static get defaultConfig(): Partial<CrudManagerConfig> {
		return {
			autoSync: true,
			autoLoad: false,
			transport       : {
				sync : {
					url : '~/api/$batch'
				}
			}
		}
	}
	context: any = null;
	attachToStore: WeakSet<any>;
	detachFromStore: WeakSet<any>;
	constructor(config: Partial<CrudManagerConfig> & { context: any }, attachToStore: WeakSet<any>, detachFromStore: WeakSet<any>) {
		super(config);
		this.context = config.context;
		this.on({
			thisObj: this,
			beforeSync: this.beforeSync
		});

		this.attachToStore = attachToStore;
		this.detachFromStore = detachFromStore;
	}
	beforeSync({source, type, eventName}): boolean {
		return true;
	}
	
	prepareData(storeId:string) {
		let self = this;
		let store = self.getCrudStore(storeId);
		store.added?.forEach((transientItem) => {
			if (this.attachToStore.delete(transientItem)) {
				return;
			}

			window.database.add(transientItem.OriginalData);
		});
		store.modified?.forEach((transientItem) => {
			//Ignore attach if the only changes are parentIndex and orderedParentIndex
			if (transientItem?.meta?.modified && Object.keys(transientItem.meta.modified).every(k => ['parentIndex', 'orderedParentIndex'].includes(k))) {
				return;
			}

			window.database.attachOrGet(transientItem.OriginalData);
		});
		store.removed?.forEach((transientItem) => {
			if (this.detachFromStore.delete(transientItem)) {
				return;
			}

			window.database.remove(transientItem.OriginalData);
		});
	}

	sync() {
		let self = this;
		if (!self.crudStoreHasChanges()) {
			return new Promise((resolve, reject) => {
				self.trigger("syncCanceled");
				reject({ cancelled: true });
			});
		}
		self.clearTimeout("autoSync");
		if (self.activeRequests.sync) {
			self.trigger("syncDelayed");
			return self.activeSyncPromise = self.activeSyncPromise.finally(() => self.sync());
		}
		return self.activeSyncPromise = new Promise((resolve, reject) => {
			self.trigger("syncStart");
			self.activeRequests.sync = true;
			if (self.crudStoreHasChanges(StoreIds.DispatchStore)) {
				self.prepareData(StoreIds.DispatchStore);
			}
			if(self.crudStoreHasChanges(StoreIds.AssignmentStore)) {
				self.prepareData(StoreIds.AssignmentStore);
			}
			if(self.trigger("beforeSync") !== false) {
				self.context.parentViewModel.syncWasOff(false);
				return window.database.saveChanges().then((data) => {
					resolve(data);
				});
			} else {
				self.trigger("syncCanceled");
				reject({ cancelled: true });
			}
		}).finally(() => {
			if(self.crudStoreHasChanges()) {
				self.acceptChanges();
				self.activeRequests['sync'] = null;
			}
			self.trigger("save");
		}).catch((error) => {
			if (error && !error.cancelled) {
				window.Log.error(error);
				throw error;
			}
			return error;
		});
	}
}
CrmCrudManager.initClass();