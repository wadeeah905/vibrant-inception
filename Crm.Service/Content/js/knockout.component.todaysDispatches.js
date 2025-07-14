/// <reference path="../../../../Content/js/system/knockout-3.5.1.js" />
;
(function(ko) {
	ko.components.register("todays-dispatches",
		{
			viewModel: {
				createViewModel: function(params, componentInfo) {
					var viewModel = new window.Crm.Service.ViewModels.ServiceOrderDispatchListIndexViewModel();
					viewModel.infiniteScroll(false);
					viewModel.pageSize(3);
					viewModel.toggleMap = null;
					viewModel.viewModes([viewModel.viewMode()]);
					viewModel.init(null, { context: "dashboard" });
					viewModel.downloadIcs = null;
					viewModel.getIcsLinkAllowed = function() {
						return false;
					};
					return viewModel;
				}
			},
			template: { url: "Crm.Service/ServiceOrderDispatchList/TodaysDispatches" }
		});
})(window.ko);
