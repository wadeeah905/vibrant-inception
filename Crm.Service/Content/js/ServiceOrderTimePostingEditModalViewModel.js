namespace("Crm.Service.ViewModels").ServiceOrderTimePostingEditModalViewModel = function(parentViewModel) {
	var viewModel = this;
	viewModel.loading = window.ko.observable(true);

	viewModel.allDay = window.ko.observable(false);
	viewModel.articleAutocomplete = window.ko.observable("");
	viewModel.currentUser = window.ko.observable(null);
	viewModel.dispatch = parentViewModel && parentViewModel.dispatch || window.ko.observable(null);
	viewModel.initialServiceOrderTimeId = window.ko.observable(null);
	viewModel.minDate = window.ko.observable(window.Crm.Service.Settings.ServiceOrderTimePosting.MaxDaysAgo ? window.moment().startOf("day").utc().add(-parseInt(window.Crm.Service.Settings.ServiceOrderTimePosting.MaxDaysAgo), "days") : false);
	viewModel.maxDate = window.ko.observable(new Date());
	viewModel.serviceOrder = parentViewModel && parentViewModel.serviceOrder || window.ko.observable(null);
	viewModel.serviceOrderTime = window.ko.observable(null);
	viewModel.serviceOrderTimePosting = window.ko.observable(null);
	viewModel.showDispatchSelection = window.ko.observable(false);
	viewModel.validItemNosAfterCustomerSignature = window.ko.observableArray([]);

	viewModel.errors = window.ko.validation.group(viewModel.serviceOrderTimePosting, { deep: true });
	viewModel.showKilometerSelection = window.ko.observable(false);
	viewModel.showKilometerSelection.subscribe(function (showKilometerSelection) {
		if (showKilometerSelection === false && viewModel.serviceOrderTimePosting()) {
			viewModel.serviceOrderTimePosting().Kilometers(null);
		}
	});
	viewModel.prePlanned = window.ko.observable(false);
	viewModel.getDurationLabel = window.ko.computed(function() {
		let durationLabel = Helper.String.getTranslatedString("Duration");
		let planned = null;
		if (viewModel.prePlanned()) {
			durationLabel = Helper.String.getTranslatedString("PlannedDuration");
		} else if (viewModel.serviceOrderTimePosting() && viewModel.serviceOrderTimePosting().PlannedDuration()) {
			planned = viewModel.serviceOrderTimePosting().PlannedDuration();
		} else if (viewModel.serviceOrderTime() && viewModel.serviceOrderTime().EstimatedDuration()) {
			planned = viewModel.serviceOrderTime().EstimatedDuration();
		}
		if (planned) {
			var duration = window.moment.duration(planned);
			var durationText = duration.isValid() ? duration.format("hh:mm", { stopTrim: "h" }) : "";
			durationLabel += " (" + Helper.String.getTranslatedString('L_EstimatedDuration') + ": " + durationText + " " + Helper.String.getTranslatedString("HourAbbreviation") + ")";
		}
		return durationLabel;
	});
	viewModel.lookups = {
		installationHeadStatuses: { $tableName: "CrmService_InstallationHeadStatus" },
		serviceOrderTypes: { $tableName: "CrmService_ServiceOrderType" },
		servicePriorities: { $tableName: "CrmService_ServicePriority" }
	}
};
namespace("Crm.Service.ViewModels").ServiceOrderTimePostingEditModalViewModel.prototype.init = function(id, params) {
	const viewModel = this;
	viewModel.prePlanned(!!params.prePlanned);
	return window.Helper.User.getCurrentUser().then(function(user) {
		viewModel.currentUser(user);
	}).then(function() {
		if (id) {
			return window.database.CrmService_ServiceOrderTimePosting
				.include("ServiceOrderTime")
				.find(id);
		}
		viewModel.serviceOrderTime(viewModel.dispatch() ? viewModel.dispatch().CurrentServiceOrderTime() : null);
		var newServiceOrderTimePosting = window.database.CrmService_ServiceOrderTimePosting.CrmService_ServiceOrderTimePosting.create();
		newServiceOrderTimePosting.ArticleId = params.articleId || (viewModel.serviceOrderTime() ? viewModel.serviceOrderTime().ArticleId() : null);
		newServiceOrderTimePosting.OrderId = viewModel.serviceOrder() ? viewModel.serviceOrder().Id() : null;
		return newServiceOrderTimePosting;
	}).then(function(serviceOrderTimePosting) {
		if (viewModel.prePlanned()) {
			serviceOrderTimePosting.Date = moment(new Date(1970, 0, 1)).utc(true).startOf("day").toDate();
		} else if (!id || (!viewModel.prePlanned() && window.Helper.ServiceOrderTimePosting.isPrePlanned(serviceOrderTimePosting))) {
			serviceOrderTimePosting.Date = moment(params.from || new Date()).utc(true).startOf("day").toDate();
			serviceOrderTimePosting.DispatchId = viewModel.dispatch() ? viewModel.dispatch().Id() : null;
			serviceOrderTimePosting.ServiceOrderTimeId = params.serviceOrderTimeId || (viewModel.dispatch() ? viewModel.dispatch().CurrentServiceOrderTimeId() : null) || null;
			serviceOrderTimePosting.To = params.to || null;
			serviceOrderTimePosting.Username = viewModel.currentUser().Id;
			return window.Helper.TimeEntry.getLatestTimeEntryToOrDefault(serviceOrderTimePosting.Username, serviceOrderTimePosting.Date).then(function(latestTo) {
				serviceOrderTimePosting.From = params.from || latestTo;
				return serviceOrderTimePosting;
			});
		}
		return serviceOrderTimePosting;
	}).then(function(serviceOrderTimePosting) {
		if (id) {
			window.database.attachOrGet(serviceOrderTimePosting);
		} else {
			window.database.add(serviceOrderTimePosting)
		}
		return serviceOrderTimePosting;
	}).then(function(serviceOrderTimePosting) {
		var from, to;
		viewModel.allDay.subscribe(function(allDay) {
			if (allDay) {
				from = viewModel.serviceOrderTimePosting().From();
				to = viewModel.serviceOrderTimePosting().To();
				viewModel.serviceOrderTimePosting().From(window.moment().startOf("day").toDate());
				viewModel.serviceOrderTimePosting().To(window.moment().startOf("day").add(1, "day").toDate());
			} else {
				viewModel.serviceOrderTimePosting().From(from);
				viewModel.serviceOrderTimePosting().To(to);
			}
		});
		viewModel.serviceOrderTimePosting(serviceOrderTimePosting.asKoObservable());
		if (!viewModel.serviceOrderTime()) {
			viewModel.serviceOrderTime(viewModel.serviceOrderTimePosting().ServiceOrderTime() || (viewModel.dispatch() ? viewModel.dispatch().CurrentServiceOrderTime() : null));
		}
		viewModel.serviceOrderTimePosting().To.subscribe(function() {
			viewModel.serviceOrderTimePosting().From.valueHasMutated();
		});
		viewModel.serviceOrderTimePosting().Date.subscribe(function() {
			viewModel.serviceOrderTimePosting().To.valueHasMutated();
		});
		viewModel.serviceOrderTimePosting().Username.subscribe(function() {
			viewModel.serviceOrderTimePosting().From.valueHasMutated();
		});
		viewModel.serviceOrderTimePosting().From.subscribe(Helper.TimeEntry.updateToAndDuration.bind(viewModel.serviceOrderTimePosting()));
		viewModel.serviceOrderTimePosting().To.subscribe(Helper.TimeEntry.updateFromAndDuration.bind(viewModel.serviceOrderTimePosting()));
		viewModel.serviceOrderTimePosting().Duration.subscribe(Helper.TimeEntry.initFromAndTo.bind(viewModel.serviceOrderTimePosting()));
		viewModel.serviceOrderTimePosting().Username.subscribe(viewModel.onUserSelect.bind(viewModel));
		if (viewModel.serviceOrderTimePosting().DispatchId() === null && viewModel.serviceOrderTimePosting().OrderId() === null) {
			viewModel.showDispatchSelection(true);
			viewModel.serviceOrderTimePosting().DispatchId.extend({
				required: {
					params: true,
					message: window.Helper.String.getTranslatedString("RuleViolation.Required").replace("{0}",
						window.Helper.String.getTranslatedString("ServiceOrderDispatch"))
				}
			});
		}
		viewModel.initialServiceOrderTimeId(viewModel.serviceOrderTimePosting().ServiceOrderTimeId());
		if (id || viewModel.dispatch() || viewModel.serviceOrder()) {
			return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups);
		}
		var validItemNo = ko.computed(function() {
			return !viewModel.dispatch() ||
				!viewModel.serviceOrderTimePosting().ItemNo() ||
				viewModel.dispatch().StatusKey() !== "SignedByCustomer" ||
				viewModel.validItemNosAfterCustomerSignature()
				.indexOf(viewModel.serviceOrderTimePosting().ItemNo()) !==
				-1;
		});
		viewModel.serviceOrderTimePosting().ArticleId.extend({
			validation: {
				validator: function() {
					return validItemNo();
				},
				message: window.Helper.String.getTranslatedString("SelectionNotPossible")
			}
		});
		validItemNo.subscribe(() => viewModel.serviceOrderTimePosting().ArticleId.valueHasMutated());
		return window.database.CrmService_ServiceOrderTimePosting
			.include("ServiceOrderDispatch")
			.filter("it.Username === this.username", { username: viewModel.serviceOrderTimePosting().Username() })
			.orderByDescending("it.To")
			.take(1)
			.toArray(function(lastTimePostings) {
				var lastTimePosting = lastTimePostings.length > 0 ? lastTimePostings[0] : null;
				var preSelectDispatchFromLastTimePosting = lastTimePosting !== null &&
					lastTimePosting.ServiceOrderDispatch !== null &&
					lastTimePosting.ServiceOrderDispatch.StatusKey !== "ClosedNotComplete" &&
					lastTimePosting.ServiceOrderDispatch.StatusKey !== "ClosedComplete";
				if (preSelectDispatchFromLastTimePosting) {
					viewModel.serviceOrderTimePosting().DispatchId(lastTimePosting.DispatchId);
					viewModel.serviceOrderTimePosting().ServiceOrderTimeId(lastTimePosting.ServiceOrderDispatch.CurrentServiceOrderTimeId || lastTimePosting.ServiceOrderTimeId);
				}
			}).then(function() {
				return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups);
			}).then(function() {
				return window.database.CrmArticle_Article.filter(function (it) {
					return it.ArticleTypeKey === "Service" && it.ExtensionValues.CanBeAddedAfterCustomerSignature;
				}).map(function (it) {
					return it.ItemNo;
				}).toArray();
			}).then(function(itemNos) {
				viewModel.validItemNosAfterCustomerSignature(itemNos);
			});
	});
};
namespace("Crm.Service.ViewModels").ServiceOrderTimePostingEditModalViewModel.prototype.dispatchFilter = function(query, term) {
	var viewModel = this;
	if (term) {
		query = query.filter("it.ServiceOrder.OrderNo.contains(this.term)", { term: term });
	}
	if (viewModel.serviceOrder()) {
		query = query.filter("OrderId", "===", viewModel.serviceOrder().Id());
	}
	if (viewModel.serviceOrderTimePosting().Username()) {
		query = query.filter("it.Username === this.username", { username: viewModel.serviceOrderTimePosting().Username() });
	}
	query = query.filter("it.StatusKey in this.statusKeys",
		{ statusKeys: ["Released", "Read", "InProgress", "SignedByCustomer"] });
	return query;
};
namespace("Crm.Service.ViewModels").ServiceOrderTimePostingEditModalViewModel.prototype.dispose = function() {
	var viewModel = this;
	window.database.detach(viewModel.serviceOrderTimePosting().innerInstance);
};
namespace("Crm.Service.ViewModels").ServiceOrderTimePostingEditModalViewModel.prototype.save = async function () {
	var viewModel = this;
	viewModel.loading(true);

