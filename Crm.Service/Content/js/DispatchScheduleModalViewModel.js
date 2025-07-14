namespace("Crm.Service.ViewModels").DispatchScheduleModalViewModel = function (parentViewModel) {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);

	viewModel.calendar = new window.Main.ViewModels.DashboardCalendarWidgetViewModel({
		dayClick: window.Crm.Service.ViewModels.DispatchScheduleModalViewModel.prototype.onDayOrEventClick.bind(viewModel),
		eventClick: window.Crm.Service.ViewModels.DispatchScheduleModalViewModel.prototype.onDayOrEventClick.bind(viewModel)
	});
	var getDispatchTimelineEvents = viewModel.calendar.getDispatchTimelineEvents;
	viewModel.calendar.getDispatchTimelineEvents = function () {
		return getDispatchTimelineEvents.apply(this, arguments).then(function (results) {
			return results
				.filter(function (x) { return ko.unwrap(x.Id) !== viewModel.dispatches()[0].Id(); })
				.concat(viewModel.dispatches());
		});
	};
	var getTimelineEvent = viewModel.calendar.getTimelineEvent;
	viewModel.calendar.getTimelineEvent = function (it) {
		if (viewModel.dispatches().indexOf(it) !== -1) {
			return {
				allDay: false,
				backgroundColor: "#4CAF50",
				dispatch: it,
				end: window.moment(it.Time()).add(window.moment.duration(it.Duration())).toDate(),
				start: it.Time(),
				title: viewModel.isAddAllowed() ? window.Helper.String.getTranslatedString("Dispatch") + " #" + (viewModel.dispatches().indexOf(it) + 1) : it.ServiceOrder().OrderNo(),
				url: "#"
			};
		}
		var result = getTimelineEvent.apply(this, arguments);
		result.url = "#";
		return result;
	};
	viewModel.canSelectUser =
		window.ko.observable(window.AuthorizationManager.isAuthorizedForAction("Dispatch", "CreateForOtherUsers"));
	viewModel.dispatches = window.ko.observableArray(null);
	viewModel.dispatchedUsernames = window.ko.pureComputed(function () {
		return window._.uniq(viewModel.dispatches().map(function (x) {
			return x.Username();
		})).filter(Boolean);
	});
	viewModel.dispatchedUsernames.subscribe(function (usernames) {
		viewModel.calendar.currentUser(usernames.length === 1 ? usernames[0] : null);
	});
	viewModel.isAddAllowed = window.ko.observable(false);
	viewModel.serviceOrder = parentViewModel.serviceOrder;
	viewModel.dispatch = parentViewModel.dispatch;
	viewModel.errors = window.ko.validation.group(viewModel.dispatches, { deep: true, live: true });
};
namespace("Crm.Service.ViewModels").DispatchScheduleModalViewModel.prototype.init = function (dispatchId, params) {
	var viewModel = this;
	viewModel.returnUrl = params.returnUrl;
	if (params.tab)
		viewModel.returnUrl += "?tab=" + params.tab; 
	var username = window.Helper.User.getCurrentUserName();
	if (params.username !== undefined && viewModel.canSelectUser()) {
		username = params.username || null;
	}
	viewModel.calendar.currentUser(username);
	return viewModel.calendar.init().then(function () {
		if (dispatchId === window.Helper.String.emptyGuid()) {
			viewModel.isAddAllowed(true);
			viewModel.serviceOrderId = params.serviceOrderId;
			return viewModel.addNewDispatch(username);
		} else {
			return window.database.CrmService_ServiceOrderDispatch
				.include("ServiceOrder")
				.find(dispatchId)
				.then(function (dispatch) {
					window.database.attachOrGet(dispatch);
					viewModel.pushDispatch(dispatch);
					viewModel.calendar.options.defaultDate = dispatch.Date;
					if (!viewModel.serviceOrder)
						viewModel.serviceOrder = ko.observable(dispatch.ServiceOrder);
				});
		}
	});
};
namespace("Crm.Service.ViewModels").DispatchScheduleModalViewModel.prototype.onDayOrEventClick = function (dateOrEvent) {
	var viewModel = this;
	var dispatch = viewModel.dispatches()[viewModel.dispatches().length - 1];
	if (dateOrEvent.dispatch === dispatch) {
		return false;
	}
	var date = dateOrEvent.end || dateOrEvent.start || dateOrEvent;
	dispatch.Date(date.clone().local(true).stripTime().toDate());
	if (!date.hasTime() && dispatch.Time()) {
		date.hours(dispatch.Time().getHours());
		date.minutes(dispatch.Time().getMinutes());
	}
	dispatch.Time(date.local(true).toDate());
	return false;
};
namespace("Crm.Service.ViewModels").DispatchScheduleModalViewModel.prototype.pushDispatch = function (dispatch) {
	var viewModel = this;
	var observableDispatch = dispatch.asKoObservable();
	observableDispatch.Date.subscribe(function () {
		if (observableDispatch.Date() && observableDispatch.Time()) {
			var dateTime = new Date(observableDispatch.Date().getUTCFullYear(),
				observableDispatch.Date().getUTCMonth(),
				observableDispatch.Date().getUTCDate(),
				observableDispatch.Time().getHours(),
				observableDispatch.Time().getMinutes());
			observableDispatch.Time(dateTime);
		}
	});
	observableDispatch.release = window.ko.pureComputed({
		read: function () {
			return observableDispatch.StatusKey() === "Released";
		},
		write: function (value) {
			observableDispatch.StatusKey(value ? "Released" : "Scheduled");
		}
	});
	if (!dispatch.StatusKey) {
		observableDispatch.release(true);
	}
	viewModel.dispatches.push(observableDispatch);
	viewModel.calendar.timelineEvents.push(observableDispatch);
	return observableDispatch;
};
namespace("Crm.Service.ViewModels").DispatchScheduleModalViewModel.prototype.addNewDispatch = function (username) {
	var viewModel = this;
	var dispatch = window.database.CrmService_ServiceOrderDispatch.CrmService_ServiceOrderDispatch.create();
	dispatch.Id = window.$data.createGuid().toString().toLowerCase();
	dispatch.OrderId = viewModel.serviceOrderId;
	dispatch.StatusKey = "Released";
	dispatch.Username = username;
	var moment = window.moment();
	var dispatches = viewModel.dispatches();
	var lastDispatch = dispatches[dispatches.length - 1];
	if (lastDispatch) {
		var time = window.moment(lastDispatch.Time());
		var duration = window.moment.duration(lastDispatch.Duration());
		moment = window.moment(time).add(duration);
		dispatch.Username = lastDispatch.Username();
	}
	dispatch.Time = moment.toDate();
	dispatch.Date = moment.startOf("day").utc(true).toDate();
	dispatch.Duration = window.moment.duration(window.Crm.Service.Settings.ServiceOrder.DefaultDuration).toISOString();
	window.database.add(dispatch);
	return viewModel.pushDispatch(dispatch);
};
namespace("Crm.Service.ViewModels").DispatchScheduleModalViewModel.prototype.removeDispatch = function (index) {
	var viewModel = this;
	viewModel.dispatches.splice(index(), 1).forEach(function (dispatch) {
		viewModel.calendar.timelineEvents.remove(dispatch);
		window.database.detach(dispatch.innerInstance);
	});
};
namespace("Crm.Service.ViewModels").DispatchScheduleModalViewModel.prototype.dispose = function () {
	var viewModel = this;
	viewModel.dispatches().forEach(function (dispatch) {
		window.database.detach(dispatch.innerInstance);
	});
};
namespace("Crm.Service.ViewModels").DispatchScheduleModalViewModel.prototype.save = function () {
	var viewModel = this;
	viewModel.loading(true);

