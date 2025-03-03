/// <reference lib="es2021.weakref" />
/// <reference lib="es2022.array" />
/// <reference path="es2023.array.d.ts" />
/// <reference path="esnext.collection.d.ts" />

import type { Tool } from "../ts/Model/Tools";
import type { Vehicle } from "../ts/Model/Vehicle";
import type { Technician } from "../ts/Model/Technicians";
import type { HelperScheduler } from "../ts/Helper/Helper.Scheduler";
import { SchedulerAddResourceModalViewModel as SchedulerAddResourceModalViewModelType } from "../ts/Modals/SchedulerAddResourceModalViewModel";
import { SchedulerDetailsViewModel as SchedulerDetailsViewModelType } from "../ts/SchedulerDetailsViewModel";
import { SchedulerEditModalViewModel as SchedulerEditModalViewModelType } from "../ts/Modals/SchedulerEditModalViewModel";
import { SchedulerLoadProfileModalViewModel as SchedulerLoadProfileModalViewModelType } from "../ts/Modals/SchedulerLoadProfileModalViewModel";
import { SchedulerAdHocModalViewModel as SchedulerAdHocModalViewModelType } from "../ts/Modals/SchedulerAdHocModalViewModel";
import { SchedulerAddProfileModalViewModel as SchedulerAddProfileModalViewModelType } from "../ts/Modals/SchedulerAddProfileModalViewModel";
import { SchedulerEditProfileModalViewModel as SchedulerEditProfileModalViewModelType } from "../ts/Modals/SchedulerEditProfileModalViewModel";
import { SchedulerGetRouteModalViewModel as SchedulerGetRouteModalViewModelType } from "../ts/Modals/SchedulerGetRouteModalViewModel";
import { SchedulerMapViewModel as SchedulerMapViewModelType } from "../ts/SchedulerMapViewModel";
import { SchedulerResourceReorderModalViewModel as SchedulerResourceReorderModalViewModelType } from "../ts/Modals/SchedulerResourceReorderModalViewModel";
import type {MapMarkerType} from "../ts/Model/MapMessage";

declare global {
	type ResourceTypes = Technician | Tool | Vehicle;
	namespace Sms {
		namespace Scheduler {
			namespace ViewModels {
				let SchedulerDetailsViewModel: SchedulerDetailsViewModelType;
				let SchedulerEditModalViewModel: SchedulerEditModalViewModelType;
				let SchedulerAddResourceModalViewModel: SchedulerAddResourceModalViewModelType;
				let SchedulerLoadProfileModalViewModel: SchedulerLoadProfileModalViewModelType;
				let SchedulerAddProfileModalViewModel: SchedulerAddProfileModalViewModelType;
				let SchedulerEditProfileModalViewModel: SchedulerEditProfileModalViewModelType;
				let SchedulerAdHocModalViewModel: SchedulerAdHocModalViewModelType;
				let SchedulerGetRouteModalViewModel: SchedulerGetRouteModalViewModelType;
				let SchedulerMapViewModel: SchedulerMapViewModelType;
				let SchedulerResourceReorderModalViewModel: SchedulerResourceReorderModalViewModelType;
			}
			namespace Settings {
				namespace DashboardCalendar {
					let ShowAbsencesInCalendar: boolean;
				}
				namespace WorkingTime {
					let FromDay: number;
					let ToDay: number;
					let FromHour: number;
					let ToHour: number;
					let MinutesInterval: number;
					let IgnoreWorkingTimesInEndDateCalculation: string;
				}
				let ServiceOrderZipCodeAreaLength: number;
				let DispatchesAfterReleaseAreEditable: string;
			}
		}
	}
	namespace Helper {
		let Scheduler: typeof HelperScheduler;
	}

	// Type definitions for bindingEvent of Knockout v3.5.0 which is not available in the solutions knockout type definition file Knockout v3.4.0
	interface KnockoutStatic {
		bindingEvent: {
			subscribe(node: Node, event: "childrenComplete" | "descendantsComplete", callback: (node: Node) => void, callbackContext?: any): Subscription;
		}
	}
}

interface Subscription {
	dispose(): void;
	disposeWhenNodeIsRemoved(node: Node): void;
}

type ComboItem =	{
		text: string,
		color: string 
	} & (StatusItem | EntityStateItem)

type StatusItem = {
	type: 'Status',
	value: string
}
type EntityStateItem = {
	type: 'EntityState',
	value: number,
	border: string
}

type ClusterGroup = {
	title: string,
	markerTypes: MapMarkerType[]
}

export type groupedGridData<T> = {
	name: string,
	expanded: boolean,
	children: groupedGridData<T>[] | T[]
}