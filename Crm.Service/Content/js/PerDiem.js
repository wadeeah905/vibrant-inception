;
(function(helper, ko, moment) {

	function setItemDescriptions(serviceOrderTimePostings) {
		return helper.Culture.languageCulture().then(function (language) {
			var itemNos = window._.uniq(serviceOrderTimePostings.map(function (x) { return x.ItemNo(); }));
			return Helper.Article.loadArticleDescriptionsMap(itemNos, language);
		}).then(function (articleDescriptionsMap) {
			serviceOrderTimePostings.forEach(function (serviceOrderTimePosting) {
				serviceOrderTimePosting.ItemDescription(articleDescriptionsMap[serviceOrderTimePosting.ItemNo()]);
			});
		});
	}

	var timeEntryIndexViewModel = window.Crm.PerDiem.ViewModels.TimeEntryIndexViewModel;
	if (timeEntryIndexViewModel) {
		window.Crm.PerDiem.ViewModels.TimeEntryIndexViewModel = function() {
			timeEntryIndexViewModel.apply(this, arguments);
			var viewModel = this;
			viewModel.serviceOrderTimePostings = ko.observableArray([]);
		};
		window.Crm.PerDiem.ViewModels.TimeEntryIndexViewModel.prototype = timeEntryIndexViewModel.prototype;

		var timeEntryIndexViewModelInit = window.Crm.PerDiem.ViewModels.TimeEntryIndexViewModel.prototype.init;
		window.Crm.PerDiem.ViewModels.TimeEntryIndexViewModel.prototype.init = function() {
			var viewModel = this;
			return timeEntryIndexViewModelInit.apply(this, arguments).then(function() {
				helper.Database.registerEventHandlers(viewModel,
					{
						"CrmService_ServiceOrderTimePosting": {
							"afterCreate": viewModel.refresh,
							"afterDelete": viewModel.refresh,
							"afterUpdate": viewModel.refresh
						}
					});
			}).then(function () {
				viewModel.canSeeAllUsersDispatches = window.AuthorizationManager.isAuthorizedForAction("Dispatch", "SeeAllUsersDispatches");
			});
		};

		var timeEntryIndexViewModelRefresh = window.Crm.PerDiem.ViewModels.TimeEntryIndexViewModel.prototype.refresh;
		window.Crm.PerDiem.ViewModels.TimeEntryIndexViewModel.prototype.refresh = function() {
			var viewModel = this;
			if (!window.database.CrmService_ServiceOrderTimePosting) {
				return timeEntryIndexViewModelRefresh.apply(this, arguments);
			}
			return timeEntryIndexViewModelRefresh.apply(this, arguments).then(function () {
				viewModel.loading(true);
				var tempdataFromDB = ko.observableArray([]);
				return window.database.CrmService_ServiceOrderTimePosting
					.include("ServiceOrder")
					.include("ServiceOrderDispatch")
					.filter(function(serviceOrderTimePosting) {
							return serviceOrderTimePosting.Username === this.username &&
								serviceOrderTimePosting.Date >= this.dateMin &&
								serviceOrderTimePosting.Date < this.dateMax;
						},
						{
							dateMin: viewModel.dateFilterFrom(),
							dateMax: viewModel.dateFilterTo(),
							username: viewModel.username()
						})
					.toArray(tempdataFromDB)
					.then(function () {
						tempdataFromDB().forEach(function (item) {
							item.ItemDescription = ko.observable("");
						});
					})
					.then(function () {
						setItemDescriptions(tempdataFromDB());
					})
					.then(function () {
						viewModel.serviceOrderTimePostings(tempdataFromDB());
						return Helper.User.getCurrentUser();
					}).then(function(user) {
						return Helper.Article.loadArticleDescriptionsMapFromItemNo(viewModel.serviceOrderTimePostings(), user.DefaultLanguageKey);
					}).then(function() {
						viewModel.loading(false);
					});
			});
		};

		var timeEntryIndexViewModelGetTimesForDate =
			window.Crm.PerDiem.ViewModels.TimeEntryIndexViewModel.prototype.getTimesForDate;
		window.Crm.PerDiem.ViewModels.TimeEntryIndexViewModel.prototype.getTimesForDate = function(date) {
			var viewModel = this;
			if (viewModel.serviceOrderTimePostings().length > 0 && !viewModel.serviceOrderTimePostings()[0].canViewCurrentUser) {
				viewModel.serviceOrderTimePostings().forEach(function (timeposting) {
					timeposting.canViewCurrentUser = ko.observable(false);
					if (viewModel.canSeeAllUsersDispatches) {
						timeposting.canViewCurrentUser(true);
					} else {
						window.database.CrmService_ServiceOrderDispatch
							.filter(function (it) {
								return it.Username === this.username &&
									it.OrderId === this.orderId;
							},
								{ username: viewModel.username, orderId: timeposting.OrderId() })
							.count()
							.then(function (count) {
								if (count > 0) {
									timeposting.canViewCurrentUser(true);
								}
							});
					}
				});
			}
			return timeEntryIndexViewModelGetTimesForDate.apply(this, arguments).concat(viewModel
				.serviceOrderTimePostings().filter(function(x) {
					return moment(x.Date()).isSame(date);
				}));
		};
	}

	var getLatestTimeEntry = helper.TimeEntry.getLatestTimeEntry;
	helper.TimeEntry.getLatestTimeEntry = function(username, date) {
		var dateStart = moment(date).startOf("day").toDate();
		var dateEnd = moment(date).endOf("day").toDate();
		if (!window.database.CrmService_ServiceOrderTimePosting) {
			return getLatestTimeEntry(username, date);
		}
		return getLatestTimeEntry(username, date)
			.then(function(result) {
				return window.database.CrmService_ServiceOrderTimePosting.filter(function(x) {
							return x.Username === this.username &&
								x.Date >= this.dateStart &&
								x.Date <= this.dateEnd;
						},
						{ username: username, dateStart: dateStart, dateEnd: dateEnd })
					.orderByDescending(function(x) { return x.To; })
					.take(1)
					.toArray()
					.then(function(results) {
						if (results.length === 0) {
							return result;
						}
						return result && result.To > results[0].To ? result : results[0];
					});
			});
	};

	var timeEntryCloseModalViewModel = window.Crm.PerDiem.ViewModels.TimeEntryCloseModalViewModel;
	if (timeEntryCloseModalViewModel) {
		window.Crm.PerDiem.ViewModels.TimeEntryCloseModalViewModel = function() {
			timeEntryCloseModalViewModel.apply(this, arguments);
			var viewModel = this;
			viewModel.serviceOrderTimePostings = ko.observableArray([]);
			var reportEntries = viewModel.reportEntries;
			viewModel.reportEntries = ko.pureComputed(function() {
				return reportEntries().concat(viewModel.serviceOrderTimePostings());
			});
		};
		window.Crm.PerDiem.ViewModels.TimeEntryCloseModalViewModel.prototype = timeEntryCloseModalViewModel.prototype;

		var timeEntryCloseModalViewModelInit =
			window.Crm.PerDiem.ViewModels.TimeEntryCloseModalViewModel.prototype.init;
		window.Crm.PerDiem.ViewModels.TimeEntryCloseModalViewModel.prototype.init = function() {
			var viewModel = this;
			if (!window.database.CrmService_ServiceOrderTimePosting) {
				return timeEntryCloseModalViewModelInit.apply(this, arguments);
			}
			return timeEntryCloseModalViewModelInit.apply(this, arguments).then(function() {
				window.database.CrmService_ServiceOrderTimePosting.GetDistinctServiceOrderTimePostingDates(viewModel.selectedUser()).forEach(function (date) {
					if (viewModel.distinctDates.indexOf(date) === -1) {
						viewModel.distinctDates.push(date);
					}
				});
			});
		};

		var timeEntryCloseModalViewModelRefresh =
			window.Crm.PerDiem.ViewModels.TimeEntryCloseModalViewModel.prototype.refresh;
		window.Crm.PerDiem.ViewModels.TimeEntryCloseModalViewModel.prototype.refresh = function() {
			var viewModel = this;
			var id = viewModel.perDiemReportId();
			if (!window.database.CrmService_ServiceOrderTimePosting) {
				return timeEntryCloseModalViewModelRefresh.apply(this, arguments);
			}
			return timeEntryCloseModalViewModelRefresh.apply(this, arguments).then(function() {
				if (!viewModel.perDiemReport().From() || !viewModel.perDiemReport().To()) {
					viewModel.serviceOrderTimePostings([]);
					return new $.Deferred().resolve().promise();
				}
				var query = window.database.CrmService_ServiceOrderTimePosting
					.include("Article")
					.include("User");
				query = id
					? query.filter(function(it) {
							return it.PerDiemReportId === this.id;
						},
						{ id: id })
					: query.filter(function(it) {
							return it.Username === this.selectedUser &&
								it.IsClosed === 0 &&
								it.Date >= this.from &&
								it.Date <= this.to &&
								it.PerDiemReportId === null;
						},
						{
							selectedUser: viewModel.selectedUser(),
							from: viewModel.perDiemReport().From(),
							to: viewModel.perDiemReport().To()
						});
				var tempdataFromDB = ko.observableArray([]);
				return query
					.orderBy("it.Date")
					.orderBy("it.From")
					.orderBy("it.ItemNo")
					.toArray(tempdataFromDB)
					.then(function () {
						tempdataFromDB().forEach(function (item) {
							item.ItemDescription = ko.observable("");
						});
					})
					.then(function () {
						setItemDescriptions(tempdataFromDB());
					})
					.then(function () {
						viewModel.serviceOrderTimePostings(tempdataFromDB());
					}).then(function () {
						return Helper.User.getCurrentUser();
					}).then(function (user) {
						return Helper.Article.loadArticleDescriptionsMapFromItemNo(viewModel.serviceOrderTimePostings(), user.DefaultLanguageKey);
					});
			});
		};
	}
})(window.Helper, window.ko, window.moment);