namespace("Crm.Service.ViewModels").InstallationDetailsPositionsTabViewModel = function(parentViewModel) {
	var viewModel = this;
	viewModel.installationId = parentViewModel.installation().Id();
	window.Crm.Service.ViewModels.InstallationPositionListIndexViewModel.call(this, viewModel.installationId, 0);
	viewModel.getFilter("ReferenceId").extend({ filterOperator: "===" })(null);
	viewModel.infiniteScroll(false);
	viewModel.lookups = parentViewModel.lookups || {};
	viewModel.lookups.quantityUnits = viewModel.lookups.quantityUnits || { $tableName: "CrmArticle_QuantityUnit" };
	viewModel.lookups.articleTypes = viewModel.lookups.articleTypes || { $tableName: "CrmArticle_ArticleType" };
	viewModel.treeLevelDisplayLimit = parseInt(window.Crm.Service.Settings.Service.Installation.Position.TreeLevelDisplayLimit);
	viewModel.pageReferenceId = window.ko.observableArray();
	viewModel.levelPage = window.ko.observable(0);
	viewModel.topPagePositionsIds = window.ko.observableArray([]);
	viewModel.getCurrentPositionContext = function(item) {
		let uniqCallback = function(item, key, id) { return item.Id(); };
		if (item.level() >= viewModel.treeLevelDisplayLimit && (item.level() % viewModel.treeLevelDisplayLimit) === 0) {
			viewModel.pageReferenceId()[viewModel.levelPage()] = !!viewModel.filters["ReferenceId"]() ? viewModel.filters["ReferenceId"]().Value : null;
			viewModel.levelPage(viewModel.levelPage() + 1);
			viewModel.getFilter("ReferenceId").extend({ filterOperator: "===" })(item.parents().slice(-1)[0].Id());
			viewModel.topPagePositionsIds()[viewModel.levelPage()] = item.Id();
			viewModel.currentLevel = item.level() + 1;
			viewModel.parents(_.uniqBy(item.parents().concat([item]), uniqCallback));
			viewModel.filter();
		} else {
			viewModel.currentLevel = item.level() >= viewModel.treeLevelDisplayLimit ? viewModel.currentLevel : 1;
			let subPositionsViewModel = new window.Crm.Service.ViewModels.InstallationPositionListIndexViewModel(viewModel.installationId, item.level() + 1, _.uniqBy(item.parents().concat([item]), uniqCallback));
			subPositionsViewModel.getFilter("ReferenceId").extend({ filterOperator: "===" })(item.Id());
			item.totalItemCount = subPositionsViewModel.totalItemCount;
			item.items = subPositionsViewModel.items;
			subPositionsViewModel.infiniteScroll(false);
			$.extend(true, item, subPositionsViewModel);
			let bookmark = window.ko.utils.arrayFirst(item.bookmarks(), function(i) {
				return i.Key === viewModel.bookmark().Key;
			}) || null;
			item.bookmark(bookmark);
			item.haveItems(true);
			subPositionsViewModel.init().then(function() {
				item.loading(false);
			});
		}
	}
};
namespace("Crm.Service.ViewModels").InstallationDetailsPositionsTabViewModel.prototype =
	Object.create(window.Crm.Service.ViewModels.InstallationPositionListIndexViewModel.prototype);
namespace("Crm.Service.ViewModels").InstallationDetailsPositionsTabViewModel.prototype.init = function() {
	var args = arguments;
	var viewModel = this;
	return window.Helper.Lookup.getLocalizedArrayMaps(viewModel.lookups)
		.then(function() {
			return window.Crm.Service.ViewModels.InstallationPositionListIndexViewModel.prototype.init.apply(viewModel, arguments);
		});
};
namespace("Crm.Service.ViewModels").InstallationDetailsPositionsTabViewModel.prototype.removeInstallationPosition =
	function(installationPosition) {
		var viewModel = this;
		window.Helper.Confirm.confirmDelete().then(function() {
			viewModel.loading(true);
			window.database.remove(window.Helper.Database.getDatabaseEntity(installationPosition));
			window.database.saveChanges();
		});
	};
