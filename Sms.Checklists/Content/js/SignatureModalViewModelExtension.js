$(function() {
	var serviceOrderChecklistValidator = function() {
		var validatorDeferred = new $.Deferred();
		var self = this;
		Helper.User.getCurrentUser().then(function(currentUser) {
			window.database.SmsChecklists_ServiceOrderChecklist
				.include("DynamicForm.Languages")
				.include2("DynamicForm.Localizations.filter(function(x) { return x.DynamicFormElementId == null })")
				.filter("filterByDynamicFormTitle", { languageKey: currentUser.DefaultLanguageKey, statusKey: 'Released'})
				.filter("it.RequiredForServiceOrderCompletion === true && it.Completed === false")
				.filter(
					"it.ReferenceKey === this.serviceOrderId && (it.DispatchId === null || it.DispatchId === this.dispatchId)",
					{
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
										return window.Crm.Service.ViewModels.DispatchDetailsChecklistsTabViewModel.prototype
											.checklistIsEditable.call(self, serviceOrderChecklist.asKoObservable());
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

	if (window.Crm.Service.ViewModels.DispatchSignatureEditModalViewModel) {
		var viewModel = window.Crm.Service.ViewModels.DispatchSignatureEditModalViewModel;
		window.Crm.Service.ViewModels.DispatchSignatureEditModalViewModel = function() {
			viewModel.apply(this, arguments);
			if (window.Sms.Checklists.Settings &&
				window.Sms.Checklists.Settings.Dispatch.CustomerSignatureValidateChecklists) {
				this.dispatchValidators.push(serviceOrderChecklistValidator);
			}
		};
		window.Crm.Service.ViewModels.DispatchSignatureEditModalViewModel.prototype = viewModel.prototype;
		window.Crm.Service.ViewModels.DispatchSignatureEditModalViewModel.prototype.getServiceOrderChecklistUrl =
			function(serviceOrderChecklist) {
				return "Sms.Checklists/ServiceOrderChecklist/EditTemplate/" + serviceOrderChecklist.Id;
			};
	}
});