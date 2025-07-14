;
(function(ko) {
	var deleteServiceOrderTime =
		window.Crm.Service.ViewModels.ServiceOrderDetailsJobsTabViewModel.prototype.deleteServiceOrderTime;
	window.Crm.Service.ViewModels.ServiceOrderDetailsJobsTabViewModel.prototype.deleteServiceOrderTime =
		function(serviceOrderTime) {
			var viewModel = this;
			var args = arguments;
			var serviceOrderTimeId = ko.unwrap(serviceOrderTime.Id);
			return window.database.SmsChecklists_ServiceOrderChecklist.filter(
					function(it) { return it.ServiceOrderTimeKey === this.serviceOrderTimeId; },
					{ serviceOrderTimeId: serviceOrderTimeId })
				.forEach(function(serviceOrderChecklist) {
					window.database.remove(serviceOrderChecklist);
				}).then(function() {
					return deleteServiceOrderTime.apply(viewModel, args);
				});
		};

	var initItems = window.Crm.Service.ViewModels.ServiceOrderDetailsJobsTabViewModel.prototype.initItems;
	window.Crm.Service.ViewModels.ServiceOrderDetailsJobsTabViewModel.prototype.initItems = function(items) {
		return initItems.apply(this, arguments).then(function() {
			var queries = [];
			items.forEach(function(jobSummary) {
				queries.push({
					queryable: window.database.SmsChecklists_ServiceOrderChecklist.filter(function(it) {
							return it.ServiceOrderTimeKey === this.serviceOrderTimeId && it.Completed;
						},
						{ serviceOrderTimeId: jobSummary.Id }),
					method: "count",
					handler: function(count) {
						jobSummary.completedServiceOrderChecklistsCount = count;
						return items;
					}
				});
				queries.push({
					queryable: window.database.SmsChecklists_ServiceOrderChecklist.filter(function(it) {
							return it.ServiceOrderTimeKey === this.serviceOrderTimeId;
						},
						{ serviceOrderTimeId: jobSummary.Id }),
					method: "count",
					handler: function(count) {
						jobSummary.serviceOrderChecklistsCount = count;
						return items;
					}
				});
			});
			return Helper.Batch.Execute(queries);
		}).then(function() {
			return items;
		});
	};
})(window.ko);