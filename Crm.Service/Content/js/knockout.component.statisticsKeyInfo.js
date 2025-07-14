/// <reference path="system/knockout-3.5.1.js" />
;
(function (ko) {
	namespace("Crm.Service.ViewModels").StatisticsKeyInfoViewModel = function (params) {
		var viewModel = this;
		viewModel.entity = ko.unwrap(params.entity);
		viewModel.tableName = ko.unwrap(params.tableName);
		viewModel.id = ko.unwrap(params.id) || ko.unwrap(viewModel.entity.Id) || null;
		viewModel.condition = ko.computed(() => ko.unwrap(params.condition) !== false);
		viewModel.getEditRoute = ko.observable();
		if (viewModel.tableName)
			viewModel.getEditRoute("Crm.Service/StatisticsKey/EditTemplate/" + viewModel.id + "?tableName=" + viewModel.tableName);
		else
			viewModel.getEditRoute("Crm.Service/StatisticsKey/EditTemplate");

	};
	ko.components.register("statisticskey-info", {
		viewModel: {
			createViewModel: function (params, componentInfo) {
				return new window.Crm.Service.ViewModels.StatisticsKeyInfoViewModel(params);
			}
		},
		template: { url: "Crm.Service/StatisticsKey/InfoTemplate" },
		permission: "StatisticsKey::View"
	});
})(window.ko);