	if (viewModel.errors().length > 0) {
		viewModel.loading(false);
		viewModel.errors.showAllMessages();
		return;
	}

	var releaseServiceOrder = false;
	var partiallyReleaseServiceOrder = false;

	return Promise.all(viewModel.dispatches().map(function (dispatch) {

		return window.NumberingService.createNewNumberBasedOnAppSettings(window.Crm.Service.Settings.Dispatch.DispatchNoIsGenerated, window.Crm.Service.Settings.Dispatch.DispatchNoIsCreateable, dispatch.DispatchNo(), "SMS.ServiceOrderDispatch", window.database.CrmService_ServiceOrderDispatch, "DispatchNo")
		.then(function (dispatchNo) {
			if (dispatchNo !== undefined) {
				dispatch.DispatchNo(dispatchNo)
			}
			var dateTime = new Date(dispatch.Date().getUTCFullYear(),
				dispatch.Date().getUTCMonth(),
				dispatch.Date().getUTCDate(),
				dispatch.Time().getHours(),
				dispatch.Time().getMinutes());
			dispatch.Time(dateTime);
			dispatch.StartTime(dateTime);
			if (dispatch.StatusKey() === "Released")
				releaseServiceOrder = true;
			if (dispatch.StatusKey() === "PartiallyReleased")
				partiallyReleaseServiceOrder = true;
			if (viewModel.dispatch) {
				viewModel.dispatch(dispatch);
			}
			return true;
		})
	})).then(function () {
			if (!releaseServiceOrder) {
				if (partiallyReleaseServiceOrder) {
					window.database.attach(window.ko.unwrap(viewModel.serviceOrder));
					if (window.ko.isObservable(viewModel.serviceOrder().StatusKey))
						viewModel.serviceOrder().StatusKey("PartiallyReleased");
					else
						viewModel.serviceOrder().StatusKey = "PartiallyReleased";
				} else {
					window.database.attach(window.ko.unwrap(viewModel.serviceOrder));
					if (window.ko.isObservable(viewModel.serviceOrder().StatusKey))
						viewModel.serviceOrder().StatusKey("Scheduled");
					else
						viewModel.serviceOrder().StatusKey = "Scheduled";
				}

				return null;
			}
			if (viewModel.serviceOrder) {
				return window.ko.unwrap(viewModel.serviceOrder);
			}
			if (viewModel.serviceOrderId) {
				return window.database.CrmService_ServiceOrderHead
					.find(viewModel.serviceOrderId);
			}
			return null;
		}).then(function (serviceOrder) {
			if (serviceOrder) {
				window.database.attach(serviceOrder);
				if (window.ko.isObservable(serviceOrder.StatusKey))
					serviceOrder.StatusKey("Released");
				else
					serviceOrder.StatusKey = "Released";
			}
			return window.database.saveChanges();
		}).then(function () {
			$(".modal:visible").modal("hide");
			if (viewModel.returnUrl) {
				window.location.hash = viewModel.returnUrl;
			}
			viewModel.loading(false);
		}).fail(function () {
			viewModel.loading(false);
			window.swal(window.Helper.String.getTranslatedString("UnknownError"),
				window.Helper.String.getTranslatedString("Error_InternalServerError"),
				"error");
		});
};