	if (viewModel.errors().length > 0) {
		viewModel.loading(false);
		viewModel.errors.showAllMessages();
		return;
	}

	try {
		if (!viewModel.prePlanned() && viewModel.dispatch() && ["Released", "Read"].indexOf(viewModel.dispatch().StatusKey()) !== -1) {
			await window.Crm.Service.ViewModels.DispatchDetailsViewModel.prototype.workOnDispatch.apply(viewModel);
		}
		await viewModel.updateEstimatedDuration();
		await window.database.saveChanges();
		viewModel.loading(false);
		$(".modal:visible").modal("hide");
	} catch {
		viewModel.loading(false);
		window.swal(window.Helper.String.getTranslatedString("UnknownError"),
			window.Helper.String.getTranslatedString("Error_InternalServerError"),
			"error");
	}
};
namespace("Crm.Service.ViewModels").ServiceOrderTimePostingEditModalViewModel.prototype.getArticleSelect2Filter = function(query,term) {
	var viewModel = this;
	query = query.filter(function(it) {
		return it.ArticleTypeKey === "Service" && it.ExtensionValues.IsHidden === false;
	});
	if (viewModel.dispatch() && viewModel.dispatch().StatusKey() === "SignedByCustomer") {
		query = query.filter(function(it) {
				return it.ExtensionValues.CanBeAddedAfterCustomerSignature;
			});
	}
	return window.Helper.Article.getArticleAutocompleteFilter(query, term, viewModel.currentUser().DefaultLanguageKey);
};
namespace("Crm.Service.ViewModels").ServiceOrderTimePostingEditModalViewModel.prototype
	.getServiceOrderTimeAutocompleteDisplay = function(serviceOrderTime) {
		var viewModel = this;
		return window.Helper.ServiceOrderTime.getAutocompleteDisplay(serviceOrderTime,
			viewModel.dispatch() ? viewModel.dispatch().CurrentServiceOrderTimeId() : null);
	};
