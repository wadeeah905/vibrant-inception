$(function() {
	var serviceOrderChecklistValidator = function() {
		var validatorDeferred = new $.Deferred();
		var self = this;
			Helper.User.getCurrentUser().then(function(currentUser) {
				window.database.SmsChecklists_ServiceOrderChecklist
					.include("DynamicForm.Languages")
					.include2("DynamicForm.Localizations.filter(function(x) { return x.DynamicFormElementId == null })")
					.filter("filterByDynamicFormTitle", { languageKey: currentUser.DefaultLanguageKey, statusKey: 'Released' })
					.filter("it.RequiredForServiceOrderCompletion === true && it.Completed === false")
					.filter("it.ReferenceKey === this.serviceOrderId && (it.DispatchId === null || it.DispatchId === this.dispatchId)", {
						serviceOrderId: window.ko.unwrap(self.dispatch().OrderId),
						dispatchId: window.ko.unwrap(self.dispatch().Id)
					})
					.toArray(function(serviceOrderChecklists) {
						if (serviceOrderChecklists.length > 0) {
							var links = $.map(serviceOrderChecklists,
								function(serviceOrderChecklist) {
									return {
										text: serviceOrderChecklist.DynamicForm.Localizations[0].Value,
										url: self.getServiceOrderChecklistUrl(serviceOrderChecklist),
										routeValues: {
											id: ko.unwrap(serviceOrderChecklist.Id),
											formReference: serviceOrderChecklist,
											dispatch: self.dispatch
										},
										condition: function() {
											return !window.Crm.Service.ViewModels.DispatchDetailsChecklistsTabViewModel
												? true
												: window.Crm.Service.ViewModels.DispatchDetailsChecklistsTabViewModel.prototype.checklistIsEditable.call(self, serviceOrderChecklist.asKoObservable());
										}
									};
								});
							validatorDeferred.resolve({
								message: window.Helper.String.getTranslatedString(
									"TheFollowingChecklistsAreRequiredForServiceOrderCompletion"),
								links: links
							});
						} else {
							validatorDeferred.resolve();
						}
					});
			});
		return validatorDeferred.promise();
	};

	if (window.Crm.Service.ViewModels.DispatchChangeStatusModalViewModel) {
		var viewModel = window.Crm.Service.ViewModels.DispatchChangeStatusModalViewModel;
		window.Crm.Service.ViewModels.DispatchChangeStatusModalViewModel = function() {
			viewModel.apply(this, arguments);
			this.dispatchValidators.push(serviceOrderChecklistValidator);
		};
		window.Crm.Service.ViewModels.DispatchChangeStatusModalViewModel.prototype = viewModel.prototype;
		window.Crm.Service.ViewModels.DispatchChangeStatusModalViewModel.prototype.getServiceOrderChecklistUrl =
			function(serviceOrderChecklist) {
				if (serviceOrderChecklist.DynamicForm.CategoryKey == 'PDF-Checklist') {
					return "Sms.Checklists/ServiceOrderChecklist/EditPdfTemplate/" + serviceOrderChecklist.Id;
				}
				return "Sms.Checklists/ServiceOrderChecklist/EditTemplate/" + serviceOrderChecklist.Id;
			};
	}

	if (window.Crm.Service.ViewModels.DispatchChangeStatusViewModel) {
		window.Crm.Service.ViewModels.DispatchChangeStatusViewModel.prototype.init = window.callAfter(
			window.Crm.Service.ViewModels.DispatchChangeStatusViewModel.prototype.init,
			function() {
				var self = this;
				self.dispatchValidators().push(serviceOrderChecklistValidator);
			});
		window.Crm.Service.ViewModels.DispatchChangeStatusViewModel.prototype.getServiceOrderChecklistUrl =
			function(serviceOrderChecklist) {
				return window.Helper.resolveUrl("~/Sms.Checklists/ServiceOrderChecklist/Details");
			};
	}
});