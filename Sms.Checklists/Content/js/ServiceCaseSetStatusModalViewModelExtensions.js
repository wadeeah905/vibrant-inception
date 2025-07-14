;
(function () {
	var submit = window.Crm.Service.ViewModels.ServiceCaseSetStatusModalViewModel.prototype.submit;
	window.Crm.Service.ViewModels.ServiceCaseSetStatusModalViewModel.prototype.submit = function () {
		var viewModel = this;
		var args = arguments;
		var belongsToClosed = window.Helper.ServiceCase.belongsToClosed(viewModel.status());
		if (!belongsToClosed) {
			return submit.apply(viewModel, args);
		}
		return new $.Deferred().resolve().promise().then(function() {
			if (Array.isArray(viewModel.arrayOrQueryable)) {
				return viewModel.arrayOrQueryable.map(function(it) {
					return it.Id();
				});
			}
			return viewModel.parentViewModel.getFilterQuery(false, false)
				.map(function(it) {
					return it.Id;
				})
				.toArray();
		}).then(function(serviceCaseIds) {
			return window.database.SmsChecklists_ServiceCaseChecklist
					.include("ServiceCase")
					.filter(function (it) {
						return it.ReferenceKey in this.serviceCaseIds && it.Completed === false;
					},
					{ serviceCaseIds: serviceCaseIds })
				.withInlineCount()
				.take(10)
				.toArray();
		}).then(function (incompleteServiceCaseChecklists) {
			if (incompleteServiceCaseChecklists.length === 0) {
				return submit.apply(viewModel, args);
			}
			var additionalCount = incompleteServiceCaseChecklists.totalCount > 10 ? incompleteServiceCaseChecklists.totalCount - 10 : 0;
			var serviceCasesText = incompleteServiceCaseChecklists.map(function(x) {
				return window.Helper.ServiceCase.getDisplayName(x.ServiceCase);
			}).join(",\r\n");
			if (additionalCount > 0) {
				serviceCasesText += "\r\n" +
					window.Helper.String.getTranslatedString("AndXAdditional")
					.replace(additionalCount);
			}
			return window.Helper.Confirm.genericConfirm({
				confirmButtonText: window.Helper.String.getTranslatedString("SetStatus"),
				text: window.Helper.String.getTranslatedString("IncompleteCompletionDynamicFormsMessage").replace("{0}", serviceCasesText),
				title: window.Helper.String.getTranslatedString("CompletionDynamicForms"),
				type: "warning"
			}).then(function () {
				return submit.apply(viewModel, args);
			}).fail(function () {
				viewModel.loading(false);
			});
		});
	};
})();