namespace("Crm.Service.ViewModels").ServiceOrderTimePostingEditModalViewModel.prototype
	.getServiceOrderTimeAutocompleteFilter = function(query,term) {
		var viewModel = this;
		query = query.filter(function(it) {
				return it.OrderId === this.orderId;
			},
			{ orderId: viewModel.serviceOrderTimePosting().OrderId() });

		if (term) {
			query = query.filter('it.Description.toLowerCase().contains(this.term)||it.ItemNo.toLowerCase().contains(this.term) ||it.PosNo.toLowerCase().contains(this.term)', { term: term });
		}
		return query;
	};
namespace("Crm.Service.ViewModels").ServiceOrderTimePostingEditModalViewModel.prototype.onArticleSelect =
	function(article) {
	var viewModel = this;
	viewModel.showKilometerSelection(article !== null && article.ExtensionValues.ShowDistanceInput);
	if (article) {
		viewModel.serviceOrderTimePosting().ArticleId(article.Id);
		viewModel.serviceOrderTimePosting().ItemNo(article.ItemNo);
	} else {
		viewModel.serviceOrderTimePosting().ArticleId(null);
		viewModel.serviceOrderTimePosting().ItemNo(null);
	}
	};
namespace("Crm.Service.ViewModels").ServiceOrderTimePostingEditModalViewModel.prototype.onDispatchSelect = function(dispatch) {
	var viewModel = this;
	if (dispatch) {
		viewModel.dispatch(dispatch.asKoObservable());
		viewModel.serviceOrder(dispatch.ServiceOrder.asKoObservable());
		if (viewModel.serviceOrderTimePosting().DispatchId() !== dispatch.Id) {
			viewModel.serviceOrderTimePosting().DispatchId(dispatch.Id);
			viewModel.serviceOrderTimePosting().ServiceOrderTimeId(null);
		}
		viewModel.serviceOrderTimePosting().OrderId(dispatch.OrderId);
		viewModel.serviceOrderTimePosting().Username(dispatch.Username);
	} else {
		viewModel.dispatch(null);
		viewModel.serviceOrderTimePosting().DispatchId(null);
		viewModel.serviceOrderTimePosting().OrderId(null);
		viewModel.serviceOrderTimePosting().ServiceOrderTimeId(null);
	}
};
namespace("Crm.Service.ViewModels").ServiceOrderTimePostingEditModalViewModel.prototype.onUserSelect = function(user) {
	var viewModel = this;
	if (user) {
		window.Helper.TimeEntry.getLatestTimeEntryToOrDefault(user, viewModel.serviceOrderTimePosting().Date()).then(function (latestTo) {
			viewModel.serviceOrderTimePosting().From(latestTo);
			const defaultDuration = viewModel.serviceOrderTimePosting().PlannedDuration() ?? "P0M";
			viewModel.serviceOrderTimePosting().Duration(defaultDuration);
			viewModel.errors.showAllMessages(false);
		});
	}
};
namespace("Crm.Service.ViewModels").ServiceOrderTimePostingEditModalViewModel.prototype.onJobSelected = function (serviceOrderTime) {
	var viewModel = this;
	if (serviceOrderTime === null) {
		viewModel.serviceOrderTime(null);
		viewModel.serviceOrderTimePosting().ServiceOrderTime(null);
		viewModel.serviceOrderTimePosting().ServiceOrderTimeId(null);
	} else {
		viewModel.serviceOrderTime(serviceOrderTime.asKoObservable());
		if (viewModel.serviceOrderTimePosting().ArticleId() === null) {
			viewModel.serviceOrderTimePosting().ArticleId(viewModel.serviceOrderTime().ArticleId());
		}
	}
};
namespace("Crm.Service.ViewModels").ServiceOrderTimePostingEditModalViewModel.prototype.isJobEditable = function() {
	return this.serviceOrderTimePosting().OrderId() && (!this.serviceOrderTimePosting().WasPrePlanned() || window.AuthorizationManager.currentUserHasPermission("ServiceOrder::TimePostingPrePlannedEditJob"));
};
namespace("Crm.Service.ViewModels").ServiceOrderTimePostingEditModalViewModel.prototype.updateEstimatedDuration = async function () {
	var viewModel = this;
	let updateInitialServiceOrderTime = !!viewModel.initialServiceOrderTimeId() && viewModel.initialServiceOrderTimeId() !== viewModel.serviceOrderTimePosting().ServiceOrderTimeId() && (viewModel.serviceOrderTimePosting().PlannedDuration.isModified() || viewModel.serviceOrderTimePosting().PlannedDuration() !== null);
	if (updateInitialServiceOrderTime) {
		await window.Helper.ServiceOrderTime.calculateEstimatedDuration(viewModel.initialServiceOrderTimeId(), viewModel.serviceOrderTimePosting().Id(), null);
	}
	let updateServiceOrderTime = viewModel.serviceOrderTimePosting().PlannedDuration.isModified() && !!viewModel.serviceOrderTimePosting().ServiceOrderTimeId();
	if (updateServiceOrderTime) {
		await window.Helper.ServiceOrderTime.calculateEstimatedDuration(viewModel.serviceOrderTimePosting().ServiceOrderTimeId(), viewModel.serviceOrderTimePosting().Id(), viewModel.serviceOrderTimePosting().PlannedDuration());
	}
}