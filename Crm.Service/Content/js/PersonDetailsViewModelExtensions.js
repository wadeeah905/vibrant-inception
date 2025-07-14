;
(function(ko) {
	var personDetailsViewModel = window.Main.ViewModels.PersonDetailsViewModel;
	window.Main.ViewModels.PersonDetailsViewModel = function() {
		var viewModel = this;
		personDetailsViewModel.apply(viewModel, arguments);
		viewModel.serviceObject = ko.observable(null);
	};
	window.Main.ViewModels.PersonDetailsViewModel.prototype = personDetailsViewModel.prototype;
	var init = window.Main.ViewModels.PersonDetailsViewModel.prototype.init;
	window.Main.ViewModels.PersonDetailsViewModel.prototype.init = function() {
		var viewModel = this;
		return init.apply(viewModel, arguments).then(function() {
			if (!viewModel.parent() && window.database.CrmService_ServiceObject) {
				return window.database.CrmService_ServiceObject
					.filter("it.Id === this.id", { id: viewModel.person().ParentId() }).take(1).toArray().then(
						function(results) {
							if (results.length > 0) {
								viewModel.serviceObject(results[0].asKoObservable());
								viewModel.parent(viewModel.serviceObject());
							}
						});
			}
			return null;
		});
	};
})(window.ko);