namespace("Crm.Service.ViewModels").InstallationDetailsPositionsTabViewModel.prototype.uninstallInstallationPosition =
	function(installationPosition) {
		var viewModel = this;
		window.Helper.Confirm.genericConfirm({
			title: window.Helper.String.getTranslatedString("Uninstall"),
			text: window.Helper.String.getTranslatedString("UninstallMaterialConfirmation"),
			type: "warning",
			confirmButtonText: window.Helper.String.getTranslatedString("Uninstall")
		}).then(function() {
			viewModel.loading(true);
			window.database.attachOrGet(installationPosition.innerInstance);
			installationPosition.IsInstalled(0);
			installationPosition.RemoveDate(new Date());
			window.database.saveChanges();
		});
	};

namespace("Crm.Service.ViewModels").InstallationDetailsPositionsTabViewModel.prototype.toggleSelectedGroupedPositions =
	function(toggledGroupedPositions) {
		var viewModel = this;
		if ($('.collapsing').length > 0) {
			return;
		}
		viewModel.positionsExpanded(false);
		function hide(positionsGroupViewModel) {
			if (positionsGroupViewModel.visible() === true) {
				$("#collapse-panel-positions-" + positionsGroupViewModel.Id()).collapse("hide");
				positionsGroupViewModel.visible(false);
				if (!!positionsGroupViewModel.items) {
					(positionsGroupViewModel.items() || []).forEach(function(item) {
						hide(item);
					});
					positionsGroupViewModel.haveItems(false);
					positionsGroupViewModel.positionsExpanded(false);
				}
			}
		};
		if (!window.ko.isWritableObservable(toggledGroupedPositions.visible)) {
			return;
		}
		if (toggledGroupedPositions.visible() === true) {
			hide(toggledGroupedPositions);
		} else {
			$("#collapse-panel-positions-" + toggledGroupedPositions.Id()).collapse("show");
			toggledGroupedPositions.visible(true);
			if (toggledGroupedPositions.IsGroupItem()) {
				viewModel.getCurrentPositionContext(toggledGroupedPositions);
			}
		}
	};
namespace("Crm.Service.ViewModels").InstallationDetailsPositionsTabViewModel.prototype.backToPreviousView = function() {
	var viewModel = this;
	viewModel.loading(true);
	viewModel.levelPage(viewModel.levelPage() - 1);
	viewModel.getFilter("ReferenceId").extend({ filterOperator: "===" })(viewModel.pageReferenceId()[viewModel.levelPage()]);
	viewModel.currentLevel = viewModel.treeLevelDisplayLimit * viewModel.levelPage() + 1;
	if (viewModel.currentLevel === 1) {
		viewModel.pageReferenceId([]);
		viewModel.topPagePositionsIds([]);
		viewModel.parents([]);
	} else {
		for (let i = 1; i < viewModel.treeLevelDisplayLimit; i++) {
			viewModel.parents.remove(viewModel.parents()[viewModel.parents().length - 1]);
		}
	}
	viewModel.filter();

};
namespace("Crm.Service.ViewModels").InstallationDetailsPositionsTabViewModel.prototype.expandAllPositions = function(data) {
	const viewModel = this;
	const position = !!data ? data : viewModel;
	position.items().forEach(function(item) {
		$("#collapse-panel-positions-" + item.Id()).collapse("show");
		item.visible(true);
		if (item.IsGroupItem()) {
			viewModel.getCurrentPositionContext(item);
		}
	});
	position.positionsExpanded(true);
}
namespace("Crm.Service.ViewModels").InstallationDetailsPositionsTabViewModel.prototype.closeAllPositions = function(data) {
	const viewModel = this;
	const position = !!data ? data : viewModel;
	position.items().forEach(function(item) {
		$("#collapse-panel-positions-" + item.Id()).collapse("hide");
		item.visible(false);
		item.haveItems(false);
	});
	position.positionsExpanded(false);
}
var baseToggleBookmark = namespace("Crm.Service.ViewModels").InstallationDetailsPositionsTabViewModel.prototype.toggleBookmark;
namespace("Crm.Service.ViewModels").InstallationDetailsPositionsTabViewModel.prototype.toggleBookmark = function(bookmark, context) {
	const viewModel = this;
	baseToggleBookmark.apply(context || this, arguments).then(function(model) {
		if (model.positionsExpanded()) { 
			viewModel.expandAllPositions(model);
		}
	});
}
