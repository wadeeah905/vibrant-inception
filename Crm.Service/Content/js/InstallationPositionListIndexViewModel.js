namespace("Crm.Service.ViewModels").InstallationPositionListIndexViewModel = function(installationId, level, parents) {
	var viewModel = this;
	window.Main.ViewModels.GenericListViewModel.call(viewModel,
		"CrmService_InstallationPos",
		["IsInstalled","PosNo"],
		["DESC","ASC"],
		["Article","RelatedInstallation"]);
	viewModel.installationId = installationId;
	viewModel.currentLevel = !!level ? level : 1;
	viewModel.parents = window.ko.observableArray(parents);
	if (!!viewModel.installationId) {
		viewModel.getFilter("InstallationId").extend({ filterOperator: "===" })(viewModel.installationId);
	}
	var bookmark = {
		Category: window.Helper.String.getTranslatedString("T_IsInstalled"),
		Name: window.Helper.String.getTranslatedString("InstalledPositions"),
		Key: "InstalledPositions",
		Expression: function(query) {
			return query.filter("it.IsInstalled === true ");
		}
	};
	viewModel.bookmarks.push(bookmark);
	viewModel.bookmark(bookmark);
	viewModel.bookmarks.push({
		Category: window.Helper.String.getTranslatedString("T_IsInstalled"),
		Name: window.Helper.String.getTranslatedString("AllPositions"),
		Key: "AllPositions",
		Expression: function(query) {
			return query.filter("it.IsInstalled === true || it.IsInstalled === false ");
		}
	});
	viewModel.positionsExpanded = window.ko.observable(false);
};
namespace("Crm.Service.ViewModels").InstallationPositionListIndexViewModel.prototype = Object.create(window.Main.ViewModels.GenericListViewModel.prototype);
namespace("Crm.Service.ViewModels").InstallationPositionListIndexViewModel.prototype.init = function() {
	var viewModel = this;
	return window.Main.ViewModels.GenericListViewModel.prototype.init.apply(viewModel, arguments);
};
namespace("Crm.Service.ViewModels").InstallationPositionListIndexViewModel.prototype.applyFilters = function(query) {
	const viewModel = this;
	query = window.Main.ViewModels.GenericListViewModel.prototype.applyFilters.call(viewModel, query);
	if (viewModel.filters.hasOwnProperty("ReferenceId")) {
		filterValue = window.ko.unwrap(viewModel.filters["ReferenceId"]) ? window.ko.unwrap(viewModel.filters["ReferenceId"]).Value : null;
		query = query.filter("it.ReferenceId === this.referenceId",
			{ referenceId: filterValue });
	}
	return query;
}
namespace("Crm.Service.ViewModels").InstallationPositionListIndexViewModel.prototype.initItem = function(item) {
	const viewModel = this;
	item = window.Main.ViewModels.GenericListViewModel.prototype.initItem.call(this, item);
	item.visible = window.ko.observable(false);
	item.haveItems = window.ko.observable(false);
	item.level = window.ko.observable(viewModel.currentLevel);
	item.parents = window.ko.observableArray(viewModel.parents());
	return item;
};
namespace("Crm.Service.ViewModels").InstallationPositionListIndexViewModel.prototype.toggleBookmark = function(bookmark) {
	var viewModel = this;
	let d = new $.Deferred();
	if (viewModel.bookmark() === bookmark) {
		viewModel.bookmark(null);
	} else {
		viewModel.bookmark(bookmark);
	}
	viewModel.page(1);
	viewModel.currentSearch = viewModel.search(false, true);
	viewModel.currentSearch.then(function() {
		viewModel.loading(false);
		d.resolve(viewModel);
	});
	return d.promise();
}
