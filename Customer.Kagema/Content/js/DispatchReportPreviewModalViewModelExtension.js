(function (ko) {
	namespace("Crm.Service.ViewModels").DispatchReportPreviewModalViewModel.prototype.init = function (id) {
		var viewModel = this;
		viewModel.loading(true);

		const loadData = function () {
			return window.Helper.User.getCurrentUser().then(function (user) {
				viewModel.user = user;
				viewModel.selectedLanguage(user.DefaultLanguageKey);
				return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups, user.DefaultLanguageKey);
			}).then(function () {
				return window.database.CrmService_ServiceOrderDispatch
					.include("DispatchedUser")
					.include("ServiceOrder")
					.include("ServiceOrder.InvoiceRecipient")
					.include("ServiceOrder.Payer")
					.include("ServiceOrder.ServiceObject")
					.find(id)
			}).then(function (dispatch) {
				viewModel.dispatch(dispatch.asKoObservable());
			}).then(function () {
				var queries = [];
				queries.push({
					queryable: window.database.CrmService_ServiceOrderTime
						.include("Installation")
						.filter("it.OrderId === this.orderId", { orderId: viewModel.dispatch().OrderId() }),
					method: "toArray",
					handler: function (x) {
						var serviceOrderTimes = x.map(function (i) {
							return i.asKoObservable();
						});
						viewModel.dispatch().ServiceOrder().ServiceOrderTimes(serviceOrderTimes);
						viewModel.serviceOrderTimes(serviceOrderTimes);
					}
				});
				queries.push({
					queryable: window.database.CrmService_ServiceOrderMaterial
						.include("ServiceOrderMaterialSerials")
						.include("Article")
						.filter("it.DispatchId === this.dispatchId && it.ActualQty > 0", { dispatchId: viewModel.dispatch().Id() }),
					method: "toArray",
					handler: function (x) {
						var dispatchMaterials = x.map(function (i) {
							return i.asKoObservable();
						});
						viewModel.dispatch().ServiceOrderMaterial(dispatchMaterials);
						viewModel.displayedMaterials(viewModel.dispatch().ServiceOrderMaterial() || []);
					}
				});
				queries.push({
					queryable: window.database.CrmService_ServiceOrderTimePosting
						.include("User")
						.include("Article")
						.filter("it.DispatchId === this.dispatchId && it.Username != null", { dispatchId: viewModel.dispatch().Id() }),
					method: "toArray",
					handler: function (x) {
						var dispatchTimePostings = x.map(function (i) {
							return i.asKoObservable();
						});
						viewModel.dispatch().ServiceOrderTimePostings(dispatchTimePostings);
						viewModel.displayedTimePostings(viewModel.dispatch().ServiceOrderTimePostings() || []);
					}
				});
				queries.push({
					queryable: window.database.Main_Company
						.include2("Addresses.filter(function(x) { x.IsCompanyStandardAddress === true; })")
						.filter("it.Id === this.id", { id: viewModel.dispatch().ServiceOrder().CustomerContactId() }),
					method: "first",
					handler: viewModel.dispatch().ServiceOrder().Company
				});
				if (viewModel.dispatch().ServiceOrder().InitiatorId()) {
					queries.push({
						queryable: window.database.Main_Company
							.include2("Addresses.filter(function(x) { x.IsCompanyStandardAddress === true; })")
							.include("Phones")
							.include("Emails")
							.filter("it.Id === this.id", { id: viewModel.dispatch().ServiceOrder().InitiatorId() }),
						method: "first",
						handler: viewModel.dispatch().ServiceOrder().Initiator
					});
				}
				if (viewModel.dispatch().ServiceOrder().InstallationId()) {
					queries.push({
						queryable: window.database.CrmService_Installation
							.include("Company")
							.include2("Company.Addresses.filter(function(x) { x.IsCompanyStandardAddress === true; })")
							.filter("it.Id === this.id", { id: viewModel.dispatch().ServiceOrder().InstallationId() }),
						method: "first",
						handler: viewModel.dispatch().ServiceOrder().Installation
					});
				}
				if (viewModel.dispatch().ServiceOrder().InitiatorPersonId()) {
					queries.push({
						queryable: window.database.Main_Person
							.include("Emails")
							.include("Phones")
							.filter("it.Id === this.id", { id: viewModel.dispatch().ServiceOrder().InitiatorPersonId() }),
						method: "first",
						handler: viewModel.dispatch().ServiceOrder().InitiatorPerson
					});
				}
				return window.Helper.Batch.Execute(queries);
			}).then(function () {
				viewModel.lookups.timePostingUserDisplayNames = viewModel.displayedTimePostings().reduce(function (map, x) {
					map[x.Username()] = Helper.User.getDisplayName(x.User);
					return map;
				}, {});
				var timePostingItemNos = viewModel.displayedTimePostings().map(function (i) {
					return window.ko.unwrap(i.ItemNo);
				});
				var materialItemNos = viewModel.displayedMaterials().map(function (i) {
					return window.ko.unwrap(i.ItemNo);
				});
				viewModel.itemNos = [];
				viewModel.itemNos.push.apply(viewModel.itemNos, timePostingItemNos);
				viewModel.itemNos.push.apply(viewModel.itemNos, materialItemNos);
				return viewModel.updateLanguage();
			}).then(function () {
				return window.database.Main_Site.GetCurrentSite().first();
			}).then(function (site) {
				viewModel.site(site);
				viewModel.selectedLanguage.subscribe(function () {
					viewModel.loading(true);
					viewModel.updateLanguage().then(function () {
						viewModel.loading(false);
					});
				});
				return window.Crm.Service.ViewModels.DispatchReportViewModel.prototype.init.call(viewModel, viewModel.dispatch().Id(), viewModel);
			});
		}

		if (viewModel.parentViewModel) {
			return loadData().then(function () {
				viewModel.loading(false);
			});
		} else {
			viewModel.IsPdfViewModel(true);
			return window.Helper.Database.initialize().then(function () {
				return window.Crm.Offline.Bootstrapper.initializeSettings();
			}).then(function () {
				return loadData();
			}).then(function () {
				viewModel.loading(false);
			});
		}
	};


})();