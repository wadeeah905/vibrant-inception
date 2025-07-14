(function () {

	var baseInit = window.Main.ViewModels.CompanyDetailsViewModel.prototype.init;
	window.Main.ViewModels.CompanyDetailsViewModel.prototype.init = function (id) {
		var viewModel = this;
		viewModel.AvailableTimeUnits = window.ko.observableArray(_.compact(window.Crm.VisitReport.Settings.Visit.AvailableTimeUnits.split(',')));
		return baseInit.apply(this, arguments)
			.then(function() {
				return window.Helper.Lookup.getLocalizedArrayMap("Main_TimeUnit")
					.then(function(lookup) {
						lookup.$array = lookup.$array.filter(function (x) { return x.Key === null || viewModel.AvailableTimeUnits().indexOf(x.Key) > -1; });
						viewModel.lookups.timeUnits = lookup;
					});
			})
			.then(function () {
				function updateVisitFrequencyValuePerYear() {
					if (viewModel.company().ExtensionValues().VisitFrequencyValue() && viewModel.company().ExtensionValues().VisitFrequencyTimeUnitKey()) {
						var timeUnit = viewModel.lookups.timeUnits[viewModel.company().ExtensionValues().VisitFrequencyTimeUnitKey()];
						viewModel.company().ExtensionValues().VisitFrequencyValuePerYear(viewModel.company().ExtensionValues().VisitFrequencyValue() * timeUnit.TimeUnitsPerYear);
					} else {
						viewModel.company().ExtensionValues().VisitFrequencyValuePerYear(null);
					}
				};
				viewModel.company().ExtensionValues().VisitFrequencyTimeUnitKey.subscribe(updateVisitFrequencyValuePerYear);
				viewModel.company().ExtensionValues().VisitFrequencyValue.subscribe(updateVisitFrequencyValuePerYear);
			});
	};

	var baseDispose = window.Main.ViewModels.CompanyDetailsViewModel.prototype.dispose;
	window.Main.ViewModels.CompanyDetailsViewModel.prototype.dispose = function (id) {
		if ($.isFunction(baseDispose)) {
			baseDispose.apply(this, arguments);
		}
	}

})();