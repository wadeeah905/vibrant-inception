;
(function (ko, Helper) {
	var initItems = window.Crm.Service.ViewModels.ServiceOrderDetailsServiceCasesTabViewModel.prototype.initItems;
	window.Crm.Service.ViewModels.ServiceOrderDetailsServiceCasesTabViewModel.prototype.initItems = function (items) {
		return initItems.apply(this, arguments).then(function () {
			var queries = [];
			items.forEach(function (serviceCase) {
				queries.push({
					queryable: window.database.SmsChecklists_ServiceCaseChecklist.filter(function (it) {
							return it.ReferenceKey === this.serviceCaseId;
						},
						{ serviceCaseId: serviceCase.Id }),
					method: "toArray",
					handler: function (results) {
						var completionChecklist = results.find(function (x) {
							return x.IsCompletionChecklist;
						});
						serviceCase.CompletionServiceCaseChecklist = ko.observable(completionChecklist ? completionChecklist.asKoObservable() : null);
						var creationChecklist = results.find(function (x) {
							return x.IsCreationChecklist;
						});
						serviceCase.CreationServiceCaseChecklist = ko.observable(creationChecklist ? creationChecklist.asKoObservable() : null);
						return items;
					}
				});
			});
			return Helper.Batch.Execute(queries);
		}).then(function () {
			return items;
		});
	};
})(window.ko, window.Helper);