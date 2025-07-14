;
(function (ko) {
	var perDiemReportDetailsModalViewModel = window.Crm.PerDiem.ViewModels.PerDiemReportDetailsModalViewModel;
	window.Crm.PerDiem.ViewModels.PerDiemReportDetailsModalViewModel = function () {
		perDiemReportDetailsModalViewModel.apply(this, arguments);
		var viewModel = this;
		viewModel.serviceOrderTimePostings = ko.observableArray([]);
		var reportEntries = viewModel.reportEntries;
		viewModel.reportEntries = ko.pureComputed(function () {
			return reportEntries().concat(viewModel.serviceOrderTimePostings());
		});
		viewModel.lookups.serviceOrderTypes = {};
	};
	window.Crm.PerDiem.ViewModels.PerDiemReportDetailsModalViewModel.prototype = perDiemReportDetailsModalViewModel.prototype;

	var perDiemReportDetailsModalViewModelLoadReportEntries =
		window.Crm.PerDiem.ViewModels.PerDiemReportDetailsModalViewModel.prototype.loadReportEntries;
	window.Crm.PerDiem.ViewModels.PerDiemReportDetailsModalViewModel.prototype.loadReportEntries = function (id, params) {
		var viewModel = this;
		return perDiemReportDetailsModalViewModelLoadReportEntries.apply(this, arguments).then(function () {
			if(!window.AuthorizationManager.isAuthorizedForAction("ServiceOrder", "TimePostingAdd")){
				return;
			}
			var filter = id
				? function (it) { return it.PerDiemReportId === this.id; }
				: function (it) { return it.Username === this.username && it.From >= this.fromDate && it.To <= this.toDate; };
			var filterParams = id ? { id: id } : params;
			return window.database.CrmService_ServiceOrderTimePosting
				.include("Article")
				.include("ServiceOrder")
				.include("ServiceOrder.Company")
				.include("ServiceOrder.Installation")
				.include("ServiceOrderTime.Installation")
				.filter(filter, filterParams)
				.orderBy("it.Date")
				.toArray()
				.then(function (results) {
					viewModel.serviceOrderTimePostings(results.map(function (x) {
						x = x.asKoObservable();
						x.ResponsibleUser = x.Username;
						return x;
					}));
					return window.Helper.Lookup
						.getLocalizedArrayMap("CrmService_ServiceOrderType")
				})
				.then(function (lookups) {
					viewModel.lookups.serviceOrderTypes = lookups;
				});
		});
	};

	window.Crm.PerDiem.ViewModels.PerDiemReportDetailsModalViewModel.prototype.getGroupedReportEntries = function () {
		var viewModel = this;
		return window._.uniqBy(viewModel.reportEntries().map(function (x) { return x.Date(); }),
			function (date) { return date.getTime(); })
			.sort(function (a, b) { return a < b ? -1 : a > b ? 1 : 0; })
			.map(function (date) {
				var dateEntries = viewModel.reportEntries().filter(function (x) {
					return window.moment(x.Date()).isSame(date);
				});
				var users = window._.uniq(dateEntries.map(function (x) {
					return x.ResponsibleUser();
				}));
				return {
					Date: date,
					Users: users.map(function (username) {
						var userDateEntries = dateEntries.filter(function (x) {
							return x.ResponsibleUser() === username;
						});

						userDateEntries = userDateEntries.sort(function (entry1, entry2) {
							if (database.CrmPerDiemGermany_PerDiemAllowanceEntry != undefined && database.CrmPerDiem_UserExpense != undefined) {
								if (entry1.innerInstance instanceof database.CrmPerDiemGermany_PerDiemAllowanceEntry.CrmPerDiemGermany_PerDiemAllowanceEntry || entry1.innerInstance instanceof database.CrmPerDiem_UserExpense.CrmPerDiem_UserExpense) {
									return 1;
								}
								if (entry2.innerInstance instanceof database.CrmPerDiemGermany_PerDiemAllowanceEntry.CrmPerDiemGermany_PerDiemAllowanceEntry || entry2.innerInstance instanceof database.CrmPerDiem_UserExpense.CrmPerDiem_UserExpense) {
									return -1;
								}
								return (new Date(entry1.From()) - new Date(entry2.From()));
							} else if (database.CrmPerDiemGermany_PerDiemAllowanceEntry == undefined) {
								if (entry1.innerInstance instanceof database.CrmPerDiem_UserExpense.CrmPerDiem_UserExpense) {
									return 1;
								}
								if (entry2.innerInstance instanceof database.CrmPerDiem_UserExpense.CrmPerDiem_UserExpense) {
									return -1;
								}
								return (new Date(entry1.From()) - new Date(entry2.From()));
							} else {
								if (entry1.innerInstance instanceof database.CrmPerDiemGermany_PerDiemAllowanceEntry) {
									return 1;
								}
								if (entry2.innerInstance instanceof database.CrmPerDiemGermany_PerDiemAllowanceEntry) {
									return -1;
								}
								return (new Date(entry1.From()) - new Date(entry2.From()));
							}

						})
						return {
							Duration: viewModel.getDurationSum(userDateEntries),
							Entries: userDateEntries,
							From: new Date(Math.min.apply(Math,
								userDateEntries.filter(function (x) { return !!window.ko.unwrap(x.From); }).map(
									function (x) {
										return x.From().getTime();
									}))),
							Sums: viewModel.getExpenseSums(userDateEntries),
							To: new Date(Math.max.apply(Math,
								userDateEntries.filter(function (x) { return !!window.ko.unwrap(x.To); }).map(
									function (x) {
										return x.To().getTime();
									}))),
							User: viewModel.users().find(function (x) { return x.Id() === username; })
						};
					})
				};
			});
	};

	window.Crm.PerDiem.ViewModels.PerDiemReportDetailsModalViewModel.prototype.isFirstServiceOrderEntry = function (data, entries, index) {
		if (index == 0) {
			return true;
		}
		var firstEntryWithSameServiceOrderNumber = entries.find(function (entry) {
			if (entry.innerInstance instanceof database.CrmService_ServiceOrderTimePosting.CrmService_ServiceOrderTimePosting) {
				return data.ServiceOrder().OrderNo() == entry.ServiceOrder().OrderNo();
			}
		})

		if (firstEntryWithSameServiceOrderNumber == data) {
			return true;
		}
		return false;
	};

	window.Crm.PerDiem.ViewModels.PerDiemReportDetailsModalViewModel.prototype.isSameOrderAsPrevious = function (data,entries, index) {
		var viewModel = this;
		if (index == 0) {
			return true;
		}
		if (viewModel.isFirstServiceOrderEntry(data, entries, index) == true) {
			return true;
		}
		if (entries[index - 1].ServiceOrder == undefined) {
			return false;
		}
		if (entries[index - 1].ServiceOrder().OrderNo() == entries[index].ServiceOrder().OrderNo()) {
			return true;
		}
		return false;
	};


})(window.ko);