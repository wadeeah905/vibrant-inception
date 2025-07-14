;
(function() {
	var getCreatePersonLink = window.Main.ViewModels.PersonDetailsStaffTabViewModel.prototype.getCreatePersonLink;
	window.Main.ViewModels.PersonDetailsStaffTabViewModel.prototype.getCreatePersonLink = function() {
		var viewModel = this;
		if (viewModel.parentViewModel.serviceObject()) {
			return "#/Main/Person/CreateTemplate?parentId=" +
				viewModel.parentViewModel.serviceObject().Id() +
				"&parentType=ServiceObject&redirectUrl=/Main/Person/DetailsTemplate/" +
				viewModel.personId() +
				"%3Ftab%3Dtab-staff";
		}
		return getCreatePersonLink.apply(viewModel, arguments);
	};
})();