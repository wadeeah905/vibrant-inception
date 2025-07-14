/// <reference path="../../../../Content/js/knockout.component.dashboardCalendarWidget.js" />
/// <reference path="../../../../Content/js/system/moment.js" />

(function() {
	const dashboardCalendarWidgetViewModel = window.Main.ViewModels.DashboardCalendarWidgetViewModel;
	window.Main.ViewModels.DashboardCalendarWidgetViewModel = function() {
		const viewModel = this;
		dashboardCalendarWidgetViewModel.apply(this, arguments);
		viewModel.addTablesToLookups();
		viewModel.initDispatchFilter();
		viewModel.initTimePostingFilter();
	};
	window.Main.ViewModels.DashboardCalendarWidgetViewModel.prototype = dashboardCalendarWidgetViewModel.prototype;
	const getTimelineEvent = window.Main.ViewModels.DashboardCalendarWidgetViewModel.prototype.getTimelineEvent;
	window.Main.ViewModels.DashboardCalendarWidgetViewModel.prototype.getTimelineEvent = function(it) {
		const viewModel = this;

		if (window.database.CrmService_ServiceOrderDispatch &&
			it.innerInstance instanceof
			window.database.CrmService_ServiceOrderDispatch.CrmService_ServiceOrderDispatch) {
			return window.Crm.Service.ViewModels.ServiceOrderDispatchListIndexViewModel.prototype.getTimelineEvent.apply(this, arguments);
		}
		if (window.database.CrmService_ServiceOrderTimePosting &&
			it.innerInstance instanceof
			window.database.CrmService_ServiceOrderTimePosting.CrmService_ServiceOrderTimePosting) {

			const translatedTimePostingType = window.Helper.Lookup.getLookupValue(viewModel.lookups.articleDescriptions, it.ItemNo());

			let timeLineEvent = {
				entityType: window.Helper.getTranslatedString("TimePosting"),
				title: translatedTimePostingType,
				start: it.From() || it.Date(),
				end: it.To() || it.Date(),
				allDay: it.From() && it.To() && moment(it.From()).clone().startOf("day").isSame(it.From()) && moment(it.From()).clone().add(1, "day").startOf("day").isSame(it.To()),
				backgroundColor: window.Helper.Lookup.getLookupColor(viewModel.lookups.articleDescriptions, it.ItemNo()),
				url: "#/Crm.Service/Dispatch/DetailsTemplate/" + window.ko.unwrap(window.ko.unwrap(it.ServiceOrderDispatch).Id) + "?tab=tab-time-postings"
			};

			timeLineEvent.title = translatedTimePostingType;
			if (!!it.Description()) {
				timeLineEvent.title += it.Description();
			}
			timeLineEvent.description = it.ServiceOrder().OrderNo()

			return timeLineEvent;
		}
		return getTimelineEvent.apply(this, arguments);
	};
	window.Main.ViewModels.DashboardCalendarWidgetViewModel.prototype.getDispatchTimelineEvents = function() {
		const viewModel = this;

		if (window.database.CrmService_ServiceOrderDispatch && viewModel.currentUser()) {
			return window.database.CrmService_ServiceOrderDispatch
				.include("ServiceOrder")
				.include("ServiceOrderTimePostings")
				.filter(function(it) {
						return it.Username === this.currentUser &&
							it.StatusKey in ["Scheduled", "Released", "Read", "InProgress"] &&
							it.Date >= this.start &&
							it.Date <= this.end
					},
					{
						currentUser: viewModel.currentUser(),
						start: viewModel.timelineStart(),
						end: viewModel.timelineEnd()
					})
				.take(viewModel.maxResults())
				.toArray()
				.then(results => results
					.filter(dispatch => dispatch.ServiceOrderTimePostings.length === 0)
					.map(x => x.asKoObservable())
				);
		} else {
			return new $.Deferred().resolve([]).promise();
		}
	};
	window.Main.ViewModels.DashboardCalendarWidgetViewModel.prototype.getTimePostingTimelineEvents = function() {
		const viewModel = this;

		if (window.database.CrmService_ServiceOrderTimePosting && viewModel.currentUser()) {
			return window.database.CrmService_ServiceOrderTimePosting
				.include("ServiceOrder")
				.include("ServiceOrderDispatch")
				.filter(function(it) {
						return it.Username === this.currentUser &&
							it.From >= this.start &&
							it.To <= this.end
					},
					{
						currentUser: viewModel.currentUser(),
						start: viewModel.timelineStart(),
						end: viewModel.timelineEnd()
					})
				.take(viewModel.maxResults())
				.toArray()
				.then(results => results
					.map(x => x.asKoObservable())
				);
		} else {
			return new $.Deferred().resolve([]).promise();
		}
	};
	window.Main.ViewModels.DashboardCalendarWidgetViewModel.prototype.addTablesToLookups = function() {
		const viewModel = this;
		if (window.database.Main_Country) {
			viewModel.lookups.countries = {$tableName: "Main_Country"};
		}
		if (window.database.Main_Region) {
			viewModel.lookups.regions = {$tableName: "Main_Region"};
		}
		if (window.database.CrmService_ServiceOrderType) {
			viewModel.lookups.serviceOrderTypes = {$tableName: "CrmService_ServiceOrderType"};
		}
		if (window.database.CrmService_ServiceOrderDispatchStatus) {
			viewModel.lookups.serviceOrderDispatchStatuses = {$tableName: "CrmService_ServiceOrderDispatchStatus"};
		}
		if (window.database.CrmArticle_ArticleDescription) {
			viewModel.lookups.articleDescriptions = {$tableName: "CrmArticle_ArticleDescription"};
		}
	}
	window.Main.ViewModels.DashboardCalendarWidgetViewModel.prototype.initDispatchFilter = function() {
		const viewModel = this;
		if (window.database.CrmService_ServiceOrderDispatch) {
			viewModel.dispatchFilterOption = {
				Value: window.database.CrmService_ServiceOrderDispatch.collectionName,
				Caption: window.Helper.String.getTranslatedString("ScheduledDispatches"),
				Tooltip: window.Helper.String.getTranslatedString("ScheduledDispatchesTooltip")
			};
			viewModel.filterOptions.push(viewModel.dispatchFilterOption);
			viewModel.selectedFilters.subscribe(function(changes) {
				if (changes.some(function(change) {
					return change.status === viewModel.changeStatus.added && change.moved === undefined && change.value.Value === viewModel.dispatchFilterOption.Value
				})) {
					viewModel.loading(true);
					viewModel.getDispatchTimelineEvents().then(function(results) {
						viewModel.timelineEvents(viewModel.timelineEvents().filter(function(event) {
							return event.innerInstance.constructor.name !== viewModel.dispatchFilterOption.Value
						}));
						viewModel.timelineEvents(viewModel.timelineEvents().concat(results));
						viewModel.loading(false);
					});
				}
				if (changes.some(function(change) {
					return change.status === viewModel.changeStatus.deleted && change.moved === undefined && change.value.Value === viewModel.dispatchFilterOption.Value
				})) {
					viewModel.timelineEvents(viewModel.timelineEvents().filter(function(event) {
						return event.innerInstance.constructor.name !== viewModel.dispatchFilterOption.Value
					}));
				}
			}, null, "arrayChange");
		}
	}
	window.Main.ViewModels.DashboardCalendarWidgetViewModel.prototype.initTimePostingFilter = function() {
		const viewModel = this;
		if (window.database.CrmService_ServiceOrderTimePosting) {
			viewModel.timePostingFilterOption = {
				Value: window.database.CrmService_ServiceOrderTimePosting.collectionName,
				Caption: window.Helper.String.getTranslatedString("TimePostings"),
				Tooltip: window.Helper.String.getTranslatedString("TimePostingsTooltip")
			};
			viewModel.filterOptions.push(viewModel.timePostingFilterOption);
			viewModel.selectedFilters.subscribe(function(changes) {
				if (changes.some(function(change) {
					return change.status === viewModel.changeStatus.added && change.moved === undefined && change.value.Value === viewModel.timePostingFilterOption.Value
				})) {
					viewModel.loading(true);
					viewModel.getTimePostingTimelineEvents().then(function(results) {
						viewModel.timelineEvents(viewModel.timelineEvents().filter(function(event) {
							return event.innerInstance.constructor.name !== viewModel.timePostingFilterOption.Value
						}));
						viewModel.timelineEvents(viewModel.timelineEvents().concat(results));
						viewModel.loading(false);
					});
				}
				if (changes.some(function(change) {
					return change.status === viewModel.changeStatus.deleted && change.moved === undefined && change.value.Value === viewModel.timePostingFilterOption.Value
				})) {
					viewModel.timelineEvents(viewModel.timelineEvents().filter(function(event) {
						return event.innerInstance.constructor.name !== viewModel.timePostingFilterOption.Value
					}));
				}
			}, null, "arrayChange");
		}
	}
})();